/**
 * @file Aggregates the initialization and updating logic for Companion variables (e.g. $(atlona:panSpeed)).
 */

// import * as VISCA from './constants.js'

export function initVariables(_activeBlocks, modelId) {
	const variableDefinitions = {}
	const activeIds = []

	for (const v of variables) {
		if (!v.models || v.models.has(modelId)) {
			variableDefinitions[v.variableId] = { name: v.name }
			activeIds.push(v.variableId)
		}
	}

	this.setVariableDefinitions(variableDefinitions)
	this.activeVariableIds = new Set(activeIds)
}

export async function updateVariables() {
	const formatPos = (val, factor, unit) => {
		if (typeof val !== 'number') return 'Unknown'
		let deg = val * factor
		return Number(deg).toFixed(1) + unit
	}

	const maxZoom = 10.0
	const zoomRange = maxZoom - 1.0

	const zoomPosVal =
		typeof this.state.zoomPosition === 'number' ? (this.state.zoomPosition / 16384) * zoomRange + 1.0 : 1.0
	const zoomPos = zoomPosVal.toFixed(1) + 'x'

	const panPos = formatPos(this.state.panPosition, 0.0694, '°')
	const tiltPos = formatPos(this.state.tiltPosition, 0.0694, '°')
	const focusPos = this.state.focusMode === 'Auto' ? 'AF' : (this.state.focusPosition ?? 'Unknown')
	const focusRegion = getChoiceLabel(this.state.focusRegion, this.choices?.FOCUS_REGION)
	const focusSensitivity = getChoiceLabel(this.state.focusSensitivity, this.choices?.AF_SENSITIVITY)

	const allValues = {
		panPosition: panPos,
		tiltPosition: tiltPos,
		zoomPosition: zoomPos,
		focusPosition: focusPos,
		focusRegion: focusRegion,
		focusSensitivity: focusSensitivity,
		focusMode: this.state.focusMode,
		exposureMode: this.state.exposureMode,
		irisPosition: getChoiceLabel(this.state.irisPosition, this.choices?.IRIS),
		risLabel: getChoiceLabel(this.state.irisPosition, this.choices?.IRIS),
		brightPosition: getChoiceLabel(this.state.brightPosition, this.choices?.BRIGHTNESS),
		shutterSpeed: getChoiceLabel(this.state.shutterSpeed, this.choices?.SHUTTER),
		gainLevel: getChoiceLabel(this.state.gainLevel, this.choices?.GAIN),
		expCompLevel: getChoiceLabel(this.state.expCompLevel, this.choices?.EXPOSURE_COMPENSATION),
		expComp: this.state.expComp,
		backlight: this.state.backlight,
		powerStatus: this.state.powerStatus,
		flipHStatus: this.state.flipHStatus,
		flipVStatus: this.state.flipVStatus,
		wbMode: getChoiceLabel(this.state.wbMode, this.choices?.WB_MODE),
		wbModePreview: getChoiceLabel(this.state.wbModePreview ?? this.state.wbMode, this.choices?.WB_MODE),
		rGain: this.state.rGain ?? 'Unknown',
		bGain: this.state.bGain ?? 'Unknown',
		lastCmdSent: this.state.lastCmdSent,
		nr2d: getChoiceLabel(this.state.nr2d, this.choices?.NR_LEVEL),
		nr3d: getChoiceLabel(this.state.nr3d, this.choices?.NR_LEVEL),
		presetSelector: this.state.presetSelector,
		presetLastUsed: this.state.presetLastUsed,
		panSpeed: this.state.panSpeed,
		tiltSpeed: this.state.tiltSpeed,
		zoomSpeed: this.state.zoomSpeed,
		focusSpeed: this.state.focusSpeed,
		contrast: getChoiceLabel(this.state.contrast, this.choices?.CONTRAST),
		sharpness: getChoiceLabel(this.state.sharpness, this.choices?.SHARPNESS),
		saturation: getChoiceLabel(this.state.saturation, this.choices?.SATURATION),
		luminance: getChoiceLabel(this.state.luminance, this.choices?.LUMINANCE),
		hue: getChoiceLabel(this.state.hue, this.choices?.HUE),
		gamma: getChoiceLabel(this.state.gamma, this.choices?.GAMMA),
	}

	let smartExpLabel = 'Exp'
	let smartExpValue = 'Unknown'

	switch (this.state.exposureMode) {
		case 'Auto':
			smartExpLabel = 'EV Comp'
			smartExpValue = allValues.expCompLevel
			break
		case 'Manual':
			smartExpLabel = 'Gain'
			smartExpValue = allValues.gainLevel
			break
		case 'SAE':
			smartExpLabel = 'Shutter'
			smartExpValue = allValues.shutterSpeed
			break
		case 'AAE':
			smartExpLabel = 'Iris'
			smartExpValue = allValues.irisPosition
			break
		case 'Bright':
			smartExpLabel = 'Bright'
			smartExpValue = allValues.brightPosition
			break
	}

	allValues.smartExpLabel = smartExpLabel
	allValues.smartExpValue = smartExpValue

	const filtered = {}
	for (const [key, value] of Object.entries(allValues)) {
		if (this.activeVariableIds.has(key)) {
			filtered[key] = value
		}
	}
	this.setVariableValues(filtered)
}

function getChoiceLabel(val, choices, prefix = '') {
	if (val === undefined || val === null) return 'Unknown'
	if (!choices || !Array.isArray(choices)) return prefix + val.toString()

	const strVal = val.toString()
	const numVal = typeof val === 'number' ? val : parseInt(val, 10)

	// 1. Try exact match first (prioritize decimal for numeric ranges)
	let choice = choices.find((c) => c.id === strVal || c.id === val)

	// 2. Fallback to hex match if no direct match found (legacy VISCA behavior)
	if (!choice && !isNaN(numVal)) {
		const hexId = numVal.toString(16).toUpperCase().padStart(4, '0')
		choice = choices.find((c) => c.id === hexId || c.id === hexId.slice(2))
	}

	return choice ? prefix + choice.label : prefix + val.toString()
}

const variables = [
	{ variableId: 'panPosition', name: 'Pan Position' },
	{ variableId: 'tiltPosition', name: 'Tilt Position' },
	{ variableId: 'zoomPosition', name: 'Zoom Position' },
	{ variableId: 'focusPosition', name: 'Focus Position' },
	{ variableId: 'focusRegion', name: 'Focus Region' },
	{ variableId: 'focusSensitivity', name: 'AF Sensitivity' },
	{ variableId: 'focusMode', name: 'Focus Mode' },
	{ variableId: 'exposureMode', name: 'Exposure Mode' },
	{ variableId: 'irisPosition', name: 'Iris Position' },
	{ variableId: 'irisLabel', name: 'Iris Label' },
	{ variableId: 'brightPosition', name: 'Bright (Iris) Position' },
	{ variableId: 'shutterSpeed', name: 'Shutter Speed' },
	{ variableId: 'gainLevel', name: 'Gain Level' },
	{ variableId: 'expCompLevel', name: 'Exposure Compensation Level' },
	{ variableId: 'expComp', name: 'Exposure Compensation Status' },
	{ variableId: 'backlight', name: 'Backlight Status' },
	{ variableId: 'powerStatus', name: 'Power Status' },
	{ variableId: 'flipHStatus', name: 'Flip-H Status' },
	{ variableId: 'flipVStatus', name: 'Flip-V Status' },
	{ variableId: 'wbMode', name: 'White Balance Mode' },
	{ variableId: 'wbModePreview', name: 'White Balance Preview Mode' },
	{ variableId: 'rGain', name: 'R.Gain Level' },
	{ variableId: 'bGain', name: 'B.Gain Level' },
	{ variableId: 'contrast', name: 'Contrast' },
	{ variableId: 'sharpness', name: 'Sharpness' },
	{ variableId: 'saturation', name: 'Saturation' },
	{ variableId: 'luminance', name: 'Brightness' },
	{ variableId: 'hue', name: 'Hue' },
	{ variableId: 'gamma', name: 'Gamma' },
	{ variableId: 'nr2d', name: 'Noise Reduction 2D' },
	{ variableId: 'nr3d', name: 'Noise Reduction 3D' },
	{ variableId: 'lastCmdSent', name: 'Last Command Sent' },
	// <premium>
	{ variableId: 'presetSelector', name: 'Preset Selector' },
	// </premium>
	{ variableId: 'presetLastUsed', name: 'Preset Last Used' },
	{ variableId: 'panSpeed', name: 'Pan Speed' },
	{ variableId: 'tiltSpeed', name: 'Tilt Speed' },
	{ variableId: 'zoomSpeed', name: 'Zoom Speed' },
	{ variableId: 'focusSpeed', name: 'Focus Speed' },
	{ variableId: 'smartExpLabel', name: 'Smart Exposure (Label)' },
	{ variableId: 'smartExpValue', name: 'Smart Exposure (Value)' },
]
export function getVariablesMarkdown() {
	let markdown = '## Variables Implemented\n\n'
	markdown += '| Id | Name |\n| --- | --- |\n'
	for (const v of variables) {
		markdown += `| ${v.variableId} | ${v.name} |\n`
	}
	return markdown
}
