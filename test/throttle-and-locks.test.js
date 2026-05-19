/**
 * @file Behaviour tests for throttleAction and the inquiry-lock side-effects
 * it produces. Uses the same stub style as visca-wire.test.js — no SDK, no
 * sockets, just direct calls against the exported helper.
 *
 * Note: the inquiry-removal threshold inside Visca.#recordInquiryResult is
 * private and cannot be driven without instantiating the full Visca class
 * with a working udpSocket. That coverage stays as a follow-up and lives
 * with the integration-test layer rather than this unit suite.
 */

import { throttleAction } from '../src/actions/utils.js'

function makeStub() {
	return {
		inquiryLocks: {},
		lastActionTime: {},
	}
}

describe('throttleAction', () => {
	test('first call returns true and records lastActionTime', () => {
		const self = makeStub()
		const t0 = Date.now()
		expect(throttleAction(self, 'iris', 100, 'irisPosition')).toBe(true)
		expect(self.lastActionTime.iris).toBeGreaterThanOrEqual(t0)
	})

	test('second call within throttle window returns false', () => {
		const self = makeStub()
		expect(throttleAction(self, 'iris', 1000, 'irisPosition')).toBe(true)
		expect(throttleAction(self, 'iris', 1000, 'irisPosition')).toBe(false)
	})

	test('different id is not blocked by previous call', () => {
		const self = makeStub()
		throttleAction(self, 'iris', 1000, 'irisPosition')
		expect(throttleAction(self, 'shutter', 1000, 'shutterSpeed')).toBe(true)
	})

	test('default lockDuration sets inquiryLocks ~1000ms in future', () => {
		const self = makeStub()
		const t0 = Date.now()
		throttleAction(self, 'iris', 0, 'irisPosition')
		expect(self.inquiryLocks.irisPosition).toBeGreaterThanOrEqual(t0 + 999)
		expect(self.inquiryLocks.irisPosition).toBeLessThanOrEqual(Date.now() + 1001)
	})

	test('custom lockDuration is honoured', () => {
		const self = makeStub()
		const t0 = Date.now()
		throttleAction(self, 'iris', 0, 'irisPosition', 2500)
		expect(self.inquiryLocks.irisPosition).toBeGreaterThanOrEqual(t0 + 2499)
	})

	test('lockDuration=0 disables the inquiry lock', () => {
		const self = makeStub()
		throttleAction(self, 'iris', 0, 'irisPosition', 0)
		expect(self.inquiryLocks.irisPosition).toBeUndefined()
	})

	test('variables can be an array — locks all entries', () => {
		const self = makeStub()
		throttleAction(self, 'snapshot', 0, ['contrast', 'sharpness', 'saturation'], 1500)
		expect(self.inquiryLocks.contrast).toBeDefined()
		expect(self.inquiryLocks.sharpness).toBeDefined()
		expect(self.inquiryLocks.saturation).toBeDefined()
	})

	test('initialises inquiryLocks if missing on self', () => {
		const self = { lastActionTime: {} } // no inquiryLocks
		expect(throttleAction(self, 'iris', 0, 'irisPosition')).toBe(true)
		expect(self.inquiryLocks).toBeDefined()
		expect(self.inquiryLocks.irisPosition).toBeGreaterThan(0)
	})

	test('initialises lastActionTime if missing on self', () => {
		const self = { inquiryLocks: {} } // no lastActionTime
		expect(throttleAction(self, 'iris', 0, 'irisPosition')).toBe(true)
		expect(self.lastActionTime).toBeDefined()
		expect(self.lastActionTime.iris).toBeGreaterThan(0)
	})

	test('successive calls past the throttle window pass again', async () => {
		const self = makeStub()
		throttleAction(self, 'iris', 30, 'irisPosition')
		await new Promise((r) => setTimeout(r, 40))
		expect(throttleAction(self, 'iris', 30, 'irisPosition')).toBe(true)
	})
})
