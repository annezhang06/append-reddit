async function updateBadge() {
    // Check whether the extension is enabled
    const { enabled } = await chrome.storage.local.get({ enabled: true });
    
    // Update badge to reflect on/off
    chrome.action.setBadgeText({
        text: enabled ? "ON" : "OFF"
    });

    // I guess we are using diff colours for on/off badge status
    chrome.action.setBadgeBackgroundColor({
        color: enabled ? "#0f9d58" : "#9e9e9e"
    });
}

// Handle navigation events
chrome.webNavigation.onCommitted.addListener(async (details) => {
    // Check that we're not working w/ an iframe
    if (details.frameId !== 0) return;

    // Check if the extension is turned on
    const { enabled } = await chrome.storage.local.get({ enabled: true });
    /*
    Equivalently:
        const result = await chrome.storage.local.get({ enabled: true });
        const enabled = result.enabled;
    Or:
        const enabled =
            (await chrome.storage.local.get({ enabled: true })).enabled;
    */
    if (!enabled) return;

    // Check if the URL is a Google search URL
    const url = new URL(details.url);

    if (url.hostname !== "www.google.com") return;
    if (url.pathname !== "/search") return;

    // Get the q string
    const query = url.searchParams.get("q");
    if (!query) return;

    // Return if q already has "reddit" — otherwise this will loop infinitely
    if (query.toLowerCase().includes("reddit")) return;

    // Append " reddit" to q – modify the q string
    url.searchParams.set("q", query + " reddit");

    // Change the curr tab to have the new URL
    chrome.tabs.update(details.tabId, {
        url: url.toString()
    });
});

// Initialize badge whenever the extension loads
// i.e., "Add a listener for the chrome.runtime.onInstalled event object"
chrome.runtime.onInstalled.addListener(() => {
    updateBadge();
});
// onInstalled fires when:
// extension is installed, you click “Reload” in dev mode, extension updates

chrome.runtime.onStartup.addListener(() => {
    updateBadge();
});
// onStartup fires when:
// Chrome launches

// Change badge (to reflect state changes) whenever the user toggles
chrome.storage.onChanged.addListener(() => {
    updateBadge();
});
