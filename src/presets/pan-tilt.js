/**
 * @file Provides preset definitions (buttons) for Pan, Tilt, and Zoom operations.
 */

import { image_rotary_bg } from '../images.js'
import { COLORS } from '../colors.js'

export const panTiltPresets = {
	'panTilt-up': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom',
		name: 'Up',
		style: {
			text: '⬆️',
			size: '50',
			color: COLORS.WHITE,
			bgcolor: COLORS.DARK_BLUE,
		},
		steps: [
			{
				down: [{ actionId: 'up', options: {} }],
				up: [{ actionId: 'stop', options: {} }],
			},
		],
		feedbacks: [],
	},
	'panTilt-down': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom',
		name: 'Down',
		style: {
			text: '⬇️',
			size: '50',
			color: COLORS.WHITE,
			bgcolor: COLORS.DARK_BLUE,
		},
		steps: [
			{
				down: [{ actionId: 'down', options: {} }],
				up: [{ actionId: 'stop', options: {} }],
			},
		],
		feedbacks: [],
	},
	'panTilt-left': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom',
		name: 'Left',
		style: {
			text: '⬅️',
			size: '50',
			color: COLORS.WHITE,
			bgcolor: COLORS.DARK_BLUE,
		},
		steps: [
			{
				down: [{ actionId: 'left', options: {} }],
				up: [{ actionId: 'stop', options: {} }],
			},
		],
		feedbacks: [],
	},
	'panTilt-right': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom',
		name: 'Right',
		style: {
			text: '➡️',
			size: '50',
			color: COLORS.WHITE,
			bgcolor: COLORS.DARK_BLUE,
		},
		steps: [
			{
				down: [{ actionId: 'right', options: {} }],
				up: [{ actionId: 'stop', options: {} }],
			},
		],
		feedbacks: [],
	},
	'panTilt-home': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom',
		name: 'Home',
		style: {
			text: 'HOME',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'home', options: {} }] }],
		feedbacks: [],
	},
	'panTilt-upLeft': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom',
		name: 'Up Left',
		style: {
			text: '↖️',
			size: '50',
			color: COLORS.WHITE,
			bgcolor: COLORS.DARK_BLUE,
		},
		steps: [
			{
				down: [{ actionId: 'upLeft', options: {} }],
				up: [{ actionId: 'stop', options: {} }],
			},
		],
		feedbacks: [],
	},
	'panTilt-upRight': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom',
		name: 'Up Right',
		style: {
			text: '↗️',
			size: '50',
			color: COLORS.WHITE,
			bgcolor: COLORS.DARK_BLUE,
		},
		steps: [
			{
				down: [{ actionId: 'upRight', options: {} }],
				up: [{ actionId: 'stop', options: {} }],
			},
		],
		feedbacks: [],
	},
	'panTilt-downLeft': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom',
		name: 'Down Left',
		style: {
			text: '↙️',
			size: '50',
			color: COLORS.WHITE,
			bgcolor: COLORS.DARK_BLUE,
		},
		steps: [
			{
				down: [{ actionId: 'downLeft', options: {} }],
				up: [{ actionId: 'stop', options: {} }],
			},
		],
		feedbacks: [],
	},
	'panTilt-downRight': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom',
		name: 'Down Right',
		style: {
			text: '↘️',
			size: '50',
			color: COLORS.WHITE,
			bgcolor: COLORS.DARK_BLUE,
		},
		steps: [
			{
				down: [{ actionId: 'downRight', options: {} }],
				up: [{ actionId: 'stop', options: {} }],
			},
		],
		feedbacks: [],
	},
	'panTilt-pos-zero': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom',
		name: 'Pos x/y',
		style: {
			text: 'Pos\\nx/y',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'ptPosition', options: { pan: 0, tilt: 0, panSpeed: 'auto', tiltSpeed: 'auto' } }] }],
		feedbacks: [],
	},
	'pan-rotary-label': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom: Rotary Labels',
		name: 'Pan (Label Only)',
		style: {
			text: 'Pan\\n\\n$(atlona:panPosition)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	},
	'pan-rotary': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom: Rotary',
		name: 'Pan Rotary (Stop on Press)',
		style: {
			text: 'Pan\\n\\n$(atlona:panPosition)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'panTiltStop', options: {} }],
				rotate_left: [{ actionId: 'panRotate', options: { dir: 'left' } }],
				rotate_right: [{ actionId: 'panRotate', options: { dir: 'right' } }],
			},
		],
		feedbacks: [],
	},
	'tilt-rotary-label': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom: Rotary Labels',
		name: 'Tilt (Label Only)',
		style: {
			text: 'Tilt\\n\\n$(atlona:tiltPosition)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	},
	'tilt-rotary': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom: Rotary',
		name: 'Tilt Rotary (Stop on Press)',
		style: {
			text: 'Tilt\\n\\n$(atlona:tiltPosition)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},

		steps: [
			{
				down: [{ actionId: 'panTiltStop', options: {} }],
				rotate_left: [{ actionId: 'tiltRotate', options: { dir: 'up' } }],
				rotate_right: [{ actionId: 'tiltRotate', options: { dir: 'down' } }],
			},
		],
		feedbacks: [],
	},
	'zoom-rotary-label': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom: Rotary Labels',
		name: 'Zoom (Label Only)',
		style: {
			text: 'Zoom\\n\\n$(atlona:zoomPosition)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	},
	'zoom-rotary': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom: Rotary',
		name: 'Zoom Rotary (Stop on Press)',
		style: {
			text: 'Zoom\\n\\n$(atlona:zoomPosition)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'zoomS', options: {} }],
				rotate_left: [{ actionId: 'zoomRotate', options: { dir: 'out' } }],
				rotate_right: [{ actionId: 'zoomRotate', options: { dir: 'in' } }],
			},
		],
		feedbacks: [],
	},
	'lens-zoomIn': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom',
		name: 'Zoom In',
		style: {
			text: 'ZOOM\\nIN',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'zoomI', options: {} }],
				up: [{ actionId: 'zoomS', options: {} }],
			},
		],
		feedbacks: [],
	},
	'lens-zoomOut': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom',
		name: 'Zoom Out',
		style: {
			text: 'ZOOM\\nOUT',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'zoomO', options: {} }],
				up: [{ actionId: 'zoomS', options: {} }],
			},
		],
		feedbacks: [],
	},
	'lens-zoomDirect': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom',
		name: 'Zoom Factor: 1.0x',
		style: {
			text: 'Zoom\\n1.0x',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'zoomDirect', options: { val: 1, speed: '03' } }],
			},
		],
		feedbacks: [],
	},
	'pan-speed-set': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom',
		name: 'Pan Speed Set',
		style: {
			text: 'Pan Spd\\n$(atlona:panSpeed)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'panSpeedSet', options: { val: '0C' } }] }],
		feedbacks: [],
	},
	'tilt-speed-set': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom',
		name: 'Tilt Speed Set',
		style: {
			text: 'Tilt Spd\\n$(atlona:tiltSpeed)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'tiltSpeedSet', options: { val: '0C' } }] }],
		feedbacks: [],
	},
	'zoom-speed-set': {
		type: 'simple',
		category: 'Pan/Tilt/Zoom',
		name: 'Zoom Speed Set',
		style: {
			text: 'Zoom Spd\\n$(atlona:zoomSpeed)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [{ down: [{ actionId: 'zoomSpeedSet', options: { val: '03' } }] }],
		feedbacks: [],
	},

	'nr2d-rotary-label': {
		type: 'simple',
		category: 'Exposure: Rotary Labels',
		name: 'NR 2D (Label Only)',
		style: {
			text: 'NR 2D\\n$(atlona:nr2d)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	},
	'nr2d-rotary': {
		type: 'simple',
		category: 'Exposure: Rotary',
		name: 'NR 2D (Rotary)',
		style: {
			text: 'NR 2D\\n$(atlona:nr2d)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				rotate_left: [{ actionId: 'nr2dSet', options: { val: 'down' } }],
				rotate_right: [{ actionId: 'nr2dSet', options: { val: 'up' } }],
			},
		],
		feedbacks: [],
	},
	'nr3d-rotary-label': {
		type: 'simple',
		category: 'Exposure: Rotary Labels',
		name: 'NR 3D (Label Only)',
		style: {
			text: 'NR 3D\\n$(atlona:nr3d)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	},
	'nr3d-rotary': {
		type: 'simple',
		category: 'Exposure: Rotary',
		name: 'NR 3D (Rotary)',
		style: {
			text: 'NR 3D\\n$(atlona:nr3d)',
			size: '12',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				rotate_left: [{ actionId: 'nr3dSet', options: { val: 'down' } }],
				rotate_right: [{ actionId: 'nr3dSet', options: { val: 'up' } }],
			},
		],
		feedbacks: [],
	},
}
