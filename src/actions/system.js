/**
 * @file Provides action definitions for system-level settings like Power, Video Format, and Image Flip.
 */

import * as VISCA from '../constants.js'
import { getCamId } from './utils.js'

export function getSystemActions(self) {
	const CHOICES = self.choices
	return {
		systemPowerToggle: {
			name: 'System Power Toggle',
			options: [],
			callback: async () => {
				const camId = getCamId(self)
				const val = self.state.powerStatus === 'On' ? '3' : '2'
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_CAMERA,
						VISCA.CMD_POWER,
						parseInt(val),
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.state.powerStatus = val === '2' ? 'On' : 'Off'
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_POWER)
			},
		},
		powerSet: {
			name: 'Power (On/Off/Toggle)',
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'val',
					choices: [
						{ id: '2', label: 'On' },
						{ id: '3', label: 'Off' },
						{ id: 'toggle', label: 'Toggle' },
					],
					default: '2',
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				let val = event.options.val
				if (val === 'toggle') val = self.state.powerStatus === 'On' ? '3' : '2'
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_CAMERA,
						VISCA.CMD_POWER,
						parseInt(val),
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.state.powerStatus = val === '2' ? 'On' : 'Off'
				self.updateVariables()
				self.checkAllFeedbacks()
				self.VISCA.sendInquiry(VISCA.INQ_POWER)
			},
		},
		flipH: {
			name: 'Flip Horizontal (On/Off/Toggle)',
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'val',
					choices: [
						{ id: '2', label: 'On' },
						{ id: '3', label: 'Off' },
						{ id: 'toggle', label: 'Toggle' },
					],
					default: '2',
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				let val = event.options.val
				if (val === 'toggle') val = self.state.flipHStatus === 'On' ? '3' : '2'
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_CAMERA,
						VISCA.CMD_MIRROR,
						parseInt(val),
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.state.flipHStatus = val === '2' ? 'On' : 'Off'
				self.updateVariables()
				self.checkAllFeedbacks()
			},
		},
		flipV: {
			name: 'Flip Vertical (On/Off/Toggle)',
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'val',
					choices: [
						{ id: '2', label: 'On' },
						{ id: '3', label: 'Off' },
						{ id: 'toggle', label: 'Toggle' },
					],
					default: '2',
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				let val = event.options.val
				if (val === 'toggle') val = self.state.flipVStatus === 'On' ? '3' : '2'
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_CAMERA,
						VISCA.CMD_FLIP,
						parseInt(val),
						VISCA.VISCA_TERMINATOR,
					]),
				)
				self.state.flipVStatus = val === '2' ? 'On' : 'Off'
				self.updateVariables()
				self.checkAllFeedbacks()
			},
		},
		videoSystemSet: {
			name: 'Set Video System (Format)',
			options: [
				{
					type: 'dropdown',
					label: 'Format',
					id: 'val',
					choices: CHOICES.VIDEO_FORMAT,
					default: '0',
				},
			],
			callback: async (event) => {
				const camId = getCamId(self)
				const val = parseInt(event.options.val, 16)
				self.VISCA.send(
					Buffer.from([
						camId,
						VISCA.MSG_COMMAND,
						VISCA.CAT_PAN_TILT,
						VISCA.CMD_VIDEO_SYSTEM,
						0x00,
						val,
						VISCA.VISCA_TERMINATOR,
					]),
				)
			},
		},
	}
}
