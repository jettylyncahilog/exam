// Chat Everywhere - Manifest V3 service worker

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CAPTURE_SCREEN") {
    const windowId = sender.tab?.windowId;

    if (windowId == null) {
      sendResponse({ success: false, error: "Could not determine browser window." });
      return true;
    }

    chrome.tabs.captureVisibleTab(windowId, { format: "png" })
      .then(dataUrl => sendResponse({ success: true, dataUrl }))
      .catch(error => {
        console.error("Screenshot failed:", error);
        sendResponse({
          success: false,
          error: error?.message || "Screenshot failed."
        });
      });

    return true;
  }

  if (message.type === "SAVE_SCREENSHOT") {
    saveScreenshot(message.image)
      .then(() => sendResponse({ success: true }))
      .catch(error => {
        console.error("Could not save screenshot:", error);
        sendResponse({
          success: false,
          error: error?.message || "Could not save screenshot."
        });
      });

    return true;
  }

  if (message.type === "DELETE_SCREENSHOT") {
    chrome.storage.local.get(["screenshots"])
      .then(result => {
        const screenshots = result.screenshots || [];
        return chrome.storage.local.set({
          screenshots: screenshots.filter(item => item.id !== message.id)
        });
      })
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({
        success: false,
        error: error?.message || "Delete failed."
      }));

    return true;
  }
});

async function saveScreenshot(image) {
  const result = await chrome.storage.local.get(["screenshots"]);
  let screenshots = result.screenshots || [];

  screenshots.unshift({
    id: crypto.randomUUID(),
    type: "screenshot",
    image,
    createdAt: new Date().toISOString()
  });

  // Keep the newest 30 screenshots.
  screenshots = screenshots.slice(0, 30);

  await chrome.storage.local.set({ screenshots });
}