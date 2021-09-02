
var host = "https://5etools-mirror-1.github.io/";
browser.webRequest.onBeforeRequest.addListener(
	function (details) {
		return { redirectUrl: host + details.url.match(/^https?:\/\/[^\/]+([\S\s]*)/)[1] };
	},
	{
		urls: [
			"*://5e.tools/*"
		],
		types: ["image"]
	},
	["blocking"]
);
