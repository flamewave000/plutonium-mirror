
const enabledInput = document.getElementById('enabled');
enabledInput.addEventListener("click", async () => {
	const enabled = enabledInput.checked;
	chrome.storage.sync.set({enabled});
});

chrome.storage.sync.get("enabled", ({ enabled }) => {
	enabledInput.checked = enabled;
});
