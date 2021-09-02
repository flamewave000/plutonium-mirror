# plutonium-mirror
An Add-On for defining which Mirror to use for 5e Tools

## Chromium Browsers (Chrome, Brave, Edge, Vivaldi, Epic, Slim, Torch, Comodo)
For all Chromium based browsers, you can find the extension in the [Chrome Web Store]()

## Mozilla Firefox
For Firefox browsers, you can find the extension in the [Firefox Add-On Store]()

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