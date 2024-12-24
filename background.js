// Store active tabs and their timing information
let activeTimers = {};
let currentDomain = null;

// Listen for tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    handleTabChange(tab);
  } catch (error) {
    console.error("Error:", error);
  }
});

// Listen for tab updates (URL changes)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    handleTabChange(tab);
  }
});

function handleTabChange(tab) {
  if (!tab.url) return;

  const url = new URL(tab.url);
  const domain = url.hostname;

  // List of coding websites to track
  const codingSites = [
    "github.com",
    "stackoverflow.com",
    "gitlab.com",
    "developer.mozilla.org",
  ];

  // Only start tracking if it's a new domain
  if (codingSites.some((site) => domain.includes(site))) {
    if (currentDomain !== domain) {
      startTracking(domain);
      currentDomain = domain;
    }
  } else {
    // If not a coding site, clear timers and reset current domain
    Object.keys(activeTimers).forEach((key) => {
      clearInterval(activeTimers[key]);
      delete activeTimers[key];
    });
    currentDomain = null;
  }
}

function startTracking(domain) {
  // Only clear the previous timer if it exists
  if (activeTimers[currentDomain]) {
    clearInterval(activeTimers[currentDomain]);
    delete activeTimers[currentDomain];
  }

  // Start new timer for current domain
  activeTimers[domain] = setInterval(async () => {
    try {
      const data = await chrome.storage.local.get("codingTime");
      const codingTime = data.codingTime || {};
      codingTime[domain] = (codingTime[domain] || 0) + 1;
      await chrome.storage.local.set({ codingTime });
      console.log(`Updated time for ${domain}:`, codingTime[domain]);
    } catch (error) {
      console.error("Error updating time:", error);
    }
  }, 60000); // Update every minute
}
