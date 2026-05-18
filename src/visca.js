/**
 * @file Manages VISCA over IP (UDP) communication, handles raw byte framing, queueing, and parsing camera responses.
 */

import { InstanceStatus } from '@companion-module/base'

const COMMAND = 'command'
const CONTROL = 'control'
const INQUIRY = 'inquiry'

const TIMEOUT_MS = 300
const COMMAND_PRIORITY_TIMEOUT_MS = 150 // How long to wait for an inquiry before a command can preempt it
const COMMAND_TIMEOUT_MS = 30000 // 30 seconds for physical movements completion
const POLL_DELAY_FAST = 100 // 100ms between inquiries when idle
const POLL_DELAY_SLOW = 500 // 500ms between inquiries when commands are pending

export class Visca {
	#instance
	#packetCounter = 0
	#cts = true
	#queue = []
	#activePackets = {}
	#pendingSeq = null
	#inquiryCallbacks = {}
	#inquiryKeys = []
	#nextInquiry = 0
	#pollTimer = null
	#consecutiveTimeouts = 0
	#totalSuccesses = 0
	#inquiryTelemetry = {}
	#lowPriorityCallbacks = {}
	#lowPriorityKeys = []
	#nextLowPriority = 0
	#backgroundKeys = []
	#nextBackground = 0
	#backgroundTimer = null
	#pollingPaused = false
	#inquiryFilter = null
	#lowPriorityInquiryCounter = 0

	constructor(instance) {
		this.#instance = instance
	}

	get command() {
		return COMMAND
	}
	get control() {
		return CONTROL
	}
	get inquiry() {
		return INQUIRY
	}

	/**
	 * Queues a VISCA packet to be sent to the camera.
	 * Handles deduplication and preemption logic (prioritizing commands over running inquiries).
	 *
	 * @param {Buffer} payload - The raw VISCA bytes
	 * @param {string} type - COMMAND, CONTROL, or INQUIRY
	 * @param {Function} callback - Optional callback on completion
	 * @param {string} inquiryKey - Identifier for mapping inquiry responses
	 * @param {boolean} highPriority - If true, places packet at the front of the queue
	 * @param {string} deduplicationKey - Key to overwrite redundant pending packets
	 */
	send(payload, type = COMMAND, callback = null, inquiryKey = null, highPriority = false, deduplicationKey = null) {
		const packet = { payload, type, callback, inquiryKey, deduplicationKey }

		if (deduplicationKey) {
			const existingIdx = this.#queue.findIndex((p) => p.deduplicationKey === deduplicationKey)
			if (existingIdx !== -1) {
				// Replace existing packet in queue to maintain position but update payload
				this.#queue[existingIdx] = packet
				return
			}
		}

		if (!this.#cts) {
			// Check if we can preempt the current pending packet
			const pendingAp = this.#activePackets[this.#pendingSeq]
			if (pendingAp && pendingAp.type === INQUIRY && (type === COMMAND || type === CONTROL)) {
				const elapsed = Date.now() - pendingAp.sentAt
				if (elapsed > COMMAND_PRIORITY_TIMEOUT_MS) {
					this.#instance.log('debug', `Preempting inquiry seq=${this.#pendingSeq} for higher priority command`)
					if (highPriority) {
						this.#queue.unshift(packet)
					} else {
						this.#queue.push(packet)
					}
					this.#handleTimeout(this.#pendingSeq)
					return
				}
			}
		}

		if (this.#cts) {
			this.#sendPacket(packet)
		} else {
			if (highPriority) {
				this.#queue.unshift(packet)
			} else {
				this.#queue.push(packet)
			}
		}
	}

	/**
	 * Parses raw incoming VISCA responses (ACK, Completion, Errors)
	 * and matches them to active packets based on sequence numbers.
	 * @param {Buffer|Uint8Array} msg - The incoming bytes from the network
	 */
	handleResponse(msg) {
		try {
			// SharedUdpSocket IPC delivers Uint8Array, not Buffer
			if (!Buffer.isBuffer(msg)) {
				if (msg instanceof Uint8Array) {
					msg = Buffer.from(msg)
				} else {
					return
				}
			}

			let payload
			let seq

			payload = msg
			if (!payload || payload.length < 2) return
			if ((payload[0] & 0x80) === 0) return // Not a VISCA response (should start with y0)

			const isMsgInquiry = payload[1] === 0x50 && payload.length > 2
			const isMsgAck = (payload[1] & 0xf0) === 0x40
			const isMsgCompletion = (payload[1] & 0xf0) === 0x50 && payload[1] !== 0x50
			const isMsgError = (payload[1] & 0xf0) === 0x60

			// In raw mode we don't have sequence numbers.
			// We match against active packets that match the response type.
			// For inquiries and completions, we prefer the oldest active packet (ascending sort).
			// For errors, we match the latest active packet (descending sort).
			const activeSeqs = Object.keys(this.#activePackets).sort((a, b) => a - b)
			seq = null

			if (isMsgError) {
				// Errors usually apply to the most recently sent command
				const latestSeqs = [...activeSeqs].reverse()
				for (const sStr of latestSeqs) {
					seq = parseInt(sStr)
					break
				}
			} else {
				for (const sStr of activeSeqs) {
					const s = parseInt(sStr)
					const ap = this.#activePackets[s]
					if (!ap) continue

					if (isMsgInquiry && ap.type === INQUIRY) {
						seq = s
						break
					}
					if ((isMsgAck || isMsgCompletion) && (ap.type === COMMAND || ap.type === CONTROL)) {
						seq = s
						break
					}
				}
			}

			// Log errors
			if (isMsgError && payload.length >= 3) {
				const ap = seq ? this.#activePackets[seq] : null
				this.#logError(payload, ap?.inquiryKey)
			}

			if (!seq) {
				this.#instance.log('debug', `UDP received (no match): ${this.msgToString(msg, false)}`)
				return
			}
			const ap = this.#activePackets[seq]
			if (!ap) return

			const isInitialResponse = seq === this.#pendingSeq
			const responseType = payload[1] >> 4

			if (responseType === 4) {
				// ACK — command accepted into a buffer slot
				clearTimeout(ap.timer)
				ap.timer = setTimeout(() => this.#handleTimeout(seq), COMMAND_TIMEOUT_MS)

				this.#onSuccessfulResponse()
				if (isInitialResponse) {
					this.#pendingSeq = null
					this.#drainOrIdle()
				}
				return
			}

			if (payload[1] === 0x50 && payload.length > 2) {
				// Inquiry response: y0 50 <data...> FF
				clearTimeout(ap.timer)
				delete this.#activePackets[seq]
				if (ap.inquiryKey) {
					this.#recordInquiryResult(ap.inquiryKey, true)
				}
				if (ap.callback) {
					try {
						ap.callback(payload)
					} catch (e) {
						this.#instance.log('warn', `Inquiry callback error: ${e.message}`)
					}
				}
				this.#onSuccessfulResponse()
				if (isInitialResponse) {
					this.#pendingSeq = null
					this.#drainOrIdle()
				}
				return
			}

			if (responseType === 5) {
				// Completion: y0 5x FF
				clearTimeout(ap.timer)
				delete this.#activePackets[seq]
				if (ap.callback) {
					try {
						ap.callback(payload)
					} catch (e) {
						this.#instance.log('warn', `Completion callback error: ${e.message}`)
					}
				}
				this.#onSuccessfulResponse()
				if (isInitialResponse) {
					this.#pendingSeq = null
					this.#drainOrIdle()
				}

				// Process queue immediately on completion instead of waiting for timer
				this.#schedulePoll()
				return
			}

			if (responseType === 6) {
				// Error response: y0 6x <err> FF
				clearTimeout(ap.timer)
				delete this.#activePackets[seq]
				if (ap.inquiryKey) {
					this.#recordInquiryResult(ap.inquiryKey, false)
				}
				this.#onSuccessfulResponse()
				if (isInitialResponse) {
					this.#pendingSeq = null
					this.#drainOrIdle()
				}
				return
			}
		} catch (e) {
			this.#instance.log('error', `Module: Error in VISCA response handler: ${e.message}`)
			// Attempt to recover polling if possible
			if (this.#pendingSeq) {
				this.#handleTimeout(this.#pendingSeq)
			} else {
				this.#drainOrIdle()
			}
		}
	}

	initializeInquiries(inquiryCallbacks) {
		this.#inquiryCallbacks = {}
		this.#inquiryKeys = []
		this.#inquiryTelemetry = {}
		for (const [key, callback] of Object.entries(inquiryCallbacks)) {
			this.#inquiryKeys.push(key)
			this.#inquiryCallbacks[key] = callback
		}
		this.#nextInquiry = 0
	}

	initializeLowPriorityInquiries(callbacks) {
		this.#lowPriorityCallbacks = callbacks
		this.#lowPriorityKeys = Object.keys(callbacks)
	}

	demoteInquiry(key) {
		const idx = this.#inquiryKeys.indexOf(key)
		if (idx !== -1) {
			this.#inquiryKeys.splice(idx, 1)
			if (!this.#lowPriorityKeys.includes(key)) {
				this.#lowPriorityKeys.push(key)
			}
			if (this.#inquiryCallbacks[key]) {
				this.#lowPriorityCallbacks[key] = this.#inquiryCallbacks[key]
				delete this.#inquiryCallbacks[key]
			}
		}
	}

	initializeBackgroundInquiries(keys) {
		this.#backgroundKeys = keys
		this.#nextBackground = 0
		this.#scheduleBackgroundPoll()
	}

	#scheduleBackgroundPoll() {
		if (this.#backgroundTimer) clearTimeout(this.#backgroundTimer)
		if (this.#backgroundKeys.length === 0 || this.#pollingPaused) return

		this.#backgroundTimer = setTimeout(() => this.#sendNextBackgroundInquiry(), 5000)
	}

	#sendNextBackgroundInquiry() {
		this.#backgroundTimer = null
		if (this.#pollingPaused || this.#backgroundKeys.length === 0) return

		if (this.#nextBackground >= this.#backgroundKeys.length) {
			this.#nextBackground = 0
		}

		const key = this.#backgroundKeys[this.#nextBackground++]
		if (!this.#inquiryFilter || this.#inquiryFilter(key)) {
			this.sendInquiry(key)
		}

		this.#scheduleBackgroundPoll()
	}

	setInquiryFilter(filterFn) {
		this.#inquiryFilter = filterFn
	}

	setPollingPaused(paused) {
		this.#pollingPaused = paused
		if (paused) {
			if (this.#pollTimer) {
				clearTimeout(this.#pollTimer)
				this.#pollTimer = null
			}
			if (this.#backgroundTimer) {
				clearTimeout(this.#backgroundTimer)
				this.#backgroundTimer = null
			}
		} else {
			if (!this.#pollTimer) {
				this.#schedulePoll()
			}
			if (!this.#backgroundTimer) {
				this.#scheduleBackgroundPoll()
			}
		}
	}

	refreshAllInquiries() {
		// Fire all low-priority inquiries once for immediate state (respecting filter).
		for (const key of this.#lowPriorityKeys) {
			if (!this.#inquiryFilter || this.#inquiryFilter(key)) {
				this.sendLowPriorityInquiry(key)
			}
		}
		// Also fire all high-priority inquiries once to be sure
		for (const key of this.#inquiryKeys) {
			if (!this.#inquiryFilter || this.#inquiryFilter(key)) {
				this.sendInquiry(key)
			}
		}
	}

	sendLowPriorityInquiry(key) {
		if (this.#inquiryFilter && !this.#inquiryFilter(key)) return
		const callback = this.#lowPriorityCallbacks[key]
		if (!callback) return
		const camId = parseInt(this.#instance.state.viscaId)
		const keyBytes = Buffer.from(key, 'hex')
		const payload = Buffer.alloc(keyBytes.length + 2)
		payload[0] = camId
		keyBytes.copy(payload, 1)
		payload[payload.length - 1] = 0xff
		this.send(payload, INQUIRY, callback, key)
	}

	sendInquiry(key, highPriority = false) {
		const callback = this.#inquiryCallbacks[key] || this.#lowPriorityCallbacks[key]
		if (!callback) return

		const camId = parseInt(this.#instance.state.viscaId)
		const keyBytes = Buffer.from(key, 'hex')
		const payload = Buffer.alloc(keyBytes.length + 2)
		payload[0] = camId
		keyBytes.copy(payload, 1)
		payload[payload.length - 1] = 0xff

		// If high priority, try to remove any existing inquiry for this key from the queue first
		if (highPriority) {
			this.#queue = this.#queue.filter((p) => p.inquiryKey !== key)
		}

		this.send(payload, INQUIRY, callback, key, highPriority)
	}

	stopPolling() {
		if (this.#pollTimer) {
			clearTimeout(this.#pollTimer)
			this.#pollTimer = null
		}
		if (this.#backgroundTimer) {
			clearTimeout(this.#backgroundTimer)
			this.#backgroundTimer = null
		}
		for (const ap of Object.values(this.#activePackets)) {
			clearTimeout(ap.timer)
		}
		this.#activePackets = {}
		this.#pendingSeq = null
		this.#queue = []
		this.#cts = true
	}

	resetSequenceNumber() {
		this.stopPolling()
		this.#packetCounter = 0

		// Clear inquiry telemetry so reconnects do not inherit stale
		// success/failure counters that may still reference removed keys.
		this.#inquiryTelemetry = {}

		this.#cts = true
		this.#schedulePoll()
	}

	msgToString(msg, separateBlocks = true) {
		let s = ''
		for (let i = 0; i < msg.length; i++) {
			s += msg[i].toString(16).padStart(2, '0') + ' '
			if (separateBlocks && (i === 1 || i === 3 || i === 7 || i === 15 || i === 23)) {
				s += '| '
			}
		}
		return s.trim()
	}

	#sendPacket({ payload, type, callback, inquiryKey, deduplicationKey }) {
		if (!this.#instance.udpSocket) {
			this.#cts = true
			return
		}

		this.#cts = false
		this.#packetCounter++
		if (this.#packetCounter >= 0xffffffff) {
			this.resetSequenceNumber()
			return
		}

		const payloadBuf = Buffer.isBuffer(payload)
			? payload
			: Buffer.from(payload, typeof payload === 'string' ? 'binary' : undefined)

		const buffer = payloadBuf

		const seq = this.#packetCounter
		this.#pendingSeq = seq
		this.#activePackets[seq] = {
			payload: buffer,
			callback,
			inquiryKey,
			deduplicationKey,
			type,
			sentAt: Date.now(),
			timer: setTimeout(() => this.#handleTimeout(seq), TIMEOUT_MS),
		}

		this.#instance.log('debug', `Raw sent (seq=${seq}): ${this.msgToString(buffer, false)}`)
		const lastCmdSent = this.msgToString(buffer, false)
		this.#instance.setVariableValues({ lastCmdSent })
		this.#instance.udpSocket.send(buffer, this.#instance.viscaPort, this.#instance.viscaHost)
	}

	#drainOrIdle() {
		if (this.#queue.length > 0) {
			this.#sendPacket(this.#queue.shift())
		} else {
			this.#cts = true
			if (!this.#pollTimer) {
				this.#schedulePoll()
			}
		}
	}

	#onSuccessfulResponse() {
		const wasRecovering = this.#consecutiveTimeouts > 0
		this.#consecutiveTimeouts = 0
		this.#totalSuccesses++
		if ((wasRecovering && this.#instance.currentStatus !== InstanceStatus.Ok) || this.#totalSuccesses === 1) {
			this.#instance.updateStatus(InstanceStatus.Ok)
		}
	}

	#handleTimeout(seq) {
		const ap = this.#activePackets[seq]
		if (!ap) return
		delete this.#activePackets[seq]

		this.#instance.log('warn', `VISCA timeout for packet seq=${seq}`)
		this.#consecutiveTimeouts++

		if (this.#consecutiveTimeouts === 5) {
			this.#instance.log(
				'info',
				'Communication issues detected. If you are using a atlona camera, check if the IP and Port are correct.',
			)
		}

		if (ap.inquiryKey) {
			this.#recordInquiryResult(ap.inquiryKey, false)
		}

		if (this.#consecutiveTimeouts >= 10) {
			this.#instance.log('warn', 'Too many timeouts, resetting connection')
			this.#instance.updateStatus(InstanceStatus.ConnectionFailure)
			this.resetSequenceNumber()
			this.#consecutiveTimeouts = 0
			return
		}

		if (this.#consecutiveTimeouts >= 4) {
			this.#instance.updateStatus(InstanceStatus.UnknownWarning, 'Communication issues')
		}

		this.#pendingSeq = null
		this.#cts = true
		if (this.#queue.length > 0) {
			this.#sendPacket(this.#queue.shift())
		} else {
			this.#schedulePollWithBackoff()
		}
	}

	#schedulePoll() {
		if (this.#pollTimer) clearTimeout(this.#pollTimer)
		if (this.#pollingPaused) return
		if (this.#inquiryKeys.length > 0 || this.#lowPriorityKeys.length > 0) {
			const configDelay = parseInt(this.#instance.config?.pollingInterval) || POLL_DELAY_FAST
			const delay = this.#queue.length === 0 ? configDelay : POLL_DELAY_SLOW
			this.#pollTimer = setTimeout(() => this.#sendNextInquiry(), delay)
		}
	}

	#schedulePollWithBackoff() {
		if (this.#pollTimer) clearTimeout(this.#pollTimer)
		if (this.#pollingPaused) return
		if (this.#inquiryKeys.length === 0 && this.#lowPriorityKeys.length === 0) return
		const maxDelay = 10000
		const configDelay = parseInt(this.#instance.config?.pollingInterval) || POLL_DELAY_FAST
		const delay = Math.min(Math.max(configDelay, POLL_DELAY_SLOW) * Math.pow(2, this.#consecutiveTimeouts), maxDelay)
		this.#pollTimer = setTimeout(() => this.#sendNextInquiry(), delay)
	}

	#sendNextInquiry() {
		try {
			this.#pollTimer = null
			if (this.#pollingPaused) return
			if (!this.#cts || !this.#instance.udpSocket) return

			let key
			let isLowPriority = false

			// Every 5th inquiry, try to send a low priority one if available
			this.#lowPriorityInquiryCounter++
			if (this.#lowPriorityInquiryCounter >= 5 && this.#lowPriorityKeys.length > 0) {
				this.#lowPriorityInquiryCounter = 0
				if (this.#nextLowPriority >= this.#lowPriorityKeys.length) {
					this.#nextLowPriority = 0
				}
				key = this.#lowPriorityKeys[this.#nextLowPriority++]
				isLowPriority = true
			} else if (this.#inquiryKeys.length > 0) {
				if (this.#nextInquiry >= this.#inquiryKeys.length) {
					this.#nextInquiry = 0
				}
				key = this.#inquiryKeys[this.#nextInquiry++]
			} else if (this.#lowPriorityKeys.length > 0) {
				// Fallback: if no high priority keys, just use low priority
				if (this.#nextLowPriority >= this.#lowPriorityKeys.length) {
					this.#nextLowPriority = 0
				}
				key = this.#lowPriorityKeys[this.#nextLowPriority++]
				isLowPriority = true
			}

			if (!key) {
				if (this.#inquiryKeys.length > 0 || this.#lowPriorityKeys.length > 0) {
					this.#schedulePoll()
				}
				return
			}

			// Filter skipping
			let attempts = 1
			const list = isLowPriority ? this.#lowPriorityKeys : this.#inquiryKeys
			while (this.#inquiryFilter && !this.#inquiryFilter(key) && attempts < list.length) {
				if (isLowPriority) {
					if (this.#nextLowPriority >= this.#lowPriorityKeys.length) this.#nextLowPriority = 0
					key = this.#lowPriorityKeys[this.#nextLowPriority++]
				} else {
					if (this.#nextInquiry >= this.#inquiryKeys.length) this.#nextInquiry = 0
					key = this.#inquiryKeys[this.#nextInquiry++]
				}
				attempts++
			}

			if (this.#inquiryFilter && !this.#inquiryFilter(key)) {
				// All keys in the chosen list are currently filtered out
				this.#schedulePoll()
				return
			}

			const camId = parseInt(this.#instance.state.viscaId)
			const keyBytes = Buffer.from(key, 'hex')
			const payload = Buffer.alloc(keyBytes.length + 2)
			payload[0] = camId
			keyBytes.copy(payload, 1)
			payload[payload.length - 1] = 0xff

			const callback = isLowPriority ? this.#lowPriorityCallbacks[key] : this.#inquiryCallbacks[key]
			this.#sendPacket({ payload, type: INQUIRY, callback, inquiryKey: key })
		} catch (e) {
			this.#instance.log('error', `Module: Error in VISCA inquiry loop: ${e.message}`)
			this.#schedulePoll() // Ensure loop continues
		}
	}

	#recordInquiryResult(key, success) {
		if (!this.#inquiryTelemetry[key]) {
			this.#inquiryTelemetry[key] = { success: 0, failed: 0 }
		}
		if (success) {
			this.#inquiryTelemetry[key].success++
		} else {
			this.#inquiryTelemetry[key].failed++
		}
		const t = this.#inquiryTelemetry[key]
		if (t.failed > 5 && t.success === 0 && this.#totalSuccesses > 20) {
			// Remove from main inquiries
			const idx = this.#inquiryKeys.indexOf(key)
			if (idx !== -1) {
				this.#inquiryKeys.splice(idx, 1)
				this.#instance.log('info', `Removed unsupported inquiry block ${key}`)
			}
			// Remove from low-priority inquiries
			const lpIdx = this.#lowPriorityKeys.indexOf(key)
			if (lpIdx !== -1) {
				this.#lowPriorityKeys.splice(lpIdx, 1)
				this.#instance.log('info', `Removed unsupported low-priority inquiry ${key}`)
			}
		}
	}

	#logError(payload, inquiryKey = null) {
		if (payload.length < 3) return
		const errorCode = payload[2]
		const errors = {
			0x01: 'Message length error',
			0x02: 'Syntax error',
			0x03: 'Command buffer full',
			0x04: 'Command cancelled',
			0x05: 'No socket',
			0x41: 'Command not executable',
		}
		const errorText = errors[errorCode] ?? 'Unknown VISCA error'
		const level = inquiryKey ? 'debug' : 'warn'
		this.#instance.log(level, `VISCA error 0x${errorCode.toString(16).padStart(2, '0')}: ${errorText}`)
		this.#instance.log('debug', `VISCA error payload: ${this.msgToString(payload, false)}`)
	}
}
