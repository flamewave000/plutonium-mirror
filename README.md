# Plutonium Mirror

[![Latest Version](https://img.shields.io/github/v/release/flamewave000/plutonium-mirror?label=Latest%20Release)](https://github.com/flamewave000/plutonium-mirror/releases/latest)![GitHub](https://img.shields.io/github/license/flamewave000/plutonium-mirror?color=orange&label=License)![GitHub Release Date](https://img.shields.io/github/release-date/flamewave000/plutonium-mirror)  
![Permissions](https://img.shields.io/badge/dynamic/json?label=Permissions&query=permissions%5B0%2C1%2C2%2C3%5D&url=https%3A%2F%2Fraw.githubusercontent.com%2Fflamewave000%2Fplutonium-mirror%2Fmaster%2Fsrc%2Fmanifest.json)

An Add-On for defining which Mirror to use for 5e Tools

![Extension In Action](.assets/config.png)

[![Support me on Patreon](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Ddragonflagon%26type%3Dpatrons&style=for-the-badge)](https://patreon.com/dragonflagon)

## Chromium Browsers (Chrome, Brave, Edge, Vivaldi, Epic, Slim, Torch, Comodo)

For all Chromium based browsers, you can find the extension in the [~~Chrome Web Store~~ Currently Pending Review](#)  
Or you can install it manually using the following steps:

1. Download the `plutonium-mirror-X.X.zip` file from the [Latest Release](https://github.com/flamewave000/plutonium-mirror/releases/latest)
2. Open your browser's extensions page (ie. `chrome://extensions` or `brave://extensions`)
3. In the top right corner, toggle ON the "Developer mode" switch.
4. Drag+Drop the `plutonium-mirror-X.X.zip` file onto the extensions page.
5. Enjoy!

## Mozilla Firefox ![Mozilla Add-on](https://img.shields.io/amo/users/plutonium-mirror?label=Mozilla%20Users)

For Firefox browsers, you can find the extension in the [Firefox Add-On Store](https://addons.mozilla.org/en-CA/firefox/addon/plutonium-mirror/)  
Or you can install it manually using the following steps:

1. Download the `plutonium-mirror-X.X.xpi` file from the [Latest Release](https://github.com/flamewave000/plutonium-mirror/releases/latest)
2. Open your Firefox's "Add-Ons and Themes" page (ie. `about:addons`)
3. In the top right corner, toggle ON the "Developer mode" switch.
4. Drag+Drop the `plutonium-mirror-X.X.xpi` file onto the Add-Ons page.
5. Click "Add" on the prompt that appears.
6. Enjoy!

## How to Use Local Files

In order to use local files for your images, you have to be using a Chromium based browser (Chrome, Brave, Edge, Vivaldi, Epic, Slim, Torch, Comodo, etc.). This is due to Firefox's Add-On Signing restrictions which are basically just a huge PITA. To find out how to do this for chromium, go to the [How To Use Local](HowToUseLocal.md) guide.

## Download Statistics

![GitHub all releases](https://img.shields.io/github/downloads/flamewave000/plutonium-mirror/total?label=Total Downloads)![GitHub release (latest by date)](https://img.shields.io/github/downloads/flamewave000/plutonium-mirror/latest/total) 
v2.x ![GitHub release (by tag)](https://img.shields.io/github/downloads/flamewave000/plutonium-mirror/v2.2/total)![GitHub release (by tag)](https://img.shields.io/github/downloads/flamewave000/plutonium-mirror/v2.1/total)![GitHub release (by tag)](https://img.shields.io/github/downloads/flamewave000/plutonium-mirror/v2.0/total)  
v1.x ![GitHub release (by tag)](https://img.shields.io/github/downloads/flamewave000/plutonium-mirror/v1.2/total)![GitHub release (by tag)](https://img.shields.io/github/downloads/flamewave000/plutonium-mirror/v1.1/total)![GitHub release (by tag)](https://img.shields.io/github/downloads/flamewave000/plutonium-mirror/v1.0/total)

## Mirror List

[![Official Mirror](https://img.shields.io/badge/dynamic/json?label=Official%20Mirror&query=mirror1&url=https%3A%2F%2Fraw.githubusercontent.com%2Fflamewave000%2Fplutonium-mirror%2Fmaster%2Fmirrors.json)](https://5etools-mirror-1.github.io)
[![Giddy's Mirror](https://img.shields.io/badge/dynamic/json?label=Giddy&query=mirror2&url=https%3A%2F%2Fraw.githubusercontent.com%2Fflamewave000%2Fplutonium-mirror%2Fmaster%2Fmirrors.json)](https://thegiddylimit.github.io)
[![DragonFlagon Mirror](https://img.shields.io/badge/dynamic/json?label=DragonFlagon&query=mirror3&url=https%3A%2F%2Fraw.githubusercontent.com%2Fflamewave000%2Fplutonium-mirror%2Fmaster%2Fmirrors.json)](https://5e-tools.dragonflagon.cafe)
[![Butterfly's Mirror](https://img.shields.io/badge/dynamic/json?label=Butterfly&query=mirror4&url=https%3A%2F%2Fraw.githubusercontent.com%2Fflamewave000%2Fplutonium-mirror%2Fmaster%2Fmirrors.json)](https://dnd5e.eclipseofbutterflies.ml)

## For Developers

This extension is designed to work in both Chromium and Firefox browsers using the exact same JavaScript/Manifest/HTML. Please adhere to this and make sure to test all changes in both browsers.

### Packaging Extensions

There is a `pak` script for bash to perform quick packing. For Chromium, this entails simply zipping the relevant files together. For Mozilla, this is running the `web-ext` tool to sign the package. Signing the package requires a Mozilla Account along with the relevant [API Credentials](https://addons.mozilla.org/en-US/developers/addon/api/key/) for your account. Please do not modify the `.web-extension-id` file as that is for my official version.

#### Install `web-ext`

`npm i -g web-ext`

#### Pack Chrome
Will package the relevant files into `plutonium-mirror.zip`. Requires the `zip` command: `sudo apt install zip`.

`./pak chrome`

#### Pack Mozilla
Will copy the project to a `.mozilla-build` directory and run the `web-ext` program.

`./pak mozilla "JWT Issuer" "JWT Secret"`

OR if you have your JWT creds in a local file called `.creds` (which is a git-ignored file), you do not need to provide them. Instead the build script will check for the file's existence and attempt to use it for the credentials.

`./pak mozilla`

The `.creds` file should be in the project's root directory and look like this:

```bash
jwt_issuer="user:########:##"
jwt_secret="1a2b3c....4d5e6f"
```

#### Pack All

Runs both the `chrome` and `mozilla` packagers

`./pak all ["JWT Issuer"] ["JWT Secret"]`  

### Important Links

- [Chrome Web Store Dev Console](https://chrome.google.com/webstore/devconsole)
- [Mozilla Add-Ons Dev Console](https://addons.mozilla.org/en-US/developers/addons)
