/**
 * @file UDP socket lifecycle for the VISCA connection. Extracted from main.js
 * into a standalone helper so the reconnect path can be exercised in unit
 * tests without spinning up the full Companion SDK.
 *
 * The helper takes the instance (`self`) and a dependency bag so DNS lookups,
 * socket creation, and InstanceStatus values can be replaced by stubs in tests.
 */

const DNS_TIMEOUT_MS = 3000

export async function initUdp(self, deps) {
	const { dns, InstanceStatus } = deps

	if (self.udpSocket) {
		await new Promise((resolve) => {
			try {
				self.udpSocket.close(resolve)
			} catch {
				resolve()
			}
		})
		self.udpSocket = null
		self.updateStatus(InstanceStatus.Disconnected)
	}

	if (!self.config.host) {
		self.updateStatus(InstanceStatus.BadConfig)
		return
	}

	self.updateStatus(InstanceStatus.Connecting)
	self.viscaPort = parseInt(self.config.port) || 1259

	try {
		const lookupPromise = dns.lookup(self.config.host, { family: 4 })
		const timeoutPromise = new Promise((_, reject) =>
			setTimeout(() => reject(new Error(`DNS lookup timed out after ${DNS_TIMEOUT_MS / 1000}s`)), DNS_TIMEOUT_MS),
		)
		const { address } = await Promise.race([lookupPromise, timeoutPromise])
		self.viscaHost = address
	} catch (err) {
		self.updateStatus(InstanceStatus.ConnectionFailure, `DNS failed: ${err.message}`)
		return
	}

	const msgHandler = (msg, rinfo) => {
		if (rinfo.address === self.viscaHost) {
			self.VISCA.handleResponse(msg)
		}
	}

	self.udpSocket = self.createSharedUdpSocket('udp4', msgHandler)

	self.udpSocket.on('error', (err) => {
		self.updateStatus(InstanceStatus.ConnectionFailure, err.message)
		try {
			self.udpSocket?.close()
		} catch {
			// already closed or never opened — ignore
		}
		self.udpSocket = null
	})

	self.udpSocket.bind(self.viscaPort, '', () => {
		self.updateStatus(InstanceStatus.Ok)
		self.VISCA.resetSequenceNumber()
		self.VISCA.refreshAllInquiries()
	})
}
