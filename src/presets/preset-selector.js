/**
 * @file Provides preset definitions (buttons) for the dynamic Preset Selector (Increment/Decrement/Recall).
 */

import { image_rotary_bg } from '../images.js'
import { COLORS } from '../colors.js'

export const presetSelectorPresets = {
	'preset-rotary-label': {
		type: 'simple',
		category: 'Presets: Rotary Labels',
		name: 'Preset Selector (Label Only)',
		style: {
			text: 'Preset\\n$(atlona:presetSelector)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	},
	'context-define-button': {
		type: 'simple',
		category: 'Rotary Controls',
		name: 'Definition Button (Smart Rotary)',
		style: {
			text: 'Setup\nSlot 1',
			size: '14',
			color: 0xffffff,
			bgcolor: 0x36454f,
			tooltip: 'Triggers the logic definition once (e.g. at startup)',
		},
		steps: [
			{
				down: [
					{
						actionId: 'configureContext',
						options: {
							slot: '1',
							condition: "$(atlona:focusMode) == 'Manual'",
							t_label: 'Focus',
							t_var: 'focusPosition',
							t_act: 'focusSet',
							f_label: 'Zoom',
							f_var: 'zoomPosition',
							f_act: 'zoomRotate',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	},
	'context1-label': {
		type: 'simple',
		category: 'Rotary Controls: Labels',
		name: 'User Context 1 (Label Only)',
		style: {
			tooltip: 'Default: Focus (Manual) / Zoom (Auto)',
			text: '$(atlona:context1_label)\n$(atlona:context1_value)',
			size: '12',
			png64: image_rotary_bg,
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'contextStatus',
				options: { slot: '1', status: 'true' },
				style: { bgcolor: 0x000000, color: 0xffffff },
			},
		],
	},
	'context2-label': {
		type: 'simple',
		category: 'Rotary Controls: Labels',
		name: 'User Context 2 (Label Only)',
		style: {
			tooltip: 'Default: Gain (Manual) / Iris (Auto)',
			text: '$(atlona:context2_label)\n$(atlona:context2_value)',
			size: '12',
			png64: image_rotary_bg,
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'contextStatus',
				options: { slot: '2', status: 'true' },
				style: { bgcolor: COLORS.BLACK, color: 0xffffff },
			},
		],
	},
	'context3-label': {
		type: 'simple',
		category: 'Rotary Controls: Labels',
		name: 'User Context 3 (Label Only)',
		style: {
			tooltip: 'Default: AI (On) / Pan (Off)',
			text: '$(atlona:context3_label)\n$(atlona:context3_value)',
			size: '12',
			png64: image_rotary_bg,
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'contextStatus',
				options: { slot: '3', status: 'true' },
				style: { bgcolor: 8388736, color: 0xffffff },
			},
		],
	},
	'context4-label': {
		type: 'simple',
		category: 'Rotary Controls: Labels',
		name: 'User Context 4 (Label Only)',
		style: {
			tooltip: 'Default: Preset (On) / Zoom (Off)',
			text: '$(atlona:context4_label)\n$(atlona:context4_value)',
			size: '12',
			png64: image_rotary_bg,
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'contextStatus',
				options: { slot: '4', status: 'true' },
				style: { bgcolor: 32896, color: 0xffffff },
			},
		],
	},
	'context5-label': {
		type: 'simple',
		category: 'Rotary Controls: Labels',
		name: 'User Context 5 (Label Only)',
		style: {
			tooltip: 'Slot 5: Custom Definition',
			text: '$(atlona:context5_label)\n$(atlona:context5_value)',
			size: '12',
			png64: image_rotary_bg,
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'contextStatus',
				options: { slot: '5', status: 'true' },
				style: { bgcolor: 9127187, color: 0xffffff },
			},
		],
	},
	'context6-label': {
		type: 'simple',
		category: 'Rotary Controls: Labels',
		name: 'User Context 6 (Label Only)',
		style: {
			tooltip: 'Slot 6: Custom Definition',
			text: '$(atlona:context6_label)\n$(atlona:context6_value)',
			size: '12',
			png64: image_rotary_bg,
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'contextStatus',
				options: { slot: '6', status: 'true' },
				style: { bgcolor: 3100495, color: 0xffffff },
			},
		],
	},
	'context7-label': {
		type: 'simple',
		category: 'Rotary Controls: Labels',
		name: 'User Context 7 (Label Only)',
		style: {
			tooltip: 'Slot 7: Custom Definition',
			text: '$(atlona:context7_label)\n$(atlona:context7_value)',
			size: '12',
			png64: image_rotary_bg,
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'contextStatus',
				options: { slot: '7', status: 'true' },
				style: { bgcolor: 4915330, color: 0xffffff },
			},
		],
	},
	'context8-label': {
		type: 'simple',
		category: 'Rotary Controls: Labels',
		name: 'User Context 8 (Label Only)',
		style: {
			tooltip: 'Slot 8: Custom Definition',
			text: '$(atlona:context8_label)\n$(atlona:context8_value)',
			size: '12',
			png64: image_rotary_bg,
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'contextStatus',
				options: { slot: '8', status: 'true' },
				style: { bgcolor: 0, color: 0xffffff },
			},
		],
	},
	'context1-rotary': {
		type: 'simple',
		category: 'Rotary Controls: Rotary',
		name: 'User Context 1 (Rotary)',
		style: {
			tooltip: 'Default: Focus (Manual) / Zoom (Auto)',
			text: '$(atlona:context1_label)\n$(atlona:context1_value)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'contextRotary', options: { slot: '1', dir: 'press' } }],
				up: [{ actionId: 'contextRotary', options: { slot: '1', dir: 'release' } }],
				rotate_left: [{ actionId: 'contextRotary', options: { slot: '1', dir: 'down' } }],
				rotate_right: [{ actionId: 'contextRotary', options: { slot: '1', dir: 'up' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'contextStatus',
				options: { slot: '1', status: 'true' },
				style: { bgcolor: COLORS.BLACK, color: COLORS.WHITE },
			},
		],
	},
	'context2-rotary': {
		type: 'simple',
		category: 'Rotary Controls: Rotary',
		name: 'User Context 2 (Rotary)',
		style: {
			tooltip: 'Default: Gain (Manual) / Iris (Auto)',
			text: '$(atlona:context2_label)\n$(atlona:context2_value)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'contextRotary', options: { slot: '2', dir: 'press' } }],
				up: [{ actionId: 'contextRotary', options: { slot: '2', dir: 'release' } }],
				rotate_left: [{ actionId: 'contextRotary', options: { slot: '2', dir: 'down' } }],
				rotate_right: [{ actionId: 'contextRotary', options: { slot: '2', dir: 'up' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'contextStatus',
				options: { slot: '2', status: 'true' },
				style: { bgcolor: COLORS.BLACK, color: COLORS.WHITE },
			},
		],
	},
	'context3-rotary': {
		type: 'simple',
		category: 'Rotary Controls: Rotary',
		name: 'User Context 3 (Rotary)',
		style: {
			tooltip: 'Default: AI (On) / Pan (Off)',
			text: '$(atlona:context3_label)\n$(atlona:context3_value)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'contextRotary', options: { slot: '3', dir: 'press' } }],
				up: [{ actionId: 'contextRotary', options: { slot: '3', dir: 'release' } }],
				rotate_left: [{ actionId: 'contextRotary', options: { slot: '3', dir: 'down' } }],
				rotate_right: [{ actionId: 'contextRotary', options: { slot: '3', dir: 'up' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'contextStatus',
				options: { slot: '3', status: 'true' },
				style: { bgcolor: 0x800080, color: COLORS.WHITE },
			},
		],
	},
	'context4-rotary': {
		type: 'simple',
		category: 'Rotary Controls: Rotary',
		name: 'User Context 4 (Rotary)',
		style: {
			tooltip: 'Default: Preset (On) / Zoom (Off)',
			text: '$(atlona:context4_label)\n$(atlona:context4_value)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'contextRotary', options: { slot: '4', dir: 'press' } }],
				up: [{ actionId: 'contextRotary', options: { slot: '4', dir: 'release' } }],
				rotate_left: [{ actionId: 'contextRotary', options: { slot: '4', dir: 'down' } }],
				rotate_right: [{ actionId: 'contextRotary', options: { slot: '4', dir: 'up' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'contextStatus',
				options: { slot: '4', status: 'true' },
				style: { bgcolor: 0x008080, color: COLORS.WHITE },
			},
		],
	},
	'context5-rotary': {
		type: 'simple',
		category: 'Rotary Controls: Rotary',
		name: 'User Context 5 (Rotary)',
		style: {
			tooltip: 'Slot 5: Custom Definition',
			text: '$(atlona:context5_label)\n$(atlona:context5_value)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'contextRotary', options: { slot: '5', dir: 'press' } }],
				up: [{ actionId: 'contextRotary', options: { slot: '5', dir: 'release' } }],
				rotate_left: [{ actionId: 'contextRotary', options: { slot: '5', dir: 'down' } }],
				rotate_right: [{ actionId: 'contextRotary', options: { slot: '5', dir: 'up' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'contextStatus',
				options: { slot: '5', status: 'true' },
				style: { bgcolor: 0x8b4513, color: COLORS.WHITE },
			},
		],
	},
	'context6-rotary': {
		type: 'simple',
		category: 'Rotary Controls: Rotary',
		name: 'User Context 6 (Rotary)',
		style: {
			tooltip: 'Slot 6: Custom Definition',
			text: '$(atlona:context6_label)\n$(atlona:context6_value)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'contextRotary', options: { slot: '6', dir: 'press' } }],
				up: [{ actionId: 'contextRotary', options: { slot: '6', dir: 'release' } }],
				rotate_left: [{ actionId: 'contextRotary', options: { slot: '6', dir: 'down' } }],
				rotate_right: [{ actionId: 'contextRotary', options: { slot: '6', dir: 'up' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'contextStatus',
				options: { slot: '6', status: 'true' },
				style: { bgcolor: 0x2f4f4f, color: COLORS.WHITE },
			},
		],
	},
	'context7-rotary': {
		type: 'simple',
		category: 'Rotary Controls: Rotary',
		name: 'User Context 7 (Rotary)',
		style: {
			tooltip: 'Slot 7: Custom Definition',
			text: '$(atlona:context7_label)\n$(atlona:context7_value)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'contextRotary', options: { slot: '7', dir: 'press' } }],
				up: [{ actionId: 'contextRotary', options: { slot: '7', dir: 'release' } }],
				rotate_left: [{ actionId: 'contextRotary', options: { slot: '7', dir: 'down' } }],
				rotate_right: [{ actionId: 'contextRotary', options: { slot: '7', dir: 'up' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'contextStatus',
				options: { slot: '7', status: 'true' },
				style: { bgcolor: 0x4b0082, color: COLORS.WHITE },
			},
		],
	},
	'context8-rotary': {
		type: 'simple',
		category: 'Rotary Controls: Rotary',
		name: 'User Context 8 (Rotary)',
		style: {
			tooltip: 'Slot 8: Custom Definition',
			text: '$(atlona:context8_label)\n$(atlona:context8_value)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'contextRotary', options: { slot: '8', dir: 'press' } }],
				up: [{ actionId: 'contextRotary', options: { slot: '8', dir: 'release' } }],
				rotate_left: [{ actionId: 'contextRotary', options: { slot: '8', dir: 'down' } }],
				rotate_right: [{ actionId: 'contextRotary', options: { slot: '8', dir: 'up' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'contextStatus',
				options: { slot: '8', status: 'true' },
				style: { bgcolor: 0x000000, color: COLORS.WHITE },
			},
		],
	},
	'preset-rotary': {
		type: 'simple',
		category: 'Presets: Rotary',
		name: 'Preset Selector (Recall on Press, Save on Hold)',
		style: {
			text: 'Preset\\n$(atlona:presetSelector)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				up: [
					{
						actionId: 'preset_recall',
						options: {
							val: 'ps',
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
					actions: [{ actionId: 'preset_save', options: { val: 'ps' } }],
				},
				701: [{ actionId: 'preset_save_clear', options: {} }],
				rotate_left: [{ actionId: 'presetSelectorSet', options: { val: 'dec', num: 1 } }],
				rotate_right: [{ actionId: 'presetSelectorSet', options: { val: 'inc', num: 1 } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'presetSaving',
				options: {},
				style: { bgcolor: 0x006400, color: 0xffffff },
			},
		],
	},
}
