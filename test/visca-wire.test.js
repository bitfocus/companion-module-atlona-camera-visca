/**
 * @file Table-driven tests for the exact VISCA wire bytes produced by each
 * action callback. Mocks a minimal Companion instance so callbacks can run in
 * isolation and the resulting Buffer can be asserted byte-for-byte.
 *
 * Goal: catch regressions in wire-byte construction (byte order, nibble
 * packing, command IDs). Does not test queueing, timing, retries, or any
 * behaviour past the moment self.VISCA.send is called.
 */

import { jest } from '@jest/globals'
import { getChoices } from '../src/choices.js'
import { getColorActions } from '../src/actions/color.js'
import { getLensActions } from '../src/actions/lens.js'
import { getPanTiltActions } from '../src/actions/pan-tilt.js'
import { getCameraPresetActions } from '../src/actions/camera-presets.js'

function makeStub(stateOverrides = {}) {
	const sent = []
	const inquiries = []
	const logs = []

	const self = {
		state: {
			viscaId: 129,
			modelId: 'generic',
			focusMode: 'Auto',
			exposureMode: 'Auto',
			irisPosition: 0x09,
			expCompLevel: 0x07,
			expComp: 'Off',
			brightPosition: 7,
			shutterSpeed: 0x05,
			gainLevel: 10,
			rGain: 0x80,
			bGain: 0x80,
			wbMode: '00',
			wbModePreview: null,
			backlight: 'Off',
			powerStatus: 'On',
			flipHStatus: 'Off',
			flipVStatus: 'Off',
			presetSelector: 1,
			presetLastUsed: 1,
			panSpeed: 12,
			tiltSpeed: 12,
			zoomSpeed: 3,
			zoomPosition: 0,
			focusPosition: 0,
			focusSpeed: 0,
			focusStationaryCount: 0,
			onePushActive: false,
			presetSaving: false,
			contrast: 7,
			sharpness: 7,
			saturation: 7,
			luminance: 7,
			hue: 7,
			gamma: 0,
			...stateOverrides,
		},
		config: { model: 'generic' },
		inquiryLocks: {},
		lastActionTime: {},
		lastRGainSetPulse: 0,
		lastBGainSetPulse: 0,
		lastFocusSetPulse: 0,
		zoomStatus: 'Stopped',
		panStatus: 'Stopped',
		tiltStatus: 'Stopped',
		focusStatus: 'Stopped',
		zoomSmoothTimer: null,
		presetSavingResetTimer: null,
		log: (level, msg) => logs.push({ level, msg }),
		updateVariables: jest.fn(),
		checkAllFeedbacks: jest.fn(),
		setVariableValues: jest.fn(),
		parseVariablesInString: async (s) => s,
		VISCA: {
			send: (buf) => sent.push(Array.from(buf)),
			sendInquiry: (key, ...rest) => inquiries.push({ key, rest }),
			setPollingPaused: jest.fn(),
			resetSequenceNumber: jest.fn(),
			refreshAllInquiries: jest.fn(),
		},
	}

	self.choices = getChoices(self.config, self)
	return { self, sent, inquiries, logs }
}

async function runCallback(actions, actionId, options = {}) {
	const action = actions[actionId]
	if (!action) throw new Error(`unknown action: ${actionId}`)
	await action.callback({ options })
}

describe('color action wire bytes', () => {
	test('saturation direct value sends Atlona format on byte 6+7', async () => {
		const { self, sent } = makeStub()
		const actions = getColorActions(self)
		await runCallback(actions, 'imageSaturationSet', { val: '10' })
		expect(sent).toHaveLength(1)
		// Current main: [camId, 0x01, 0x04, 0x49, 0x00, 0x00, 0x00, val & 0x0f, 0xff]
		// PR fix/v1-color will update this to the two-nibble form.
		expect(sent[0]).toEqual([0x81, 0x01, 0x04, 0x49, 0x00, 0x00, 0x00, 0x0a, 0xff])
	})

	test('sharpness direct value uses the two-nibble layout', async () => {
		const { self, sent } = makeStub()
		const actions = getColorActions(self)
		await runCallback(actions, 'imageSharpnessSet', { val: '8' })
		expect(sent).toHaveLength(1)
		expect(sent[0]).toEqual([0x81, 0x01, 0x04, 0x42, 0x00, 0x00, 0x00, 0x08, 0xff])
	})

	test('contrast direct value uses the two-nibble layout', async () => {
		const { self, sent } = makeStub()
		const actions = getColorActions(self)
		await runCallback(actions, 'imageContrastSet', { val: '12' })
		expect(sent).toHaveLength(1)
		expect(sent[0]).toEqual([0x81, 0x01, 0x04, 0xa2, 0x00, 0x00, 0x00, 0x0c, 0xff])
	})

	test('wb mode apply sends the mode byte', async () => {
		const { self, sent } = makeStub()
		const actions = getColorActions(self)
		await runCallback(actions, 'wbMode', { val: '03' })
		expect(sent).toHaveLength(1)
		expect(sent[0]).toEqual([0x81, 0x01, 0x04, 0x35, 0x03, 0xff])
	})

	test('wb cycle preview only updates state, does not send', async () => {
		const { self, sent } = makeStub()
		const actions = getColorActions(self)
		await runCallback(actions, 'wbCycle', { behavior: 'preview', direction: 'next', subset: 'all' })
		expect(sent).toEqual([])
		expect(self.state.wbModePreview).not.toBeNull()
	})

	test('wb cycle confirm without preview is a no-op send', async () => {
		const { self, sent } = makeStub({ wbModePreview: null })
		const actions = getColorActions(self)
		await runCallback(actions, 'wbCycle', { behavior: 'confirm' })
		expect(sent).toEqual([])
	})
})

describe('lens action wire bytes', () => {
	test('zoom in uses CMD_ZOOM with speed in low nibble', async () => {
		const { self, sent } = makeStub({ zoomSpeed: 3 })
		const actions = getLensActions(self)
		await runCallback(actions, 'zoomI', {})
		expect(sent).toHaveLength(1)
		// Zoom In = 0x20 | speed; Zoom Out = 0x30 | speed
		expect(sent[0]).toEqual([0x81, 0x01, 0x04, 0x07, 0x23, 0xff])
	})

	test('zoom out uses CMD_ZOOM with 0x30 prefix', async () => {
		const { self, sent } = makeStub({ zoomSpeed: 5 })
		const actions = getLensActions(self)
		await runCallback(actions, 'zoomO', {})
		expect(sent).toHaveLength(1)
		expect(sent[0]).toEqual([0x81, 0x01, 0x04, 0x07, 0x35, 0xff])
	})

	test('zoom stop sends speed 0', async () => {
		const { self, sent } = makeStub()
		const actions = getLensActions(self)
		await runCallback(actions, 'zoomS', {})
		expect(sent).toHaveLength(1)
		expect(sent[0]).toEqual([0x81, 0x01, 0x04, 0x07, 0x00, 0xff])
	})
})

describe('camera-preset wire bytes', () => {
	test('preset_save sends the save-preset command with the preset number', async () => {
		const { self, sent } = makeStub()
		const actions = getCameraPresetActions(self)
		await runCallback(actions, 'preset_save', { val: '7' })
		expect(sent).toHaveLength(1)
		// Preset save: 0x01 0x04 0x3f 0x01 <num>
		expect(sent[0]).toEqual([0x81, 0x01, 0x04, 0x3f, 0x01, 0x07, 0xff])
	})

	test('preset_save clamps numbers above 254 to 254', async () => {
		const { self, sent } = makeStub()
		const actions = getCameraPresetActions(self)
		await runCallback(actions, 'preset_save', { val: '300' })
		expect(sent).toHaveLength(1)
		expect(sent[0][5]).toBe(254)
	})
})

describe('pan-tilt action smoke', () => {
	test('the pan-tilt action set loads without errors', () => {
		const { self } = makeStub()
		const actions = getPanTiltActions(self)
		expect(typeof actions).toBe('object')
		expect(Object.keys(actions).length).toBeGreaterThan(0)
	})
})
