# Permission Justifications

Below are the justifications for the permissions requested by the "MD Reader" extension, as required for the Chrome Web Store submission.

---

## `tabs` Permission

**Purpose:** This permission is required for the core functionality of the extension.

**Justification:** The primary function of this extension is to render the content of a local Markdown (`.md`) file in a new browser tab. To achieve this, the extension must be able to open a new tab using the `chrome.tabs.create()` API. This API call requires the `tabs` permission. Without it, the extension cannot display the rendered content to the user, making it non-functional.

---

## `storage` Permission

**Purpose:** This permission is used to save and sync user settings.

**Justification:** This extension includes a dark mode feature. The `storage` permission is used to save the user's theme preference (light or dark mode) via the `chrome.storage.sync` API. This allows the user's choice to be preserved when they close and reopen the extension, and also syncs their preference across different devices logged into the same Google account.
