/**
 * @file Shared utility functions, constants, and reusable choice lists used across multiple action definitions.
 */

import * as VISCA from '../constants.js'

export const MAX_ZOOM_SPEED = 7
export const DEFAULT_ZOOM_SPEED = 3
export const DEFAULT_PAN_SPEED = 12
export const DEFAULT_TILT_SPEED = 12

export const getPtzParams = (self) => {
	const camId = parseInt(self.state.viscaId)
	const panSpeed = self.state.panSpeed ?? DEFAULT_PAN_SPEED
	const tiltSpeed = self.state.tiltSpeed ?? DEFAULT_TILT_SPEED
	return { camId, panSpeed, tiltSpeed }
}

export const getCamId = (self) => parseInt(self.state.viscaId)

export const resetSnap = (self) => {
	delete self.state.lastSentPan
	delete self.state.lastSentTilt
}

export const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const SNAPSHOT_LOCK_KEYS = {
	exposure: [
		'exposureMode',
		'shutterSpeed',
		'irisPosition',
		'gainLevel',
		'brightPosition',
		'expComp',
		'expCompLevel',
		'backlight',
	],
	wb: ['wbMode', 'rGain', 'bGain'],
	image: ['contrast', 'sharpness', 'saturation', 'luminance', 'hue', 'gamma', 'nr2d', 'nr3d'],
}

export const applySnapshotGroup = async (self, snap, group) => {
	const camId = getCamId(self)

	// Lock inquiries for the variables this snapshot writes so background polls
	// do not race against the in-flight VISCA sends below.
	if (!self.inquiryLocks) self.inquiryLocks = {}
	const lockUntil = Date.now() + 1500
	for (const key of SNAPSHOT_LOCK_KEYS[group] || []) {
		self.inquiryLocks[key] = lockUntil
	}

	if (group === 'exposure') {
		// Exposure Mode
		if (snap.exposureMode !== undefined && snap.exposureMode !== self.state.exposureMode) {
			const expVal =
				snap.exposureMode === 'Auto'
					? VISCA.EXPOSURE_AUTO
					: snap.exposureMode === 'Manual'
						? VISCA.EXPOSURE_MANUAL
						: snap.exposureMode === 'SAE'
							? VISCA.EXPOSURE_SHUTTER_PRIO
							: snap.exposureMode === 'AAE'
								? VISCA.EXPOSURE_IRIS_PRIO
								: snap.exposureMode === 'Bright'
									? VISCA.EXPOSURE_BRIGHT
									: null
			if (expVal !== null) {
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_CAMERA,
						VISCA.CMD_EXPOSURE_MODE,
						expVal,
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.state.exposureMode = snap.exposureMode
				await wait(50)
			}
		}

		// Shutter
		if (snap.shutterSpeed !== undefined && snap.shutterSpeed !== self.state.shutterSpeed) {
			const s = snap.shutterSpeed
			self.VISCA.send(
				Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_SHUTTER_DIRECT,
					0x00,
					0x00,
					(s >> 4) & 0x0f,
					s & 0x0f,
					VISCA.VISCA_TERMINATOR,
				]),
			)
			self.state.shutterSpeed = s
			await wait(50)
		}

		// Iris
		if (snap.irisPosition !== undefined && snap.irisPosition !== self.state.irisPosition) {
			const i = snap.irisPosition
			self.VISCA.send(
				Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_IRIS_DIRECT,
					0x00,
					0x00,
					(i >> 4) & 0x0f,
					i & 0x0f,
					VISCA.VISCA_TERMINATOR,
				]),
			)
			self.state.irisPosition = i
			await wait(50)
		}

		// Gain
		if (snap.gainLevel !== undefined && snap.gainLevel !== self.state.gainLevel) {
			const g = snap.gainLevel
			self.VISCA.send(
				Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_GAIN_DIRECT,
					0x00,
					0x00,
					(g >> 4) & 0x0f,
					g & 0x0f,
					VISCA.VISCA_TERMINATOR,
				]),
			)
			self.state.gainLevel = g
			await wait(50)
		}

		// Brightness
		if (snap.brightPosition !== undefined && snap.brightPosition !== self.state.brightPosition) {
			const b = snap.brightPosition
			self.VISCA.send(
				Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_BRIGHT_DIRECT,
					0x00,
					0x00,
					(b >> 4) & 0x0f,
					b & 0x0f,
					VISCA.VISCA_TERMINATOR,
				]),
			)
			self.state.brightPosition = b
			await wait(50)
		}

		// Exp Comp
		if (snap.expComp !== undefined && snap.expComp !== self.state.expComp) {
			const ec = snap.expComp === 'On' ? VISCA.PARAM_ON : VISCA.PARAM_OFF
			self.VISCA.send(
				Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_CAMERA, VISCA.CMD_EXP_COMP_MODE, ec, VISCA.VISCA_TERMINATOR]),
			)
			self.state.expComp = snap.expComp
			await wait(50)
		}

		// Exp Comp Level
		if (snap.expCompLevel !== undefined && snap.expCompLevel !== self.state.expCompLevel) {
			const ecl = snap.expCompLevel
			self.VISCA.send(
				Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_EXP_COMP_DIRECT,
					0x00,
					0x00,
					(ecl >> 4) & 0x0f,
					ecl & 0x0f,
					VISCA.VISCA_TERMINATOR,
				]),
			)
			self.state.expCompLevel = ecl
			await wait(50)
		}

		// Backlight
		if (snap.backlight !== undefined && snap.backlight !== self.state.backlight) {
			const bl = snap.backlight === 'On' ? VISCA.PARAM_ON : VISCA.PARAM_OFF
			self.VISCA.send(
				Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_CAMERA, VISCA.CMD_BACKLIGHT, bl, VISCA.VISCA_TERMINATOR]),
			)
			self.state.backlight = snap.backlight
			await wait(50)
		}
	} else if (group === 'wb') {
		// WB Mode
		if (snap.wbMode !== undefined && snap.wbMode !== self.state.wbMode) {
			const wb = parseInt(snap.wbMode, 16)
			self.VISCA.send(
				Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_CAMERA, VISCA.CMD_WB_MODE, wb, VISCA.VISCA_TERMINATOR]),
			)
			self.state.wbMode = snap.wbMode
			await wait(50)
		}

		// R Gain
		if (snap.rGain !== undefined && snap.rGain !== self.state.rGain) {
			const rg = snap.rGain
			self.VISCA.send(
				Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_R_GAIN_DIRECT,
					0x00,
					0x00,
					(rg >> 4) & 0x0f,
					rg & 0x0f,
					VISCA.VISCA_TERMINATOR,
				]),
			)
			self.state.rGain = rg
			await wait(50)
		}

		// B Gain
		if (snap.bGain !== undefined && snap.bGain !== self.state.bGain) {
			const bg = snap.bGain
			self.VISCA.send(
				Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_B_GAIN_DIRECT,
					0x00,
					0x00,
					(bg >> 4) & 0x0f,
					bg & 0x0f,
					VISCA.VISCA_TERMINATOR,
				]),
			)
			self.state.bGain = bg
			await wait(50)
		}
	} else if (group === 'image') {
		// Atlona uses VISCA for image params
		if (snap.contrast !== undefined && snap.contrast !== self.state.contrast) {
			const c = snap.contrast
			self.VISCA.send(
				Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_CONTRAST_DIRECT,
					0x00,
					0x00,
					(c >> 4) & 0x0f,
					c & 0x0f,
					VISCA.VISCA_TERMINATOR,
				]),
			)
			await wait(50)
		}

		if (snap.sharpness !== undefined && snap.sharpness !== self.state.sharpness) {
			const sh = snap.sharpness
			self.VISCA.send(
				Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_SHARPNESS_DIRECT,
					0x00,
					0x00,
					(sh >> 4) & 0x0f,
					sh & 0x0f,
					VISCA.VISCA_TERMINATOR,
				]),
			)
			await wait(50)
		}

		if (snap.saturation !== undefined && snap.saturation !== self.state.saturation) {
			const s = snap.saturation
			self.VISCA.send(
				Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_SATURATION_DIRECT,
					0x00,
					0x00,
					0x00,
					s & 0x0f,
					VISCA.VISCA_TERMINATOR,
				]),
			)
			await wait(50)
		}

		if (snap.luminance !== undefined && snap.luminance !== self.state.luminance) {
			const l = snap.luminance
			self.VISCA.send(
				Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_LUMINANCE_DIRECT,
					0x00,
					0x00,
					(l >> 4) & 0x0f,
					l & 0x0f,
					VISCA.VISCA_TERMINATOR,
				]),
			)
			await wait(50)
		}

		if (snap.hue !== undefined && snap.hue !== self.state.hue) {
			const h = snap.hue
			self.VISCA.send(
				Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_HUE_DIRECT,
					0x00,
					0x00,
					(h >> 4) & 0x0f,
					h & 0x0f,
					VISCA.VISCA_TERMINATOR,
				]),
			)
			await wait(50)
		}

		if (snap.gamma !== undefined && snap.gamma !== self.state.gamma) {
			const g = snap.gamma
			self.VISCA.send(
				Buffer.from([
					camId,
					VISCA.MSG_COMMAND,
					VISCA.CAT_CAMERA,
					VISCA.CMD_GAMMA_DIRECT,
					g & 0x0f,
					VISCA.VISCA_TERMINATOR,
				]),
			)
			await wait(50)
		}

		// NR 2D/3D (VISCA for all models usually)
		if (snap.nr2d !== undefined && snap.nr2d !== self.state.nr2d) {
			self.VISCA.send(
				Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_CAMERA, VISCA.CMD_NR2D, snap.nr2d, VISCA.VISCA_TERMINATOR]),
			)
			self.state.nr2d = snap.nr2d
			await wait(50)
		}
		if (snap.nr3d !== undefined && snap.nr3d !== self.state.nr3d) {
			self.VISCA.send(
				Buffer.from([camId, VISCA.MSG_COMMAND, VISCA.CAT_CAMERA, VISCA.CMD_NR3D, snap.nr3d, VISCA.VISCA_TERMINATOR]),
			)
			self.state.nr3d = snap.nr3d
			await wait(50)
		}

		if (snap.contrast !== undefined) self.state.contrast = snap.contrast
		if (snap.sharpness !== undefined) self.state.sharpness = snap.sharpness
		if (snap.saturation !== undefined) self.state.saturation = snap.saturation
		if (snap.luminance !== undefined) self.state.luminance = snap.luminance
		if (snap.hue !== undefined) self.state.hue = snap.hue
		if (snap.gamma !== undefined) self.state.gamma = snap.gamma
	}
	self.updateVariables()
	self.checkAllFeedbacks()
}

export const parseVar = async (self, val) => {
	if (typeof val !== 'string' || val.indexOf('$(') === -1) return val
	try {
		if (self.parseVariablesInString) {
			return await self.parseVariablesInString(val)
		}
	} catch (e) {
		self.log('debug', 'Variable parse failed: ' + e.message)
	}
	return val
}

/**
 * Throttles an action and sets an inquiry lock.
 * @param {Object} self Instance
 * @param {string} id Unique ID for the parameter (e.g. 'iris')
 * @param {number} throttle Throttling delay in ms
 * @param {string|string[]} variables Variable name(s) to lock in inquiries
 * @param {number} lockDuration Duration of the inquiry lock in ms (default 1000, 0 to disable)
 * @returns {boolean} True if action should proceed
 */
export const throttleAction = (self, id, throttle, variables, lockDuration = 1000) => {
	const now = Date.now()
	if (!self.lastActionTime) self.lastActionTime = {}
	if (!self.inquiryLocks) self.inquiryLocks = {}

	if (self.lastActionTime[id] && now - self.lastActionTime[id] < throttle) {
		return false
	}

	self.lastActionTime[id] = now

	// Set/Refresh inquiry locks
	if (lockDuration > 0) {
		const vars = Array.isArray(variables) ? variables : [variables]
		vars.forEach((v) => {
			self.inquiryLocks[v] = now + lockDuration
		})
	}

	return true
}
