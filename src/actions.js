/**
 * @file Aggregates all action definitions for the module and applies model-specific filtering.
 */

import { filterByModel } from './model-caps.js'
import { getPanTiltActions } from './actions/pan-tilt.js'
import { getLensActions } from './actions/lens.js'
import { getExposureActions } from './actions/exposure.js'
import { getColorActions } from './actions/color.js'
import { getSystemActions } from './actions/system.js'
import { getCameraPresetActions } from './actions/camera-presets.js'

export function getActionDefinitions(self) {
	const otherActions = {
		...getPanTiltActions(self),
		...getLensActions(self),
		...getExposureActions(self),
		...getColorActions(self),
		...getSystemActions(self),
		...getCameraPresetActions(self),
	}

	const all = {
		...otherActions,
	}

	// Wrap all callbacks with error handling to protect polling state
	for (const actionId in all) {
		const originalCallback = all[actionId].callback
		if (typeof originalCallback === 'function') {
			all[actionId].callback = async (event) => {
				try {
					await originalCallback(event)
				} catch (e) {
					self.log('error', `Module: Error executing action: ${e.message}\n${e.stack ?? ''}`)
					// Safeguard: Always ensure polling is resumed if it was paused during the crash
					self.VISCA.setPollingPaused(false)
				}
			}
		}
	}

	return filterByModel(all, self.config.model)
}

export function getActionsMarkdown() {
	return (
		'## Actions Implemented\n\n' +
		'### Pan/Tilt Actions\n\n' +
		'- Pan Left\n' +
		'- Pan Right\n' +
		'- Tilt Up\n' +
		'- Tilt Down\n' +
		'- Up Left\n' +
		'- Up Right\n' +
		'- Down Left\n' +
		'- Down Right\n' +
		'- Stop\n' +
		'- Pan Rotate\n' +
		'- Tilt Rotate\n' +
		'- Stop & Reset Speed\n' +
		'- Reset/Recalibrate\n' +
		'- Home\n' +
		'- Set Pan Speed\n' +
		'- Set Tilt Speed\n' +
		'- Recall Absolute Position\n\n' +
		'### Lens/Zoom/Focus Actions\n\n' +
		'- Zoom In\n' +
		'- Zoom Out\n' +
		'- Zoom Stop\n' +
		'- Zoom Rotate\n' +
		'- Set Zoom Factor Direct\n' +
		'- Set Zoom Speed\n' +
		'- Focus Mode (Auto/Manual/Toggle)\n' +
		'- Focus Near\n' +
		'- Focus Far\n' +
		'- Focus Stop\n' +
		'- Focus Rotate\n' +
		'- Focus: One Push AF\n' +
		'- Set Focus Region Direct\n' +
		'- Focus Set AF Sensitivity\n' +
		'- Set Focus Direct\n' +
		'- Focus (Combine Near/Far/Stop into one Action)\n\n' +
		'### Exposure Actions\n\n' +
		'- Exposure Mode\n' +
		'- Iris Up/Down/Set\n' +
		'- Brightness (AE Bright Mode Only) Up/Down/Set\n' +
		'- Shutter Speed Up/Down\n' +
		'- Shutter Speed Jump to Value\n' +
		'- Gain Up/Down\n' +
		'- Gain Jump to Value\n' +
		'- Exposure Compensation: Set Level\n' +
		'- Exposure Compensation: Reset\n' +
		'- Exposure Compensation: Up\n' +
		'- Exposure Compensation: Down\n' +
		'- Set Backlight Compensation\n\n' +
		'### Color Actions\n\n' +
		'- White Balance Mode\n' +
		'- White Balance: Cycle Modes\n' +
		'- One push WB trigger\n' +
		'- R.Gain Up/Down\n' +
		'- R.Gain Set Direct\n' +
		'- B.Gain Up/Down\n' +
		'- B.Gain Set Direct\n' +
		'- Image: Contrast\n' +
		'- Image: Sharpness\n' +
		'- Image: Saturation\n' +
		'- Image: Brightness\n' +
		'- Image: Hue\n' +
		'- Image: Gamma\n' +
		'- Image: Set Custom Defaults (Calibration)\n\n' +
		'### System & Format Actions\n\n' +
		'- System Power Toggle\n' +
		'- Power (On/Off/Toggle)\n' +
		'- Flip Horizontal (On/Off/Toggle)\n' +
		'- Flip Vertical (On/Off/Toggle)\n' +
		'- Set Video System (Format)\n\n' +
		'### Camera Preset Actions\n\n' +
		'- Save Preset\n' +
		'- Recall Preset\n' +
		'- Preset Selector: Set/Inc/Dec\n\n'
	)
}
