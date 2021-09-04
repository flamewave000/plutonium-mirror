# Plutonium Mirror [![Latest Version](https://img.shields.io/github/v/release/flamewave000/plutonium-mirror?label=Latest%20Release)](https://github.com/flamewave000/plutonium-mirror/releases/latest)
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

## Mozilla Firefox

For Firefox browsers, you can find the extension in the [Firefox Add-On Store](https://addons.mozilla.org/en-CA/firefox/addon/plutonium-mirror/)  
Or you can install it manually using the following steps:

1. Download the `plutonium-mirror-X.X.xpi` file from the [Latest Release](https://github.com/flamewave000/plutonium-mirror/releases/latest)
2. Open your firefox's "Add-ons and Themes" page (ie. `about:addons`)
3. In the top right corner, toggle ON the "Developer mode" switch.
4. Drag+Drop the `plutonium-mirror-X.X.xpi` file onto the Add-ons page.
5. Click "Add" on the prompt that appears.
6. Enjoy!

## How to Use Local Files

In order to use local files for your images, you have to be using a Chromium based browser (Chrome, Brave, Edge, Vivaldi, Epic, Slim, Torch, Comodo, etc.). This is due to Firefox's Add-On Signing restrictions which are basically just a huge PITA. To find out how to do this for chromium, go to the [How To Use Local](HowToUseLocal.md) guide.

## For Developers

This extension is designed to work in both Chromium and Firefox browsers using the exact same JavaScript/Manifest/HTML. Please adhere to this and make sure to test all changes in both browsers.

### Packaging Extensions

There is a `pak.sh` script for bash to perform quick packing. For Chromium, this entails simply zipping the relavent files together. For Mozilla, this is running the `web-ext` tool to sign the package. Signing the package requires a Mozille Account along with the relevant [API Credentials](https://addons.mozilla.org/en-US/developers/addon/api/key/) for your account. Please do not modify the `.web-extension-id` file as that is for my official version.

#### Install `web-ext`

`npm i -g web-ext`

#### Pack Chrome
Will package the relevant files into `plutonium-mirror.zip`. Requires the `zip` command: `sudo apt install zip`.

`./pak.sh chrome`

#### Pack Mozilla
Will package the relavent files into 

`./pak.sh mozilla "JWT Issuer" "JWT Secret"`

#### Pack All

`./pak.sh all "JWT Issuer" "JWT Secret"`

### Important Links

- Chrome Web Store Dev Console [https://chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole)
- Mozilla Add-Ons Dev Console [https://addons.mozilla.org/en-US/developers/addons](https://addons.mozilla.org/en-US/developers/addons)
