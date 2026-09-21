# Privacy Policy for MD Reader

This page explains the privacy policy for the "MD Reader" Chrome extension.

## Data Collection and Usage

The "MD Reader" extension **does not** collect, store, or transmit any personal data or the content of your files.

### File Processing

When you drag and drop a Markdown file (`.md`) into the extension, its content is read locally in your browser. This content is used solely to render the formatted version in a new tab and to fill the editor. The file content never leaves your computer and is not stored or processed on any server.

### Saving Files

The editor has a **Save** button. Saving uses the browser's own file picker (File System Access API): you choose the folder and file name yourself, and the text is written directly to that file on your own device. If you pick a folder that belongs to a cloud storage service (Google Drive, OneDrive, Dropbox, ...) that is synced with your computer, that service may upload the file afterwards, in the same way as it would for any other file you save there. The extension itself never uploads anything and has no access to your files beyond the file you pick.

### Draft Autosave

While you type, the text in the editor is kept as a local draft using the browser's own `chrome.storage.local` storage, so that your work is not lost when the tab is closed. This draft stays on your device, is never synced to a server and is overwritten or discarded as soon as you load, save or clear the text.

### Settings

The extension uses the `chrome.storage.sync` API to save your preference for the dark mode feature. This setting is synced with your own Google Account, allowing you to have the same setting across different devices. The developer of this extension does not have access to this stored data.

## Summary

Your data and files remain your own and are processed exclusively locally on your computer.
