const env = chrome || browser;

const VERSION = 1;
const DEF_ENABLED = true;
const DEF_MIRROR = 'main';
const DEF_CUSTOM = '';

async function getSavedData() {
	return new Promise((res, _) => env.storage.sync.get((data) => res(data)));
}

const data = {
	version: VERSION,
	enabled: DEF_ENABLED,
	mirror: DEF_MIRROR,
	custom: DEF_CUSTOM
}
env.storage.onChanged.addListener(changeSet => {
	for (let key of Object.keys(changeSet)) {
		data[key] = changeSet[key].newValue;
	}
});

env.runtime.onInstalled.addListener(() => {
	env.storage.sync.get(async ({ version, enabled, mirror, custom }) => {
		if (enabled !== undefined) return;
		data.version = VERSION;
		data.enabled = DEF_ENABLED;
		data.mirror = DEF_MIRROR;
		data.custom = DEF_CUSTOM;
		await env.storage.sync.set(data);
		console.log('Default Settings Configured');
	});
});

env.storage.sync.get(({ version, enabled, mirror, custom }) => {
	data.version = version;
	data.enabled = enabled;
	data.mirror = mirror;
	data.custom = custom;
});

env.webRequest.onBeforeRequest.addListener(
	function (details) {
		const { enabled, mirror, custom } = data;
		if (!enabled) return;
		var host = '';
		switch (mirror) {
			case 'custom':
				host = custom;
				break;
			case 'mirror1':
				host = 'https://5etools-mirror-1.github.io/';
				break;
			case 'main':
			default:
				host = 'https://5e.tools/';
				break;
		}
		// Ignore links that are already going to our Target Mirror
		if (host === details.url.match(/(^https?:\/\/[^\/]+\/)[\S\s]*/)[1]) return;
		// Redirect to the target mirror host
		return { redirectUrl: host + details.url.match(/^https?:\/\/[^\/]+\/([\S\s]*)/)[1] };
	},
	{
		urls: [
			"*://5e.tools/*",
			"*://5etools-mirror-1.github.io/*"
		],
		types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "other"]
	},
	["blocking"]
);
