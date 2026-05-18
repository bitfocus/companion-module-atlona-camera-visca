/**
 * @file Defines static and dynamic dropdown choices (e.g. speeds, ON/OFF states) for the Companion UI.
 */

export function getChoices(config, _self) {
	const c = { ...CHOICES }
	const frameRate = config?.frameRate || '50'

	// Shutter filtering logic based on Frame Rate
	let recommended = []
	if (frameRate === '60') {
		recommended = [
			'0010',
			'000F',
			'000E',
			'000D',
			'000C',
			'000B',
			'000A',
			'0009',
			'0008',
			'0007',
			'0006',
			'0004',
			'0003',
			'0001',
		]
	} else if (frameRate === '50' || frameRate === '24') {
		recommended = ['0010', '000F', '000E', '000D', '000C', '000B', '000A', '0008', '0005', '0002', '0000']
	}

	const filteredShutter = []
	const otherShutter = []

	for (const s of CHOICES.SHUTTER) {
		if (recommended.includes(s.id)) {
			filteredShutter.push({ ...s, label: `* ${s.label}` })
		} else {
			otherShutter.push(s)
		}
	}

	c.SHUTTER = [...filteredShutter, ...otherShutter]

	return c
}

export const CHOICES = {
	VIDEO_FORMAT: [
		{ id: '00', label: '1080P60' },
		{ id: '01', label: '1080P50' },
		{ id: '02', label: '1080I60' },
		{ id: '03', label: '1080I50' },
		{ id: '04', label: '720P60' },
		{ id: '05', label: '720P50' },
		{ id: '06', label: '1080P30' },
		{ id: '07', label: '1080P25' },
		{ id: '0A', label: '1080P59.94' },
		{ id: '0B', label: '1080I59.94' },
		{ id: '0C', label: '720P59.94' },
		{ id: '0D', label: '1080P29.97' },
	],
	FOCUS_REGION: [
		{ id: '00', label: 'Top' },
		{ id: '01', label: 'Center' },
		{ id: '02', label: 'Bottom' },
		{ id: '03', label: 'All' },
	],
	EXPOSURE_COMPENSATION: [
		{ id: '0E', label: '+7' },
		{ id: '0D', label: '+6' },
		{ id: '0C', label: '+5' },
		{ id: '0B', label: '+4' },
		{ id: '0A', label: '+3' },
		{ id: '09', label: '+2' },
		{ id: '08', label: '+1' },
		{ id: '07', label: '0', default: true },
		{ id: '06', label: '-1' },
		{ id: '05', label: '-2' },
		{ id: '04', label: '-3' },
		{ id: '03', label: '-4' },
		{ id: '02', label: '-5' },
		{ id: '01', label: '-6' },
		{ id: '00', label: '-7' },
	],
	BACKLIGHT: [
		{ id: '02', label: 'On' },
		{ id: '03', label: 'Off' },
		{ id: 'toggle', label: 'Toggle' },
	],
	PRESET: [
		...Array.from({ length: 64 }, (_, i) => ({ id: i + 1, label: `Preset ${i + 1}` })),
		{ id: 'ps', label: 'Use presetSelector Variable' },
	],
	WB_MODE: [
		{ id: '00', label: 'Auto' },
		{ id: '01', label: 'Indoor' },
		{ id: '02', label: 'Outdoor' },
		{ id: '03', label: 'OnePush' },
		{ id: '04', label: 'ATW' },
		{ id: '05', label: 'Manual' },
		{ id: '06', label: 'Sodium' },
	],
	SPEED: [
		{ id: '18', label: 'Speed 24 (fast)' },
		{ id: '17', label: 'Speed 23' },
		{ id: '16', label: 'Speed 22' },
		{ id: '15', label: 'Speed 21' },
		{ id: '14', label: 'Speed 20' },
		{ id: '13', label: 'Speed 19' },
		{ id: '12', label: 'Speed 18' },
		{ id: '11', label: 'Speed 17' },
		{ id: '10', label: 'Speed 16' },
		{ id: '0F', label: 'Speed 15' },
		{ id: '0E', label: 'Speed 14' },
		{ id: '0D', label: 'Speed 13' },
		{ id: '0C', label: 'Speed 12 (default)' },
		{ id: '0B', label: 'Speed 11' },
		{ id: '0A', label: 'Speed 10' },
		{ id: '09', label: 'Speed 09' },
		{ id: '08', label: 'Speed 08' },
		{ id: '07', label: 'Speed 07' },
		{ id: '06', label: 'Speed 06' },
		{ id: '05', label: 'Speed 05' },
		{ id: '04', label: 'Speed 04' },
		{ id: '03', label: 'Speed 03' },
		{ id: '02', label: 'Speed 02' },
		{ id: '01', label: 'Speed 01 (slow)' },
	],
	LENS_SPEED: [
		{ id: '07', label: 'Speed 7 (fast)' },
		{ id: '06', label: 'Speed 6' },
		{ id: '05', label: 'Speed 5' },
		{ id: '04', label: 'Speed 4' },
		{ id: '03', label: 'Speed 3' },
		{ id: '02', label: 'Speed 2' },
		{ id: '01', label: 'Speed 1' },
		{ id: '00', label: 'Speed 0 (slow)' },
	],
	CAMERA_ID: [
		{ id: '128', label: 'id 0' },
		{ id: '129', label: 'id 1 (default)' },
		{ id: '130', label: 'id 2' },
		{ id: '131', label: 'id 3' },
		{ id: '132', label: 'id 4' },
		{ id: '133', label: 'id 5' },
		{ id: '134', label: 'id 6' },
		{ id: '135', label: 'id 7' },
		{ id: '136', label: 'id 8' },
	],
	IRIS: [
		{ id: '0C', label: '1.8' },
		{ id: '0B', label: '2.0' },
		{ id: '0A', label: '2.4' },
		{ id: '09', label: '2.8' },
		{ id: '08', label: '3.4' },
		{ id: '07', label: '4.0' },
		{ id: '06', label: '4.8' },
		{ id: '05', label: '5.6' },
		{ id: '04', label: '6.8' },
		{ id: '03', label: '8.0' },
		{ id: '02', label: '9.6' },
		{ id: '01', label: '11.0' },
		{ id: '00', label: 'Close' },
	],
	SHUTTER: [
		{ id: '0010', label: '1/10000' },
		{ id: '000F', label: '1/6000' },
		{ id: '000E', label: '1/4000' },
		{ id: '000D', label: '1/3000' },
		{ id: '000C', label: '1/2000' },
		{ id: '000B', label: '1/1000' },
		{ id: '000A', label: '1/500' },
		{ id: '0009', label: '1/350' },
		{ id: '0008', label: '1/250' },
		{ id: '0007', label: '1/180' },
		{ id: '0006', label: '1/120' },
		{ id: '0005', label: '1/100' },
		{ id: '0004', label: '1/90' },
		{ id: '0003', label: '1/60' },
		{ id: '0002', label: '1/50' },
		{ id: '0001', label: '1/30' },
		{ id: '0000', label: '1/25' },
	],
	GAIN: Array.from({ length: 21 }, (_, i) => ({
		id: i.toString(16).toUpperCase().padStart(4, '0'),
		label: i.toString(),
	})).reverse(),
	BRIGHTNESS: Array.from({ length: 24 }, (_, i) => ({
		id: i.toString(16).toUpperCase().padStart(4, '0'),
		label: i.toString(),
	})).reverse(),
	AF_SENSITIVITY: [
		{ id: '00', label: 'High' },
		{ id: '01', label: 'Middle' },
		{ id: '02', label: 'Low' },
	],
	GAIN_RGB: Array.from({ length: 256 }, (_, i) => ({ id: i.toString(), label: i.toString() })),
	NR_LEVEL: [
		{ id: '0', label: 'Off' },
		{ id: '1', label: '1' },
		{ id: '2', label: '2' },
		{ id: '3', label: '3' },
		{ id: '4', label: '4' },
		{ id: '5', label: '5' },
		{ id: '6', label: '6' },
		{ id: '7', label: '7' },
		{ id: '8', label: 'Auto' },
	],
	CONTRAST: Array.from({ length: 15 }, (_, i) => ({
		id: i.toString(),
		label: i.toString(),
	})),
	SHARPNESS: Array.from({ length: 16 }, (_, i) => ({
		id: i.toString(),
		label: i.toString(),
	})),
	LUMINANCE: Array.from({ length: 15 }, (_, i) => ({
		id: i.toString(),
		label: i.toString(),
	})),
	HUE: Array.from({ length: 15 }, (_, i) => ({
		id: i.toString(),
		label: i.toString(),
	})),
	SATURATION: Array.from({ length: 15 }, (_, i) => ({
		id: i.toString(),
		label: (60 + i * 10).toString() + '%',
	})),
	GAMMA: [
		{ id: '0', label: 'Default' },
		{ id: '1', label: '0.45' },
		{ id: '2', label: '0.50' },
		{ id: '3', label: '0.55' },
		{ id: '4', label: '0.63' },
	],
}
