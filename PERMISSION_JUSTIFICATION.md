# Permission Justifications

Below are the justifications for the permissions requested by the "MD Reader" extension, as required for the Chrome Web Store submission.

---

## `storage` Permission

**Purpose:** This permission is used to save and sync user settings and to keep a local draft of the text in the editor.

**Justification:** This extension includes a dark mode feature. The `storage` permission is used to save the user's theme preference (light or dark mode) via the `chrome.storage.sync` API. This allows the user's choice to be preserved when they close and reopen the extension, and also syncs their preference across different devices logged into the same Google account. The same permission is also used to store the markdown text that is being edited as a local draft (`chrome.storage.local`) so that unsaved work is not lost when the tab is closed.

---

## No Further Permissions

Saving a file does not require any additional permission: the extension page uses the standard File System Access API (`showSaveFilePicker`), which always asks the user which file to write to. Reading a file works through a regular `<input type="file">` element and a drag-and-drop dropzone. The content of the user's files is only used locally to render the markdown in a new tab; nothing is sent to a server.
