// Give us a reference to the checkbox (slider)
const toggle = document.getElementById("toggle");

// Check from storage whether the extension is enabled;
// set the toggle's status accordingly
// This function needs to be called whenever the popup is opened
async function syncToggleFromStorage() {
    const { enabled } = await chrome.storage.local.get({ enabled: true });
    toggle.checked = enabled;
}

// Add a function that runs whenever the toggle is switched
toggle.addEventListener("change", async () => {
    
    // Define enabled directly based on toggle status
    const newEnabled = toggle.checked;

    // Update enabled in storage
    await chrome.storage.local.set({ enabled: newEnabled });

    chrome.action.setBadgeText({
        text: newEnabled ? "ON" : "OFF"
    });
});

// Now here's the JS that runs on the popup:
// Initialize popup UI when it opens
syncToggleFromStorage();
