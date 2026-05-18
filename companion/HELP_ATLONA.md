# Atlona PTZ VISCA

This module controls Atlona PTZ cameras (e.g., K20UH) using the VISCA over IP protocol.

**Please Note**: Not all commands may be supported by all Atlona models.

## Configuration

- Type in the IP address of the device.
- Type in the port of the device (default is 1259)
- Type in the Web Interface Username (default: admin)
- Type in the Web Interface Password (default: admin)
- Note: If you do not want to use the web interface, please leave the username and password blank. Be aware that most AI features will not be available then.
- You can also specify the Camera ID (default: 129)

## Enabling VISCA over IP on your camera

Please refer to the manual for your camera for specific instructions on how to enable VISCA over IP.

## Smart-Features in this module

This module goes beyond simple static commands to offer "Smart Actions". These actions track the internal state of the camera (such as Exposure Mode, PTZ speed, and White Balance mode) and adapt their behavior intelligently to the current context or how you interact with them.

### Smart Rotary Actions

Especially when using controllers with encoders (like the Stream Deck +), the following smart actions provide a highly improved workflow:

- **Smart Exposure Rotary (Context Aware):**
  The function of this rotary automatically adapts to your active exposure mode.
  - In Auto mode, it adjusts Exposure Compensation.
  - In Manual mode, it adjusts Gain.
  - In SAE (Shutter Priority), it adjusts Shutter Speed.
  - In AAE (Iris Priority), it adjusts Iris.
  - In Bright mode, it adjusts Brightness.
    This means you only need _one_ rotary on your Stream Deck to control the most relevant exposure parameter at any time.
- **Pan, Tilt, Zoom & Focus Rotaries:**
  These rotaries feature dynamic speed scaling. As long as you keep turning the dial in the same direction, the movement speed gradually increases to allow for fast sweeps. If you reverse the direction, the movement stops immediately to prevent accidental overshoots and allow for precise framing.
- **Dynamic Focus (Up/Down):**
  Features intelligent acceleration based on turn speed. Fast turns result in large focus steps to quickly reach the general focus plane, while slow turns allow for highly precise fine-tuning.
- **White Balance Cycle (Preview):**
  Allows you to step through white balance modes and preview the mode name before confirming and applying the change.
- **Contextual Rotary Action:**
  Allows you to define multi-purpose rotary slots that change their behavior dynamically based on camera state. For example, a single rotary can control Focus when in Manual mode, but switch to Zoom when in Auto mode. These actions now also support **Press** and **Release** events in addition to turning.
- **Snapshot Presets (Parameter Emulation):**
  This feature allows you to save and recall more than just the camera position. When enabled, it captures Exposure, White Balance, and Image settings locally in the module.
  - If **Enable Parameter Snapshots in Presets** is enabled in the configuration:
    - **Saving a Preset:** Always stores a full snapshot of current Exposure, WB, and Image parameters locally.
    - **Recalling a Preset:** The "Recall Preset" action now features checkboxes to selectively decide which parameter groups to restore (Position, Exposure, White Balance, Image).
    - **Recall Delay:** You can specify a delay (default 200ms) for sending the additional parameters after the initial position recall.
  
  > ### ?? Pro-Tip: Presets as "Image Filters"
  > You can use this to create "Look" presets! By disabling **"Recall Position & Focus"** in the recall action but keeping **"Recall Exposure/WB"** enabled, you can apply stored lighting settings to the current camera shot without the camera moving.

- **Image Calibration (Press to Reset):**
  All Image Parameter buttons (Labels, Rotaries, and Standard Adjustments) support a quick-calibration feature. A simple **Press** on these buttons immediately sets the image to a optimized "Sweet Spot" configuration.

### Polling & Feedback

The module automatically tracks changes made outside of Companion (e.g., via the Web Interface or IR Remote):

- **VISCA Parameters** (Iris, Shutter, Gain, WB): Updated every ~2 seconds.
- **PTZ Positions**: Updated every ~200ms (High Priority).

### Smart Tagging Workflow

With Companion 4.3 or newer, you can use our advanced "Smart Tagging" presets to dynamically name your presets without creating a huge mess of custom variables.

**How to use:**

1. In the Atlona module configuration, set the **"Smart Tagging Page"** to the page number where you want to place your Tag buttons (e.g., page 99).
2. Go to the Buttons tab and navigate to page 1 (or wherever your presets live). Drag and drop the **"Smart Tagged Camera Preset"** buttons from the _Smart Tagging_ preset category.
3. Navigate to your defined Tagging Page (e.g., page 99) and drag and drop the **"Smart Tag: [Name]"** templates onto this page. Edit their text and internal values as you see fit (e.g. "Singer", "Guitar", etc.).

**How it works:**

- A short press on the Camera Preset recalls the preset.
- A 700ms hold saves the preset.
- A 2200ms hold saves the button's coordinates to a single background variable (`tag_loc`) and automatically jumps to your Smart Tagging Page.
- Pressing any Tag button on the tagging page will inject the tag text directly into the local variable of the camera preset button you came from, and automatically jump you back to where you started!

## Actions Implemented

### Pan/Tilt Actions

- Pan Left / Right / Up / Down
- Diagonal movement (Up Left, etc.)
- Pan/Tilt Stop
- Pan/Tilt Home
- Pan/Tilt Reset
- Pan Speed Set / Tilt Speed Set
- Pan/Tilt Position (Absolute, supports variables)
- Pan Rotate / Tilt Rotate (Dynamic speed)
- Pan/Tilt Stop & Reset Speed

### Lens Actions

- Zoom In / Out / Stop
- Zoom Rotate (Dynamic speed)
- Zoom Direct (Absolute factor)
- Zoom Speed Set
- Focus Mode (Auto / Manual / Toggle)
- Focus Near / Far / Stop
- Focus Rotate (Dynamic speed)
- Focus Position Up/Down (with acceleration)
- One Push Auto Focus
- Focus Direct (Absolute position)
- Focus Region (Top, Center, Bottom, All)
- AF Sensitivity (High, Middle, Low)

### Color Actions

- White Balance Mode (Auto, OnePush, Manu)
- White Balance: Cycle Modes (Preview/Confirm)
- One push WB trigger
- R.Gain Up / Down / Set (0-255)
- B.Gain Up / Down / Set (0-255)
- Image: Contrast / Sharpness / Saturation / Brightness / Hue / Gamma
- Image: Set Custom Defaults (Calibration)
- Noise Reduction 2D: Up / Down / Set
- Noise Reduction 3D: Up / Down / Set


### Camera Preset Actions

- Save Preset (Supports variables)
- Recall Preset (Supports variables)
- Preset Selector: Set / Increment / Decrement
- Clear Preset Save Status

### Smart Actions

- Smart Action: Execute Dynamically
- Context: Configure Slot
- Context: Rotary Action

## Presets Implemented

### Pan/Tilt/Zoom Presets

- Directional Buttons (Up, Down, Left, Right, Home, Diagonals)
- Pos x/y
- Pan / Tilt / Zoom (Label Only)
- Pan / Tilt / Zoom Rotary (with dynamic speed and Stop on Press)
- Zoom In / Out
- Zoom Factor: 1.0x
- Pan / Tilt / Zoom Speed Set

### Focus Presets

- Focus Mode Toggle
- One Push Auto Focus
- Focus Position: 0
- Focus (Label Only)
- Focus Rotary (with acceleration)
- AF Zone / AF Sensitivity (Label Only)
- AF Zone / AF Sensitivity Rotary

### Exposure Presets

- Exposure Modes (Full Auto, Manual, SAE, AAE, Bright, Toggle)
- Backlight Compensation (On, Off, Toggle)
- Shutter to 1/100 (Press)
- Exposure Compensation (Set Level, Reset, Up, Down, Toggle)
- Smart Exposure (Label Only)
- Smart Exposure Rotary (Context Aware)
- Shutter / Brightness / Gain / ExpComp (Label Only)
- Shutter / Iris / Brightness / Gain Rotary (with various Press defaults)
- Noise Reduction 2D / 3D (Label Only)
- Noise Reduction 2D / 3D Rotary

### Color Presets

- White Balance Cycle (Favorites / All)
- White Balance Mode (Toggle)
- White Balance Modes (Auto, OnePush, Manual)
- White Balance Trigger
- R.Gain / B.Gain Set (0-255)
- Contrast / Sharpness / Saturation / Brightness / Hue / Gamma Set
- White Balance (Label Only)
- White Balance (Preview & Confirm Rotary)
- R.Gain / B.Gain (Label Only)
- R.Gain / B.Gain Rotary (with Press Calibration)
- Contrast / Sharpness / Saturation / Brightness / Hue / Gamma (Label Only)
- Contrast / Sharpness / Saturation / Brightness / Hue / Gamma Rotary

### System Presets

- System Power Toggle
- Flip-H / Flip-V Toggle

### Camera Presets

- **Presets 1-8** (Buttons with Hold-to-Save and Tap-to-Recall)
- **Smart Tagged Presets** (Buttons with Hold-to-Save and Hold-to-Tag)
- **Preset Selector Rotary** (Recall on Press, Save on Hold)

## Variables Implemented

| Id                    | Name                                |
| --------------------- | ----------------------------------- |
| panPosition           | Pan Position                        |
| tiltPosition          | Tilt Position                       |
| zoomPosition          | Zoom Position (x)                   |
| focusPosition         | Focus Position                      |
| focusMode             | Focus Mode                          |
| focusRegion           | Focus Region                        |
| focusSensitivity      | AF Sensitivity                      |
| exposureMode          | Exposure Mode                       |
| irisPosition          | Iris Position                       |
| irisLabel             | Iris Label                          |
| brightPosition        | Bright (Iris) Position              |
| shutterSpeed          | Shutter Speed                       |
| gainLevel             | Gain Level                          |
| expCompLevel          | Exposure Compensation Level         |
| expComp               | Exposure Compensation Status        |
| backlight             | Backlight Status                    |
| powerStatus           | Power Status                        |
| flipHStatus           | Flip-H Status                       |
| flipVStatus           | Flip-V Status                       |
| wbMode                | White Balance Mode                  |
| wbModePreview         | White Balance Preview Mode          |
| rGain                 | R.Gain Level                        |
| bGain                 | B.Gain Level                        |
| contrast              | Contrast                            |
| sharpness             | Sharpness                           |
| saturation            | Saturation                          |
| luminance             | Brightness (HTTP)                   |
| hue                   | Hue                                 |
| gamma                 | Gamma                               |
| nr2d                  | Noise Reduction 2D                  |
| nr3d                  | Noise Reduction 3D                  |
| lastCmdSent           | Last Command Sent                   |
| presetSelector        | Preset Selector                     |
| presetLastUsed        | Preset Last Used                    |
| panSpeed              | Pan Speed                           |
| tiltSpeed             | Tilt Speed                          |
| zoomSpeed             | Zoom Speed                          |
| focusSpeed            | Focus Speed                         |
| tagPage               | Smart Tagging Page                  |
| contextX_label        | Context X Label (1-8)               |
| contextX_value        | Context X Value (1-8)               |
| smartExpLabel         | Smart Exposure (Label)              |
| smartExpValue         | Smart Exposure (Value)              |

