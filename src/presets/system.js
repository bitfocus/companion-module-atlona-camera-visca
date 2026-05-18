/**
 * @file Provides preset definitions (buttons) for System-level commands like Power and Flip.
 */

import { COLORS } from '../colors.js'

export const systemPresets = {
	'system-power-toggle': {
		type: 'simple',
		category: 'System',
		name: 'System Power Toggle',
		style: {
			text: 'Power\nToggle',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'systemPowerToggle', options: {} }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'powerStatus',
				options: { status: 'On' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_GREEN },
			},
		],
	},
	'system-fliph-toggle': {
		type: 'simple',
		category: 'System',
		name: 'Flip-H Toggle',
		style: {
			text: 'Flip-H\n$(atlona:flipHStatus)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'flipH', options: { val: 'toggle' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'flipHStatus',
				options: { status: 'On' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'system-flipv-toggle': {
		type: 'simple',
		category: 'System',
		name: 'Flip-V Toggle',
		style: {
			text: 'Flip-V\n$(atlona:flipVStatus)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'flipV', options: { val: 'toggle' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'flipVStatus',
				options: { status: 'On' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
}
