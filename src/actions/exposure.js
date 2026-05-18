/**
 * @file Provides action definitions for exposure settings like Iris, Shutter Speed, Gain, and Exposure Compensation.
 */

import { getActionDefinitions } from '../actions.js'
import { getCamId, parseVar, throttleAction } from './utils.js'

export function getExposureActions(self) {
	const CHOICES = self.choices
	return {
		expM: {
			name: 'Exposure Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'val',
					choices: [
						{ id: '0', label: 'Auto' },
						{ id: '3', label: 'Manual' },
						{ id: '10', label: 'SAE (Shutter Priority)' },
						{ id: '11', label: 'AAE (Iris Priority)' },
						{ id: '13', label: 'Bright' },
						{ id: 'toggle', label: 'Toggle Auto/Manual' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				if (!throttleAction(self, 'expMode', 200, 'exposureMode')) return

				const camId = getCamId(self)
				let valId = event.options.val
				if (valId === 'toggle') {
					valId = self.state.exposureMode === 'Auto' ? '3' : '0'
				}

				const val = parseInt(valId)
				self.VISCA.send(Buffer.from([camId, 0x01, 0x04, 0x39, val, 0xff]))

				if (val === 0x00) self.state.exposureMode = 'Auto'
				else if (val === 0x03) self.state.exposureMode = 'Manual'
				else if (val === 0x0a) self.state.exposureMode = 'SAE'
				else if (val === 0x0b) self.state.exposureMode = 'AAE'
				else if (val === 0x0d) self.state.exposureMode = 'Bright'

				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry('090439')
			},
		},
		irisSet: {
			name: 'Iris Up/Down/Set',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'val',
					choices: [{ id: 'up', label: 'Iris Open (Up)' }, { id: 'down', label: 'Iris Close (Down)' }, ...CHOICES.IRIS],
					default: 'up',
				},
			],
			callback: async (event) => {
				if (!throttleAction(self, 'iris', 100, 'irisPosition')) return

				const camId = getCamId(self)
				const valId = event.options.val
				let val
				if (valId === 'up' || valId === 'down') {
					const irisChoices = CHOICES.IRIS.map((c) => parseInt(c.id, 16))
					const current = self.state.irisPosition ?? 0x09
					let idx = irisChoices.indexOf(current)
					if (idx === -1) {
						// Find closest if current is not in list
						idx = irisChoices.findIndex((v) => v <= current)
						if (idx === -1) idx = 3 // fallback to 2.8
					}

					if (valId === 'up') {
						idx = Math.max(0, idx - 1)
					} else {
						idx = Math.min(irisChoices.length - 1, idx + 1)
					}
					val = irisChoices[idx]
				} else {
					val = parseInt(valId, 16)
				}

				const cmd = Buffer.from([camId, 0x01, 0x04, 0x4b, 0x00, 0x00, (val >> 4) & 0x0f, val & 0x0f, 0xff])
				self.VISCA.send(cmd, undefined, undefined, undefined, false, 'irisSet')
				self.state.irisPosition = val
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry('09044B', true)
			},
		},
		brightSet: {
			name: 'Brightness (Only in AE Bright Mode) Up/Down/Set',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'val',
					choices: [
						{ id: 'up', label: 'Brightness Up' },
						{ id: 'down', label: 'Brightness Down' },
						...CHOICES.BRIGHTNESS,
					],
					default: 'up',
				},
			],
			callback: async (event) => {
				if (!throttleAction(self, 'bright', 100, 'brightPosition')) return

				const camId = getCamId(self)
				const valId = event.options.val
				let val

				if (valId === 'up' || valId === 'down') {
					const current = typeof self.state.brightPosition === 'number' ? self.state.brightPosition : 0x0a
					val = valId === 'up' ? current + 1 : current - 1
					const max = 14
					val = Math.max(0, Math.min(max, val))
				} else {
					val = parseInt(valId, 16)
				}

				const cmd = Buffer.from([camId, 0x01, 0x04, 0x4d, 0x00, 0x00, (val >> 4) & 0x0f, val & 0x0f, 0xff])
				self.VISCA.send(cmd, undefined, undefined, undefined, false, 'brightSet')
				self.state.brightPosition = val
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry('09044D', true)
			},
		},
		shutterSet: {
			name: 'Shutter Speed Up/Down',
			options: [
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'val',
					choices: [
						{ id: 'up', label: 'Shutter Up' },
						{ id: 'down', label: 'Shutter Down' },
					],
					default: 'up',
				},
			],
			callback: async (event) => {
				// No inquiry lock (0) because we don't know the absolute value yet
				if (!throttleAction(self, 'shutter', 100, 'shutterSpeed', 0)) return

				const camId = getCamId(self)
				const valId = event.options.val
				const cmd = Buffer.from([camId, 0x01, 0x04, 0x0a, valId === 'up' ? 0x02 : 0x03, 0xff])
				self.VISCA.send(cmd)
				self.VISCA.sendInquiry('09044A', true)
			},
		},
		shutterSetAbs: {
			name: 'Shutter Speed Jump to Value',
			options: [
				{
					type: 'dropdown',
					label: 'Target Shutter\n(* = recommended for your frame rate)',
					id: 'val',
					choices: self.choices.SHUTTER,
					default: '0005',
				},
			],
			callback: async (event) => {
				if (!throttleAction(self, 'shutter', 100, 'shutterSpeed')) return

				const camId = getCamId(self)
				const val = parseInt(event.options.val, 16)

				const cmd = Buffer.from([camId, 0x01, 0x04, 0x4a, 0x00, 0x00, (val >> 4) & 0x0f, val & 0x0f, 0xff])
				self.log('debug', `Sending Shutter Absolute: ${cmd.toString('hex')}`)
				self.VISCA.send(cmd)

				// Optimistic update
				self.state.shutterSpeed = val
				self.updateVariables()
				self.VISCA.sendInquiry('09044A', true)
			},
		},
		gainSet: {
			name: 'Gain Up/Down/Set',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'val',
					choices: [{ id: 'up', label: 'Gain Up' }, { id: 'down', label: 'Gain Down' }, ...CHOICES.GAIN],
					default: 'up',
				},
			],
			callback: async (event) => {
				if (!throttleAction(self, 'gain', 100, 'gainLevel')) return

				const camId = getCamId(self)
				const valId = event.options.val
				let val

				if (valId === 'up' || valId === 'down') {
					// Use internal state for calculation as native relative commands are not supported
					const current = parseInt(self.state.gainLevel ?? 0)
					val = valId === 'up' ? current + 1 : current - 1
					const maxGain = CHOICES.GAIN.length - 1
					val = Math.max(0, Math.min(maxGain, val))
					self.log('debug', `Gain ${valId}: Calculated new level ${val} from current ${current}`)
				} else {
					val = parseInt(valId, 16)
				}

				const cmd = Buffer.from([camId, 0x01, 0x04, 0x4c, 0x00, 0x00, (val >> 4) & 0x0f, val & 0x0f, 0xff])
				self.log('debug', `Sending Gain Absolute: ${cmd.toString('hex')}`)
				self.VISCA.send(cmd, undefined, undefined, undefined, false, 'gainSet')

				// Optimistic update
				self.state.gainLevel = val
				self.updateVariables()
				self.VISCA.sendInquiry('09044C', true)
			},
		},
		gainSetAbs: {
			name: 'Gain Jump to Value',
			options: [
				{
					type: 'number',
					label: `Target Gain (0 - ${CHOICES.GAIN.length - 1})`,
					id: 'val',
					min: 0,
					max: 255,
					default: 0,
					useVariables: true,
				},
			],
			callback: async (event) => {
				if (!throttleAction(self, 'gain', 100, 'gainLevel')) return

				const camId = getCamId(self)
				const valId = await parseVar(self, event.options.val)
				const maxGain = CHOICES.GAIN.length - 1
				const val = Math.max(0, Math.min(maxGain, Math.round(Number(valId))))

				const cmd = Buffer.from([camId, 0x01, 0x04, 0x4c, 0x00, 0x00, (val >> 4) & 0x0f, val & 0x0f, 0xff])
				self.log('debug', `Sending Gain Absolute: ${cmd.toString('hex')}`)
				self.VISCA.send(cmd, undefined, undefined, undefined, false, 'gainSet')

				// Optimistic update
				self.state.gainLevel = val
				self.updateVariables()
				self.VISCA.sendInquiry('09044C', true)
			},
		},
		expCompSet: {
			name: 'Exposure Compensation: Set Level',
			options: [
				{
					type: 'dropdown',
					label: 'Level',
					id: 'val',
					choices: CHOICES.EXPOSURE_COMPENSATION,
					default: '09',
				},
			],
			callback: async (event) => {
				if (!throttleAction(self, 'expComp', 100, 'expCompLevel')) return

				const camId = getCamId(self)
				const valId = event.options.val
				const val = parseInt(valId, 16)
				const cmd = Buffer.from([camId, 0x01, 0x04, 0x4e, 0x00, 0x00, (val >> 4) & 0x0f, val & 0x0f, 0xff])

				self.state.expCompLevel = val
				self.updateVariables()

				self.VISCA.send(cmd, undefined, () => {
					self.VISCA.sendInquiry('09044E', true)
				})
			},
		},
		expCompReset: {
			name: 'Exposure Compensation: Reset',
			options: [],
			callback: async () => {
				if (!throttleAction(self, 'expComp', 100, 'expCompLevel')) return

				const camId = getCamId(self)
				const cmd = Buffer.from([camId, 0x01, 0x04, 0x0e, 0x00, 0xff])

				self.state.expCompLevel = 0x07
				self.updateVariables()

				self.VISCA.send(cmd, undefined, () => {
					self.VISCA.sendInquiry('09044E', true)
				})
			},
		},
		expCompUp: {
			name: 'Exposure Compensation: Up',
			options: [],
			callback: async () => {
				if (!throttleAction(self, 'expComp', 100, 'expCompLevel')) return

				const camId = getCamId(self)
				// Use absolute command to avoid relative command inversion issues across models
				const current = typeof self.state.expCompLevel === 'number' ? self.state.expCompLevel : 0x07
				const val = Math.min(0x0e, current + 1)
				const cmd = Buffer.from([camId, 0x01, 0x04, 0x4e, 0x00, 0x00, (val >> 4) & 0x0f, val & 0x0f, 0xff])

				self.state.expCompLevel = val
				self.updateVariables()
				self.VISCA.send(cmd, undefined, () => {
					self.VISCA.sendInquiry('09044E', true)
				})
			},
		},
		expCompDown: {
			name: 'Exposure Compensation: Down',
			options: [],
			callback: async () => {
				if (!throttleAction(self, 'expComp', 100, 'expCompLevel')) return

				const camId = getCamId(self)
				// Use absolute command to avoid relative command inversion issues across models
				const current = typeof self.state.expCompLevel === 'number' ? self.state.expCompLevel : 0x07
				const val = Math.max(0x00, current - 1)
				const cmd = Buffer.from([camId, 0x01, 0x04, 0x4e, 0x00, 0x00, (val >> 4) & 0x0f, val & 0x0f, 0xff])

				self.state.expCompLevel = val
				self.updateVariables()
				self.VISCA.send(cmd, undefined, () => {
					self.VISCA.sendInquiry('09044E', true)
				})
			},
		},

		smartExpRotary: {
			name: 'Smart Exposure Rotary (Context Aware)',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'val',
					choices: [
						{ id: 'up', label: 'Up (Increase)' },
						{ id: 'down', label: 'Down (Decrease)' },
					],
					default: 'up',
				},
			],
			callback: async (event) => {
				const mode = self.state.exposureMode
				const isUp = event.options.val === 'up'
				const val = isUp ? 'up' : 'down'
				const invertedVal = isUp ? 'down' : 'up'

				const actionMap = {
					Auto: isUp ? 'expCompUp' : 'expCompDown',
					Manual: 'gainSet',
					SAE: 'shutterSet',
					AAE: 'irisSet',
					Bright: 'brightSet',
				}

				const targetActionName = actionMap[mode]
				if (!targetActionName || targetActionName === 'none') return

				const actions = getActionDefinitions(self)
				const targetAction = actions[targetActionName]
				if (targetAction) {
					if (targetActionName === 'expCompUp' || targetActionName === 'expCompDown') {
						await targetAction.callback({ options: {} })
					} else {
						// For Shutter Priority (SAE), "Up" (Faster) makes it darker,
						// so we invert to ensure Right turn (Increase) always makes it brighter.
						const effectiveVal = mode === 'SAE' ? invertedVal : val
						await targetAction.callback({ options: { val: effectiveVal } })
					}
				}
			},
		},
		expCompMode: {
			name: 'Exposure Compensation: Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'val',
					choices: CHOICES.BACKLIGHT,
					default: '02',
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				let valId = event.options.val
				if (valId === 'toggle') {
					valId = self.state.expComp === 'On' ? '03' : '02'
				}

				const val = parseInt(valId, 16)
				const cmd = Buffer.from([camId, 0x01, 0x04, 0x3e, val, 0xff])
				self.VISCA.send(cmd)
				self.state.expComp = val === 0x02 ? 'On' : 'Off'
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry('09043E')
			},
		},
		backlightSet: {
			name: 'Set Backlight Compensation',
			options: [{ type: 'dropdown', label: 'Status', id: 'val', choices: CHOICES.BACKLIGHT, default: '03' }],
			callback: async (event) => {
				const camId = getCamId(self)
				let valId = event.options.val
				if (valId === 'toggle') {
					valId = self.state.backlight === 'On' ? '03' : '02'
				}

				const val = parseInt(valId, 16)
				const cmd = Buffer.from([camId, 0x01, 0x04, 0x33, val, 0xff])
				self.VISCA.send(cmd)
				self.state.backlight = val === 0x02 ? 'On' : 'Off'
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry('090433')
			},
		},
	}
}
