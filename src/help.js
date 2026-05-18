import * as fs from 'fs'
import * as actions from '../src/actions.js'
import * as presets from '../src/presets.js'
import * as variables from '../src/variables.js'

// This script is run by 'yarn docs' to generate the 'companion/HELP.md' file based on the definitions in the module.

let markdown =
	'# Atlona PTZ VISCA\n' +
	'\n' +
	'This module controls Atlona PTZ cameras (e.g., K20UH) using the VISCA over IP protocol.\n' +
	'\n' +
	'**Please Note**: Not all commands may be supported by all Atlona models.\n' +
	'\n' +
	'## Configuration\n' +
	'\n' +
	'- Type in the IP address of the device.\n' +
	'- Type in the port of the device (default is 1259)\n' +
	'- You can also specify the Camera ID (default: 1)\n' +
	'\n' +
	'## Enabling VISCA over IP on your camera\n' +
	'\n' +
	'Please refer to the manual for your camera for specific instructions on how to enable VISCA over IP.\n' +
	'\n' +
	'## Smart-Features in this module\n' +
	'\n' +
	'This module goes beyond simple static commands to offer “Smart Actions”. These actions track the internal state of the camera (such as Exposure Mode, PTZ speed, and White Balance mode) and adapt their behavior intelligently to the current context or how you interact with them.\n' +
	'\n' +
	'### Smart Rotary Actions\n' +
	'\n' +
	'Especially when using controllers with encoders (like the Stream Deck +), the following smart actions provide a highly improved workflow:\n' +
	'\n' +
	'- **Smart Exposure Rotary (Context Aware):**\n' +
	'  The function of this rotary automatically adapts to your active exposure mode.\n' +
	'  - In Auto mode, it adjusts Exposure Compensation.\n' +
	'  - In Manual mode, it adjusts Gain.\n' +
	'  - In SAE (Shutter Priority), it adjusts Shutter Speed.\n' +
	'  - In AAE (Iris Priority), it adjusts Iris.\n' +
	'  - In Bright mode, it adjusts Brightness.\n' +
	'  This means you only need *one* rotary on your Stream Deck to control the most relevant exposure parameter at any time.\n' +
	'- **Pan, Tilt, Zoom & Focus Rotaries:**\n' +
	'  These rotaries feature dynamic speed scaling. As long as you keep turning the dial in the same direction, the movement speed gradually increases to allow for fast sweeps. If you reverse the direction, the movement stops immediately to prevent accidental overshoots and allow for precise framing.\n' +
	'- **Dynamic Focus (Up/Down):**\n' +
	'  Features intelligent acceleration based on turn speed. Fast turns result in large focus steps to quickly reach the general focus plane, while slow turns allow for highly precise fine-tuning.\n' +
	'- **White Balance Cycle (Preview):**\n' +
	'  Allows you to step through white balance modes and preview the mode name before confirming and applying the change.\n' +
	'// <premium>\n' +
	'- **Contextual Rotary Action:**\n' +
	'  Allows you to define multi-purpose rotary slots that change their behavior dynamically based on camera state. For example, a single rotary can control Focus when in Manual mode, but switch to Zoom when in Auto mode. These actions now also support **Press** and **Release** events in addition to turning.\n' +
	'- **Snapshot Presets (Parameter Emulation):**\n' +
	'  This feature allows you to save and recall more than just the camera position. When enabled, it captures Exposure, White Balance, and Image settings locally in the module.\n' +
	'  - If **Enable Parameter Snapshots in Presets** is enabled in the configuration:\n' +
	'    - **Saving a Preset:** Always stores a full snapshot of current Exposure, WB, and Image parameters locally.\n' +
	'    - **Recalling a Preset:** The “Recall Preset” action now features checkboxes to selectively decide which parameter groups to restore (Position, Exposure, White Balance, Image).\n' +
	'    - **Recall Delay:** You can specify a delay (default 200ms) for sending the additional parameters after the initial position recall.\n' +
	'// </premium>\n' +
	'- **Image Calibration (Press to Reset):**\n' +
	'  All Image Parameter buttons (Labels, Rotaries, and Standard Adjustments) support a quick-calibration feature. A simple **Press** on these buttons immediately sets the image to a optimized “Sweet Spot” configuration.\n' +
	'\n' +
	'### Polling & Feedback\n' +
	'\n' +
	'The module automatically tracks changes made outside of Companion (e.g., via IR Remote):\n' +
	'\n' +
	'- **VISCA Parameters** (Iris, Shutter, Gain, WB): Updated every ~2 seconds.\n' +
	'- **PTZ Positions**: Updated every ~200ms (High Priority).\n' +
	'// <premium>\n' +
	'\n' +
	'### Smart Tagging Workflow\n' +
	'\n' +
	'With Companion 4.3 or newer, you can use our advanced “Smart Tagging” presets to dynamically name your presets without creating a huge mess of custom variables.\n' +
	'\n' +
	'**How to use:**\n' +
	'\n' +
	'1. In the Atlona module configuration, set the **“Smart Tagging Page”** to the page number where you want to place your Tag buttons (e.g., page 99).\n' +
	'2. Go to the Buttons tab and navigate to page 1 (or wherever your presets live). Drag and drop the **“Smart Tagged Camera Preset”** buttons from the *Smart Tagging* preset category.\n' +
	'3. Navigate to your defined Tagging Page (e.g., page 99) and drag and drop the **“Smart Tag: [Name]”** templates onto this page. Edit their text and internal values as you see fit (e.g. “Singer”, “Guitar”, etc.).\n' +
	'\n' +
	'**How it works:**\n' +
	'\n' +
	'- A short press on the Camera Preset recalls the preset.\n' +
	'- A 700ms hold saves the preset.\n' +
	'- A 2200ms hold saves the button’s coordinates to a single background variable (`tag_loc`) and automatically jumps to your Smart Tagging Page.\n' +
	'- Pressing any Tag button on the tagging page will inject the tag text directly into the local variable of the camera preset button you came from, and automatically jump you back to where you started!\n' +
	'// </premium>\n'

if (actions.getActionsMarkdown()) {
	markdown += '\n' + actions.getActionsMarkdown()
}
if (presets.getPresetsMarkdown()) {
	markdown += '\n' + presets.getPresetsMarkdown()
}
if (variables.getVariablesMarkdown()) {
	markdown += '\n' + variables.getVariablesMarkdown()
}

fs.writeFileSync('companion/HELP.md', markdown)
