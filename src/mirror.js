const env = chrome || browser;

const VERSION = chrome.runtime.getManifest().version;
const DEF_ENABLED = true;
const DEF_MIRROR = 'main';
const DEF_CUSTOM = '';
const DEF_EXTENSION = '';

// Target Filters
// We are only going to intercept URLs that match these
const filterUrls = [];
// We intercept ALL kinds of requests
const filterTypes = ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "other"];

// Settings Data
const data = {
	version: VERSION,
	enabled: DEF_ENABLED,
	mirror: DEF_MIRROR,
	custom: DEF_CUSTOM,
	extension: DEF_EXTENSION
};
var mirrors = {};
var mirrorSet = new Set();
// Listen for changes to the extension settings
env.storage.onChanged.addListener(changeSet => {
	for (let key of Object.keys(changeSet)) {
		data[key] = changeSet[key].newValue;
	}
	bindListeners();
});

// When we are first installed, set the default settings
env.runtime.onInstalled.addListener(() => {
	env.storage.sync.get(async ({ version, enabled, mirror, custom }) => {
		// Ignore if the setting actually do already exist. This happens when reloading the extension.
		if (enabled !== undefined) return;
		data.version = VERSION;
		data.enabled = DEF_ENABLED;
		data.mirror = DEF_MIRROR;
		data.custom = DEF_CUSTOM;
		data.extension = DEF_EXTENSION;
		await env.storage.sync.set(data);
		console.log('Default Settings Configured');
	});
});

// Retrieve the current settings
env.storage.sync.get(({ version, enabled, mirror, custom, extension }) => {
	data.version = version;
	data.enabled = enabled;
	data.mirror = mirror;
	data.custom = custom;
	data.extension = extension;
	mirrorSet.clear();
	for (let mirror of Object.keys(mirrors)) {
		mirrorSet.add(getMirrorUrl(mirror));
	}
	bindListeners();
});

// Retrieve the mirror list
fetch('https://raw.githubusercontent.com/flamewave000/plutonium-mirror/master/mirrors.json')
	.then(res => res.json())
	.then(mirrorsObject => {
		mirrors = mirrorsObject;
		mirrorSet.clear();
		for (let mirror of Object.keys(mirrors)) {
			const mirrorUrl = getMirrorUrl(mirror);
			// Ignore custom/extension mirrors that have not been defined
			if (mirrorUrl.trim().length <= 0) continue;
			mirrorSet.add(mirrorUrl);
			// Add each mirror to the list of redirectable URLs
			if (mirror === 'extension') filterUrls.push(mirrorUrl.concat('*'));
			else filterUrls.push(mirrorUrl.replace(/^.+:/, '*:').concat('*'));
		}
		// Add the static Roll20 URL filter
		filterUrls.push("*://imgsrv.roll20.net/*");
		bindListeners();
	});

function getMirrorUrl(mirror) {
	const { custom, extension } = data;
	mirror = mirror || data.mirror;
	// Determine the host URL
	if (mirror === 'custom') return custom;
	else if (mirror === 'extension') return extension.trim().length > 0 ? `chrome-extension://${extension}/` : '';
	else return mirrors[mirror];
}

const regex_roll20ImageSrvCheck = /^https?:\/\/([^\/]+\/)[\S\s]*/;
const regex_domain = /(^https?:\/\/[^\/]+\/)[\S\s]*/;
const regex_query = /^https?:\/\/[^\/]+\/([\S\s]*)(\?[\S\s]+)?$/;

function onBeforeRequest(details) {
	// if we are disabled, return immediately
	if (!data.enabled) return;
	// Determine the host URL
	var host = getMirrorUrl();
	// Ignore links that are already going to our Target Mirror
	if (host === regex_domain.exec(details.url)[1]) return;
	// Extract Query
	var query = undefined;
	if (regex_roll20ImageSrvCheck.exec(details.url)[1] === 'imgsrv.roll20.net/') {
		const originalUrl = new URL(details.url);
		const url = decodeURIComponent(originalUrl.searchParams.get('src'));
		const domain = regex_domain.exec(url)[1]
		// Ignore links that are not relevant 5e-tools URLs
		if (!mirrorSet.has(domain)) return;
		// Ignore links that are already going to our Target Mirror
		if (domain === host) return;
		query = regex_query.exec(url)[1];
	}
	else query = regex_query.exec(details.url)[1];
	// Redirect to the target mirror host
	return { redirectUrl: host + query };
}

function bindListeners() {
	if (mirrors[DEF_MIRROR] === undefined) return;
	if (env.webRequest.onBeforeRequest.hasListener(onBeforeRequest))
		env.webRequest.onBeforeRequest.removeListener(onBeforeRequest);
	if (!data.enabled) return;
	// Bind interceptor for redirecting 5e.tools https requests
	env.webRequest.onBeforeRequest.addListener(
		onBeforeRequest,
		{ urls: data.custom.length == 0 ? filterUrls : filterUrls.concat([data.custom + '*']), types: filterTypes },
		// We block calls until our handler completes
		["blocking"]
	);
}
