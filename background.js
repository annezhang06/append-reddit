// 1. Handle navigation events
chrome.webNavigation.onCommitted.addListener(async (details) => {
    // Check that we're not working w/ an iframe
    if (details.frameId !== 0) return;

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

// 2. Handle toolbar icon clicks (the toggle)
chrome.action.onClicked.addListener(async () => {
    // Get the enabled bool
    const { enabled } = await chrome.storage.local.get({ enabled: true });
    const newEnabled = !enabled;

    await chrome.storage.local.set({ enabled: newEnabled});

    chrome.action.setBadgeText({
        text: newEnabled ? "ON" : "OFF"
    });
});
