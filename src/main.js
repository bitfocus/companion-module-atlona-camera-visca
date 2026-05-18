/**
 * @file Main entry point for the Companion module. Handles initialization, config, variables, and VISCA/HTTP connections.
 */

import { InstanceBase, InstanceStatus } from '@companion-module/base'
import { promises as dns } from 'dns'
import { getChoices, CHOICES } from './choices.js'
import { UpgradeScripts } from './upgrades.js'
import { getConfigDefinitions } from './config.js'
import { getFeedbackDefinitions } from './feedbacks.js'
import { getActionDefinitions } from './actions.js'
import { getPresetDefinitions } from './presets.js'
import { getPresetsStructure } from './presets-structure.js'
import { initVariables, updateVariables } from './variables.js'
import { getInquiryBlocks, parseInquiryResponse } from './inquiries.js'
import { Visca } from './visca.js'
import * as VISCA from './constants.js'

class AtlonaViscaInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
		this.initVariables = initVariables
		this.updateVariables = updateVariables
		this.VISCA = new Visca(this)
		this.udpSocket = null
		this.viscaHost = null
		this.viscaPort = 1259
		this.lastFocusDetected = 0
	}

	async init(config) {
		this.updateStatus(InstanceStatus.Disconnected)
		if (!config.model) {
			config.model = 'generic'
		}
		this.config = config
		this.choices = getChoices(config, this)
		this.state = {
			modelId: config.model,
			viscaId: this.config.id || 129,
			focusMode: 'Auto',
			exposureMode: 'Auto',
			irisPosition: 0x09,
			expCompLevel: 0x07,
			expComp: 'Off',
			brightPosition: 7,
			shutterSpeed: 0x05,
			gainLevel: 10,
			rGain: 0x80,
			bGain: 0x80,
			wbMode: '00',
			wbModePreview: null,
			backlight: 'Off',
			powerStatus: 'On',
			flipHStatus: 'Off',
			flipVStatus: 'Off',
			presetSelector: 1,
			presetLastUsed: 1,
			panSpeed: 12,
			tiltSpeed: 12,
			zoomSpeed: 3,
			panPosition: 0,
			tiltPosition: 0,
			zoomPosition: 0,
			focusPosition: 0,
			focusSpeed: 0,
			focusStationaryCount: 0,
			onePushActive: false,
			presetSaving: false,
			contrast: 7,
			sharpness: 7,
			saturation: 7,
			luminance: 7,
			hue: 7,
			gamma: 0,
		}

		this.inquiryLocks = {}
		this.lastActionTime = {}
		this.lastRGainSetPulse = 0
		this.lastBGainSetPulse = 0

		this.registerDefinitions()
		this.VISCA.setInquiryFilter((key) => {
			if (this.state.wbMode !== '05' && (key === '090443' || key === '090444')) {
				return false
			}
			return true
		})

		this.setupInquiries()
		await this.init_udp()
		this.updateVariables()
	}

	async destroy() {
		this.VISCA.stopPolling()
		if (this.udpSocket) {
			try {
				this.udpSocket.close()
			} catch {
				// ignore
			}
			this.udpSocket = null
		}
	}

	async configUpdated(config) {
		this.config = config
		this.state.modelId = config.model
		this.choices = getChoices(config, this)
		this.registerDefinitions()
		this.VISCA.stopPolling()
		this.setupInquiries()
		await this.init_udp()
	}

	registerDefinitions() {
		const actions = getActionDefinitions(this)
		this.setActionDefinitions(actions)
		const feedbacks = getFeedbackDefinitions(this)
		this.setFeedbackDefinitions(feedbacks)

		const actionIds = new Set(Object.keys(actions))
		const feedbackIds = new Set(Object.keys(feedbacks))
		const presets = getPresetDefinitions(this, actionIds, feedbackIds)

		const structure = getPresetsStructure(presets)

		this.setPresetDefinitions(structure, presets)

		if (feedbackIds.size > 0) {
			this.checkAllFeedbacks()
		}

		this.initVariables(undefined, this.config.model)
	}

	getConfigFields() {
		return getConfigDefinitions(CHOICES)
	}

	async init_udp() {
		if (this.udpSocket) {
			await new Promise((resolve) => {
				try {
					this.udpSocket.close(resolve)
				} catch {
					resolve()
				}
			})
			this.udpSocket = null
			this.updateStatus(InstanceStatus.Disconnected)
		}

		if (!this.config.host) {
			this.updateStatus(InstanceStatus.BadConfig)
			return
		}

		this.updateStatus(InstanceStatus.Connecting)
		this.viscaPort = parseInt(this.config.port) || 1259

		try {
			const lookupPromise = dns.lookup(this.config.host, { family: 4 })
			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error('DNS lookup timed out after 3s')), 3000),
			)
			const { address } = await Promise.race([lookupPromise, timeoutPromise])
			this.viscaHost = address
		} catch (err) {
			this.updateStatus(InstanceStatus.ConnectionFailure, `DNS failed: ${err.message}`)
			return
		}

		const msgHandler = (msg, rinfo) => {
			if (rinfo.address === this.viscaHost) {
				this.VISCA.handleResponse(msg)
			}
		}

		this.udpSocket = this.createSharedUdpSocket('udp4', msgHandler)

		this.udpSocket.on('error', (err) => {
			this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
			try {
				this.udpSocket?.close()
			} catch {
				// already closed or never opened — ignore
			}
			this.udpSocket = null
		})

		this.udpSocket.bind(this.viscaPort, '', () => {
			this.updateStatus(InstanceStatus.Ok)
			this.VISCA.resetSequenceNumber()
			this.VISCA.refreshAllInquiries()
		})
	}

	setupInquiries() {
		const blocks = getInquiryBlocks(this.config.model)
		const highPriorityCallbacks = {}
		const backgroundKeys = [VISCA.INQ_POWER, '0904AA', '090458', VISCA.INQ_GAMMA, VISCA.INQ_WB_MODE]
		const stayHighKeys = [
			VISCA.INQ_PT_POSITION, // Pan/Tilt Position
			VISCA.INQ_ZOOM_POSITION, // Zoom Position
			VISCA.INQ_FOCUS_POSITION, // Focus Position
			VISCA.INQ_FOCUS_MODE, // Focus Mode
			VISCA.INQ_EXPOSURE_MODE, // Exposure Mode
			'09044B', // Iris
			'09044A', // Shutter
			'09044C', // Gain
			'09044E', // ExpComp
			'0904A1', // Luminance
			'0904A2', // Contrast
			'090449', // Saturation
			'090442', // Sharpness
			'09044F', // Hue
			'09045B', // Gamma
		]

		for (const [key, blockDef] of Object.entries(blocks)) {
			const cb = (payload) => {
				const changed = parseInquiryResponse(blockDef, payload, this.state, this.choices, this.inquiryLocks)

				// Dynamic demotion: If this key is not meant to stay high priority,
				// move it to low priority after the first successful reception.
				if (!stayHighKeys.includes(key)) {
					this.VISCA.demoteInquiry(key)
				}

				if (key === '090448') {
					// Focus Detection (for OnePush completion)
					if (this.state.onePushActive) {
						if (this.state.focusPosition === this.lastFocusDetected) {
							this.state.focusStationaryCount++
							if (this.state.focusStationaryCount >= 3) {
								const camId = parseInt(this.state.viscaId)
								this.VISCA.send(Buffer.from([camId, 0x01, 0x04, 0x38, 0x03, 0xff]))
								this.state.focusMode = 'Manual'
								this.state.onePushActive = false
								this.state.focusStationaryCount = 0
								this.updateVariables()
								this.checkAllFeedbacks()
								this.VISCA.sendInquiry('090438')
							}
						} else {
							this.lastFocusDetected = this.state.focusPosition
							this.state.focusStationaryCount = 0
						}
					} else {
						this.state.focusStationaryCount = 0
					}
				}

				if (changed) {
					this.updateVariables()
					this.checkAllFeedbacks()
				}
			}

			highPriorityCallbacks[key] = cb
		}

		this.VISCA.initializeInquiries(highPriorityCallbacks)
		this.VISCA.initializeBackgroundInquiries(backgroundKeys)
		this.VISCA.initializeLowPriorityInquiries({}) // Starts empty, populated via demoteInquiry
	}
}

export default AtlonaViscaInstance
export { UpgradeScripts }
