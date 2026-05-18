/**
 * @file Aggregates all Companion feedback definitions (e.g. tally light logic, variable checks).
 */

import { COLORS } from './colors.js'
import { CHOICES } from './choices.js'
import { filterByModel } from './model-caps.js'

export function getFeedbackDefinitions(self) {
	const parseVar = async (val) => {
		if (typeof val !== 'string' || val.indexOf('$(') === -1) return val
		try {
			if (self.parseVariablesInString) {
				return await self.parseVariablesInString(val)
			}
		} catch (e) {
			self.log('debug', 'Variable parse failed: ' + e.message)
		}
		return val
	}

	const feedbacks = {
		powerStatus: {
			type: 'boolean',
			name: 'Power Status',
			description: 'Highlights when Power is On',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'status',
					choices: [
						{ id: 'On', label: 'On' },
						{ id: 'Off', label: 'Off' },
					],
					default: 'On',
				},
			],
			callback: function (feedback) {
				return self.state.powerStatus === feedback.options.status
			},
		},
		flipHStatus: {
			type: 'boolean',
			name: 'Flip Horizontal Status',
			description: 'Highlights when Flip-H is On',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'status',
					choices: [
						{ id: 'On', label: 'On' },
						{ id: 'Off', label: 'Off' },
					],
					default: 'On',
				},
			],
			callback: function (feedback) {
				return self.state.flipHStatus === feedback.options.status
			},
		},
		flipVStatus: {
			type: 'boolean',
			name: 'Flip Vertical Status',
			description: 'Highlights when Flip-V is On',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'status',
					choices: [
						{ id: 'On', label: 'On' },
						{ id: 'Off', label: 'Off' },
					],
					default: 'On',
				},
			],
			callback: function (feedback) {
				return self.state.flipVStatus === feedback.options.status
			},
		},
		focusMode: {
			type: 'boolean',
			name: 'Focus Mode',
			description: 'Highlights when focus mode matches',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					choices: [
						{ id: 'Auto', label: 'Auto' },
						{ id: 'Manual', label: 'Manual' },
					],
					default: 'Auto',
				},
			],
			callback: function (feedback) {
				return self.state.focusMode === feedback.options.mode
			},
		},
		exposureMode: {
			type: 'boolean',
			name: 'Exposure Mode',
			description: 'Highlights when exposure mode matches',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					choices: [
						{ id: 'Auto', label: 'Auto' },
						{ id: 'Manual', label: 'Manual' },
						{ id: 'SAE', label: 'SAE' },
						{ id: 'AAE', label: 'AAE' },
						{ id: 'Bright', label: 'Bright' },
					],
					default: 'Auto',
				},
			],
			callback: function (feedback) {
				return self.state.exposureMode === feedback.options.mode
			},
		},
		irisPosition: {
			type: 'boolean',
			name: 'Iris Value',
			description: 'Highlights when iris matches value',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_BLUE,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Iris',
					id: 'val',
					choices: CHOICES.IRIS,
					default: '0E',
				},
			],
			callback: function (feedback) {
				const val = parseInt(feedback.options.val, 16)
				return self.state.irisPosition === val
			},
		},
		expComp: {
			type: 'boolean',
			name: 'Exposure Compensation',
			description: 'Highlights when exposure compensation status matches',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'status',
					choices: [
						{ id: 'On', label: 'On' },
						{ id: 'Off', label: 'Off' },
					],
					default: 'On',
				},
			],
			callback: function (feedback) {
				return self.state.expComp === feedback.options.status
			},
		},
		backlight: {
			type: 'boolean',
			name: 'Backlight Compensation',
			description: 'Highlights when backlight compensation is on',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'status',
					choices: [
						{ id: 'On', label: 'On' },
						{ id: 'Off', label: 'Off' },
					],
					default: 'On',
				},
			],
			callback: function (feedback) {
				return self.state.backlight === feedback.options.status
			},
		},
		hueValue: {
			type: 'boolean',
			name: 'Hue Value',
			description: 'Highlights when Hue matches value',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_BLUE,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Hue',
					id: 'val',
					choices: CHOICES.HUE,
					default: '7',
				},
			],
			callback: function (feedback) {
				return self.state.hue === Number(feedback.options.val)
			},
		},
		contrastValue: {
			type: 'boolean',
			name: 'Contrast Value',
			description: 'Highlights when Contrast matches value',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_BLUE,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Contrast',
					id: 'val',
					choices: CHOICES.CONTRAST,
					default: '7',
				},
			],
			callback: function (feedback) {
				return self.state.contrast === Number(feedback.options.val)
			},
		},
		sharpnessValue: {
			type: 'boolean',
			name: 'Sharpness Value',
			description: 'Highlights when Sharpness matches value',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_BLUE,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Sharpness',
					id: 'val',
					choices: CHOICES.SHARPNESS,
					default: '7',
				},
			],
			callback: function (feedback) {
				return self.state.sharpness === Number(feedback.options.val)
			},
		},
		saturationValue: {
			type: 'boolean',
			name: 'Saturation Value',
			description: 'Highlights when Saturation matches value',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_BLUE,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Saturation',
					id: 'val',
					choices: CHOICES.SATURATION,
					default: '7',
				},
			],
			callback: function (feedback) {
				return self.state.saturation === Number(feedback.options.val)
			},
		},
		luminanceValue: {
			type: 'boolean',
			name: 'Luminance Value',
			description: 'Highlights when Luminance matches value',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_BLUE,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Luminance',
					id: 'val',
					choices: CHOICES.LUMINANCE,
					default: '7',
				},
			],
			callback: function (feedback) {
				return self.state.luminance === Number(feedback.options.val)
			},
		},
		wbMode: {
			type: 'boolean',
			name: 'White Balance Mode',
			defaultStyle: { color: COLORS.WHITE, bgcolor: COLORS.DARK_GREEN },
			options: [{ type: 'dropdown', label: 'Mode', id: 'val', choices: self.choices.WB_MODE, default: '00' }],
			callback: (event) => self.state.wbMode === event.options.val,
		},
		wbPreviewMatchesActive: {
			type: 'boolean',
			name: 'White Balance Preview Matches Active',
			defaultStyle: { color: COLORS.WHITE, bgcolor: COLORS.DARK_GREEN },
			options: [],
			callback: () => (self.state.wbModePreview ?? self.state.wbMode) === self.state.wbMode,
		},
		selectedPreset: {
			type: 'boolean',
			name: 'Selected Preset',
			description: 'Highlight the selected preset',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: 0x777788,
			},
			options: [
				{
					type: 'textinput',
					label: 'Preset Number (1-64 or variable)',
					id: 'preset',
					default: '1',
					useVariables: true,
				},
			],
			callback: async function (feedback) {
				const parsed = await parseVar(feedback.options.preset)
				if (parsed === 'ps') {
					return false
				}
				return parseInt(parsed) === self.state.presetLastUsed
			},
		},
		presetSaving: {
			type: 'boolean',
			name: 'Preset Saving Active',
			description: 'Highlights when a preset is being saved',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: 0x006400, // Dark Green
			},
			options: [],
			callback: function () {
				return self.state.presetSaving
			},
		},
	}

	return filterByModel(feedbacks, self.config.model)
}
