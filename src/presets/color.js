/**
 * @file Provides preset definitions (buttons) for White Balance and Color adjustments.
 */

import { image_rotary_bg } from '../images.js'
import { COLORS } from '../colors.js'
import { CAP_ONE_PUSH } from '../model-caps.js'

export const colorPresets = {
	'color-wb-cycle': {
		type: 'simple',
		category: 'Color & Image',
		name: 'White Balance: Cycle All Modes',
		style: {
			text: 'WB\\n$(atlona:wbMode)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'wbCycle', options: { behavior: 'apply', direction: 'next', subset: 'all' } }],
			},
		],
		feedbacks: [],
	},
	'color-wb-toggle': {
		type: 'simple',
		category: 'Color & Image',
		name: 'White Balance Mode (Toggle: Auto/Manual/OnePush)',
		style: {
			text: 'WB\\n$(atlona:wbMode)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'wbCycle', options: { behavior: 'apply', direction: 'next', subset: 'favorites' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'wbMode',
				options: { val: '00' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
			{
				feedbackId: 'wbMode',
				options: { val: '05' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
			{
				feedbackId: 'wbMode',
				options: { val: '03' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'color-wbAuto': {
		type: 'simple',
		category: 'Color & Image',
		name: 'White Balance: Auto',
		style: {
			text: 'WB\\nAuto',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'wbMode', options: { val: '00' } }] }],
		feedbacks: [],
	},
	'color-wbOnePush': {
		models: CAP_ONE_PUSH,
		type: 'simple',
		category: 'Color & Image',
		name: 'White Balance: One Push',
		style: {
			text: 'WB\\n1 Push',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'wbMode', options: { val: '03' } }] }],
		feedbacks: [],
	},
	'color-wbTrigger': {
		models: CAP_ONE_PUSH,
		type: 'simple',
		category: 'Color & Image',
		name: 'White Balance Trigger',
		style: {
			text: 'WB\\nTrigger',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.DARK_RED,
		},
		steps: [{ down: [{ actionId: 'wbOnePush', options: {} }] }],
		feedbacks: [],
	},
	'color-wbManu': {
		type: 'simple',
		category: 'Color & Image',
		name: 'White Balance: Manual',
		style: {
			text: 'WB\\nManual',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'wbMode', options: { val: '05' } }] }],
		feedbacks: [],
	},
	'color-rgain-set': {
		type: 'simple',
		category: 'Color & Image',
		name: 'R.Gain Set',
		style: {
			text: 'R.Gain\\nSet',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'rGainSet', options: { val: '150' } }] }],
		feedbacks: [],
	},
	'color-bgain-set': {
		type: 'simple',
		category: 'Color & Image',
		name: 'B.Gain Set',
		style: {
			text: 'B.Gain\\nSet',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'bGainSet', options: { val: '150' } }] }],
		feedbacks: [],
	},
	'color-wb-rotary-label': {
		type: 'simple',
		category: 'Color & Image: Rotary Labels',
		name: 'White Balance (Label Only)',
		style: {
			text: 'WB\\n$(atlona:wbModePreview)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [{ down: [] }],
		feedbacks: [
			{
				feedbackId: 'wbPreviewMatchesActive',
				options: {},
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_GREEN },
			},
		],
	},
	'color-wb-rotary': {
		type: 'simple',
		category: 'Color & Image: Rotary',
		name: 'White Balance (Preview & Confirm)',
		style: {
			text: 'WB\\nConfirm',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				rotate_left: [{ actionId: 'wbCycle', options: { behavior: 'preview', direction: 'prev', subset: 'all' } }],
				rotate_right: [{ actionId: 'wbCycle', options: { behavior: 'preview', direction: 'next', subset: 'all' } }],
				down: [{ actionId: 'wbCycle', options: { behavior: 'confirm', direction: 'none', subset: 'all' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'wbPreviewMatchesActive',
				options: {},
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_GREEN },
			},
		],
	},
	'rgain-rotary-label': {
		type: 'simple',
		category: 'Color & Image: Rotary Labels',
		name: 'R.Gain (Label Only)',
		style: {
			text: '',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'wbMode',
				options: { val: '05' },
				style: {
					text: 'R.Gain\n$(atlona:rGain)',
				},
			},
		],
	},
	'bgain-rotary-label': {
		type: 'simple',
		category: 'Color & Image: Rotary Labels',
		name: 'B.Gain (Label Only)',
		style: {
			text: '',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'wbMode',
				options: { val: '05' },
				style: {
					text: 'B.Gain\n$(atlona:bGain)',
				},
			},
		],
	},
	'rgain-rotary': {
		type: 'simple',
		category: 'Color & Image: Rotary',
		name: 'R.Gain (Reset on Press)',
		style: {
			text: '',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				1000: {
					options: { runWhileHeld: true },
					actions: [{ actionId: 'rGainDirect', options: { val: 150 } }],
				},
				rotate_left: [{ actionId: 'rGainSet', options: { val: 'down', step: 1 } }],
				rotate_right: [{ actionId: 'rGainSet', options: { val: 'up', step: 1 } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'wbMode',
				options: { val: '05' },
				style: {
					text: 'R.Gain\nReset',
				},
			},
		],
	},
	'bgain-rotary': {
		type: 'simple',
		category: 'Color & Image: Rotary',
		name: 'B.Gain (Reset on Press)',
		style: {
			text: '',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				1000: {
					options: { runWhileHeld: true },
					actions: [{ actionId: 'bGainDirect', options: { val: 150 } }],
				},
				rotate_left: [{ actionId: 'bGainSet', options: { val: 'down', step: 1 } }],
				rotate_right: [{ actionId: 'bGainSet', options: { val: 'up', step: 1 } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'wbMode',
				options: { val: '05' },
				style: {
					text: 'B.Gain\nReset',
				},
			},
		],
	},
}
