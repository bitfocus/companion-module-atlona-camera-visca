/**
 * @file Shared validation helper functions for presets to check required actions and feedbacks.
 */

export function presetFeedbacksAvailable(preset, availableFeedbackIds) {
	if (!availableFeedbackIds || !preset.feedbacks) return true
	for (const feedback of preset.feedbacks) {
		if (feedback.feedbackId && !availableFeedbackIds.has(feedback.feedbackId)) return false
	}
	return true
}

export function presetActionsAvailable(preset, availableActionIds) {
	if (!preset.steps) return true
	for (const step of preset.steps) {
		for (const [key, value] of Object.entries(step)) {
			if (key === 'down' || key === 'up' || key === 'rotate_left' || key === 'rotate_right') {
				if (Array.isArray(value)) {
					for (const action of value) {
						if (action.actionId && !availableActionIds.has(action.actionId)) return false
					}
				}
			} else if (typeof key === 'string' && /^\d+$/.test(key)) {
				const actions = Array.isArray(value) ? value : value?.actions
				if (Array.isArray(actions)) {
					for (const action of actions) {
						if (action.actionId && !availableActionIds.has(action.actionId)) return false
					}
				}
			}
		}
	}
	return true
}
