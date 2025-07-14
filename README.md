# Previous Tab Keyboard Shortcut 🔄

*The extension Chrome should have built themselves... about a decade ago.*

## What Does This Thing Do?

Ever wanted `Ctrl+Tab` to switch to your **previously focused tab** instead of Chrome's default behavior of cycling through tabs like you're playing some sort of browser roulette? Yeah, me too. 😢

Back in the day, awesome extensions like AutoControl could **override** Chrome's default `Ctrl+Tab` to make it behave sensibly - jumping to your last focused tab instead of just the next one in line. This extension brings back that sweet, sweet sanity with a simple keyboard shortcut. No more tab surfing, no more "where the heck was I?", just pure, unadulterated tab-switching bliss.

## Features That Actually Matter

- 🎯 **Smart Tab Switching**: Jumps to your previously focused tab, not just the next one in line
- 🧠 **Remembers Everything**: Maintains a history of your last 10 focused tabs
- 🔄 **Handles Closed Tabs**: If your previous tab got closed, it tries the next one in history
- 🪟 **Multi-Window Support**: Works independently in each Chrome window
- 🚫 **No Tab Loss**: Never loses track of your tabs (unlike some *other* extensions)
- 🔄 **Graceful Restart Recovery**: Rebuilds history naturally after browser restart

## The Tragic Backstory 😭

Once upon a time, there was this amazing extension called [AutoControl](https://chromewebstore.google.com/detail/autocontrol-keyboard-shor/lkaihdpfpifdlgoapbfocpmekbokmcfd?utm_source=ext_app_menu) that could **override** ANY Chrome shortcut, including turning the useless default `Ctrl+Tab` (which just cycles through tabs) into the holy grail of switching to previously focused tabs. Life was good.

Then Chrome Manifest V3 happened. 💀

Google, in their infinite wisdom, decided to:
- ❌ Disallow extensions from overriding `Ctrl+Tab` and other built-in shortcuts
- ❌ Remove many apps that allowed creating custom shortcuts
- ❌ Break AutoControl and similar extensions
- ❌ Keep the useless default `Ctrl+Tab` behavior (cycles through tabs in order)
- ❌ Still not build the obviously superior "switch to previously focused tab" functionality themselves (seriously, Google?)

So here we are, building workarounds for something that should have been built into Chrome years ago. *Thanks, Google.*

## Installation & Setup

### Step 1: Install the Extension
1. Download this extension
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension folder

### Step 2: Customize the Keyboard Shortcut (Optional)
The default shortcut is `Alt+Q`, but you can change it:

1. Go to `chrome://extensions/shortcuts`
2. Find "Previous Tab Keyboard Shortcut"
3. Click the pencil icon next to "Switch to previous tab"
4. Press your desired key combination

**Supported Keys:** `A-Z`, `0-9`, `F1-F12`, `Comma`, `Period`, `Home`, `End`, `PageUp`, `PageDown`, `Space`, `Insert`, `Delete`, `Up`, `Down`, `Left`, `Right`, plus modifiers `Ctrl`, `Alt`, `Shift`

*Note: Chrome won't let you use the backtick (\`) or `Ctrl+Tab` directly because... reasons.* 🤷‍♀️

### Step 3: Start Using It!
The extension learns your tab usage patterns as you browse. After a browser restart or opening a new window, you'll need to switch between tabs at least once before the "previous tab" functionality becomes available - this is normal behavior since there's no meaningful "previous tab" until you actually navigate!

## The `Ctrl+Tab` Workaround 🎩✨

Missing `Ctrl+Tab`? Here's the magic trick that actually works:

### What You'll Need:
- This extension (obviously)
- [Windows PowerToys](https://learn.microsoft.com/en-us/windows/powertoys/keyboard-manager) (free Microsoft utility)

### The Setup:
1. **Install this extension** and note its keyboard shortcut (default: `Alt+Q`)
2. **Download and install PowerToys**
3. **Open PowerToys Settings** → **Keyboard Manager**
4. **Click "Remap a shortcut"**
5. **Add a new mapping:**
   - **From:** `Ctrl+Tab`
   - **To:** `Alt+Q` (or whatever you set the extension to)
   - **Target Application:** chrome.exe (optional, but recommended)

![PowerToys Keyboard Manager Setup](powertoys-setup.png)
*Example: Mapping Ctrl+Tab to Alt+Q for chrome.exe*

**BOOM!** 💥 Now `Ctrl+Tab` switches to previously focused tabs like it should, instead of Chrome's default useless tab cycling!

## Why This Extension Rocks vs. Others

Other tab-switching extensions in the Chrome Web Store:
- ❌ Don't handle closed tabs properly
- ❌ Lose track when browser restarts
- ❌ Don't support `Ctrl+Tab` (obviously)
- ❌ Don't maintain proper tab history
- ❌ Poor multi-window support

This extension:
- ✅ Handles all edge cases gracefully
- ✅ Rebuilds history intelligently after restart
- ✅ Works independently in each Chrome window
- ✅ Works with the PowerToys workaround for `Ctrl+Tab`
- ✅ Actually works like you'd expect it to

## Technical Stuff (For the Nerds) 🤓

- **Manifest Version:** 3 (because we have no choice)
- **Permissions:** `storage` (for persistence), `tabs` (for tab management)
- **Background:** Service worker (no more background pages, RIP)
- **History Size:** 10 tabs (configurable in code)
- **Persistence:** `chrome.storage.local`

## Contributing

Found a bug? Want a feature? Open an issue! PRs welcome.

Just remember: this extension exists because Chrome doesn't have basic functionality that users have been requesting for years. We're all just trying to make the best of a frustrating situation. 🤷‍♂️

## License

MIT License - because sharing is caring, and maybe Google will finally get the hint.

---

*"In a world where Chrome removed useful shortcuts, one extension dared to bring them back... sort of."* 🎬 