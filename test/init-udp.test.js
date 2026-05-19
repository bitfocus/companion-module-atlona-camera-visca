/**
 * @file Unit tests for initUdp — the UDP socket lifecycle helper extracted
 * from main.js. Stubs the Companion SDK (InstanceStatus) and DNS, so the
 * reconnect path can be exercised without the SDK runtime.
 */

import { jest } from '@jest/globals'
import { initUdp } from '../src/udp.js'

const InstanceStatus = {
	Ok: 'ok',
	Disconnected: 'disconnected',
	BadConfig: 'bad_config',
	Connecting: 'connecting',
	ConnectionFailure: 'connection_failure',
}

function makeSocket() {
	const handlers = {}
	let bindCalls = 0
	const sock = {
		on: jest.fn((ev, cb) => {
			handlers[ev] = cb
		}),
		close: jest.fn((cb) => {
			if (cb) cb()
		}),
		bind: jest.fn((port, addr, cb) => {
			bindCalls++
			if (cb) cb()
		}),
		_handlers: handlers,
		_bindCalls: () => bindCalls,
	}
	return sock
}

function makeSelf({ host = '10.0.0.22', port } = {}) {
	const statusCalls = []
	const sock = makeSocket()
	return {
		config: { host, port },
		udpSocket: null,
		viscaHost: null,
		viscaPort: 1259,
		VISCA: {
			handleResponse: jest.fn(),
			resetSequenceNumber: jest.fn(),
			refreshAllInquiries: jest.fn(),
		},
		updateStatus: jest.fn((s, msg) => statusCalls.push({ s, msg })),
		createSharedUdpSocket: jest.fn(() => sock),
		_statusCalls: statusCalls,
		_lastSocket: () => sock,
	}
}

function makeDnsOk(addr = '10.0.0.22') {
	return {
		lookup: jest.fn(() => Promise.resolve({ address: addr, family: 4 })),
	}
}

function makeDnsFail(msg = 'getaddrinfo ENOTFOUND') {
	return {
		lookup: jest.fn(() => Promise.reject(new Error(msg))),
	}
}

function makeDnsHang() {
	return {
		lookup: jest.fn(() => new Promise(() => {})), // never resolves
	}
}

describe('initUdp', () => {
	test('returns BadConfig when host is missing', async () => {
		const self = makeSelf({ host: '' })
		await initUdp(self, { dns: makeDnsOk(), InstanceStatus })
		expect(self._statusCalls.map((c) => c.s)).toEqual([InstanceStatus.BadConfig])
		expect(self.createSharedUdpSocket).not.toHaveBeenCalled()
	})

	test('closes existing socket and reports Disconnected before reopening', async () => {
		const self = makeSelf()
		const oldSock = makeSocket()
		self.udpSocket = oldSock
		await initUdp(self, { dns: makeDnsOk(), InstanceStatus })
		expect(oldSock.close).toHaveBeenCalled()
		expect(self._statusCalls.map((c) => c.s)).toEqual([
			InstanceStatus.Disconnected,
			InstanceStatus.Connecting,
			InstanceStatus.Ok,
		])
	})

	test('survives close() throwing on existing socket', async () => {
		const self = makeSelf()
		const oldSock = {
			close: jest.fn(() => {
				throw new Error('socket already closed')
			}),
		}
		self.udpSocket = oldSock
		await expect(initUdp(self, { dns: makeDnsOk(), InstanceStatus })).resolves.toBeUndefined()
		expect(self._statusCalls.map((c) => c.s)).toContain(InstanceStatus.Ok)
	})

	test('uses configured port when valid, defaults to 1259 otherwise', async () => {
		const a = makeSelf({ port: '5678' })
		await initUdp(a, { dns: makeDnsOk(), InstanceStatus })
		expect(a.viscaPort).toBe(5678)

		const b = makeSelf({ port: 'nope' })
		await initUdp(b, { dns: makeDnsOk(), InstanceStatus })
		expect(b.viscaPort).toBe(1259)
	})

	test('reports ConnectionFailure when DNS rejects', async () => {
		const self = makeSelf()
		await initUdp(self, { dns: makeDnsFail('ENOTFOUND'), InstanceStatus })
		const last = self._statusCalls.at(-1)
		expect(last.s).toBe(InstanceStatus.ConnectionFailure)
		expect(last.msg).toMatch(/DNS failed/)
		expect(self.createSharedUdpSocket).not.toHaveBeenCalled()
	})

	test('reports ConnectionFailure when DNS hangs past timeout', async () => {
		jest.useFakeTimers()
		const self = makeSelf()
		const p = initUdp(self, { dns: makeDnsHang(), InstanceStatus })
		jest.advanceTimersByTime(3001)
		await p
		jest.useRealTimers()
		const last = self._statusCalls.at(-1)
		expect(last.s).toBe(InstanceStatus.ConnectionFailure)
		expect(last.msg).toMatch(/timed out/)
	})

	test('stores resolved address as viscaHost', async () => {
		const self = makeSelf({ host: 'cam.example.com' })
		await initUdp(self, { dns: makeDnsOk('192.168.1.50'), InstanceStatus })
		expect(self.viscaHost).toBe('192.168.1.50')
	})

	test('binds socket and reports Ok with sequence reset + inquiry refresh', async () => {
		const self = makeSelf()
		await initUdp(self, { dns: makeDnsOk(), InstanceStatus })
		const sock = self._lastSocket()
		expect(sock._bindCalls()).toBe(1)
		expect(sock.bind).toHaveBeenCalledWith(1259, '', expect.any(Function))
		expect(self._statusCalls.at(-1).s).toBe(InstanceStatus.Ok)
		expect(self.VISCA.resetSequenceNumber).toHaveBeenCalled()
		expect(self.VISCA.refreshAllInquiries).toHaveBeenCalled()
	})

	test('socket error handler reports ConnectionFailure and clears udpSocket', async () => {
		const self = makeSelf()
		await initUdp(self, { dns: makeDnsOk(), InstanceStatus })
		const sock = self._lastSocket()
		sock._handlers.error(new Error('EADDRINUSE'))
		expect(self._statusCalls.at(-1)).toEqual({ s: InstanceStatus.ConnectionFailure, msg: 'EADDRINUSE' })
		expect(sock.close).toHaveBeenCalled()
		expect(self.udpSocket).toBeNull()
	})

	test('msgHandler forwards only datagrams from the resolved camera host', async () => {
		const self = makeSelf()
		await initUdp(self, { dns: makeDnsOk('10.0.0.22'), InstanceStatus })
		const msgHandler = self.createSharedUdpSocket.mock.calls[0][1]
		const buf = Buffer.from([0x90, 0x41, 0xff])
		msgHandler(buf, { address: '10.0.0.22' })
		msgHandler(buf, { address: '10.0.0.99' })
		expect(self.VISCA.handleResponse).toHaveBeenCalledTimes(1)
		expect(self.VISCA.handleResponse).toHaveBeenCalledWith(buf)
	})
})
