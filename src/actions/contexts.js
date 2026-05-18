/**
 * @file Provides dynamic context-aware actions, such as Smart Execute, Context Rotary, and overlay toggles.
 */

import { getActionDefinitions } from '../actions.js'
import { getContextPressChoices, getContextTurnChoices, parseVar } from './utils.js'

// <premium>
export function getContextActions(self, all) {
	return {
		configureContext: {
			name: 'Context: Configure Slot',
			options: [
				{
					type: 'dropdown',
					label: 'Slot',
					id: 'slot',
					choices: [
						{ id: '1', label: 'Slot 1' },
						{ id: '2', label: 'Slot 2' },
						{ id: '3', label: 'Slot 3' },
						{ id: '4', label: 'Slot 4' },
						{ id: '5', label: 'Slot 5' },
						{ id: '6', label: 'Slot 6' },
						{ id: '7', label: 'Slot 7' },
						{ id: '8', label: 'Slot 8' },
					],
					default: '1',
				},
				{
					type: 'textinput',
					label: 'Logical Condition (e.g. $(atlona:focusMode) == "Manual" && $(atlona:presetSelector) > 1)',
					id: 'condition',
					default: '',
				},
				{
					type: 'static-text',
					id: 'info_t',
					label: '',
					value: '--- IF TRUE ---',
				},
				{
					type: 'textinput',
					label: 'True Label',
					id: 't_label',
					default: 'Focus',
				},
				{
					type: 'dropdown',
					label: 'True Value Variable',
					id: 't_var',
					choices: [
						{ id: 'contrast', label: 'Contrast' },
						{ id: 'sharpness', label: 'Sharpness' },
						{ id: 'saturation', label: 'Saturation' },
						{ id: 'luminance', label: 'Brightness (Picture)' },
						{ id: 'hue', label: 'Hue' },
						{ id: 'gamma', label: 'Gamma' },
						{ id: 'brightPosition', label: 'Brightness (AE)' },
						{ id: 'expCompLevel', label: 'Exp Comp Level' },
						{ id: 'focusPosition', label: 'Focus Position' },
						{ id: 'gainLevel', label: 'Gain Level' },
						{ id: 'irisPosition', label: 'Iris Position' },
						{ id: 'panPosition', label: 'Pan Position' },
						{ id: 'presetSelector', label: 'Preset Selector' },
						{ id: 'shutterSpeed', label: 'Shutter Speed' },
						{ id: 'tiltPosition', label: 'Tilt Position' },
						{ id: 'zoomPosition', label: 'Zoom Position (x)' },
					],
					default: 'focusPosition',
				},
				{
					type: 'dropdown',
					label: 'True Action',
					id: 't_act',
					choices: getContextTurnChoices(),
					default: 'focusSet',
				},
				{
					type: 'textinput',
					label: 'True Turn Up Value (Optional)',
					id: 't_up_val',
					default: '',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'True Turn Down Value (Optional)',
					id: 't_down_val',
					default: '',
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'True Press Action',
					id: 't_press_act',
					choices: getContextPressChoices(),
					default: 'none',
				},
				{
					type: 'textinput',
					label: 'True Press Value (Optional)',
					id: 't_press_val',
					default: '',
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'True Release Action',
					id: 't_release_act',
					choices: getContextPressChoices(),
					default: 'none',
				},
				{
					type: 'textinput',
					label: 'True Release Value (Optional)',
					id: 't_release_val',
					default: '',
					useVariables: true,
				},
				{
					type: 'static-text',
					id: 'info_f',
					label: '',
					value: '--- IF FALSE ---',
				},
				{
					type: 'textinput',
					label: 'False Label',
					id: 'f_label',
					default: 'Zoom',
				},
				{
					type: 'dropdown',
					label: 'False Value Variable',
					id: 'f_var',
					choices: [
						{ id: 'contrast', label: 'Contrast' },
						{ id: 'sharpness', label: 'Sharpness' },
						{ id: 'saturation', label: 'Saturation' },
						{ id: 'luminance', label: 'Brightness (Picture)' },
						{ id: 'hue', label: 'Hue' },
						{ id: 'gamma', label: 'Gamma' },
						{ id: 'brightPosition', label: 'Brightness (AE)' },
						{ id: 'expCompLevel', label: 'Exp Comp Level' },
						{ id: 'focusPosition', label: 'Focus Position' },
						{ id: 'gainLevel', label: 'Gain Level' },
						{ id: 'irisPosition', label: 'Iris Position' },
						{ id: 'panPosition', label: 'Pan Position' },
						{ id: 'presetSelector', label: 'Preset Selector' },
						{ id: 'shutterSpeed', label: 'Shutter Speed' },
						{ id: 'tiltPosition', label: 'Tilt Position' },
						{ id: 'zoomPosition', label: 'Zoom Position (x)' },
					],
					default: 'zoomPosition',
				},
				{
					type: 'dropdown',
					label: 'False Action (Turn CW/CCW)',
					id: 'f_act',
					choices: getContextTurnChoices(),
					default: 'zoomRotate',
				},
				{
					type: 'textinput',
					label: 'False Turn Up Value (Optional)',
					id: 'f_up_val',
					default: '',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'False Turn Down Value (Optional)',
					id: 'f_down_val',
					default: '',
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'False Press Action',
					id: 'f_press_act',
					choices: getContextPressChoices(),
					default: 'none',
				},
				{
					type: 'textinput',
					label: 'False Press Value (Optional)',
					id: 'f_press_val',
					default: '',
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'False Release Action',
					id: 'f_release_act',
					choices: getContextPressChoices(),
					default: 'none',
				},
				{
					type: 'textinput',
					label: 'False Release Value (Optional)',
					id: 'f_release_val',
					default: '',
					useVariables: true,
				},
			],
			callback: async (event) => {
				const slot = event.options.slot
				if (self.customContexts && self.customContexts[slot]) {
					self.customContexts[slot] = {
						condition: event.options.condition,
						t_label: event.options.t_label,
						t_var: event.options.t_var,
						t_act: event.options.t_act,
						t_up_val: event.options.t_up_val,
						t_down_val: event.options.t_down_val,
						t_press_act: event.options.t_press_act,
						t_press_val: event.options.t_press_val,
						t_release_act: event.options.t_release_act,
						t_release_val: event.options.t_release_val,
						f_label: event.options.f_label,
						f_var: event.options.f_var,
						f_act: event.options.f_act,
						f_up_val: event.options.f_up_val,
						f_down_val: event.options.f_down_val,
						f_press_act: event.options.f_press_act,
						f_press_val: event.options.f_press_val,
						f_release_act: event.options.f_release_act,
						f_release_val: event.options.f_release_val,
					}

					// Persist to config
					if (!self.config.customContexts) self.config.customContexts = {}
					self.config.customContexts = { ...self.customContexts }
					self.saveConfig(self.config)
					self.updateVariables()
					self.checkAllFeedbacks('contextStatus')
				}
			},
		},
		contextRotary: {
			name: 'Context: Rotary Action',
			options: [
				{
					type: 'dropdown',
					label: 'Slot',
					id: 'slot',
					choices: [
						{ id: '1', label: 'Slot 1' },
						{ id: '2', label: 'Slot 2' },
						{ id: '3', label: 'Slot 3' },
						{ id: '4', label: 'Slot 4' },
						{ id: '5', label: 'Slot 5' },
						{ id: '6', label: 'Slot 6' },
						{ id: '7', label: 'Slot 7' },
						{ id: '8', label: 'Slot 8' },
					],
					default: '1',
				},
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'dir',
					choices: [
						{ id: 'up', label: 'Up / Clockwise' },
						{ id: 'down', label: 'Down / Counter-Clockwise' },
						{ id: 'press', label: 'Press' },
						{ id: 'release', label: 'Release' },
					],
					default: 'up',
				},
			],
			callback: async (event) => {
				const slot = event.options.slot
				if (!self.customContexts || !self.customContexts[slot] || !self.contextState) return

				const ctx = self.customContexts[slot]
				const isTrue = self.contextState[slot]
				const dir = event.options.dir

				let customVal = ''
				if (isTrue) {
					if (dir === 'up') customVal = ctx.t_up_val
					else if (dir === 'down') customVal = ctx.t_down_val
					else if (dir === 'press') customVal = ctx.t_press_val
					else if (dir === 'release') customVal = ctx.t_release_val
				} else {
					if (dir === 'up') customVal = ctx.f_up_val
					else if (dir === 'down') customVal = ctx.f_down_val
					else if (dir === 'press') customVal = ctx.f_press_val
					else if (dir === 'release') customVal = ctx.f_release_val
				}

				let targetActionName
				if (dir === 'press') {
					targetActionName = isTrue ? ctx.t_press_act : ctx.f_press_act
				} else if (dir === 'release') {
					targetActionName = isTrue ? ctx.t_release_act : ctx.f_release_act
				} else {
					targetActionName = isTrue ? ctx.t_act : ctx.f_act
				}

				if (!targetActionName || targetActionName === 'none') return

				const actions = getActionDefinitions(self)
				const targetAction = actions[targetActionName]

				if (!targetAction && targetActionName !== 'expCompSet') return

				let mappedValue = dir

				if (customVal !== undefined && customVal !== '') {
					const rawVal = await parseVar(self, customVal)
					// Try to map label to ID if it's a dropdown option
					const targetOption = targetAction.options.find((o) => ['val', 'dir', 'direction', 'mode'].includes(o.id))
					if (targetOption && targetOption.choices) {
						const choice = targetOption.choices.find(
							(c) =>
								c.label.toLowerCase() === rawVal.toLowerCase() ||
								c.id.toString().toLowerCase() === rawVal.toLowerCase(),
						)
						if (choice) {
							mappedValue = choice.id
						} else {
							mappedValue = rawVal
						}
					} else {
						mappedValue = rawVal
					}
				} else {
					switch (targetActionName) {
						case 'panRotate':
							mappedValue = dir === 'up' ? 'right' : dir === 'down' ? 'left' : dir
							break
						case 'tiltRotate':
							mappedValue = dir === 'up' ? 'up' : dir === 'down' ? 'down' : dir
							break
						case 'zoomRotate':
							mappedValue = dir === 'up' ? 'in' : dir === 'down' ? 'out' : dir
							break
						case 'focusRotate':
							mappedValue = dir === 'up' ? 'far' : dir === 'down' ? 'near' : dir
							break
						case 'presetSelectorSet':
							mappedValue = dir === 'up' ? 'inc' : dir === 'down' ? 'dec' : dir
							break
						case 'wbCycle':
						case 'focusRegion':
						case 'focusSensitivity':
							mappedValue = dir === 'up' ? 'next' : dir === 'down' ? 'prev' : dir
							break
						case 'imageContrastSet':
						case 'imageSharpnessSet':
						case 'imageSaturationSet':
						case 'imageLuminanceSet':
						case 'imageHueSet':
						case 'imageGammaSet':
							mappedValue = dir === 'up' ? 'up' : dir === 'down' ? 'down' : dir
							break
					}
				}

				self.log('debug', `Context Rotary: Slot ${slot}, Action: ${targetActionName}, Value: ${mappedValue}`)

				if (targetActionName === 'expCompSet') {
					if (dir === 'up' || dir === 'down') {
						const actualActionName = dir === 'up' ? 'expCompUp' : 'expCompDown'
						const actualAction = actions[actualActionName]
						if (actualAction) await actualAction.callback({ options: {} })
					}
				} else {
					const options = {}
					if (targetAction.options.find((o) => o.id === 'dir')) {
						options.dir = mappedValue
					} else if (targetAction.options.find((o) => o.id === 'val')) {
						options.val = mappedValue
					} else if (targetAction.options.find((o) => o.id === 'direction')) {
						options.direction = mappedValue
						options.behavior = 'apply'
					} else if (targetAction.options.find((o) => o.id === 'mode')) {
						options.mode = mappedValue
					}
					await targetAction.callback({ options })
				}
			},
		},
		smartExecute: {
			name: 'Smart Action: Execute Dynamically',
			options: [
				{
					type: 'dropdown',
					label: 'Select Action',
					id: 'actionChoice',
					choices: [
						{ id: 'custom', label: 'Custom / Variable' },
						...Object.entries(all)
							.map(([id, action]) => ({ id, label: action.name }))
							.sort((a, b) => a.label.localeCompare(b.label)),
					],
					default: 'custom',
				},
				{
					type: 'textinput',
					label: 'Action ID (if Custom)',
					id: 'actionId',
					useVariables: true,
					isVisibleExpression: 'options.actionChoice === "custom"',
					tooltip: 'e.g. zoomI, home, preset_recall',
				},
				{
					type: 'textinput',
					label: 'Options (JSON)',
					id: 'optionsJson',
					useVariables: true,
					default: '{}',
					tooltip: 'Parameters for the target action, e.g. {"val": 1}',
				},
			],
			callback: async (event) => {
				let targetId = event.options.actionChoice
				if (targetId === 'custom') {
					targetId = await parseVar(self, event.options.actionId)
				}

				if (!targetId || targetId === 'smartExecute') return

				let targetOptions = {}
				try {
					const jsonStr = await parseVar(self, event.options.optionsJson)
					targetOptions = JSON.parse(jsonStr || '{}')
				} catch (e) {
					self.log('error', `Smart Action: Invalid JSON: ${e.message}`)
					return
				}

				const actions = all // filterByModel is done later
				const targetAction = actions[targetId]
				if (targetAction && typeof targetAction.callback === 'function') {
					await targetAction.callback({ options: targetOptions })
				} else {
					self.log('warn', `Smart Action: Action "${targetId}" not found.`)
				}
			},
		},
		showOverlay: {
			name: 'Show Overlay: Toggle/Set',
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'val',
					choices: [
						{ id: '1', label: 'On' },
						{ id: '0', label: 'Off' },
						{ id: 'toggle', label: 'Toggle' },
					],
					default: 'toggle',
				},
			],
			callback: async (event) => {
				if (event.options.val === 'toggle') {
					self.state.show_overlay = !self.state.show_overlay
				} else {
					self.state.show_overlay = event.options.val === '1'
				}
				self.updateVariables()
			},
		},
	}
}
// </premium>
