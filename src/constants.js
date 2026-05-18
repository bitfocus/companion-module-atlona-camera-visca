/**
 * @file Defines VISCA protocol byte constants (Command types, Categories, Terminators).
 */

export const VISCA_TERMINATOR = 0xff

export const MSG_COMMAND = 0x01
export const MSG_CONTROL = 0x00 // Typically for 8x 00 ...
export const MSG_INQUIRY = 0x09

// Categories
export const CAT_LENS = 0x04
export const CAT_CAMERA = 0x05
export const CAT_PAN_TILT = 0x06

// Commands - Lens
export const CMD_ZOOM = 0x07
export const CMD_FOCUS = 0x08
export const CMD_FOCUS_MODE = 0x38
export const CMD_FOCUS_ONE_PUSH = 0x38 // 8x 01 04 38 04 FF
export const CMD_FOCUS_DIRECT = 0x48
export const CMD_FOCUS_REGION = 0xaa
export const CMD_FOCUS_SENSITIVITY = 0x58

// Commands - Camera
export const CMD_POWER = 0x00
export const CMD_WB_MODE = 0x35
export const CMD_WB_ONE_PUSH = 0x10
export const CMD_EXPOSURE_MODE = 0x39
export const CMD_SHUTTER = 0x0a
export const CMD_IRIS_DIRECT = 0x4b
export const CMD_GAIN_DIRECT = 0x4c
export const CMD_SHUTTER_DIRECT = 0x4a
export const CMD_BRIGHT_DIRECT = 0x4d
export const CMD_EXP_COMP_MODE = 0x3e
export const CMD_EXP_COMP_DIRECT = 0x4e
export const CMD_BACKLIGHT = 0x33
export const CMD_PRESET = 0x3f
export const CMD_R_GAIN_DIRECT = 0x43
export const CMD_B_GAIN_DIRECT = 0x44
export const CMD_LUMINANCE_DIRECT = 0xa1
export const CMD_CONTRAST_DIRECT = 0xa2
export const CMD_SATURATION_DIRECT = 0x49
export const CMD_SHARPNESS_DIRECT = 0x42
export const CMD_HUE_DIRECT = 0x4f
export const CMD_GAMMA_DIRECT = 0x5b
export const CMD_NR2D = 0x53
export const CMD_NR3D = 0x54

// Commands - Pan/Tilt
export const CMD_PT_DRIVE = 0x01
export const CMD_PT_ABSOLUTE = 0x02
export const CMD_PT_HOME = 0x04
export const CMD_PT_RESET = 0x05

// Commands - System
export const CMD_MIRROR = 0x61
export const CMD_FLIP = 0x66
export const CMD_VIDEO_SYSTEM = 0x35

// Command Parameters
export const PARAM_ON = 0x02
export const PARAM_OFF = 0x03
export const PARAM_TOGGLE = 'toggle'

export const PARAM_FOCUS_AUTO = 0x02
export const PARAM_FOCUS_MANUAL = 0x03
export const PARAM_FOCUS_ONE_PUSH_TRIGGER = 0x04
export const PARAM_FOCUS_STOP = 0x00
export const PARAM_FOCUS_FAR = 0x02
export const PARAM_FOCUS_NEAR = 0x03

// Preset Parameters
export const PARAM_PRESET_RECALL = 0x02
export const PARAM_PRESET_SET = 0x01

// Pan/Tilt Directions
export const PT_PAN_LEFT = 0x01
export const PT_PAN_RIGHT = 0x02
export const PT_PAN_STOP = 0x03
export const PT_TILT_UP = 0x01
export const PT_TILT_DOWN = 0x02
export const PT_TILT_STOP = 0x03

// Lens Parameters
export const ZOOM_STOP = 0x00
export const ZOOM_IN = 0x20
export const ZOOM_OUT = 0x30
export const FOCUS_STOP = 0x00
export const FOCUS_FAR = 0x20
export const FOCUS_NEAR = 0x30

// Exposure Modes
export const EXPOSURE_AUTO = 0x00
export const EXPOSURE_MANUAL = 0x03
export const EXPOSURE_SHUTTER_PRIO = 0x0a
export const EXPOSURE_IRIS_PRIO = 0x0b
export const EXPOSURE_BRIGHT = 0x0d

// Inquiry Keys
export const INQ_POWER = '090400'
export const INQ_PT_POSITION = '090612'
export const INQ_ZOOM_POSITION = '090447'
export const INQ_FOCUS_MODE = '090438'
export const INQ_FOCUS_POSITION = '090448'
export const INQ_EXPOSURE_MODE = '090439'
export const INQ_WB_MODE = '090435'
export const INQ_IRIS_POSITION = '09044B'
export const INQ_SHUTTER_SPEED = '09044A'
export const INQ_GAIN_LEVEL = '09044C'
export const INQ_EXP_COMP_LEVEL = '09044E'
export const INQ_EXP_COMP_MODE = '09043E'
export const INQ_BACKLIGHT = '090433'
export const INQ_LUMINANCE = '0904A1'
export const INQ_CONTRAST = '0904A2'
export const INQ_SATURATION = '090449'
export const INQ_SHARPNESS = '090442'
export const INQ_HUE = '09044F'
export const INQ_GAMMA = '09045B'
export const INQ_R_GAIN = '090443'
export const INQ_B_GAIN = '090444'
export const INQ_NR2D = '090453'
export const INQ_NR3D = '090454'
export const INQ_FOCUS_REGION = '0904AA'
export const INQ_FOCUS_SENSITIVITY = '090458'
