/**
 * @file Provides action definitions for Pan and Tilt movements, including speed adjustments and positional resets.
 */

import { getCamId } from './utils.js'
import * as VISCA from '../constants.js'
import { getPtzParams, resetSnap, parseVar } from './utils.js'

export function getPanTiltActions(self) {
	const CHOICES = self.choices
	return {
		left: {
			name: 'Pan Left',
			options: [],
			callback: async () => {
				resetSnap(self)
				const { camId, panSpeed, tiltSpeed } = getPtzParams(self)
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_PAN_TILT,
						VISCA.CMD_PT_DRIVE,
						panSpeed,
						tiltSpeed,
						VISCA.PT_PAN_LEFT,
						VISCA.PT_TILT_STOP,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_PT_POSITION)
			},
		},
		right: {
			name: 'Pan Right',
			options: [],
			callback: async () => {
				resetSnap(self)
				const { camId, panSpeed, tiltSpeed } = getPtzParams(self)
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_PAN_TILT,
						VISCA.CMD_PT_DRIVE,
						panSpeed,
						tiltSpeed,
						VISCA.PT_PAN_RIGHT,
						VISCA.PT_TILT_STOP,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_PT_POSITION)
			},
		},
		upLeft: {
			name: 'Pan/Tilt Up Left',
			options: [],
			callback: async () => {
				resetSnap(self)
				const { camId, panSpeed, tiltSpeed } = getPtzParams(self)
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_PAN_TILT,
						VISCA.CMD_PT_DRIVE,
						panSpeed,
						tiltSpeed,
						VISCA.PT_PAN_LEFT,
						VISCA.PT_TILT_UP,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_PT_POSITION)
			},
		},
		upRight: {
			name: 'Pan/Tilt Up Right',
			options: [],
			callback: async () => {
				resetSnap(self)
				const { camId, panSpeed, tiltSpeed } = getPtzParams(self)
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_PAN_TILT,
						VISCA.CMD_PT_DRIVE,
						panSpeed,
						tiltSpeed,
						VISCA.PT_PAN_RIGHT,
						VISCA.PT_TILT_UP,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_PT_POSITION)
			},
		},
		downLeft: {
			name: 'Pan/Tilt Down Left',
			options: [],
			callback: async () => {
				resetSnap(self)
				const { camId, panSpeed, tiltSpeed } = getPtzParams(self)
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_PAN_TILT,
						VISCA.CMD_PT_DRIVE,
						panSpeed,
						tiltSpeed,
						VISCA.PT_PAN_LEFT,
						VISCA.PT_TILT_DOWN,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_PT_POSITION)
			},
		},
		downRight: {
			name: 'Pan/Tilt Down Right',
			options: [],
			callback: async () => {
				resetSnap(self)
				const { camId, panSpeed, tiltSpeed } = getPtzParams(self)
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_PAN_TILT,
						VISCA.CMD_PT_DRIVE,
						panSpeed,
						tiltSpeed,
						VISCA.PT_PAN_RIGHT,
						VISCA.PT_TILT_DOWN,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_PT_POSITION)
			},
		},
		up: {
			name: 'Tilt Up',
			options: [],
			callback: async () => {
				resetSnap(self)
				const { camId, panSpeed, tiltSpeed } = getPtzParams(self)
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_PAN_TILT,
						VISCA.CMD_PT_DRIVE,
						panSpeed,
						tiltSpeed,
						VISCA.PT_PAN_STOP,
						VISCA.PT_TILT_UP,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_PT_POSITION)
			},
		},
		down: {
			name: 'Tilt Down',
			options: [],
			callback: async () => {
				resetSnap(self)
				const { camId, panSpeed, tiltSpeed } = getPtzParams(self)
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_PAN_TILT,
						VISCA.CMD_PT_DRIVE,
						panSpeed,
						tiltSpeed,
						VISCA.PT_PAN_STOP,
						VISCA.PT_TILT_DOWN,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_PT_POSITION)
			},
		},
		stop: {
			name: 'Pan/Tilt Stop',
			options: [],
			callback: async () => {
				resetSnap(self)
				const { camId, panSpeed, tiltSpeed } = getPtzParams(self)
				self.panStatus = 'Stopped'
				self.tiltStatus = 'Stopped'
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_PAN_TILT,
						VISCA.CMD_PT_DRIVE,
						panSpeed,
						tiltSpeed,
						VISCA.PT_PAN_STOP,
						VISCA.PT_TILT_STOP,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_PT_POSITION)
			},
		},
		panRotate: {
			name: 'Pan Rotate',
			options: [
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'dir',
					choices: [
						{ id: 'left', label: 'Left' },
						{ id: 'right', label: 'Right' },
					],
					default: 'left',
				},
			],
			callback: async (event) => {
				resetSnap(self)
				const camId = getCamId(self)
				const dir = event.options.dir

				const panStatus = self.panStatus
				const tiltStatus = self.tiltStatus

				const isMovingLeft = panStatus === 'Left'
				const isMovingRight = panStatus === 'Right'
				const isMovingUp = tiltStatus === 'Up'
				const isMovingDown = tiltStatus === 'Down'

				if ((dir === 'left' && isMovingRight) || (dir === 'right' && isMovingLeft)) {
					// Counter-direction -> STOP
					self.panStatus = 'Stopped'
					self.tiltStatus = 'Stopped'
					self.VISCA.send(
						Buffer.from([
							camId,
							VISCA.MSG_COMMAND,
							VISCA.CAT_PAN_TILT,
							VISCA.CMD_PT_DRIVE,
							0x01,
							0x01,
							VISCA.PT_PAN_STOP,
							VISCA.PT_TILT_STOP,
							VISCA.VISCA_TERMINATOR,
						]),
					)
				} else {
					// Same direction or starting from stop
					const sameDir = (dir === 'left' && isMovingLeft) || (dir === 'right' && isMovingRight)

					if (sameDir) {
						self.state.panSpeed = Math.min((self.state.panSpeed || 0) + 1, 0x18)
					} else {
						self.state.panSpeed = 1
					}

					self.panStatus = dir === 'left' ? 'Left' : 'Right'
					const q = isMovingUp ? VISCA.PT_TILT_UP : isMovingDown ? VISCA.PT_TILT_DOWN : VISCA.PT_TILT_STOP

					self.VISCA.send(
						Buffer.from([
							camId,
							VISCA.MSG_COMMAND,
							VISCA.CAT_PAN_TILT,
							VISCA.CMD_PT_DRIVE,
							self.state.panSpeed,
							self.state.tiltSpeed,
							dir === 'left' ? VISCA.PT_PAN_LEFT : VISCA.PT_PAN_RIGHT,
							q,
							VISCA.VISCA_TERMINATOR,
						]),
					)
				}
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_PT_POSITION)
			},
		},
		tiltRotate: {
			name: 'Tilt Rotate',
			options: [
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'dir',
					choices: [
						{ id: 'up', label: 'Up' },
						{ id: 'down', label: 'Down' },
					],
					default: 'up',
				},
			],
			callback: async (event) => {
				resetSnap(self)
				const camId = getCamId(self)
				const dir = event.options.dir

				const panStatus = self.panStatus
				const tiltStatus = self.tiltStatus

				const isMovingUp = tiltStatus === 'Up'
				const isMovingDown = tiltStatus === 'Down'
				const isMovingLeft = panStatus === 'Left'
				const isMovingRight = panStatus === 'Right'

				if ((dir === 'up' && isMovingDown) || (dir === 'down' && isMovingUp)) {
					// Counter-direction -> STOP
					self.panStatus = 'Stopped'
					self.tiltStatus = 'Stopped'
					self.VISCA.send(
						Buffer.from([
							camId,
							VISCA.MSG_COMMAND,
							VISCA.CAT_PAN_TILT,
							VISCA.CMD_PT_DRIVE,
							0x01,
							0x01,
							VISCA.PT_PAN_STOP,
							VISCA.PT_TILT_STOP,
							VISCA.VISCA_TERMINATOR,
						]),
					)
				} else {
					// Same direction or starting from stop
					const sameDir = (dir === 'up' && isMovingUp) || (dir === 'down' && isMovingDown)

					if (sameDir) {
						self.state.tiltSpeed = Math.min((self.state.tiltSpeed || 0) + 1, 0x14)
					} else {
						self.state.tiltSpeed = 1
					}

					self.tiltStatus = dir === 'up' ? 'Up' : 'Down'
					const p = isMovingLeft ? VISCA.PT_PAN_LEFT : isMovingRight ? VISCA.PT_PAN_RIGHT : VISCA.PT_PAN_STOP

					self.VISCA.send(
						Buffer.from([
							camId,
							VISCA.MSG_COMMAND,
							VISCA.CAT_PAN_TILT,
							VISCA.CMD_PT_DRIVE,
							self.state.panSpeed,
							self.state.tiltSpeed,
							p,
							dir === 'up' ? VISCA.PT_TILT_UP : VISCA.PT_TILT_DOWN,
							VISCA.VISCA_TERMINATOR,
						]),
					)
				}
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_PT_POSITION)
			},
		},
		panTiltStop: {
			name: 'Pan/Tilt Stop & Reset Speed',
			options: [],
			callback: async () => {
				resetSnap(self)
				const camId = getCamId(self)
				self.panStatus = 'Stopped'
				self.tiltStatus = 'Stopped'
				self.updateVariables()
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_PAN_TILT,
						VISCA.CMD_PT_DRIVE,
						0x01,
						0x01,
						VISCA.PT_PAN_STOP,
						VISCA.PT_TILT_STOP,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.VISCA.sendInquiry(VISCA.INQ_PT_POSITION)
			},
		},
		ptzReset: {
			name: 'Pan/Tilt Reset',
			options: [],
			callback: async () => {
				resetSnap(self)
				const camId = getCamId(self)
				self.VISCA.send(
					Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_PAN_TILT, VISCA.CMD_PT_RESET, VISCA.VISCA_TERMINATOR]),
				)
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_PT_POSITION)
			},
		},
		home: {
			name: 'Pan/Tilt Home',
			options: [],
			callback: async () => {
				resetSnap(self)
				const camId = getCamId(self)
				self.VISCA.send(
					Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_PAN_TILT, VISCA.CMD_PT_HOME, VISCA.VISCA_TERMINATOR]),
				)
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_PT_POSITION)
			},
		},
		panSpeedSet: {
			name: 'Pan Speed Set',
			options: [
				{
					type: 'dropdown',
					label: 'Speed',
					id: 'val',
					choices: CHOICES.SPEED,
					default: '0C',
				},
			],
			callback: async (event) => {
				self.state.panSpeed = parseInt(event.options.val, 16)
				self.updateVariables()
			},
		},
		tiltSpeedSet: {
			name: 'Tilt Speed Set',
			options: [
				{
					type: 'dropdown',
					label: 'Speed',
					id: 'val',
					choices: CHOICES.SPEED,
					default: '0C',
				},
			],
			callback: async (event) => {
				self.state.tiltSpeed = parseInt(event.options.val, 16)
				self.updateVariables()
			},
		},
		ptPosition: {
			name: 'Pan/Tilt Position',
			options: [
				{
					type: 'textinput',
					label: 'Pan Position (-170Â° - 170Â°)',
					tooltip: 'Empty = no movement',
					id: 'pan',
					default: '0',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Tilt Position (-30Â° - 90Â°)',
					tooltip: 'Empty = no movement',
					id: 'tilt',
					default: '0',
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'Pan Speed',
					id: 'panSpeed',
					choices: [{ id: 'auto', label: 'Use Current Speed' }, ...CHOICES.SPEED],
					default: 'auto',
				},
				{
					type: 'dropdown',
					label: 'Tilt Speed',
					id: 'tiltSpeed',
					choices: [{ id: 'auto', label: 'Use Current Speed' }, ...CHOICES.SPEED],
					default: 'auto',
				},
			],
			callback: async (event) => {
				const { camId, panSpeed: statePanSpeed, tiltSpeed: stateTiltSpeed } = getPtzParams(self)
				const panVar = await parseVar(self, event.options.pan)
				const tiltVar = await parseVar(self, event.options.tilt)

				const pan = panVar !== '' ? parseFloat(panVar) : NaN
				const tilt = tiltVar !== '' ? parseFloat(tiltVar) : NaN

				const p_raw = isNaN(pan) ? self.state.panPosition : Math.round(pan / 0.0694)
				const t_raw = isNaN(tilt) ? self.state.tiltPosition : Math.round(tilt / 0.0694)

				if (p_raw === undefined || t_raw === undefined) {
					self.log('warn', 'Cannot skip axis: Current position unknown. Please wait for inquiry.')
					return
				}

				if (!isNaN(pan)) self.state.lastSentPan = p_raw
				if (!isNaN(tilt)) self.state.lastSentTilt = t_raw

				const panSpeed =
					!event.options.panSpeed || event.options.panSpeed === 'auto'
						? statePanSpeed
						: parseInt(event.options.panSpeed, 16)
				const tiltSpeed =
					!event.options.tiltSpeed || event.options.tiltSpeed === 'auto'
						? stateTiltSpeed
						: parseInt(event.options.tiltSpeed, 16)

				const p = p_raw < 0 ? 0x10000 + p_raw : p_raw
				const t = t_raw < 0 ? 0x10000 + t_raw : t_raw
				const cmd = Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_PAN_TILT,
					VISCA.CMD_PT_ABSOLUTE,
					panSpeed,
					tiltSpeed,
					(p >> 12) & 0x0f,
					(p >> 8) & 0x0f,
					(p >> 4) & 0x0f,
					p & 0x0f,
					(t >> 12) & 0x0f,
					(t >> 8) & 0x0f,
					(t >> 4) & 0x0f,
					t & 0x0f,
					VISCA.VISCA_TERMINATOR,
				])
				self.VISCA.send(cmd)
				self.VISCA.sendInquiry(VISCA.INQ_PT_POSITION)
			},
		},
	}
}
