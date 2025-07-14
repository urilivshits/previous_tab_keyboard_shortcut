// Constants for tab history management
const HISTORY_KEY = 'tabHistory';
const MAX_HISTORY_LENGTH = 10;

// Initialize storage on extension install and validate on startup
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set({ [HISTORY_KEY]: [] });
  } else {
    // On startup or update, validate existing history
    await validateAndRebuildHistory();
  }
});

// Handle browser startup - validate and rebuild tab history
chrome.runtime.onStartup.addListener(async () => {
  await validateAndRebuildHistory();
});

// Validate stored tab IDs and rebuild history if needed
async function validateAndRebuildHistory() {
  try {
    const { [HISTORY_KEY]: history = [] } = await chrome.storage.local.get(HISTORY_KEY);
    
    // Check which stored tab IDs are still valid
    const validTabIds = [];
    for (const tabId of history) {
      try {
        await chrome.tabs.get(tabId);
        validTabIds.push(tabId);
      } catch (error) {
        // Tab ID is invalid, skip it
      }
    }
    
    // If we lost all history, start fresh and track current tab
    if (validTabIds.length === 0) {
      await initializeWithCurrentTab();
    } else if (validTabIds.length !== history.length) {
      // Just clean up invalid IDs
      await chrome.storage.local.set({ [HISTORY_KEY]: validTabIds });
    }
  } catch (error) {
    console.error('Error validating tab history:', error);
  }
}

// Initialize history with the currently active tab
async function initializeWithCurrentTab() {
  try {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (activeTab) {
      await chrome.storage.local.set({ [HISTORY_KEY]: [activeTab.id] });
    } else {
      await chrome.storage.local.set({ [HISTORY_KEY]: [] });
    }
  } catch (error) {
    console.error('Error initializing with current tab:', error);
    await chrome.storage.local.set({ [HISTORY_KEY]: [] });
  }
}

// Track tab activations
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // Get current history from storage
  const { [HISTORY_KEY]: history = [] } = await chrome.storage.local.get(HISTORY_KEY);
  
  // Remove existing entry if tab is already in history (avoid duplicates)
  const filteredHistory = history.filter(id => id !== activeInfo.tabId);
  
  // Add new tab to the beginning of the history
  const updatedHistory = [activeInfo.tabId, ...filteredHistory];
  
  // Trim history to maintain MAX_HISTORY_LENGTH
  const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_LENGTH);
  
  // Save updated history back to storage
  await chrome.storage.local.set({ [HISTORY_KEY]: trimmedHistory });
});

// Clean up closed tabs from history
chrome.tabs.onRemoved.addListener(async (tabId) => {
  // Get current history from storage
  const { [HISTORY_KEY]: history = [] } = await chrome.storage.local.get(HISTORY_KEY);
  
  // Remove closed tab from history
  const updatedHistory = history.filter(id => id !== tabId);
  
  // Save updated history back to storage
  await chrome.storage.local.set({ [HISTORY_KEY]: updatedHistory });
});

// Handle keyboard shortcut command
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'switch-to-previous-tab') {
    try {
      // Get current active tab
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Get tab history from storage
      const { [HISTORY_KEY]: history = [] } = await chrome.storage.local.get(HISTORY_KEY);
      
      // Array to track tabs to remove from history
      const tabsToRemove = [];
      
      // Iterate through history to find a valid tab
      for (const tabId of history) {
        // Skip current tab
        if (tabId === activeTab.id) continue;
        
        try {
          // Check if tab exists
          await chrome.tabs.get(tabId);
          
          // Switch to valid tab
          await chrome.tabs.update(tabId, { active: true });
          break;
          
        } catch (error) {
          // Tab doesn't exist, mark for removal
          tabsToRemove.push(tabId);
        }
      }
      
      // Remove invalid tabs from history if any
      if (tabsToRemove.length > 0) {
        const updatedHistory = history.filter(id => !tabsToRemove.includes(id));
        await chrome.storage.local.set({ [HISTORY_KEY]: updatedHistory });
      }
      
    } catch (error) {
      console.error('Error in tab switching:', error);
    }
  }
});
