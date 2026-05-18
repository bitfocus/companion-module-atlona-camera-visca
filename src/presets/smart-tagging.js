/**
 * @file Provides preset definitions for Smart Tagging functionality, allowing dynamic visual feedback for presets.
 */

import { COLORS } from '../colors.js'

export function getSmartTaggingPresets(self) {
	const textColor = self?.config?.presetColorText ?? COLORS.WHITE
	const bgColor = self?.config?.presetColorBG ?? COLORS.CHARCOAL
	const selectedBG = self?.config?.presetSelectedBG ?? 0x777788
	const presets = {}

	for (let i = 0; i < 8; i++) {
		presets['smartTagging-Preset' + i] = {
			type: 'simple',
			category: 'Presets',
			name: 'Smart Tagged Camera Preset ' + (i + 1),
			style: {
				text: '$(local:btnText)',
				size: '14',
				color: textColor,
				bgcolor: bgColor,
			},
			steps: [
				{
					down: [
						{
							actionId: 'setup_hint_0',
							options: {},
						},
					],
					up: [
						{
							actionId: 'preset_recall',
							options: {
								val: '$(local:presetNumber)',
								recallPos: true,
								recallExp: true,
								recallWb: true,
								recallImg: true,
								recallDelay: 500,
							},
						},
					],
					700: {
						options: { runWhileHeld: true },
						actions: [
							{
								actionId: 'preset_save',
								options: { val: '$(local:presetNumber)' },
							},
						],
					},
					701: [
						{
							actionId: 'preset_save_clear',
							options: {},
						},
					],
					2200: {
						options: { runWhileHeld: true },
						actions: [
							{
								actionId: 'preset_save_clear',
								options: {},
							},
							{
								actionId: 'setup_hint_1',
								options: {},
							},
							{
								actionId: 'setup_hint_2',
								options: {},
							},
						],
					},
				},
			],
			localVariables: [
				{
					variableName: 'presetNumber',
					variableType: 'simple',
					startupValue: (i + 1).toString(),
				},
				{
					variableName: 'btnText',
					variableType: 'simple',
					startupValue: 'Preset\\n$(local:presetNumber)',
				},
			],
			feedbacks: [
				{
					feedbackId: 'selectedPreset',
					options: { preset: '$(local:presetNumber)' },
					style: { bgcolor: selectedBG },
				},
				{
					feedbackId: 'presetSaving',
					options: {},
					style: { bgcolor: 0x006400, color: COLORS.WHITE },
				},
			],
		}
	}
	return presets
}

export const smartTagsPresets = {
	'smart-tags-presenter': createTagSenderPreset('Presenter'),
	'smart-tags-singer': createTagSenderPreset('Singer'),
	'smart-tags-guitar': createTagSenderPreset('Guitar'),
	'smart-tags-bass': createTagSenderPreset('Bass'),
	'smart-tags-drums': createTagSenderPreset('Drums'),
	'smart-tags-keyboard': createTagSenderPreset('Keyboard'),
	'smart-tags-percussion': createTagSenderPreset('Percussion'),
	'smart-tags-crowd': createTagSenderPreset('Crowd'),
}

function createTagSenderPreset(tag) {
	return {
		type: 'simple',
		category: 'Presets',
		name: 'Smart Tag: ' + tag,
		style: {
			text: '$(local:tag)',
			size: '13',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'setup_hint_3',
						options: {},
					},
				],
				up: [
					{
						actionId: 'preset_recall',
						options: {
							val: '$(local:presetNumber)',
							recallPos: true,
							recallExp: true,
							recallWb: true,
							recallImg: true,
							recallDelay: 500,
						},
					},
				],
			},
		],
		localVariables: [
			{
				variableName: 'tag',
				variableType: 'simple',
				startupValue: tag,
				persist: true,
			},
		],
		feedbacks: [],
	}
}
