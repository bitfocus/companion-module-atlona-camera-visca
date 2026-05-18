/**
 * @file Centralizes feature flags and capabilities per camera model to selectively show/hide actions.
 */

// Protocol families — models sharing a protocol specification
const FAMILY_ATLONA = new Set(['at-hdvs', 'generic'])

// --- Capability sets ---

// All real camera models
export const CAP_ALL_CAMERAS = new Set([...FAMILY_ATLONA])

// One-push trigger capabilities (WB/AF)
export const CAP_ONE_PUSH = new Set([...FAMILY_ATLONA])

/**
 * Filter definitions by model ID.
 */
export function filterByModel(definitions, modelId) {
	const filtered = {}
	for (const [key, def] of Object.entries(definitions)) {
		if (!def.models || def.models.has(modelId)) {
			filtered[key] = def
		}
	}
	return filtered
}
