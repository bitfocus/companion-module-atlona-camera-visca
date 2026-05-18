/**
 * @file Provides preset definitions (buttons) for Exposure, Iris, Shutter, and Gain controls.
 */

import { COLORS } from '../colors.js'
import { image_rotary_bg } from '../images.js'

export const exposurePresets = {
	'exposure-auto': {
		type: 'simple',
		category: 'Exposure',
		name: 'Exposure Mode: Full Auto',
		style: {
			text: 'Exp\\nAuto',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{ actionId: 'expM', options: { val: '0' } },
					{ actionId: 'expCompMode', options: { val: '02' } },
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'exposureMode',
				options: { mode: 'Auto' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'exposure-sae': {
		type: 'simple',
		category: 'Exposure',
		name: 'Exposure Mode: SAE (Shutter Priority)',
		style: {
			text: 'Exp\nSAE',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'expM', options: { val: '10' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'exposureMode',
				options: { mode: 'SAE' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'exposure-aae': {
		type: 'simple',
		category: 'Exposure',
		name: 'Exposure Mode: AAE (Iris Priority)',
		style: {
			text: 'Exp\nAAE',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'expM', options: { val: '11' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'exposureMode',
				options: { mode: 'AAE' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},

	'exposure-manual': {
		type: 'simple',
		category: 'Exposure',
		name: 'Exposure Mode: Manual',
		style: {
			text: 'Exp\\nManual',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{ actionId: 'expM', options: { val: '3' } },
					{ actionId: 'expCompMode', options: { val: '03' } },
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'exposureMode',
				options: { mode: 'Manual' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'exposure-bright': {
		type: 'simple',
		category: 'Exposure',
		name: 'Exposure Mode: Bright',
		style: {
			text: 'Exp\\nBright',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{ actionId: 'expM', options: { val: '13' } },
					{ actionId: 'expCompMode', options: { val: '03' } },
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'exposureMode',
				options: { mode: 'Bright' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'exposure-toggle': {
		type: 'simple',
		category: 'Exposure',
		name: 'Exposure Mode: Toggle',
		style: {
			text: 'Exp\\nToggle',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{ actionId: 'expM', options: { val: 'toggle' } },
					{ actionId: 'expCompMode', options: { val: 'toggle' } },
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'exposureMode',
				options: { mode: 'Manual' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'exposure-backlight-on': {
		type: 'simple',
		category: 'Exposure',
		name: 'Backlight Compensation: On',
		style: {
			text: 'Backlight\\nOn',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'backlightSet', options: { val: '02' } }] }],
		feedbacks: [
			{
				feedbackId: 'backlight',
				options: { status: 'On' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'exposure-backlight-off': {
		type: 'simple',
		category: 'Exposure',
		name: 'Backlight Compensation: Off',
		style: {
			text: 'Backlight\\nOff',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'backlightSet', options: { val: '03' } }] }],
		feedbacks: [
			{
				feedbackId: 'backlight',
				options: { status: 'Off' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'exposure-backlight-toggle': {
		type: 'simple',
		category: 'Exposure',
		name: 'Backlight Compensation: Toggle',
		style: {
			text: 'Backlight\\nToggle',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'backlightSet', options: { val: 'toggle' } }] }],
		feedbacks: [
			{
				feedbackId: 'backlight',
				options: { status: 'On' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'exposure-shutter-abs': {
		type: 'simple',
		category: 'Exposure',
		name: 'Shutter to 1/100 (Press)',
		style: {
			text: 'Shutter\\n1/100',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'shutterSetAbs', options: { val: '0005' } }],
			},
		],
		feedbacks: [],
	},
	'exposure-comp-reset': {
		type: 'simple',
		category: 'Exposure',
		name: 'Exposure Compensation: Reset',
		style: {
			text: 'ExpComp\\nReset',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'expCompReset', options: {} }] }],
		feedbacks: [],
	},
	'exposure-comp-toggle': {
		type: 'simple',
		category: 'Exposure',
		name: 'Exposure Compensation: Toggle',
		style: {
			text: 'ExpComp\\nTOGGLE',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'expCompMode', options: { val: 'toggle' } }] }],
		feedbacks: [
			{
				feedbackId: 'expComp',
				options: { status: 'On' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'exposure-comp-up': {
		type: 'simple',
		category: 'Exposure',
		name: 'Exposure Compensation: Up',
		style: {
			text: 'ExpComp\\nUp',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'expCompUp', options: {} }] }],
		feedbacks: [],
	},
	'exposure-comp-down': {
		type: 'simple',
		category: 'Exposure',
		name: 'Exposure Compensation: Down',
		style: {
			text: 'ExpComp\\nDown',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'expCompDown', options: {} }] }],
		feedbacks: [],
	},
	'exposure-comp-set': {
		type: 'simple',
		category: 'Exposure',
		name: 'Exposure Compensation: Set Level',
		style: {
			text: 'ExpComp\\nSet',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'expCompSet', options: { val: '09' } }] }],
		feedbacks: [],
	},
	'exposure-comp-rotary-label': {
		type: 'simple',
		category: 'Exposure: Rotary Labels',
		name: 'ExpComp (Label Only)',
		style: {
			text: 'ExpComp\\n$(atlona:expCompLevel)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	},
	'smart-exp-rotary': {
		type: 'simple',
		category: 'Exposure: Rotary',
		name: 'Smart Exposure (Rotary)',
		style: {
			text: 'Smart\\n$(atlona:smartExpLabel)\\n$(atlona:smartExpValue)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				rotate_left: [{ actionId: 'smartExpRotary', options: { val: 'down' } }],
				rotate_right: [{ actionId: 'smartExpRotary', options: { val: 'up' } }],
			},
		],
		feedbacks: [],
	},

	'smart-exp-rotary-label': {
		type: 'simple',
		category: 'Exposure: Rotary Labels',
		name: 'Smart Exposure (Label Only)',
		style: {
			text: 'Smart\\n$(atlona:smartExpLabel)\\n$(atlona:smartExpValue)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	},
	'exposure-comp-rotary': {
		type: 'simple',
		category: 'Exposure: Rotary',
		name: 'ExpComp (0 on Press)',
		style: {
			text: 'ExpComp\\n0',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				700: {
					options: { runWhileHeld: true },
					actions: [{ actionId: 'expCompReset', options: {} }],
				},
				rotate_left: [{ actionId: 'expCompDown', options: {} }],
				rotate_right: [{ actionId: 'expCompUp', options: {} }],
			},
		],
		feedbacks: [],
	},
	'exposure-iris-set': {
		type: 'simple',
		category: 'Exposure',
		name: 'Iris: 2.8',
		style: {
			text: 'Iris\\n$(atlona:irisPosition)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'irisSet', options: { val: '09' } }] }],
		feedbacks: [
			{
				feedbackId: 'irisPosition',
				options: { val: '09' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_BLUE },
			},
		],
	},
	'shutter-rotary-label': {
		type: 'simple',
		category: 'Exposure: Rotary Labels',
		name: 'Shutter Speed (Label Only)',
		style: {
			text: 'Shutter\\n$(atlona:shutterSpeed)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	},
	'shutter-rotary-label-120': {
		type: 'simple',
		category: 'Exposure: Rotary Labels',
		name: 'Shutter Speed (Label Only)',
		style: {
			text: 'Shutter\\n$(atlona:shutterSpeed)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	},
	'iris-rotary-label': {
		type: 'simple',
		category: 'Exposure: Rotary Labels',
		name: 'Iris (Label Only)',
		style: {
			text: 'Iris\\n$(atlona:irisPosition)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	},
	'bright-rotary-label': {
		type: 'simple',
		category: 'Exposure: Rotary Labels',
		name: 'Brightness (Label Only)',
		style: {
			text: 'Bright\\n$(atlona:brightPosition)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	},
	'gain-rotary-label': {
		type: 'simple',
		category: 'Exposure: Rotary Labels',
		name: 'Gain (Label Only)',
		style: {
			text: 'Gain\\n$(atlona:gainLevel)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	},
	'shutter-rotary': {
		type: 'simple',
		category: 'Exposure: Rotary',
		name: 'Shutter Speed (1/100 on Press)',
		style: {
			text: 'Shutter\\n$(atlona:shutterSpeed)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				700: {
					options: { runWhileHeld: true },
					actions: [{ actionId: 'shutterSetAbs', options: { val: '0005' } }],
				},
				rotate_left: [{ actionId: 'shutterSet', options: { val: 'down' } }],
				rotate_right: [{ actionId: 'shutterSet', options: { val: 'up' } }],
			},
		],
		feedbacks: [],
	},
	'iris-rotary': {
		type: 'simple',
		category: 'Exposure: Rotary',
		name: 'Iris (4.0 on Press)',
		style: {
			text: 'Iris\\n$(atlona:irisPosition)',
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
					actions: [{ actionId: 'irisSet', options: { val: '07' } }],
				},
				rotate_left: [{ actionId: 'irisSet', options: { val: 'down' } }],
				rotate_right: [{ actionId: 'irisSet', options: { val: 'up' } }],
			},
		],
		feedbacks: [],
	},
	'shutter-rotary-120': {
		type: 'simple',
		category: 'Exposure: Rotary',
		name: 'Shutter Speed (1/120 on Press)',
		style: {
			text: 'Shutter\\n$(atlona:shutterSpeed)',
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
					actions: [{ actionId: 'shutterSetAbs', options: { val: '0006' } }],
				},
				rotate_left: [{ actionId: 'shutterSet', options: { val: 'down' } }],
				rotate_right: [{ actionId: 'shutterSet', options: { val: 'up' } }],
			},
		],
		feedbacks: [],
	},
	'bright-rotary': {
		type: 'simple',
		category: 'Exposure: Rotary',
		name: 'Brightness (10 on Press)',
		style: {
			text: 'Bright\\n$(atlona:brightPosition)',
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
					actions: [{ actionId: 'brightSet', options: { val: '0A' } }],
				},
				rotate_left: [{ actionId: 'brightSet', options: { val: 'down' } }],
				rotate_right: [{ actionId: 'brightSet', options: { val: 'up' } }],
			},
		],
		feedbacks: [],
	},
	'gain-rotary': {
		type: 'simple',
		category: 'Exposure: Rotary',
		name: 'Gain (Level 4 on Press)',
		style: {
			text: 'Gain\\n$(atlona:gainLevel)',
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
					actions: [{ actionId: 'gainSet', options: { val: '04' } }],
				},
				rotate_left: [{ actionId: 'gainSet', options: { val: 'down' } }],
				rotate_right: [{ actionId: 'gainSet', options: { val: 'up' } }],
			},
		],
		feedbacks: [],
	},
}
