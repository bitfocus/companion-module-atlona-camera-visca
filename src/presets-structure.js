/**
 * Get the presets structure for atlona Visca module.
 * @param {Object} presets All defined presets
 * @returns {Array} The filtered structure
 */
export function getPresetsStructure(presets) {
	const presetsList = []
	for (let i = 0; i < 64; i++) {
		presetsList.push('presets-Preset' + i)
	}

	const structure = [
		{
			id: 'section-ptz',
			name: 'Pan/Tilt/Zoom',
			definitions: [
				{
					id: 'ptz-group-pan-tilt',
					type: 'simple',
					name: 'Pan / Tilt',
					presets: [
						'panTilt-up',
						'panTilt-down',
						'panTilt-left',
						'panTilt-right',
						'panTilt-upLeft',
						'panTilt-upRight',
						'panTilt-downLeft',
						'panTilt-downRight',
						'panTilt-home',
						'panTilt-pos-zero',
					],
				},
				{
					id: 'ptz-group-zoom',
					type: 'simple',
					name: 'Zoom',
					presets: ['lens-zoomIn', 'lens-zoomOut', 'lens-zoomDirect'],
				},
				{
					id: 'ptz-group-speed',
					type: 'simple',
					name: 'PTZ Speed',
					presets: ['pan-speed-set', 'tilt-speed-set', 'zoom-speed-set'],
				},
				{
					id: 'ptz-group-rotary-labels',
					type: 'simple',
					name: 'Rotary Labels',
					presets: ['pan-rotary-label', 'tilt-rotary-label', 'zoom-rotary-label'],
				},
				{
					id: 'ptz-group-rotary',
					type: 'simple',
					name: 'Rotary',
					presets: ['pan-rotary', 'tilt-rotary', 'zoom-rotary'],
				},
			],
		},
		{
			id: 'section-lens',
			name: 'Focus',
			definitions: [
				{
					id: 'lens-group-basic',
					type: 'simple',
					name: 'Basic Focus',
					presets: ['lens-focusAuto', 'lens-opaf', 'lens-focusDirect', 'lens-focusRegion', 'lens-focusSensitivity'],
				},
				{
					id: 'lens-group-rotary-labels',
					type: 'simple',
					name: 'Rotary Labels',
					presets: ['focus-rotary-label', 'focus-region-rotary-label', 'focus-sens-rotary-label'],
				},
				{
					id: 'lens-group-rotary',
					type: 'simple',
					name: 'Rotary',
					presets: ['focus-rotary', 'focus-region-rotary', 'focus-sens-rotary'],
				},
			],
		},
		{
			id: 'section-exposure',
			name: 'Exposure',
			definitions: [
				{
					id: 'exposure-group-modes',
					type: 'simple',
					name: 'Modes',
					presets: [
						'exposure-auto',
						'exposure-manual',
						'exposure-sae',
						'exposure-aae',
						'exposure-bright',
						'exposure-toggle',
					],
				},
				{
					id: 'exposure-group-adjust',
					type: 'simple',
					name: 'Adjustments',
					presets: [
						'exposure-backlight-on',
						'exposure-backlight-off',
						'exposure-backlight-toggle',
						'exposure-comp-toggle',
						'exposure-comp-reset',
						'exposure-comp-up',
						'exposure-comp-down',
						'exposure-comp-set',
						'exposure-iris-set',
						'exposure-shutter-abs',
					],
				},
				{
					id: 'exposure-group-rotary-labels',
					type: 'simple',
					name: 'Rotary Labels',
					presets: [
						'shutter-rotary-label',
						'shutter-rotary-label-120',
						'iris-rotary-label',
						'gain-rotary-label',
						'exposure-comp-rotary-label',
						'nr2d-rotary-label',
						'nr3d-rotary-label',
						'smart-exp-rotary-label',
					],
				},
				{
					id: 'exposure-group-rotary',
					type: 'simple',
					name: 'Rotary',
					presets: [
						'shutter-rotary',
						'shutter-rotary-120',
						'iris-rotary',
						'gain-rotary',
						'exposure-comp-rotary',
						'nr2d-rotary',
						'nr3d-rotary',
						'smart-exp-rotary',
					],
				},
			],
		},
		{
			id: 'section-color',
			name: 'Color & Image',
			definitions: [
				{
					id: 'color-group-wb',
					type: 'simple',
					name: 'White Balance',
					presets: [
						'color-wb-cycle',
						'color-wb-toggle',
						'color-wbAuto',
						'color-wbOnePush',
						'color-wbTrigger',
						'color-wbManu',
					],
				},
				{
					id: 'color-group-standard',
					type: 'simple',
					name: 'Standard Adjustments',
					presets: [
						'color-rgain-set',
						'color-bgain-set',
						'image-contrast-set',
						'image-sharpness-set',
						'image-saturation-set',
						'image-luminance-set',
						'image-hue-set',
						'image-gamma-set',
					],
				},
				{
					id: 'color-group-rotary-labels',
					type: 'simple',
					name: 'Rotary Labels',
					presets: [
						'color-wb-rotary-label',
						'rgain-rotary-label',
						'bgain-rotary-label',
						'bright-rotary-label',
						'image-contrast-rotary-label',
						'image-sharpness-rotary-label',
						'image-saturation-rotary-label',
						'image-luminance-rotary-label',
						'image-hue-rotary-label',
						'image-gamma-rotary-label',
					],
				},
				{
					id: 'color-group-image-rotaries',
					type: 'simple',
					name: 'Rotary',
					presets: [
						'color-wb-rotary',
						'rgain-rotary',
						'bgain-rotary',
						'bright-rotary',
						'image-contrast-rotary',
						'image-sharpness-rotary',
						'image-saturation-rotary',
						'image-luminance-rotary',
						'image-hue-rotary',
						'image-gamma-rotary',
					],
				},
			],
		},

		{
			id: 'section-presets',
			name: 'Presets',
			definitions: [
				{
					id: 'presets-group-all',
					type: 'simple',
					name: 'Camera Presets',
					presets: presetsList,
				},
			],
		},
		{
			id: 'section-system',
			name: 'System',
			definitions: [
				{
					id: 'system-group-basic',
					type: 'simple',
					name: 'System Basics',
					presets: ['system-power-toggle', 'system-fliph-toggle', 'system-flipv-toggle'],
				},
			],
		},
	]

	// Filter structure to only include valid presets for this model
	return structure
		.map((section) => ({
			...section,
			definitions: section.definitions
				.map((group) => ({
					...group,
					presets: group.presets.filter((id) => presets[id] !== undefined),
				}))
				.filter((group) => group.presets.length > 0),
		}))
		.filter((section) => section.definitions.length > 0)
}
