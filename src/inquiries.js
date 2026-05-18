/**
 * @file Defines VISCA status inquiry commands and the logic to parse their responses (polling).
 */

import * as VISCA from './constants.js'
import { filterByModel } from './model-caps.js'

// Concatenate lower nibbles of bytes at given indices into a single value
function nibbleConcat(resp, indices) {
	try {
		let value = 0
		for (let i = 0; i < indices.length; i++) {
			const byte = resp[indices[i]]
			if (byte === undefined) return undefined
			value |= (byte & 0x0f) << ((indices.length - 1 - i) * 4)
		}
		return value
	} catch (err) {
		console.error('nibbleConcat error:', err)
		return undefined
	}
}

// Same as nibbleConcat but treats result as a 16-bit signed integer
function nibbleConcatSigned(resp, indices) {
	try {
		let value = nibbleConcat(resp, indices)
		if (value === undefined) return undefined
		if (value > 0x7fff) {
			value -= 0x10000
		}
		return value
	} catch (err) {
		console.error('nibbleConcatSigned error:', err)
		return undefined
	}
}

/**
 * Parse an inquiry response payload and update state.
 */
export function parseInquiryResponse(blockDef, payload, state, choices, locks = {}, log) {
	if (payload.length < blockDef.minLength) {
		return false
	}

	const now = Date.now()
	let changed = false
	for (const field of blockDef.fields) {
		// Check for inquiry locks
		if (locks[field.variable] && locks[field.variable] > now) {
			continue
		}

		try {
			const value = field.extract(payload, choices, state)
			if (value !== undefined && state[field.variable] !== value) {
				state[field.variable] = value
				changed = true
			}
		} catch (err) {
			if (log) {
				log('debug', `Error parsing inquiry field ${field.variable}: ${err}`)
			} else {
				console.error(`Error parsing inquiry field ${field.variable}:`, err)
			}
		}
	}
	return changed
}

const BLOCKS_atlona = {
	// Power Inq: y0 50 02 FF / y0 50 03 FF
	[VISCA.INQ_POWER]: {
		minLength: 4,
		fields: [{ variable: 'powerStatus', extract: (r) => (r[2] === VISCA.PARAM_ON ? 'On' : 'Off') }],
	},
	// Pan/Tilt Position: y0 50 0p 0p 0p 0p 0t 0t 0t 0t FF
	[VISCA.INQ_PT_POSITION]: {
		minLength: 10,
		fields: [
			{
				variable: 'panPosition',
				extract: (r, _c, s) => {
					let val = nibbleConcatSigned(r, [2, 3, 4, 5])
					if (s && s.lastSentPan !== undefined && Math.abs(val - s.lastSentPan) <= 2) {
						return s.lastSentPan
					}
					return val
				},
			},
			{
				variable: 'tiltPosition',
				extract: (r, _c, s) => {
					let val = nibbleConcatSigned(r, [6, 7, 8, 9])
					if (s && s.lastSentTilt !== undefined && Math.abs(val - s.lastSentTilt) <= 2) {
						return s.lastSentTilt
					}
					return val
				},
			},
		],
	},
	// Zoom Position: y0 50 0z 0z 0z 0z FF
	[VISCA.INQ_ZOOM_POSITION]: {
		minLength: 7,
		fields: [{ variable: 'zoomPosition', extract: (r) => nibbleConcat(r, [2, 3, 4, 5]) }],
	},
	// Focus Mode: y0 50 pp FF (02=Auto, 03=Manual)
	[VISCA.INQ_FOCUS_MODE]: {
		minLength: 4,
		fields: [
			{
				variable: 'focusMode',
				extract: (r) => (r[2] === VISCA.PARAM_FOCUS_AUTO ? 'Auto' : 'Manual'),
			},
		],
	},
	// Focus Position: y0 50 0p 0q 0r 0s FF
	[VISCA.INQ_FOCUS_POSITION]: {
		minLength: 7,
		fields: [
			{
				variable: 'focusPosition',
				extract: (r) => nibbleConcat(r, [2, 3, 4, 5]),
			},
		],
	},
	// Exposure Mode: y0 50 0p FF (0:Auto, 3:Manual, A:Shutter, B:Iris, D:Bright)
	[VISCA.INQ_EXPOSURE_MODE]: {
		minLength: 4,
		fields: [
			{
				variable: 'exposureMode',
				extract: (r) => {
					if (r[2] === VISCA.EXPOSURE_AUTO) return 'Auto'
					if (r[2] === VISCA.EXPOSURE_MANUAL) return 'Manual'
					if (r[2] === VISCA.EXPOSURE_SHUTTER_PRIO) return 'SAE'
					if (r[2] === VISCA.EXPOSURE_IRIS_PRIO) return 'AAE'
					if (r[2] === VISCA.EXPOSURE_BRIGHT) return 'Bright'
					return 'Unknown'
				},
			},
		],
	},
	// Iris Inquiry: y0 50 00 00 0p 0q FF
	[VISCA.INQ_IRIS_POSITION]: {
		minLength: 7,
		fields: [{ variable: 'irisPosition', extract: (r) => nibbleConcat(r, [2, 3, 4, 5]) }],
	},
	// Bright (Iris) Inquiry: y0 50 00 00 0p 0q FF
	[VISCA.INQ_BRIGHT_LEVEL]: {
		minLength: 7,
		fields: [{ variable: 'brightPosition', extract: (r) => nibbleConcat(r, [2, 3, 4, 5]) }],
	},
	// Shutter Speed: y0 50 00 00 0p 0q FF
	[VISCA.INQ_SHUTTER_SPEED]: {
		minLength: 7,
		fields: [{ variable: 'shutterSpeed', extract: (r) => nibbleConcat(r, [2, 3, 4, 5]) }],
	},
	// Gain: y0 50 00 00 0p 0q FF
	[VISCA.INQ_GAIN_LEVEL]: {
		minLength: 7,
		fields: [{ variable: 'gainLevel', extract: (r) => nibbleConcat(r, [2, 3, 4, 5]) }],
	},
	// White Balance Mode: y0 50 0p FF
	[VISCA.INQ_WB_MODE]: {
		minLength: 4,
		fields: [{ variable: 'wbMode', extract: (r) => r[2].toString(16).padStart(2, '0') }],
	},
	// R.Gain: y0 50 00 00 0p 0q FF
	[VISCA.INQ_R_GAIN]: {
		minLength: 7,
		fields: [
			{
				variable: 'rGain',
				extract: (r, _c, s) => {
					let val = nibbleConcat(r, [2, 3, 4, 5])
					if (s && s.lastSentRGain !== undefined && Math.abs(val - s.lastSentRGain) <= 1) {
						return s.lastSentRGain
					}
					return val
				},
			},
		],
	},
	// B.Gain: y0 50 00 00 0p 0q FF
	[VISCA.INQ_B_GAIN]: {
		minLength: 7,
		fields: [
			{
				variable: 'bGain',
				extract: (r, _c, s) => {
					let val = nibbleConcat(r, [2, 3, 4, 5])
					if (s && s.lastSentBGain !== undefined && Math.abs(val - s.lastSentBGain) <= 1) {
						return s.lastSentBGain
					}
					return val
				},
			},
		],
	},
	// Exposure Compensation: y0 50 00 00 0p 0q FF
	[VISCA.INQ_EXP_COMP_LEVEL]: {
		minLength: 4,
		fields: [
			{
				variable: 'expCompLevel',
				extract: (r, _c, _s) => {
					const val = r.length >= 7 ? nibbleConcat(r, [2, 3, 4, 5]) : r[2]
					// If the inquiry returns 0, it's likely unsupported or returning dummy data (scale is 0x02-0x10)
					// Allow 0 as it is a valid ID in the new scale
					// if (val === 0) return s.expCompLevel
					return val
				},
			},
		],
	},
	// Exposure Compensation Status: y0 50 0p FF
	[VISCA.INQ_EXP_COMP_MODE]: {
		minLength: 4,
		fields: [
			{
				variable: 'expComp',
				extract: (r, _c, s) => {
					const val = r[2]
					if (val === VISCA.PARAM_ON) return 'On'
					if (val === VISCA.PARAM_OFF) return 'Off'
					// Ignore 0 or other values
					return s.expComp
				},
			},
		],
	},
	// Noise Reduction 2D: y0 50 0p FF
	[VISCA.INQ_NR2D]: {
		minLength: 4,
		fields: [{ variable: 'nr2d', extract: (r) => r[2] }],
	},
	// Noise Reduction 3D: y0 50 0p FF
	[VISCA.INQ_NR3D]: {
		minLength: 4,
		fields: [{ variable: 'nr3d', extract: (r) => r[2] }],
	},
	// Brightness (Picture): y0 50 00 00 0p 0q FF or y0 50 0p FF
	[VISCA.INQ_LUMINANCE]: {
		minLength: 4,
		fields: [{ variable: 'luminance', extract: (r) => (r.length >= 7 ? nibbleConcat(r, [2, 3, 4, 5]) : r[2]) }],
	},
	// Contrast: y0 50 00 00 0p 0q FF or y0 50 0p FF
	[VISCA.INQ_CONTRAST]: {
		minLength: 4,
		fields: [{ variable: 'contrast', extract: (r) => (r.length >= 7 ? nibbleConcat(r, [2, 3, 4, 5]) : r[2]) }],
	},
	// Saturation: y0 50 00 00 0p 0q FF or y0 50 0p FF
	[VISCA.INQ_SATURATION]: {
		minLength: 4,
		fields: [{ variable: 'saturation', extract: (r) => (r.length >= 7 ? nibbleConcat(r, [2, 3, 4, 5]) : r[2]) }],
	},
	// Sharpness: y0 50 00 00 0p 0q FF or y0 50 0p FF
	[VISCA.INQ_SHARPNESS]: {
		minLength: 4,
		fields: [{ variable: 'sharpness', extract: (r) => (r.length >= 7 ? nibbleConcat(r, [2, 3, 4, 5]) : r[2]) }],
	},
	// Hue: y0 50 00 00 0p 0q FF or y0 50 0p FF
	[VISCA.INQ_HUE]: {
		minLength: 4,
		fields: [{ variable: 'hue', extract: (r) => (r.length >= 7 ? nibbleConcat(r, [2, 3, 4, 5]) : r[2]) }],
	},
	// Backlight: y0 50 0p FF
	[VISCA.INQ_BACKLIGHT]: {
		minLength: 4,
		fields: [{ variable: 'backlight', extract: (r) => (r[2] === VISCA.PARAM_ON ? 'On' : 'Off') }],
	},
	// Focus Region Inquiry: y0 50 0p FF
	[VISCA.INQ_FOCUS_REGION]: {
		minLength: 4,
		fields: [
			{
				variable: 'focusRegion',
				extract: (r) => r[2].toString(16).padStart(2, '0'),
			},
		],
	},
	// Focus Sensitivity Inquiry: y0 50 0p FF
	[VISCA.INQ_FOCUS_SENSITIVITY]: {
		minLength: 4,
		fields: [
			{
				variable: 'focusSensitivity',
				extract: (r) => (r[2] - 1).toString(16).padStart(2, '0'),
			},
		],
	},
	// Gamma: y0 50 0p FF
	[VISCA.INQ_GAMMA]: {
		minLength: 4,
		fields: [{ variable: 'gamma', extract: (r) => r[2].toString() }],
	},
}

export function getInquiryBlocks(modelId) {
	return filterByModel(BLOCKS_atlona, modelId)
}
