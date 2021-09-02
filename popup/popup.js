const env = chrome || browser;

const VERSION = chrome.runtime.getManifest().version;
const DEF_ENABLED = true;
const DEF_MIRROR = 'main';
const DEF_CUSTOM = '';

//#region Collect HTML Elements
const enabledInput = document.getElementById('enabled');
const resetButton = document.getElementById('reset');
const linkSelect = document.getElementById('link-select');
const linkCustom = document.getElementById('link-custom');
const saveButton = document.getElementById('save');
const errorInsecure = document.getElementById('insecure');
//#endregion

//#region Event Registrations
enabledInput.addEventListener("click", async () => await handleChangeEvent());
resetButton.addEventListener('click', async () => await resetSettings());
linkSelect.addEventListener('change', async () => await handleChangeEvent());
linkCustom.addEventListener('change', async () => await handleChangeEvent());
saveButton.addEventListener('click', async () => await saveChanges());
//#endregion

//#region Data Helpers
function getData() {
	return {
		enabled: enabledInput.checked,
		mirror: linkSelect.value,
		custom: linkCustom.value
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
	element.style.display = condition ? 'inherit' : 'none';
}
//#endregion

//#region Event Handlers
async function handleChangeEvent() {
	var oldMirror = 'main';
	var oldCustom = '';
	await new Promise((res, _) => {
		env.storage.sync.get(({ mirror, custom }) => {
			oldMirror = mirror;
			oldCustom = custom;
			res();
		});
	});
	var { enabled, mirror, custom } = getData();
	custom = custom.trim();
	// Validate URL
	if (mirror === 'custom' && custom.length > 0) {
		if (!custom.endsWith('/')) {
			custom += '/';
		}
		if (!(/^https?:\/\/.+/).test(custom)) {
			const idx = custom.indexOf('//');
			if (idx > -1) {
				custom = custom.slice(idx + 2);
			}
			custom = 'http://' + custom;
		}
		setVisible(errorInsecure, !custom.startsWith('https'));
	} else {
		setVisible(errorInsecure, false);
	}
	linkCustom.value = custom;

	await env.storage.sync.set({ enabled, mirror: oldMirror, custom: oldCustom });
	if (!enabled) {
		setEnabled(saveButton, false);
		setEnabled(linkSelect, false);
		setEnabled(linkCustom, false);
	} else {
		setEnabled(saveButton, oldMirror !== mirror || oldCustom !== custom);
		setEnabled(linkSelect, true);
		setEnabled(linkCustom, mirror === 'custom');
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
	enabledInput.checked = DEF_ENABLED;
	setEnabled(saveButton, false);
	setEnabled(linkSelect, true);
	setEnabled(linkCustom, false);
}
//#endregion

(async () => {
	const { version, enabled, mirror, custom } = await getSavedData();
	enabledInput.checked = enabled;
	linkSelect.value = mirror || 'main';
	linkCustom.value = custom || '';
	setEnabled(saveButton, false);
	setEnabled(linkSelect, enabled);
	setEnabled(linkCustom, enabled && mirror === 'custom');
	setVisible(errorInsecure, mirror === 'custom' && custom.length > 0 && !custom.startsWith('https'));
})();