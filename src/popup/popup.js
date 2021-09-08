const env = chrome || browser;
const isChrome = window['chrome'] !== undefined;

const VERSION = chrome.runtime.getManifest().version;
const DEF_ENABLED = true;
const DEF_MIRROR = 'main';
const DEF_CUSTOM = '';
const DEF_EXTENSION = '';

//#region Collect HTML Elements
const table = document.getElementsByTagName('table')[0];
const enabledInput = document.getElementById('enabled');
const resetButton = document.getElementById('reset');
const linkSelect = document.getElementById('link-select');
const linkCustom = document.getElementById('link-custom');
const linkCustomRow = document.getElementById('custom-row');
const linkExtension = document.getElementById('link-extension');
const linkExtensionRow = document.getElementById('extension-row');
const saveButton = document.getElementById('save');
const errorInsecure = document.getElementById('insecure');
const errorUnsupported = document.getElementById('unsupported');
//#endregion

//#region Event Registrations
enabledInput.addEventListener("click", async () => await handleChangeEvent());
resetButton.addEventListener('click', async () => await resetSettings());
linkSelect.addEventListener('change', async () => await handleChangeEvent());
linkCustom.addEventListener('change', async () => await handleChangeEvent());
linkExtension.addEventListener('change', async () => await handleChangeEvent());
saveButton.addEventListener('click', async () => await saveChanges());
//#endregion

//#region Data Helpers
function getData() {
	return {
		enabled: enabledInput.checked,
		mirror: linkSelect.value,
		custom: linkCustom.value,
		extension: linkExtension.value
	};
}
async function getSavedData() {
	return new Promise((res, _) => env.storage.sync.get((data) => res(data)));
}
//#endregion

//#region Element Toggle Helpers
function setEnabled(element, condition) {
	if (condition) element.removeAttribute('disabled');
	else element.setAttribute('disabled', '');
}
function setVisible(element, condition) {
	element.style.display = condition ? '' : 'none';
}
//#endregion

//#region Event Handlers
async function handleChangeEvent() {
	const oldData = await getSavedData();
	var oldMirror = oldData.mirror;
	var oldCustom = oldData.custom;
	var oldExtension = oldData.extension;

	var { enabled, mirror, custom, extension } = getData();
	custom = custom.trim();
	// Validate URL
	if (mirror === 'custom' && custom.length > 0) {
		if (!custom.endsWith('/')) {
			custom += '/';
		}
		setVisible(errorInsecure, custom.startsWith('http:'));
		setVisible(errorUnsupported, !(/^(https?):\/\/\/?.+/).test(custom));
	} else {
		setVisible(errorInsecure, false);
		setVisible(errorUnsupported, false);
	}
	linkCustom.value = custom;

	await env.storage.sync.set({ enabled });
	setVisible(table, enabled);
	setVisible(saveButton, enabled);
	if (!enabled) {
		setEnabled(saveButton, false);
		setEnabled(linkSelect, false);
		setVisible(linkCustomRow, false);
		setVisible(linkExtensionRow, false);
	} else {
		setEnabled(saveButton, oldMirror !== mirror || oldCustom !== custom || oldExtension !== extension);
		setEnabled(linkSelect, true);
		setVisible(linkCustomRow, mirror === 'custom');
		setVisible(linkExtensionRow, isChrome && mirror === 'extension');
	}
}
async function saveChanges() {
	setEnabled(saveButton, false);
	await env.storage.sync.set(getData());
}
async function resetSettings() {
	await env.storage.sync.set({
		version: VERSION,
		enabled: DEF_ENABLED,
		mirror: DEF_MIRROR,
		custom: DEF_CUSTOM
	});
	linkSelect.value = DEF_MIRROR;
	linkCustom.value = DEF_CUSTOM;
	linkCustom.value = DEF_CUSTOM;
	enabledInput.checked = DEF_ENABLED;
	setEnabled(saveButton, false);
	setEnabled(linkSelect, true);
	setVisible(linkCustomRow, false);
	setVisible(linkExtensionRow, false);
}
//#endregion

//#region layout initialization
async function populateMirrors() {
	return new Promise((res, _) => {
		const url = env.runtime.getURL('mirrors.json');
		fetch(url)
			.then(response => response.json())
			.then(mirrors => {
				var element = null;
				for (let key of Object.keys(mirrors)) {
					if (key === 'extension' && !isChrome) continue;
					element = document.createElement("option");
					element.setAttribute('value', key);
					element.text = mirrors[key];
					linkSelect.appendChild(element);
				}
				res();
			});
	});
}

async function populateExtensions() {
	return new Promise((res, _) => {
		env.management.getAll(async apps => {
			// Alphabetically sort the chrome extensions by Name Ascending
			apps = apps.sort(function (a, b) {
				a = a.name.toUpperCase(); // ignore upper and lowercase
				b = b.name.toUpperCase(); // ignore upper and lowercase
				return a < b ? -1 : (a > b ? 1 : 0);
			});
			// Create Option elements for each and add them to the selector
			var element = null;
			for (let app of apps) {
				element = document.createElement("option");
				element.setAttribute('value', app.id);
				element.text = app.name;
				linkExtension.appendChild(element);
			}
			res();
		});
	});
}

function updateLayout({ enabled, mirror, custom }) {
	setEnabled(saveButton, false);
	setEnabled(linkSelect, enabled);
	setVisible(linkCustomRow, enabled && mirror === 'custom');
	setVisible(linkExtensionRow, isChrome && enabled && mirror === 'extension');
	setVisible(errorInsecure, mirror === 'custom' && custom.length > 0 && custom.startsWith('http:'));
	setVisible(errorUnsupported, mirror === 'custom' && custom.length > 0 && !(/^(https?):\/\/\/?.+/).test(custom));
}
//#endregion

(async () => {
	const table = document.getElementsByTagName('table')[0];
	setVisible(table, false);
	setVisible(saveButton, false);
	await populateMirrors();
	if (isChrome) await populateExtensions();
	const { enabled, mirror, custom, extension } = await getSavedData();
	// Initialize the rest of the settings and UI
	enabledInput.checked = enabled;
	linkSelect.value = mirror || DEF_MIRROR;
	linkCustom.value = custom || DEF_CUSTOM;
	linkExtension.value = extension || DEF_EXTENSION;
	updateLayout({ enabled, mirror, custom });
	setVisible(table, enabled);
	setVisible(saveButton, enabled);
})();