/**
 * @file Aggregates all preset definitions for the module and validates them against available actions and feedbacks.
 */

import { panTiltPresets } from './presets/pan-tilt.js'
import { lensPresets } from './presets/lens.js'
import { exposurePresets } from './presets/exposure.js'
import { colorPresets } from './presets/color.js'
import { imagePresets } from './presets/image.js'
import { systemPresets } from './presets/system.js'

import { getCameraPresets } from './presets/camera-presets.js'
import { presetActionsAvailable, presetFeedbacksAvailable } from './presets/utils.js'

/**
 * IMPORTANT FOR COMPANION 3.0 PRESETS:
 * Whenever you add a new preset here, you MUST also add its ID to the `structure` array
 * inside `src/main.js` (in `registerDefinitions()`).
 * If you forget to add it to `structure`, Companion will throw a warning:
 * "The following preset definitions exist in presets but are not referenced by structure".
 */

export function getPresetDefinitions(self, availableActionIds, availableFeedbackIds) {
	const all = {
		...panTiltPresets,
		...lensPresets,
		...exposurePresets,
		...colorPresets,
		...imagePresets,
		...systemPresets,

		...getCameraPresets(self),
	}

	if (!availableActionIds) return all
	const filtered = {}
	for (const [key, preset] of Object.entries(all)) {
		if (
			(!preset.models || preset.models.has(self.config.model)) &&
			presetActionsAvailable(preset, availableActionIds) &&
			presetFeedbacksAvailable(preset, availableFeedbackIds)
		) {
			filtered[key] = preset
		}
	}
	return filtered
}

export function getPresetsMarkdown() {
	return (
		'## Presets Implemented\n\n' +
		'### Pan/Tilt/Zoom Presets\n\n' +
		'- PTZ Directions (Up, Down, Left, Right, Diagonals, Stop, Home)\n' +
		'- Zoom In / Zoom Out / Zoom Stop\n' +
		'- Focus Mode (Toggle)\n' +
		'- Focus Direct (0)\n' +
		'- Focus Set AF Sensitivity\n' +
		'- Focus Region Set\n\n' +
		'### Exposure Presets\n\n' +
		'- Exposure Modes (Auto, Manual, SAE, AAE, Bright, Toggle)\n' +
		'- Shutter Speed Up / Down / Set Absolute\n' +
		'- Iris Up / Down / Set Absolute\n' +
		'- Gain Up / Down / Set Absolute\n' +
		'- Exposure Comp Up/Down/Reset/Set\n' +
		'- Brightness Up/Down/Set\n' +
		'- Backlight On/Off/Toggle\n\n' +
		'### Color / White Balance Presets\n\n' +
		'- White Balance Modes (Auto, OnePush, Manu)\n' +
		'- White Balance Cycle (All / Favorites)\n' +
		'- One Push WB Trigger\n' +
		'- R.Gain Up/Down/Set\n' +
		'- B.Gain Up/Down/Set\n\n' +
		'### Image Setting Presets\n\n' +
		'- Set Contrast (Specific value)\n' +
		'- Set Sharpness (Specific value)\n' +
		'- Set Saturation (Specific value)\n' +
		'- Set Brightness (Specific value)\n' +
		'- Set Hue (Specific value)\n' +
		'- Set Gamma (Specific value)\n\n' +
		'### System Presets\n\n' +
		'- System Power Toggle\n' +
		'- Power On / Off\n' +
		'- Flip Horizontal On / Off\n' +
		'- Flip Vertical On / Off\n\n' +
		'### Dynamic Camera Presets\n\n' +
		'- Save Preset 1-255\n' +
		'- Recall Preset 1-255\n'
	)
}
