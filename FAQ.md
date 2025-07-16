# Frequently Asked Questions

## Installation & Setup

### Q: How do I install the extension?
**A:** Download the extension files, go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", and select the extension folder.

### Q: The keyboard shortcuts aren't working. What should I do?
**A:** Go to `chrome://extensions/shortcuts` and manually assign the shortcuts:
- **Alt+W** for "Switch to previous tab"
- **Alt+Q** for "Switch to left tab"
- **Alt+E** for "Switch to right tab"

### Q: Can I use Ctrl+Tab instead of Alt+W?
**A:** Unfortunately, Chrome doesn't allow extensions to override built-in shortcuts like Ctrl+Tab. However, you can use PowerToys (Windows) or Karabiner (Mac) to remap Ctrl+Tab to Alt+W.

## Functionality

### Q: How does the extension remember my tab history?
**A:** The extension tracks which tabs you activate and stores this information locally in your browser. It remembers up to 10 of your most recently focused tabs.

### Q: What happens when I close a tab?
**A:** The extension automatically removes closed tabs from the history and will switch to the next available tab in your history.

### Q: Does this work across multiple Chrome windows?
**A:** Yes! Each Chrome window maintains its own independent tab history, so switching tabs in one window doesn't affect others.

### Q: Will this work after restarting Chrome?
**A:** The extension will rebuild your tab history naturally as you start using tabs again. After a restart, you'll need to switch between tabs at least once before the "previous tab" functionality becomes available.

## Privacy & Security

### Q: Does this extension collect any data?
**A:** **No.** This extension does not collect, store, or transmit any personal data. All tab history is stored locally on your device.

### Q: What permissions does the extension need?
**A:** The extension requires:
- **Storage**: To save your tab history locally
- **Tabs**: To manage tab switching and track active tabs

### Q: Is my browsing history safe?
**A:** Yes. The extension only tracks tab IDs (numbers) and doesn't read or store any website content, URLs, or personal information.

## Troubleshooting

### Q: The extension stopped working after a Chrome update
**A:** Try these steps:
1. Go to `chrome://extensions/`
2. Toggle the extension off and on
3. Check if shortcuts need to be reassigned at `chrome://extensions/shortcuts`

### Q: Alt+E isn't working (opens Chrome menu)
**A:** This is a known conflict. Either:
- Use a different shortcut in `chrome://extensions/shortcuts`
- Or use Alt+W for previous tab instead

### Q: The extension doesn't remember tabs from before installation
**A:** This is expected behavior. The extension starts tracking tab history from the moment it's installed.

### Q: How do I completely reset the extension?
**A:** Uninstall and reinstall the extension, or clear your browser's local storage for the extension.

## Compatibility

### Q: Does this work on Mac/Linux?
**A:** Yes! The extension works on all platforms where Chrome runs. The keyboard shortcuts may need adjustment based on your operating system.

### Q: Will this work with other tab management extensions?
**A:** Generally yes, but conflicts are possible. If you experience issues, try disabling other tab-related extensions temporarily.

### Q: Does this work in incognito mode?
**A:** You'll need to enable the extension for incognito mode in `chrome://extensions/` by clicking "Details" on the extension and enabling "Allow in incognito."

## Advanced Usage

### Q: Can I change the keyboard shortcuts?
**A:** Yes! Go to `chrome://extensions/shortcuts` to customize all keyboard shortcuts.

### Q: How many tabs does it remember?
**A:** The extension keeps track of your last 10 focused tabs.

### Q: Can I see my tab history?
**A:** The extension doesn't provide a UI for viewing history, but the data is stored locally and can be accessed through browser developer tools if needed.

### Q: Does this work with Chrome's tab groups?
**A:** Yes, the extension works with tab groups and will switch between tabs regardless of their group assignment.
