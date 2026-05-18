/**
 * @file Provides action definitions for saving, recalling, and clearing internal camera presets.
 */

import * as VISCA from '../constants.js'
import { getCamId, parseVar } from './utils.js'

export function getCameraPresetActions(self) {
	return {
		preset_recall: {
			name: 'Recall Preset',
			options: [
				{
					type: 'textinput',
					label: 'Preset Number (0-254 or variable)',
					id: 'val',
					default: '1',
					useVariables: true,
				},
				{ type: 'checkbox', label: 'Recall Position', id: 'recallPos', default: true },
			],
			callback: async (event) => {
				const camId = getCamId(self)
				let val = await parseVar(self, event.options.val)
				if (val === 'ps') {
					val = self.state.presetSelector
				}

				let presetNum = parseInt(val)
				if (isNaN(presetNum) || presetNum < 0) {
					self.log('warn', `Recall Preset: Invalid number "${val}". Defaulting to 0.`)
					presetNum = 0
				}

				self.state.presetLastUsed = presetNum
				self.updateVariables()
				self.checkAllFeedbacks('selectedPreset')

				const recallPos = event.options.recallPos ?? true

				if (recallPos) {
					self.state.presetRecallActive = Date.now()
					// Send camera preset recall first
					const cameraPreset = Math.max(0, Math.min(presetNum, 254))
					self.VISCA.send(
						Buffer.from([
							camId,
							VISCA.MSG_COMMAND,
							VISCA.CAT_LENS,
							VISCA.CMD_PRESET,
							VISCA.PARAM_PRESET_RECALL,
							cameraPreset,
							VISCA.VISCA_TERMINATOR,
						]),
					)
				}

				if (recallPos) {
					setTimeout(() => {
						self.VISCA.sendInquiry(VISCA.INQ_PT_POSITION)
						self.VISCA.sendInquiry(VISCA.INQ_ZOOM_POSITION)
					}, 2000)
				}
			},
		},

		preset_save: {
			name: 'Save Preset',
			options: [
				{
					type: 'textinput',
					label: 'Preset Number (0-254 or variable)',
					id: 'val',
					default: '1',
					useVariables: true,
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				let val = await parseVar(self, event.options.val)
				if (val === 'ps') {
					val = self.state.presetSelector
				}

				let presetNum = parseInt(val)
				if (isNaN(presetNum) || presetNum < 0) {
					self.log('warn', `Save Preset: Invalid number "${val}". Defaulting to 0.`)
					presetNum = 0
				}

				self.state.presetLastUsed = presetNum
				self.updateVariables()
				self.checkAllFeedbacks('selectedPreset')

				self.state.presetSaving = true
				self.checkAllFeedbacks('presetSaving')

				if (self.presetSavingResetTimer) {
					clearTimeout(self.presetSavingResetTimer)
				}
				self.presetSavingResetTimer = setTimeout(() => {
					self.state.presetSaving = false
					self.checkAllFeedbacks('presetSaving')
					self.presetSavingResetTimer = null
				}, 2000)

				const cameraPreset = Math.max(0, Math.min(presetNum, 254))
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_LENS,
						VISCA.CMD_PRESET,
						VISCA.PARAM_PRESET_SET,
						cameraPreset,
						VISCA.VISCA_TERMINATOR,
					]),
				)
			},
		},

		preset_save_clear: {
			name: 'Clear Preset Save Status',
			options: [],
			callback: async () => {
				self.state.presetSaving = false
				self.updateVariables()
				self.checkAllFeedbacks('presetSaving')
			},
		},
	}
}
