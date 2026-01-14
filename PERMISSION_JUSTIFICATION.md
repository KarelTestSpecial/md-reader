# Permission Justifications

Below are the justifications for the permissions requested by the "MD Reader" extension, as required for the Chrome Web Store submission.

---

## `storage` Permission

**Purpose:** This permission is used to save and sync user settings.

**Justification:** This extension includes a dark mode feature. The `storage` permission is used to save the user's theme preference (light or dark mode) via the `chrome.storage.sync` API. This allows the user's choice to be preserved when they close and reopen the extension, and also syncs their preference across different devices logged into the same Google account.
