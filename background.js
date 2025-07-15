// Constants for tab history management
const HISTORY_KEY = 'tabHistory';
const MAX_HISTORY_LENGTH = 10;

// State management for preventing repeated shortcut execution
let lastCommandTime = 0;

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
  // Block auto-repeat events - these typically fire every 30-100ms when holding keys
  const currentTime = Date.now();
  const timeSinceLast = currentTime - lastCommandTime;
  
  // Use 150ms threshold to reliably catch auto-repeat while allowing intentional presses
  if (timeSinceLast < 150) {
    return; // Skip auto-repeat events
  }
  
  lastCommandTime = currentTime;

  try {
    // Get current active tab
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!activeTab) return;

    switch (command) {
      case 'switch-to-previous-tab':
        await handleSwitchToPreviousTab(activeTab);
        break;
      case 'switch-to-left-tab':
        await handleSwitchToLeftTab(activeTab);
        break;
      case 'switch-to-right-tab':
        await handleSwitchToRightTab(activeTab);
        break;
    }
  } catch (error) {
    console.error('Error in tab switching:', error);
  }
});

// Handle switching to the previously focused tab
async function handleSwitchToPreviousTab(activeTab) {
  try {
    // Get tab history from storage
    const { [HISTORY_KEY]: history = [] } = await chrome.storage.local.get(HISTORY_KEY);
    
    // If history is empty, try to rebuild it from recent tab activations
    if (history.length === 0) {
      await rebuildHistoryFromRecentTabs(activeTab.windowId);
      const { [HISTORY_KEY]: rebuiltHistory = [] } = await chrome.storage.local.get(HISTORY_KEY);
      if (rebuiltHistory.length === 0) {
        return; // No history available
      }
    }
    
    // Array to track tabs to remove from history
    const tabsToRemove = [];
    let switched = false;
    
    // Iterate through history to find a valid tab in the current window
    for (const tabId of history) {
      // Skip current tab
      if (tabId === activeTab.id) continue;
      
      try {
        // Check if tab exists and is in the same window
        const tab = await chrome.tabs.get(tabId);
        
        if (tab.windowId === activeTab.windowId) {
          // Switch to valid tab in current window
          await chrome.tabs.update(tabId, { active: true });
          switched = true;
          break;
        }
        // Tab exists but in different window - keep in history, just skip
        
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
    
    // If no valid previous tab found and we have history, rebuild from scratch
    if (!switched && history.length > 0) {
      await validateAndRebuildHistory();
      // Try one more time with rebuilt history
      const { [HISTORY_KEY]: newHistory = [] } = await chrome.storage.local.get(HISTORY_KEY);
      for (const tabId of newHistory) {
        if (tabId === activeTab.id) continue;
        try {
          const tab = await chrome.tabs.get(tabId);
          if (tab.windowId === activeTab.windowId) {
            await chrome.tabs.update(tabId, { active: true });
            break;
          }
        } catch (error) {
          // Continue to next tab
        }
      }
    }
  } catch (error) {
    console.error('Error switching to previous tab:', error);
  }
}

// Rebuild history from recent tab activations when history is lost
async function rebuildHistoryFromRecentTabs(windowId) {
  try {
    // Get all tabs in the window
    const tabs = await chrome.tabs.query({ windowId });
    
    // Sort by last access time (most recent first)
    tabs.sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0));
    
    // Take the most recently accessed tabs (excluding the current one)
    const recentTabs = tabs
      .filter(tab => tab.active === false)
      .slice(0, MAX_HISTORY_LENGTH)
      .map(tab => tab.id);
    
    if (recentTabs.length > 0) {
      await chrome.storage.local.set({ [HISTORY_KEY]: recentTabs });
    }
  } catch (error) {
    console.error('Error rebuilding history from recent tabs:', error);
  }
}

// Handle switching to the left tab
async function handleSwitchToLeftTab(activeTab) {
  try {
    // Get all tabs in the current window, ordered by index
    const tabs = await chrome.tabs.query({ windowId: activeTab.windowId });
    tabs.sort((a, b) => a.index - b.index);
    
    // Find current tab index
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab.id);
    
    if (currentIndex === -1) return;
    
    // Calculate left tab index (wrap around to end if at beginning)
    const leftIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    
    // Switch to the left tab
    await chrome.tabs.update(tabs[leftIndex].id, { active: true });
  } catch (error) {
    console.error('Error switching to left tab:', error);
  }
}

// Handle switching to the right tab
async function handleSwitchToRightTab(activeTab) {
  try {
    // Get all tabs in the current window, ordered by index
    const tabs = await chrome.tabs.query({ windowId: activeTab.windowId });
    tabs.sort((a, b) => a.index - b.index);
    
    // Find current tab index
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab.id);
    
    if (currentIndex === -1) return;
    
    // Calculate right tab index (wrap around to beginning if at end)
    const rightIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
    
    // Switch to the right tab
    await chrome.tabs.update(tabs[rightIndex].id, { active: true });
  } catch (error) {
    console.error('Error switching to right tab:', error);
  }
}
