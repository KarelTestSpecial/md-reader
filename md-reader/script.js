/*
 * MD Reader – read, write, render and save markdown in the browser.
 *
 * The page runs as a Chrome extension page (chrome-extension://) but also
 * works as a plain web page, which keeps it easy to test and preview.
 */

const dropzone = document.getElementById('dropzone');
const themeToggle = document.getElementById('checkbox');
const renderBtn = document.getElementById('render-btn');
const saveBtn = document.getElementById('save-btn');
const markdownInput = document.getElementById('markdown-input');
const statusEl = document.getElementById('status');
const counterEl = document.getElementById('counter');
const fileUpload = document.getElementById('file-upload');

const DEFAULT_FILENAME = 'document.md';
const DEFAULT_TITLE = 'Rendered Markdown';
const THEME_KEY = 'darkMode';
const DRAFT_KEY = 'draft';
const DRAFT_DEBOUNCE_MS = 600;

/* ------------------------------------------------------------------ *
 * Environment helpers (extension page vs. plain web page)
 * ------------------------------------------------------------------ */
const hasChromeStorage = typeof chrome !== 'undefined' && !!chrome.storage;
const hasChromeTabs = typeof chrome !== 'undefined' && !!chrome.tabs;

function storageGet(area, key, fallback) {
  if (hasChromeStorage) {
    return new Promise((resolve) => {
      chrome.storage[area].get([key], (data) => {
        resolve(data && key in data ? data[key] : fallback);
      });
    });
  }
  try {
    const raw = localStorage.getItem('mdreader:' + area + ':' + key);
    return Promise.resolve(raw === null ? fallback : JSON.parse(raw));
  } catch (err) {
    return Promise.resolve(fallback);
  }
}

function storageSet(area, key, value) {
  if (hasChromeStorage) {
    return new Promise((resolve) => chrome.storage[area].set({ [key]: value }, () => resolve()));
  }
  try {
    localStorage.setItem('mdreader:' + area + ':' + key, JSON.stringify(value));
  } catch (err) {
    /* storage full or disabled – the editor simply keeps working in memory */
  }
  return Promise.resolve();
}

/* ------------------------------------------------------------------ *
 * Editor state
 * ------------------------------------------------------------------ */
let fileHandle = null;      // FileSystemFileHandle from a previous save
let currentName = DEFAULT_FILENAME;
let isDirty = false;
let draftTimer = null;
let statusTimer = null;

/* ------------------------------------------------------------------ *
 * Theme
 * ------------------------------------------------------------------ */
function setTheme(isDark) {
  document.body.classList.toggle('dark-mode', !!isDark);
  themeToggle.checked = !!isDark;
}

themeToggle.addEventListener('change', () => {
  const isDark = themeToggle.checked;
  setTheme(isDark);
  storageSet('sync', THEME_KEY, isDark);
});

/* ------------------------------------------------------------------ *
 * Status line + word counter
 * ------------------------------------------------------------------ */
function setStatus(message, tone) {
  clearTimeout(statusTimer);
  statusEl.textContent = message || '';
  statusEl.className = tone || '';
  if (message && tone !== 'warn' && tone !== 'error') {
    statusTimer = setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = '';
    }, 6000);
  }
}

function updateCounter() {
  const text = markdownInput.value;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  counterEl.textContent = words + ' words · ' + text.length + ' characters' +
    (isDirty ? ' · unsaved changes' : '');
  counterEl.classList.toggle('dirty', isDirty);
  document.title = (isDirty ? '• ' : '') + (currentName || DEFAULT_FILENAME) + ' – MD Reader';
}

function markDirty(value) {
  isDirty = value;
  updateCounter();
}

/* ------------------------------------------------------------------ *
 * Draft autosave (local only – so a closed tab never loses your text)
 * ------------------------------------------------------------------ */
function draftPayload() {
  return { text: markdownInput.value, name: currentName, dirty: isDirty };
}

function scheduleDraftSave() {
  clearTimeout(draftTimer);
  draftTimer = setTimeout(() => {
    storageSet('local', DRAFT_KEY, draftPayload());
  }, DRAFT_DEBOUNCE_MS);
}

function saveDraftNow() {
  clearTimeout(draftTimer);
  return storageSet('local', DRAFT_KEY, draftPayload());
}

async function restoreDraft() {
  const draft = await storageGet('local', DRAFT_KEY, null);
  if (!draft || typeof draft.text !== 'string' || !draft.text.trim()) return;
  markdownInput.value = draft.text;
  if (draft.name) currentName = draft.name;
  const wasDirty = draft.dirty !== false;
  markDirty(wasDirty);
  setStatus(wasDirty ? 'Restored your unsaved draft.' : 'Reopened your last text.', '');
}

/* ------------------------------------------------------------------ *
 * Rendering
 * ------------------------------------------------------------------ */
function buildPreviewHtml(bodyContent, title, isDark) {
  let themeCss = `
      <style>
          body {
              font-family: sans-serif;
              line-height: 1.6;
              padding: 2em;
              max-width: 95%; /* Increased from 800px to allow scaling */
              margin: 0 auto;
          }
          table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f4f4f4; text-align: left; }
      </style>
  `;
  if (isDark) {
    themeCss = `
        <style>
            body {
                background-color: #1a1a1a;
                color: #eee;
                font-family: sans-serif;
                line-height: 1.6;
                padding: 2em;
                max-width: 95%; /* Increased from 800px to allow scaling */
                margin: 0 auto;
            }
            a { color: #58a6ff; }
            code { background-color: #2a2a2a; padding: 0.2em 0.4em; border-radius: 3px; border: 1px solid #444; }
            pre { background-color: #2a2a2a; padding: 1em; border-radius: 5px; overflow-x: auto; border: 1px solid #444;}
            blockquote { border-left: 5px solid #555; padding-left: 1em; color: #ccc; }
            hr { border-color: #555; }
            img { max-width: 100%; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
            th, td { border: 1px solid #444; padding: 8px; }
            th { background-color: #333; text-align: left; }
        </style>
    `;
  }

  return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>${title}</title>
          ${themeCss}
      </head>
      <body>
          ${bodyContent}
      </body>
      </html>
  `;
}

function openPreview(fullHtml) {
  if (hasChromeTabs) {
    chrome.tabs.create({ url: 'data:text/html;charset=utf-8,' + encodeURIComponent(fullHtml) });
    return;
  }
  const preview = window.open('', '_blank');
  if (!preview) {
    setStatus('Please allow pop-ups to open the rendered view.', 'error');
    return;
  }
  preview.document.open();
  preview.document.write(fullHtml);
  preview.document.close();
}

function renderMarkdown(markdownText, title = DEFAULT_TITLE) {
  const bodyContent = marked.parse(markdownText);
  storageGet('sync', THEME_KEY, false).then((isDark) => {
    openPreview(buildPreviewHtml(bodyContent, title, !!isDark));
  });
}

function renderFromEditor() {
  const markdownText = markdownInput.value;
  if (!markdownText.trim()) {
    setStatus('Nothing to render yet – write or paste some markdown first.', 'warn');
    return;
  }
  renderMarkdown(markdownText, currentName || DEFAULT_TITLE);
}

/* ------------------------------------------------------------------ *
 * Saving – standard file picker (File System Access API),
 * with a download fallback for browsers without it.
 * ------------------------------------------------------------------ */
function suggestedFileName() {
  const name = (currentName || DEFAULT_FILENAME).trim() || DEFAULT_FILENAME;
  return /\.[a-z0-9]+$/i.test(name) ? name : name + '.md';
}

function isAbortError(err) {
  if (!err) return false;
  if (err.name === 'AbortError') return true;
  return /aborted|cancell?ed/i.test(err.message || '');
}

async function writeToHandle(handle, text) {
  const writable = await handle.createWritable();
  await writable.write(text);
  await writable.close();
}

function downloadText(text, filename) {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function afterSave(name, message) {
  currentName = name;
  markDirty(false);
  saveDraftNow();
  setStatus(message, 'ok');
}

async function saveDocument(options = {}) {
  const forcePicker = !!options.forcePicker;
  const text = markdownInput.value;

  if (!text.trim()) {
    setStatus('Nothing to save yet – write or paste some markdown first.', 'warn');
    return;
  }

  let handleWasLost = false;

  // Keep writing to the file the user already picked (classic "Save").
  if (fileHandle && !forcePicker) {
    try {
      await writeToHandle(fileHandle, text);
      afterSave(fileHandle.name, 'Saved to “' + fileHandle.name + '”.');
      return;
    } catch (err) {
      if (isAbortError(err)) {
        setStatus('Save cancelled.', '');
        return;
      }
      // The file was moved, deleted or the permission was revoked.
      console.warn('Could not write to the previous file.', err);
      fileHandle = null;
      handleWasLost = true;
    }
  }

  // Standard file picker: works for local folders and for cloud folders that
  // are synced with the file system (Drive, OneDrive, Dropbox, ...).
  if (typeof window.showSaveFilePicker === 'function') {
    let handle = null;
    try {
      handle = await window.showSaveFilePicker({
        id: 'md-reader-save',
        suggestedName: suggestedFileName(),
        types: [
          { description: 'Markdown', accept: { 'text/markdown': ['.md', '.markdown'] } },
          { description: 'Text file', accept: { 'text/plain': ['.txt'] } }
        ]
      });
    } catch (err) {
      if (isAbortError(err)) {
        setStatus('Save cancelled.', '');
        return;
      }
      console.warn('The save dialog could not be opened.', err);
      if (handleWasLost) {
        // The failed write used up the click that triggered this save, so the
        // picker needs a fresh user gesture.
        setStatus('That file can no longer be written to – press Save again to pick a file.', 'warn');
        return;
      }
    }

    if (handle) {
      try {
        await writeToHandle(handle, text);
        fileHandle = handle;
        afterSave(handle.name, 'Saved to “' + handle.name + '”.');
        return;
      } catch (err) {
        if (isAbortError(err)) {
          setStatus('Save cancelled.', '');
          return;
        }
        console.warn('Could not write the file.', err);
        setStatus('Could not save “' + handle.name + '”: ' + (err.message || err), 'error');
        return;
      }
    }
  }

  // Fallback: no file picker in this browser – download the text instead.
  const name = suggestedFileName();
  downloadText(text, name);
  afterSave(name, 'No save dialog available – “' + name + '” was downloaded instead.');
}

/* ------------------------------------------------------------------ *
 * Loading files (drop + browse)
 * ------------------------------------------------------------------ */
function isSupportedFile(file) {
  return /\.(md|markdown|txt)$/i.test(file.name) || file.type === 'text/markdown';
}

function loadFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const markdownText = event.target.result;
    markdownInput.value = markdownText;
    currentName = file.name;
    fileHandle = null;
    markDirty(false);
    scheduleDraftSave();
    setStatus('Loaded “' + file.name + '” into the editor.', 'ok');
    renderMarkdown(markdownText, file.name);
  };
  reader.readAsText(file);
}

function handleFiles(files) {
  if (!files || files.length === 0) return;
  const file = files[0];
  if (!isSupportedFile(file)) {
    alert('Please choose a valid .md file.');
    return;
  }
  loadFile(file);
}

dropzone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropzone.classList.add('hover');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('hover');
});

dropzone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropzone.classList.remove('hover');
  handleFiles(event.dataTransfer.files);
});

if (fileUpload) {
  fileUpload.addEventListener('change', (event) => {
    handleFiles(event.target.files);
    event.target.value = '';
  });
}

/* ------------------------------------------------------------------ *
 * Buttons + shortcuts
 * ------------------------------------------------------------------ */
saveBtn.addEventListener('click', (event) => {
  saveDocument({ forcePicker: event.shiftKey });
});

renderBtn.addEventListener('click', renderFromEditor);

markdownInput.addEventListener('input', () => {
  markDirty(true);
  scheduleDraftSave();
});

document.addEventListener('keydown', (event) => {
  const modifier = event.ctrlKey || event.metaKey;
  if (!modifier) return;
  const key = event.key.toLowerCase();
  if (key === 's') {
    event.preventDefault();
    saveDocument({ forcePicker: event.shiftKey });
  } else if (key === 'enter') {
    event.preventDefault();
    renderFromEditor();
  }
});

/* ------------------------------------------------------------------ *
 * Startup
 * ------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', async () => {
  const isDark = await storageGet('sync', THEME_KEY, false);
  setTheme(isDark);
  updateCounter();
  markdownInput.focus();
  await restoreDraft();
  updateCounter();
});
