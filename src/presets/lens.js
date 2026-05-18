/**
 * @file Provides preset definitions (buttons) for Lens and Focus control.
 */

import { CAP_ONE_PUSH } from '../model-caps.js'
import { COLORS } from '../colors.js'
import { image_rotary_bg } from '../images.js'

export const lensPresets = {
	'lens-focusAuto': {
		type: 'simple',
		category: 'Focus',
		name: 'Focus Mode Toggle',
		style: {
			text: 'Focus\\n$(atlona:focusMode)',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'focusM', options: { mode: 'toggle' } }] }],
		feedbacks: [
			{
				feedbackId: 'focusMode',
				options: { mode: 'Manual' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'lens-opaf': {
		models: CAP_ONE_PUSH,
		type: 'simple',
		category: 'Focus',
		name: 'One Push Auto Focus',
		style: {
			text: 'O.P.\\nAF',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'focusOpaf', options: {} }] }],
		feedbacks: [],
	},
	'lens-focusDirect': {
		type: 'simple',
		category: 'Focus',
		name: 'Focus Position: 0',
		style: {
			text: 'Focus\\n0',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'focusDirect', options: { val: 0 } }] }],
		feedbacks: [],
	},
	'lens-focusRegion': {
		type: 'simple',
		category: 'Focus',
		name: 'Focus Region Cycle',
		style: {
			text: 'AF Zone\\n$(atlona:focusRegion)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'focusRegion',
						options: { val: 'next' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'lens-focusSensitivity': {
		type: 'simple',
		category: 'Focus',
		name: 'AF Sensitivity Cycle',
		style: {
			text: 'AF Sens.\\n$(atlona:focusSensitivity)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'focusSensitivity',
						options: { val: 'next' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'focus-rotary-label': {
		type: 'simple',
		category: 'Focus: Rotary Labels',
		name: 'Focus (Label Only)',
		style: {
			text: 'Focus\\n\\n$(atlona:focusPosition)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	},
	'focus-rotary': {
		type: 'simple',
		category: 'Focus: Rotary',
		name: 'Focus Direct (Reset on Press)',
		style: {
			text: 'Focus\\n\\n$(atlona:focusPosition)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				rotate_left: [{ actionId: 'focusSet', options: { val: 'down', step: 1 } }],
				rotate_right: [{ actionId: 'focusSet', options: { val: 'up', step: 1 } }],
			},
		],
		feedbacks: [],
	},
	'focus-region-rotary-label': {
		type: 'simple',
		category: 'Focus: Rotary Labels',
		name: 'AF Zone (Label Only)',
		style: {
			text: 'AF Zone\\n\\n$(atlona:focusRegion)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'focusMode',
				options: { mode: 'Manual' },
				style: { text: '' },
			},
		],
	},
	'focus-region-rotary': {
		type: 'simple',
		category: 'Focus: Rotary',
		name: 'AF Zone (Rotary)',
		style: {
			text: 'AF Zone\\n\\n$(atlona:focusRegion)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				rotate_left: [
					{
						actionId: 'focusRegion',
						options: { val: 'prev' },
					},
				],
				rotate_right: [
					{
						actionId: 'focusRegion',
						options: { val: 'next' },
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'focusMode',
				options: { mode: 'Manual' },
				style: { text: '' },
			},
		],
	},
	'focus-sens-rotary-label': {
		type: 'simple',
		category: 'Focus: Rotary Labels',
		name: 'AF Sens (Label Only)',
		style: {
			text: 'AF Sens\\n\\n$(atlona:focusSensitivity)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'focusMode',
				options: { mode: 'Manual' },
				style: { text: '' },
			},
		],
	},
	'focus-sens-rotary': {
		type: 'simple',
		category: 'Focus: Rotary',
		name: 'AF Sens (Rotary)',
		style: {
			text: 'AF Sens\\n\\n$(atlona:focusSensitivity)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				rotate_left: [
					{
						actionId: 'focusSensitivity',
						options: { val: 'prev' },
					},
				],
				rotate_right: [
					{
						actionId: 'focusSensitivity',
						options: { val: 'next' },
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'focusMode',
				options: { mode: 'Manual' },
				style: { text: '' },
			},
		],
	},
}
