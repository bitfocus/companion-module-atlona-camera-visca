# companion-module-atlona-visca

This module controls Atlona PTZ cameras (e.g., AT-HDVS series) using the VISCA over IP protocol.

- See [HELP.md](companion/HELP.md) for features implemented and operational instructions.
- See [LICENSE](LICENSE)

> Lineage: Sony VISCA scaffolding (Bitfocus) → Fomako internal module → Atlona derivation. Thanks to the Fomako branch for paving the way.

## Features

- **PTZ Control:** Full Pan, Tilt, and Zoom control via VISCA with dynamic speed scaling and variable support.
- **Exposure & Image:** Comprehensive control of exposure modes, white balance, and noise reduction (2D/3D).
- **Smart Features:** Context-aware rotary encoders, intelligent acceleration, and White Balance preview workflows.

## Support & Contact

If you have questions, find bugs, or need a specific feature, please open an [Issue](https://github.com/bitfocus/companion-module-atlona-visca/issues) on GitHub.

Maintained by: **Tom Lehmann** (tom@mailc.de)

## Support & Contact

If you have questions, find bugs, or need a specific feature, please open an [Issue](https://github.com/bitfocus/companion-module-atlona-visca/issues) on GitHub.

Maintained by: **Tom Lehmann** (tom@mailc.de)

## How to Test

### Requirements

- **Companion v3.5 or later**
- **Latest camera firmware**

### Installing a Development Build

1. Go to the [Actions tab](https://github.com/tom-niddatal/companion-module-atlona-visca/actions) on GitHub
2. Find the latest workflow run for the branch you want to test
3. Download the **pkg** artifact (it will save as `pkg.zip` containing the module `.tgz`)
4. Extract the `.tgz` file from the zip
5. In Companion, go to the **Modules** tab and click **Import module package**
6. Select the `.tgz` file to install it
7. Go to the **Connections** tab and open your Atlona connection's config
8. Click the pencil icon next to **Module Version** and select the imported version from the dropdown
