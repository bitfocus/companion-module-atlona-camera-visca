# Atlona PTZ VISCA

This module controls Atlona PTZ cameras (e.g., K20UH) using the VISCA over IP protocol.

**Please Note**: Not all commands may be supported by all Atlona models.

## Configuration

- Type in the IP address of the device.
- Type in the port of the device (default is 1259)
- You can also specify the Camera ID (default: 1)

## Enabling VISCA over IP on your camera

Please refer to the manual for your camera for specific instructions on how to enable VISCA over IP.

## Smart-Features in this module

This module goes beyond simple static commands to offer “Smart Actions”. These actions track the internal state of the camera (such as Exposure Mode, PTZ speed, and White Balance mode) and adapt their behavior intelligently to the current context or how you interact with them.

### Smart Rotary Actions

Especially when using controllers with encoders (like the Stream Deck +), the following smart actions provide a highly improved workflow:

- **Smart Exposure Rotary (Context Aware):**
  The function of this rotary automatically adapts to your active exposure mode.
  - In Auto mode, it adjusts Exposure Compensation.
  - In Manual mode, it adjusts Gain.
  - In SAE (Shutter Priority), it adjusts Shutter Speed.
  - In AAE (Iris Priority), it adjusts Iris.
  - In Bright mode, it adjusts Brightness.
  This means you only need *one* rotary on your Stream Deck to control the most relevant exposure parameter at any time.
- **Pan, Tilt, Zoom & Focus Rotaries:**
  These rotaries feature dynamic speed scaling. As long as you keep turning the dial in the same direction, the movement speed gradually increases to allow for fast sweeps. If you reverse the direction, the movement stops immediately to prevent accidental overshoots and allow for precise framing.
- **Dynamic Focus (Up/Down):**
  Features intelligent acceleration based on turn speed. Fast turns result in large focus steps to quickly reach the general focus plane, while slow turns allow for highly precise fine-tuning.
- **White Balance Cycle (Preview):**
  Allows you to step through white balance modes and preview the mode name before confirming and applying the change.
// <premium>
- **Contextual Rotary Action:**
  Allows you to define multi-purpose rotary slots that change their behavior dynamically based on camera state. For example, a single rotary can control Focus when in Manual mode, but switch to Zoom when in Auto mode. These actions now also support **Press** and **Release** events in addition to turning.
- **Snapshot Presets (Parameter Emulation):**
  This feature allows you to save and recall more than just the camera position. When enabled, it captures Exposure, White Balance, and Image settings locally in the module.
  - If **Enable Parameter Snapshots in Presets** is enabled in the configuration:
    - **Saving a Preset:** Always stores a full snapshot of current Exposure, WB, and Image parameters locally.
    - **Recalling a Preset:** The “Recall Preset” action now features checkboxes to selectively decide which parameter groups to restore (Position, Exposure, White Balance, Image).
    - **Recall Delay:** You can specify a delay (default 200ms) for sending the additional parameters after the initial position recall.
// </premium>
- **Image Calibration (Press to Reset):**
  All Image Parameter buttons (Labels, Rotaries, and Standard Adjustments) support a quick-calibration feature. A simple **Press** on these buttons immediately sets the image to a optimized “Sweet Spot” configuration.

### Polling & Feedback

The module automatically tracks changes made outside of Companion (e.g., via IR Remote):

- **VISCA Parameters** (Iris, Shutter, Gain, WB): Updated every ~2 seconds.
- **PTZ Positions**: Updated every ~200ms (High Priority).
// <premium>

### Smart Tagging Workflow

With Companion 4.3 or newer, you can use our advanced “Smart Tagging” presets to dynamically name your presets without creating a huge mess of custom variables.

**How to use:**

1. In the Atlona module configuration, set the **“Smart Tagging Page”** to the page number where you want to place your Tag buttons (e.g., page 99).
2. Go to the Buttons tab and navigate to page 1 (or wherever your presets live). Drag and drop the **“Smart Tagged Camera Preset”** buttons from the *Smart Tagging* preset category.
3. Navigate to your defined Tagging Page (e.g., page 99) and drag and drop the **“Smart Tag: [Name]”** templates onto this page. Edit their text and internal values as you see fit (e.g. “Singer”, “Guitar”, etc.).

**How it works:**

- A short press on the Camera Preset recalls the preset.
- A 700ms hold saves the preset.
- A 2200ms hold saves the button’s coordinates to a single background variable (`tag_loc`) and automatically jumps to your Smart Tagging Page.
- Pressing any Tag button on the tagging page will inject the tag text directly into the local variable of the camera preset button you came from, and automatically jump you back to where you started!
// </premium>

## Actions Implemented

### Pan/Tilt Actions

- Pan Left
- Pan Right
- Tilt Up
- Tilt Down
- Up Left
- Up Right
- Down Left
- Down Right
- Stop
- Pan Rotate
- Tilt Rotate
- Stop & Reset Speed
- Reset/Recalibrate
- Home
- Set Pan Speed
- Set Tilt Speed
- Recall Absolute Position

### Lens/Zoom/Focus Actions

- Zoom In
- Zoom Out
- Zoom Stop
- Zoom Rotate
- Set Zoom Factor Direct
- Set Zoom Speed
- Focus Mode (Auto/Manual/Toggle)
- Focus Near
- Focus Far
- Focus Stop
- Focus Rotate
- Focus: One Push AF
- Set Focus Region Direct
- Focus Set AF Sensitivity
- Set Focus Direct
- Focus (Combine Near/Far/Stop into one Action)

### Exposure Actions

- Exposure Mode
- Iris Up/Down/Set
- Brightness (AE Bright Mode Only) Up/Down/Set
- Shutter Speed Up/Down
- Shutter Speed Jump to Value
- Gain Up/Down
- Gain Jump to Value
- Exposure Compensation: Set Level
- Exposure Compensation: Reset
- Exposure Compensation: Up
- Exposure Compensation: Down
- Set Backlight Compensation

### Color Actions

- White Balance Mode
- White Balance: Cycle Modes
- One push WB trigger
- R.Gain Up/Down
- R.Gain Set Direct
- B.Gain Up/Down
- B.Gain Set Direct
- Image: Contrast
- Image: Sharpness
- Image: Saturation
- Image: Brightness
- Image: Hue
- Image: Gamma
- Image: Set Custom Defaults (Calibration)

### System & Format Actions

- System Power Toggle
- Power (On/Off/Toggle)
- Flip Horizontal (On/Off/Toggle)
- Flip Vertical (On/Off/Toggle)
- Set Video System (Format)

### Camera Preset Actions

- Save Preset
- Recall Preset
- Preset Selector: Set/Inc/Dec


## Presets Implemented

### Pan/Tilt/Zoom Presets

- PTZ Directions (Up, Down, Left, Right, Diagonals, Stop, Home)
- Zoom In / Zoom Out / Zoom Stop
- Focus Mode (Toggle)
- Focus Direct (0)
- Focus Set AF Sensitivity
- Focus Region Set

### Exposure Presets

- Exposure Modes (Auto, Manual, SAE, AAE, Bright, Toggle)
- Shutter Speed Up / Down / Set Absolute
- Iris Up / Down / Set Absolute
- Gain Up / Down / Set Absolute
- Exposure Comp Up/Down/Reset/Set
- Brightness Up/Down/Set
- Backlight On/Off/Toggle

### Color / White Balance Presets

- White Balance Modes (Auto, OnePush, Manu)
- White Balance Cycle (All / Favorites)
- One Push WB Trigger
- R.Gain Up/Down/Set
- B.Gain Up/Down/Set

### Image Setting Presets

- Set Contrast (Specific value)
- Set Sharpness (Specific value)
- Set Saturation (Specific value)
- Set Brightness (Specific value)
- Set Hue (Specific value)
- Set Gamma (Specific value)

### System Presets

- System Power Toggle
- Power On / Off
- Flip Horizontal On / Off
- Flip Vertical On / Off

### Dynamic Camera Presets

- Save Preset 1-255
- Recall Preset 1-255

## Variables Implemented

| Id | Name |
| --- | --- |
| panPosition | Pan Position |
| tiltPosition | Tilt Position |
| zoomPosition | Zoom Position |
| focusPosition | Focus Position |
| focusRegion | Focus Region |
| focusSensitivity | AF Sensitivity |
| focusMode | Focus Mode |
| exposureMode | Exposure Mode |
| irisPosition | Iris Position |
| irisLabel | Iris Label |
| brightPosition | Bright (Iris) Position |
| shutterSpeed | Shutter Speed |
| gainLevel | Gain Level |
| expCompLevel | Exposure Compensation Level |
| expComp | Exposure Compensation Status |
| backlight | Backlight Status |
| powerStatus | Power Status |
| flipHStatus | Flip-H Status |
| flipVStatus | Flip-V Status |
| wbMode | White Balance Mode |
| wbModePreview | White Balance Preview Mode |
| rGain | R.Gain Level |
| bGain | B.Gain Level |
| contrast | Contrast |
| sharpness | Sharpness |
| saturation | Saturation |
| luminance | Brightness |
| hue | Hue |
| gamma | Gamma |
| nr2d | Noise Reduction 2D |
| nr3d | Noise Reduction 3D |
| lastCmdSent | Last Command Sent |
| presetSelector | Preset Selector |
| presetLastUsed | Preset Last Used |
| panSpeed | Pan Speed |
| tiltSpeed | Tilt Speed |
| zoomSpeed | Zoom Speed |
| focusSpeed | Focus Speed |
| smartExpLabel | Smart Exposure (Label) |
| smartExpValue | Smart Exposure (Value) |
