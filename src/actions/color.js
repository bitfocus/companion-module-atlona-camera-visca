/**
 * @file Provides action definitions for Color and White Balance settings, including Red/Blue Gain and Image properties (Contrast, Hue, Saturation).
 */

import { CAP_ONE_PUSH } from '../model-caps.js'
import * as VISCA from '../constants.js'
import { getCamId, throttleAction } from './utils.js'

export function getColorActions(self) {
	const CHOICES = self.choices
	return {
		wbMode: {
			name: 'White Balance Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'val',
					choices: CHOICES.WB_MODE,
					default: '00',
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				const valId = event.options.val
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_CAMERA,
						VISCA.CMD_WB_MODE,
						parseInt(valId, 16),
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.state.wbMode = valId
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_WB_MODE)
			},
		},
		wbCycle: {
			name: 'White Balance: Cycle Modes',
			options: [
				{
					type: 'dropdown',
					label: 'Behavior',
					id: 'behavior',
					choices: [
						{ id: 'apply', label: 'Cycle & Apply Immediately' },
						{ id: 'preview', label: 'Cycle Preview Only' },
						{ id: 'confirm', label: 'Confirm & Apply Preview' },
					],
					default: 'apply',
				},
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'direction',
					choices: [
						{ id: 'next', label: 'Next Mode' },
						{ id: 'prev', label: 'Previous Mode' },
						{ id: 'none', label: '- none -' },
					],
					default: 'next',
					isVisibleExpression: 'options.behavior !== "confirm"',
				},
				{
					type: 'dropdown',
					label: 'Mode Subset',
					id: 'subset',
					choices: [
						{ id: 'all', label: 'All Modes' },
						{ id: 'favorites', label: 'Favorites (Auto, Manual, OnePush)' },
					],
					default: 'all',
					isVisibleExpression: 'options.behavior !== "confirm"',
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				const behavior = event.options.behavior

				if (behavior === 'confirm') {
					if (self.state.wbModePreview !== null && self.state.wbModePreview !== undefined) {
						self.VISCA.send(
							Buffer.from([
								camId,
								VISCA.MSG_COMMAND,
								VISCA.CAT_CAMERA,
								VISCA.CMD_WB_MODE,
								parseInt(self.state.wbModePreview, 16),
								VISCA.VISCA_TERMINATOR,
							]),
						)
						self.state.wbModePreview = null
						self.updateVariables()
						self.checkAllFeedbacks()
						self.VISCA.sendInquiry('090435')
					} else {
						self.log('warn', 'WB Cycle: confirm called without an active preview — no change applied')
					}
					return
				}

				const direction = event.options.direction
				if (direction === 'none') return

				const subset = event.options.subset
				let modes = CHOICES.WB_MODE.map((m) => m.id)

				if (subset === 'favorites') {
					modes = ['00', '03', '05'] // Auto, OnePush, Manual
				}

				if (modes.length === 0) return

				const currentActive =
					behavior === 'preview' && self.state.wbModePreview !== null ? self.state.wbModePreview : self.state.wbMode
				const currentIndex = modes.indexOf(currentActive)

				let nextIndex
				if (currentIndex === -1) {
					// If current mode is not in the subset, jump to the first/last depending on direction
					nextIndex = direction === 'next' ? 0 : modes.length - 1
				} else {
					if (direction === 'next') {
						nextIndex = (currentIndex + 1) % modes.length
					} else {
						nextIndex = (currentIndex - 1 + modes.length) % modes.length
					}
				}

				const nextMode = modes[nextIndex]
				if (!nextMode) return

				if (behavior === 'preview') {
					self.state.wbModePreview = nextMode
					self.updateVariables()
					self.checkAllFeedbacks()
				} else {
					self.VISCA.send(
						Buffer.from([
							camId,
							VISCA.MSG_COMMAND,
							VISCA.CAT_CAMERA,
							VISCA.CMD_WB_MODE,
							parseInt(nextMode, 16),
							VISCA.VISCA_TERMINATOR,
						]),
					)
					self.state.wbMode = nextMode
					self.updateVariables()
					self.checkAllFeedbacks()
					self.VISCA.sendInquiry(VISCA.INQ_WB_MODE)
				}
			},
		},
		wbOnePush: {
			models: CAP_ONE_PUSH,
			name: 'One Push WB Trigger',
			options: [],
			callback: async () => {
				const camId = getCamId(self)
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_CAMERA,
						VISCA.CMD_WB_ONE_PUSH,
						0x05,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				// No forced inquiry here. Background loop will eventually update the state.
			},
		},

		rGainSet: {
			name: 'R.Gain Up/Down/Set',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'val',
					choices: [
						{ id: 'up', label: 'R.Gain Up (+)' },
						{ id: 'down', label: 'R.Gain Down (-)' },
						...CHOICES.GAIN_RGB,
					],
					default: 'up',
				},
				{
					type: 'number',
					label: 'Step Size (for up/down)',
					id: 'step',
					min: 1,
					max: 50,
					default: 1,
				},
			],
			callback: async (event) => {
				if (self.state.wbMode !== '05') return
				if (!throttleAction(self, 'rGain', 50, 'rGain')) return

				const camId = getCamId(self)
				const valId = event.options.val
				const baseStep = event.options.step ?? 1

				// Dynamic acceleration
				const now = Date.now()
				const diff = now - (self.lastRGainSetPulse || 0)
				self.lastRGainSetPulse = now

				let accel = 1
				if (diff < 100) accel = 10
				else if (diff < 250) accel = 4
				else if (diff < 500) accel = 2

				const step = baseStep * accel
				const current = parseInt(self.state.rGain ?? 150)

				let val
				if (valId === 'up' || valId === 'down') {
					val = valId === 'up' ? current + step : current - step
				} else {
					val = parseInt(valId)
				}

				val = Math.max(0, Math.min(255, val))
				self.lastSentRGain = val

				const cmd = Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_R_GAIN_DIRECT,
					0x00,
					0x00,
					(val >> 4) & 0x0f,
					val & 0x0f,
					VISCA.VISCA_TERMINATOR,
				])
				self.VISCA.send(cmd)

				// Optimistic state update
				self.state.rGain = val
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_R_GAIN)
			},
		},
		rGainDirect: {
			name: 'R.Gain Set Direct (Legacy)',
			options: [
				{
					type: 'number',
					label: 'Direct Value (0 - 255)',
					id: 'val',
					min: 0,
					max: 255,
					default: 150,
				},
			],
			callback: async (event) => {
				if (self.state.wbMode !== '05') return
				const camId = getCamId(self)
				const val = event.options.val
				self.lastSentRGain = val
				const cmd = Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_R_GAIN_DIRECT,
					0x00,
					0x00,
					(val >> 4) & 0x0f,
					val & 0x0f,
					VISCA.VISCA_TERMINATOR,
				])
				self.VISCA.send(cmd)
				self.state.rGain = val
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_R_GAIN)
			},
		},
		bGainSet: {
			name: 'B.Gain Up/Down/Set',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'val',
					choices: [
						{ id: 'up', label: 'B.Gain Up (+)' },
						{ id: 'down', label: 'B.Gain Down (-)' },
						...CHOICES.GAIN_RGB,
					],
					default: 'up',
				},
				{
					type: 'number',
					label: 'Step Size (for up/down)',
					id: 'step',
					min: 1,
					max: 50,
					default: 1,
				},
			],
			callback: async (event) => {
				if (self.state.wbMode !== '05') return
				if (!throttleAction(self, 'bGain', 50, 'bGain')) return

				const camId = getCamId(self)
				const valId = event.options.val
				const baseStep = event.options.step ?? 1

				// Dynamic acceleration
				const now = Date.now()
				const diff = now - (self.lastBGainSetPulse || 0)
				self.lastBGainSetPulse = now

				let accel = 1
				if (diff < 100) accel = 10
				else if (diff < 250) accel = 4
				else if (diff < 500) accel = 2

				const step = baseStep * accel
				const current = parseInt(self.state.bGain ?? 150)

				let val
				if (valId === 'up' || valId === 'down') {
					val = valId === 'up' ? current + step : current - step
				} else {
					val = parseInt(valId)
				}

				val = Math.max(0, Math.min(255, val))
				self.lastSentBGain = val

				const cmd = Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_B_GAIN_DIRECT,
					0x00,
					0x00,
					(val >> 4) & 0x0f,
					val & 0x0f,
					VISCA.VISCA_TERMINATOR,
				])
				self.VISCA.send(cmd)

				// Optimistic state update
				self.state.bGain = val
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_B_GAIN)
			},
		},
		bGainDirect: {
			name: 'B.Gain Set Direct (Legacy)',
			options: [
				{
					type: 'number',
					label: 'Direct Value (0 - 255)',
					id: 'val',
					min: 0,
					max: 255,
					default: 150,
				},
			],
			callback: async (event) => {
				if (self.state.wbMode !== '05') return
				const camId = getCamId(self)
				const val = event.options.val
				self.lastSentBGain = val
				const cmd = Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_B_GAIN_DIRECT,
					0x00,
					0x00,
					(val >> 4) & 0x0f,
					val & 0x0f,
					VISCA.VISCA_TERMINATOR,
				])
				self.VISCA.send(cmd)
				self.state.bGain = val
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_B_GAIN)
			},
		},
		nr2dSet: {
			name: 'Noise Reduction 2D: Up/Down/Set',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'val',
					choices: [{ id: 'up', label: 'Level Up (+)' }, { id: 'down', label: 'Level Down (-)' }, ...CHOICES.NR_LEVEL],
					default: 'up',
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				const valId = event.options.val
				let val
				if (valId === 'up' || valId === 'down') {
					const current = self.state.nr2d ?? 2
					val = valId === 'up' ? current + 1 : current - 1
					val = Math.max(0, Math.min(8, val))
				} else {
					val = parseInt(valId)
				}
				self.VISCA.send(
					Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_CAMERA, VISCA.CMD_NR2D, val, VISCA.VISCA_TERMINATOR]),
				)
				self.state.nr2d = val
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_NR2D, true)
			},
		},
		nr3dSet: {
			name: 'Noise Reduction 3D: Up/Down/Set',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'val',
					choices: [{ id: 'up', label: 'Level Up (+)' }, { id: 'down', label: 'Level Down (-)' }, ...CHOICES.NR_LEVEL],
					default: 'up',
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				const valId = event.options.val
				let val
				if (valId === 'up' || valId === 'down') {
					const current = self.state.nr3d ?? 2
					val = valId === 'up' ? current + 1 : current - 1
					val = Math.max(0, Math.min(8, val))
				} else {
					val = parseInt(valId)
				}
				self.VISCA.send(
					Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_CAMERA, VISCA.CMD_NR3D, val, VISCA.VISCA_TERMINATOR]),
				)
				self.state.nr3d = val
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_NR3D, true)
			},
		},
		imageContrastSet: {
			name: 'Image: Contrast',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'val',
					choices: [{ id: 'up', label: 'Up' }, { id: 'down', label: 'Down' }, ...CHOICES.CONTRAST],
					default: 'up',
				},
			],
			callback: async (event) => {
				if (!throttleAction(self, 'contrast', 0, 'contrast', 1000)) return

				const camId = getCamId(self)
				const valId = event.options.val
				let val
				if (valId === 'up' || valId === 'down') {
					const current = self.state.contrast ?? 7
					val = valId === 'up' ? current + 1 : current - 1
					val = Math.max(0, Math.min(14, val))
				} else {
					val = parseInt(valId)
				}
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_CAMERA,
						VISCA.CMD_CONTRAST_DIRECT,
						0x00,
						0x00,
						(val >> 4) & 0x0f,
						val & 0x0f,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.state.contrast = val
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_CONTRAST, true)
			},
		},
		imageSharpnessSet: {
			name: 'Image: Sharpness',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'val',
					choices: [{ id: 'up', label: 'Up' }, { id: 'down', label: 'Down' }, ...CHOICES.SHARPNESS],
					default: 'up',
				},
			],
			callback: async (event) => {
				if (!throttleAction(self, 'sharpness', 0, 'sharpness', 1000)) return

				const camId = getCamId(self)
				const valId = event.options.val
				let val
				if (valId === 'up' || valId === 'down') {
					const current = self.state.sharpness ?? 7
					val = valId === 'up' ? current + 1 : current - 1
					val = Math.max(0, Math.min(15, val))
				} else {
					val = parseInt(valId)
				}
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_CAMERA,
						VISCA.CMD_SHARPNESS_DIRECT,
						0x00,
						0x00,
						(val >> 4) & 0x0f,
						val & 0x0f,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.state.sharpness = val
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_SHARPNESS, true)
			},
		},
		imageSaturationSet: {
			name: 'Image: Saturation',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'val',
					choices: [{ id: 'up', label: 'Up' }, { id: 'down', label: 'Down' }, ...CHOICES.SATURATION],
					default: 'up',
				},
			],
			callback: async (event) => {
				if (!throttleAction(self, 'saturation', 0, 'saturation', 1000)) return

				const camId = getCamId(self)
				const valId = event.options.val
				let val
				if (valId === 'up' || valId === 'down') {
					const current = self.state.saturation ?? 7
					val = valId === 'up' ? current + 1 : current - 1
					val = Math.max(0, Math.min(14, val))
				} else {
					val = parseInt(valId)
				}
				self.VISCA.send(Buffer.from([camId, 0x01, 0x04, 0x49, 0x00, 0x00, (val >> 4) & 0x0f, val & 0x0f, 0xff]))
				self.state.saturation = val
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_SATURATION, true)
			},
		},
		imageLuminanceSet: {
			name: 'Image: Brightness (Picture)',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'val',
					choices: [{ id: 'up', label: 'Up' }, { id: 'down', label: 'Down' }, ...CHOICES.LUMINANCE],
					default: 'up',
				},
			],
			callback: async (event) => {
				if (!throttleAction(self, 'luminance', 0, 'luminance', 1000)) return

				const camId = getCamId(self)
				const valId = event.options.val
				let val
				if (valId === 'up' || valId === 'down') {
					const current = self.state.luminance ?? 7
					val = valId === 'up' ? current + 1 : current - 1
					val = Math.max(0, Math.min(14, val))
				} else {
					val = parseInt(valId)
				}
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_CAMERA,
						VISCA.CMD_LUMINANCE_DIRECT,
						0x00,
						0x00,
						(val >> 4) & 0x0f,
						val & 0x0f,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.state.luminance = val
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_LUMINANCE, true)
			},
		},
		imageHueSet: {
			name: 'Image: Hue',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'val',
					choices: [{ id: 'up', label: 'Up' }, { id: 'down', label: 'Down' }, ...CHOICES.HUE],
					default: 'up',
				},
			],
			callback: async (event) => {
				if (!throttleAction(self, 'hue', 0, 'hue', 1000)) return

				const camId = getCamId(self)
				const valId = event.options.val
				let val
				if (valId === 'up' || valId === 'down') {
					const current = self.state.hue ?? 7
					val = valId === 'up' ? current + 1 : current - 1
					val = Math.max(0, Math.min(14, val))
				} else {
					val = parseInt(valId)
				}
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_CAMERA,
						VISCA.CMD_HUE_DIRECT,
						0x00,
						0x00,
						(val >> 4) & 0x0f,
						val & 0x0f,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.state.hue = val
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_HUE, true)
			},
		},
		imageGammaSet: {
			name: 'Image: Gamma',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'val',
					choices: [{ id: 'up', label: 'Up' }, { id: 'down', label: 'Down' }, ...CHOICES.GAMMA],
					default: 'up',
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				const valId = event.options.val
				let val
				if (valId === 'up' || valId === 'down') {
					const current = parseInt(self.state.gamma ?? 0)
					val = valId === 'up' ? current + 1 : current - 1
					val = Math.max(0, Math.min(4, val))
				} else {
					val = parseInt(valId)
				}
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_CAMERA,
						VISCA.CMD_GAMMA_DIRECT,
						val & 0x0f,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.state.gamma = val.toString()
				self.updateVariables()
				self.VISCA.sendInquiry(VISCA.INQ_GAMMA, true)
			},
		},
	}
}
