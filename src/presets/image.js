/**
 * @file Provides preset definitions (buttons) for Image parameter adjustments like Contrast, Sharpness, and Saturation.
 */

import { image_rotary_bg } from '../images.js'
import { COLORS } from '../colors.js'

export const imagePresets = {
	'image-contrast-rotary-label': {
		type: 'simple',
		category: 'Color & Image: Rotary Labels',
		name: 'Contrast (Label Only)',
		style: {
			text: 'Contrast\\n$(atlona:contrast)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'contrastValue',
				options: { val: '7' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_GREEN },
			},
		],
	},
	'image-contrast-set': {
		type: 'simple',
		category: 'Color & Image',
		name: 'Contrast Set',
		style: {
			text: 'Contrast\\nSet',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'imageContrastSet', options: { val: '7' } }] }],
		feedbacks: [],
	},
	'image-contrast-rotary': {
		type: 'simple',
		category: 'Color & Image: Rotary',
		name: 'Contrast (Rotary)',
		style: {
			text: 'Contrast\\n$(atlona:contrast)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				rotate_left: [{ actionId: 'imageContrastSet', options: { val: 'down', step: 1 } }],
				rotate_right: [{ actionId: 'imageContrastSet', options: { val: 'up', step: 1 } }],
				down: [{ actionId: 'imageContrastSet', options: { val: '7' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'contrastValue',
				options: { val: '7' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_GREEN },
			},
		],
	},
	'image-sharpness-rotary-label': {
		type: 'simple',
		category: 'Color & Image: Rotary Labels',
		name: 'Sharpness (Label Only)',
		style: {
			text: 'Sharp\\n$(atlona:sharpness)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'sharpnessValue',
				options: { val: '8' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_GREEN },
			},
		],
	},
	'image-sharpness-set': {
		type: 'simple',
		category: 'Color & Image',
		name: 'Sharpness Set',
		style: {
			text: 'Sharp\\nSet',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'imageSharpnessSet', options: { val: '7' } }] }],
		feedbacks: [],
	},
	'image-sharpness-rotary': {
		type: 'simple',
		category: 'Color & Image: Rotary',
		name: 'Sharpness (Rotary)',
		style: {
			text: 'Sharp\\n$(atlona:sharpness)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				rotate_left: [{ actionId: 'imageSharpnessSet', options: { val: 'down', step: 1 } }],
				rotate_right: [{ actionId: 'imageSharpnessSet', options: { val: 'up', step: 1 } }],
				down: [{ actionId: 'imageSharpnessSet', options: { val: '8' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'sharpnessValue',
				options: { val: '8' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_GREEN },
			},
		],
	},
	'image-saturation-rotary-label': {
		type: 'simple',
		category: 'Color & Image: Rotary Labels',
		name: 'Saturation (Label Only)',
		style: {
			text: 'Sat\\n$(atlona:saturation)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'saturationValue',
				options: { val: '4' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_GREEN },
			},
		],
	},
	'image-saturation-set': {
		type: 'simple',
		category: 'Color & Image',
		name: 'Saturation Set',
		style: {
			text: 'Sat\\nSet',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'imageSaturationSet', options: { val: '4' } }] }],
		feedbacks: [],
	},
	'image-saturation-rotary': {
		type: 'simple',
		category: 'Color & Image: Rotary',
		name: 'Saturation (Rotary)',
		style: {
			text: 'Satur\\n$(atlona:saturation)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				rotate_left: [{ actionId: 'imageSaturationSet', options: { val: 'down', step: 1 } }],
				rotate_right: [{ actionId: 'imageSaturationSet', options: { val: 'up', step: 1 } }],
				down: [{ actionId: 'imageSaturationSet', options: { val: '4' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'saturationValue',
				options: { val: '4' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_GREEN },
			},
		],
	},
	'image-luminance-rotary-label': {
		type: 'simple',
		category: 'Color & Image: Rotary Labels',
		name: 'Brightness (Label Only)',
		style: {
			text: 'Bright\\n$(atlona:luminance)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	},
	'image-luminance-set': {
		type: 'simple',
		category: 'Color & Image',
		name: 'Brightness Set',
		style: {
			text: 'Bright\\nSet',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'imageLuminanceSet', options: { val: '7' } }] }],
		feedbacks: [],
	},
	'image-luminance-rotary': {
		type: 'simple',
		category: 'Color & Image: Rotary',
		name: 'Brightness (Rotary)',
		style: {
			text: 'Bright\\n$(atlona:luminance)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				rotate_left: [{ actionId: 'imageLuminanceSet', options: { val: 'down', step: 1 } }],
				rotate_right: [{ actionId: 'imageLuminanceSet', options: { val: 'up', step: 1 } }],
			},
		],
		feedbacks: [],
	},
	'image-hue-rotary-label': {
		type: 'simple',
		category: 'Color & Image: Rotary Labels',
		name: 'Hue (Label Only)',
		style: {
			text: 'Hue\\n$(atlona:hue)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'hueValue',
				options: { val: '7' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_GREEN },
			},
		],
	},
	'image-hue-set': {
		type: 'simple',
		category: 'Color & Image',
		name: 'Hue Set',
		style: {
			text: 'Hue\\nSet',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'imageHueSet', options: { val: '7' } }] }],
		feedbacks: [],
	},
	'image-hue-rotary': {
		type: 'simple',
		category: 'Color & Image: Rotary',
		name: 'Hue (Rotary)',
		style: {
			text: 'Hue\\n$(atlona:hue)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				rotate_left: [{ actionId: 'imageHueSet', options: { val: 'down', step: 1 } }],
				rotate_right: [{ actionId: 'imageHueSet', options: { val: 'up', step: 1 } }],
				down: [{ actionId: 'imageHueSet', options: { val: '7' } }],
			},
		],
		feedbacks: [
			{
				feedbackId: 'hueValue',
				options: { val: '7' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_GREEN },
			},
		],
	},
	'image-gamma-rotary-label': {
		type: 'simple',
		category: 'Color & Image: Rotary Labels',
		name: 'Gamma (Label Only)',
		style: {
			text: 'Gamma\\n$(atlona:gamma)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	},
	'image-gamma-set': {
		type: 'simple',
		category: 'Color & Image',
		name: 'Gamma Set',
		style: {
			text: 'Gamma\\nSet',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'imageGammaSet', options: { val: '0' } }] }],
		feedbacks: [],
	},
	'image-gamma-rotary': {
		type: 'simple',
		category: 'Color & Image: Rotary',
		name: 'Gamma (Rotary)',
		style: {
			text: 'Gamma\\n$(atlona:gamma)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				rotate_left: [{ actionId: 'imageGammaSet', options: { val: 'down', step: 1 } }],
				rotate_right: [{ actionId: 'imageGammaSet', options: { val: 'up', step: 1 } }],
			},
		],
		feedbacks: [],
	},
}
