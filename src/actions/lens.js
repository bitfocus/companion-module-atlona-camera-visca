/**
 * @file Provides action definitions for Lens control, including Zoom and Focus (Auto/Manual, One Push AF).
 */

import * as VISCA from '../constants.js'
import { resetSnap } from './utils.js'
import { CAP_ONE_PUSH } from '../model-caps.js'
import { getCamId, parseVar, DEFAULT_ZOOM_SPEED, MAX_ZOOM_SPEED } from './utils.js'

export function getLensActions(self) {
	const CHOICES = self.choices
	return {
		zoomI: {
			name: 'Zoom In',
			options: [],
			callback: async () => {
				resetSnap(self)
				const camId = getCamId(self)
				const p = self.state.zoomSpeed ?? DEFAULT_ZOOM_SPEED
				self.VISCA.send(
					Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_LENS, VISCA.CMD_ZOOM, 0x20 | p, VISCA.VISCA_TERMINATOR]),
				)
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_ZOOM_POSITION)
			},
		},
		zoomO: {
			name: 'Zoom Out',
			options: [],
			callback: async () => {
				resetSnap(self)
				const camId = getCamId(self)
				const p = self.state.zoomSpeed ?? DEFAULT_ZOOM_SPEED
				self.VISCA.send(
					Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_LENS, VISCA.CMD_ZOOM, 0x30 | p, VISCA.VISCA_TERMINATOR]),
				)
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_ZOOM_POSITION)
			},
		},
		zoomS: {
			name: 'Zoom Stop',
			options: [],
			callback: async () => {
				const camId = getCamId(self)
				self.zoomStatus = 'Stopped'
				self.VISCA.send(
					Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_LENS, VISCA.CMD_ZOOM, 0x00, VISCA.VISCA_TERMINATOR]),
				)
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_ZOOM_POSITION)
			},
		},
		zoomRotate: {
			name: 'Zoom Rotate',
			options: [
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'dir',
					choices: [
						{ id: 'in', label: 'Zoom In' },
						{ id: 'out', label: 'Zoom Out' },
					],
					default: 'in',
				},
			],
			callback: async (event) => {
				resetSnap(self)
				const camId = getCamId(self)
				const dir = event.options.dir

				const zoomStatus = self.zoomStatus

				const isMovingIn = zoomStatus === 'In'
				const isMovingOut = zoomStatus === 'Out'

				if ((dir === 'in' && isMovingOut) || (dir === 'out' && isMovingIn)) {
					// Counter-direction -> STOP
					self.zoomStatus = 'Stopped'
					self.VISCA.send(
						Buffer.from([
							camId,
							VISCA.MSG_COMMAND,
							VISCA.CAT_LENS,
							VISCA.CMD_ZOOM,
							VISCA.ZOOM_STOP,
							VISCA.VISCA_TERMINATOR,
						]),
					)
				} else {
					// Same direction or starting from stop
					const sameDir = (dir === 'in' && isMovingIn) || (dir === 'out' && isMovingOut)

					if (sameDir) {
						// Increase speed 0-MAX_ZOOM_SPEED
						self.state.zoomSpeed = Math.min((self.state.zoomSpeed || 0) + 1, MAX_ZOOM_SPEED)
					} else {
						self.state.zoomSpeed = 1
					}

					self.zoomStatus = dir === 'in' ? 'In' : 'Out'
					// Command: 0x01, 0x04, 0x07, 0x2p (In) or 0x3p (Out) where p is speed
					const p = self.state.zoomSpeed
					const cmdByte = dir === 'in' ? VISCA.ZOOM_IN | p : VISCA.ZOOM_OUT | p
					self.VISCA.send(
						Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_LENS, VISCA.CMD_ZOOM, cmdByte, VISCA.VISCA_TERMINATOR]),
					)
				}
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_ZOOM_POSITION)
			},
		},
		zoomDirect: {
			name: 'Zoom Factor',
			options: [
				{
					type: 'textinput',
					label: 'Zoom Factor (1.0x - 10.0x)',
					id: 'val',
					default: '1',
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'Speed',
					id: 'speed',
					choices: CHOICES.LENS_SPEED,
					default: '03',
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				const maxZoom = 10.0
				const zoomRange = maxZoom - 1.0

				const inputVal = parseFloat(await parseVar(self, event.options.val))
				const targetRaw = Math.round(((inputVal - 1.0) / zoomRange) * 16384)
				const speed = parseInt(event.options.speed, 16)

				if (self.state.zoomPosition === undefined) {
					self.log('warn', 'Zoom Factor: Current position unknown. Please wait for inquiry.')
					return
				}

				const startPos = self.state.zoomPosition
				if (Math.abs(startPos - targetRaw) < 50) {
					return // Already there
				}

				self.VISCA.setPollingPaused(true)

				const direction = targetRaw > startPos ? 'in' : 'out'
				const cmdByte = direction === 'in' ? VISCA.ZOOM_IN | speed : VISCA.ZOOM_OUT | speed
				self.VISCA.send(
					Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_LENS, VISCA.CMD_ZOOM, cmdByte, VISCA.VISCA_TERMINATOR]),
				)

				const startTime = Date.now()
				const timeout = 15000 // Safety timeout
				let slowedDown = false

				// Thresholds in raw units (approx 16384 range)
				const EASE_OUT_DIST = 1000 // Start slowing down ~1.1x factor units before target
				const STOP_ANTICIPATION = 80 // Stop ~0.1x factor units before target to handle overshoot

				if (self.zoomSmoothTimer) clearTimeout(self.zoomSmoothTimer)

				const runLoop = () => {
					if (Date.now() - startTime > timeout) {
						stopAndCleanup()
						return
					}

					self.VISCA.sendInquiry(VISCA.INQ_ZOOM_POSITION, true)

					const currentPos = self.state.zoomPosition
					if (currentPos !== undefined) {
						const dist = Math.abs(currentPos - targetRaw)
						const hasPassed = direction === 'in' ? currentPos >= targetRaw : currentPos <= targetRaw

						// 1. Stop Logic (with anticipation)
						if (hasPassed || dist <= STOP_ANTICIPATION) {
							stopAndCleanup()
							return
						}

						// 2. Ease Out Logic (slow down near target)
						if (!slowedDown && speed > 0 && dist < EASE_OUT_DIST) {
							slowedDown = true
							const slowCmdByte = direction === 'in' ? VISCA.ZOOM_IN | 0x00 : VISCA.ZOOM_OUT | 0x00
							self.VISCA.send(
								Buffer.from([
									camId,
									VISCA.MSG_COMMAND,
									VISCA.CAT_LENS,
									VISCA.CMD_ZOOM,
									slowCmdByte,
									VISCA.VISCA_TERMINATOR,
								]),
							)
						}
					}

					// 3. Dynamic Polling Interval
					let interval = 50
					if (currentPos !== undefined) {
						const dist = Math.abs(currentPos - targetRaw)
						if (dist < 1500) interval = 30
						if (dist < 500) interval = 20
					}

					self.zoomSmoothTimer = setTimeout(runLoop, interval)
				}

				runLoop()

				function stopAndCleanup() {
					if (self.zoomSmoothTimer) {
						clearTimeout(self.zoomSmoothTimer)
						self.zoomSmoothTimer = null
					}
					self.VISCA.send(
						Buffer.from([
							camId,
							VISCA.MSG_COMMAND,
							VISCA.CAT_LENS,
							VISCA.CMD_ZOOM,
							VISCA.ZOOM_STOP,
							VISCA.VISCA_TERMINATOR,
						]),
					)
					self.VISCA.setPollingPaused(false)
					self.updateVariables()
				}
			},
		},
		zoomSpeedSet: {
			name: 'Zoom Speed Set',
			options: [
				{
					type: 'dropdown',
					label: 'Speed',
					id: 'val',
					choices: CHOICES.LENS_SPEED,
					default: '03',
				},
			],
			callback: async (event) => {
				self.state.zoomSpeed = parseInt(event.options.val, 16)
				self.updateVariables()
			},
		},
		focusM: {
			name: 'Focus Mode (Auto/Manual)',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					choices: [
						{ id: '2', label: 'Auto' },
						{ id: '3', label: 'Manual' },
						{ id: 'toggle', label: 'Toggle' },
					],
					default: '2',
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				let mode = event.options.mode
				if (mode === 'toggle') {
					mode = self.state.focusMode === 'Manual' ? '2' : '3'
				}
				const val = mode === '2' ? VISCA.PARAM_FOCUS_AUTO : VISCA.PARAM_FOCUS_MANUAL
				self.VISCA.send(
					Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_LENS, VISCA.CMD_FOCUS_MODE, val, VISCA.VISCA_TERMINATOR]),
				)
				self.state.focusMode = mode === '2' ? 'Auto' : 'Manual'
				self.state.focusSpeed = 0
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_FOCUS_MODE)
				self.VISCA.sendInquiry(VISCA.INQ_FOCUS_POSITION)
			},
		},
		focusF: {
			name: 'Focus Far',
			options: [],
			callback: async () => {
				const camId = getCamId(self)
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_LENS,
						VISCA.CMD_FOCUS,
						VISCA.PARAM_FOCUS_FAR,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_FOCUS_POSITION)
			},
		},
		focusN: {
			name: 'Focus Near',
			options: [],
			callback: async () => {
				const camId = getCamId(self)
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_LENS,
						VISCA.CMD_FOCUS,
						VISCA.PARAM_FOCUS_NEAR,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_FOCUS_POSITION)
			},
		},
		focusS: {
			name: 'Focus Stop',
			options: [],
			callback: async () => {
				const camId = getCamId(self)
				self.focusStatus = 'Stopped'
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_LENS,
						VISCA.CMD_FOCUS,
						VISCA.PARAM_FOCUS_STOP,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.state.focusSpeed = 0
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_FOCUS_POSITION)
			},
		},
		focusRotate: {
			name: 'Focus Rotate',
			options: [
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'dir',
					choices: [
						{ id: 'far', label: 'Focus Far' },
						{ id: 'near', label: 'Focus Near' },
					],
					default: 'far',
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				const dir = event.options.dir

				const focusStatus = self.focusStatus

				const isMovingFar = focusStatus === 'Far'
				const isMovingNear = focusStatus === 'Near'

				if ((dir === 'far' && isMovingNear) || (dir === 'near' && isMovingFar)) {
					// Counter-direction -> STOP
					self.focusStatus = 'Stopped'
					self.state.focusSpeed = 0
					self.VISCA.send(
						Buffer.from([
							camId,
							VISCA.MSG_COMMAND,
							VISCA.CAT_LENS,
							VISCA.CMD_FOCUS,
							VISCA.FOCUS_STOP,
							VISCA.VISCA_TERMINATOR,
						]),
					)
				} else {
					// Same direction or starting from stop
					const sameDir = (dir === 'far' && isMovingFar) || (dir === 'near' && isMovingNear)

					if (sameDir) {
						// Increase speed 0-7 (matching zoom speed range)
						self.state.focusSpeed = Math.min((self.state.focusSpeed || 0) + 1, 7)
					} else {
						self.state.focusSpeed = 1
					}

					self.focusStatus = dir === 'far' ? 'Far' : 'Near'
					// Command: 0x01, 0x04, 0x08, 0x2p (Far) or 0x3p (Near) where p is speed
					const p = self.state.focusSpeed
					const cmdByte = dir === 'far' ? VISCA.FOCUS_FAR | p : VISCA.FOCUS_NEAR | p
					self.VISCA.send(
						Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_LENS, VISCA.CMD_FOCUS, cmdByte, VISCA.VISCA_TERMINATOR]),
						undefined,
						undefined,
						undefined,
						false,
						'focusRotate',
					)
				}
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_FOCUS_POSITION)
			},
		},
		focusOpaf: {
			models: CAP_ONE_PUSH,
			name: 'One Push Auto Focus',
			options: [],
			callback: async () => {
				const camId = getCamId(self)
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_LENS,
						VISCA.CMD_FOCUS_ONE_PUSH,
						VISCA.PARAM_FOCUS_ONE_PUSH_TRIGGER,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.state.onePushActive = true
				self.state.focusStationaryCount = 0
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_FOCUS_MODE)
				self.VISCA.sendInquiry(VISCA.INQ_FOCUS_POSITION)
			},
		},
		focusRegion: {
			name: 'Focus Region',
			options: [
				{
					type: 'dropdown',
					label: 'Region',
					id: 'val',
					choices: [...CHOICES.FOCUS_REGION, { id: 'next', label: 'Next' }, { id: 'prev', label: 'Previous' }],
					default: '00',
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				let current = parseInt(self.state.focusRegion ?? '00', 10)
				let val

				if (event.options.val === 'next') {
					val = (current + 1) % 4
				} else if (event.options.val === 'prev') {
					val = (current + 3) % 4
				} else {
					val = parseInt(event.options.val, 16)
				}

				self.VISCA.send(
					Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_LENS, VISCA.CMD_FOCUS_REGION, val, VISCA.VISCA_TERMINATOR]),
				)
				self.state.focusRegion = val.toString().padStart(2, '0')
				self.updateVariables()
			},
		},
		focusSensitivity: {
			name: 'AF Sensitivity',
			options: [
				{
					type: 'dropdown',
					label: 'Sensitivity',
					id: 'val',
					choices: [...CHOICES.AF_SENSITIVITY, { id: 'next', label: 'Next' }, { id: 'prev', label: 'Previous' }],
					default: '01',
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				let current = parseInt(self.state.focusSensitivity ?? '01', 10)
				let val

				if (event.options.val === 'next') {
					val = (current + 1) % 3
				} else if (event.options.val === 'prev') {
					val = (current + 2) % 3
				} else {
					val = parseInt(event.options.val, 16)
				}

				// Correct VISCA command for AF Sensitivity: 8x 01 04 58 0p FF
				// 00: High -> 58 01, 01: Normal -> 58 02, 02: Low -> 58 03
				const p = val + 1
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_LENS,
						VISCA.CMD_FOCUS_SENSITIVITY,
						p,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.state.focusSensitivity = val.toString().padStart(2, '0')
				self.updateVariables()
			},
		},
		focusDirect: {
			name: 'Focus Direct',
			options: [
				{
					type: 'textinput',
					label: 'Focus Position (0 - 2198)',
					id: 'val',
					default: '0',
					useVariables: true,
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				const val = parseInt(await parseVar(self, event.options.val))
				const cmd = Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_LENS,
					VISCA.CMD_FOCUS_DIRECT,
					(val >> 12) & 0x0f,
					(val >> 8) & 0x0f,
					(val >> 4) & 0x0f,
					val & 0x0f,
					VISCA.VISCA_TERMINATOR,
				])
				self.VISCA.send(cmd, undefined, undefined, undefined, false, 'focusDirect')
				self.state.focusPosition = val
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_FOCUS_POSITION)
			},
		},
		focusSet: {
			name: 'Focus Position Up/Down',
			options: [
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'val',
					choices: [
						{ id: 'up', label: 'Focus Far (+)' },
						{ id: 'down', label: 'Focus Near (-)' },
					],
					default: 'up',
				},
				{
					type: 'number',
					label: 'Step Size',
					id: 'step',
					min: 1,
					max: 500,
					default: 1,
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				let current = self.state.focusPosition ?? 0

				// Dynamic acceleration
				const now = Date.now()
				const diff = now - (self.lastFocusSetPulse || 0)
				self.lastFocusSetPulse = now

				let accel = 1
				if (diff < 100)
					accel = 10 // Very fast turning
				else if (diff < 250)
					accel = 4 // Medium turning
				else if (diff < 500) accel = 2 // Slow turning

				const baseStep = event.options.step ?? 1
				const step = baseStep * accel

				let next = event.options.val === 'up' ? current + step : current - step
				next = Math.max(0, Math.min(2198, next))

				const cmd = Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_LENS,
					VISCA.CMD_FOCUS_DIRECT,
					(next >> 12) & 0x0f,
					(next >> 8) & 0x0f,
					(next >> 4) & 0x0f,
					next & 0x0f,
					VISCA.VISCA_TERMINATOR,
				])
				self.VISCA.send(cmd, undefined, undefined, undefined, false, 'focusDirect')
				self.state.focusPosition = next
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_FOCUS_POSITION)
			},
		},
	}
}
