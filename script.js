const dropzone = document.getElementById('dropzone');
const themeToggle = document.getElementById('checkbox');
const renderBtn = document.getElementById('render-btn');
const markdownInput = document.getElementById('markdown-input');

// Function to set the theme
function setTheme(isDark) {
  if (isDark) {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
  } else {
    document.body.classList.remove('dark-mode');
    themeToggle.checked = false;
  }
}

// Load the saved theme preference
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('darkMode', (data) => {
    setTheme(data.darkMode);
  });
});

// Save theme preference when the toggle is clicked
themeToggle.addEventListener('change', () => {
  const isDark = themeToggle.checked;
  chrome.storage.sync.set({ 'darkMode': isDark });
  setTheme(isDark);
});


dropzone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropzone.classList.add('hover');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('hover');
});

function renderMarkdown(markdownText, title = 'Rendered Markdown') {

    // Oude versie:
    // const bodyContent = marked(markdownText);

    // Nieuwe versie (vaak):
    const bodyContent = marked.parse(markdownText);
  
    chrome.storage.sync.get('darkMode', (data) => {
        const isDark = data.darkMode;
        let themeCss = `
            <style>
                body {
                    font-family: sans-serif;
                    line-height: 1.6;
                    padding: 2em;
                    max-width: 800px;
                    margin: 0 auto;
                }
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
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    a { color: #58a6ff; }
                    code { background-color: #2a2a2a; padding: 0.2em 0.4em; border-radius: 3px; border: 1px solid #444; }
                    pre { background-color: #2a2a2a; padding: 1em; border-radius: 5px; overflow-x: auto; border: 1px solid #444;}
                    blockquote { border-left: 5px solid #555; padding-left: 1em; color: #ccc; }
                    hr { border-color: #555; }
                    img { max-width: 100%; }
                </style>
            `;
        }

        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                ${themeCss}
            </head>
            <body>
                ${bodyContent}
            </body>
            </html>
        `;
        chrome.tabs.create({ url: 'data:text/html;charset=utf-8,' + encodeURIComponent(fullHtml) });
    });
}

dropzone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropzone.classList.remove('hover');

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const markdownText = e.target.result;
        renderMarkdown(markdownText, file.name);
      };
      reader.readAsText(file);
    } else {
      alert('Please drop a valid .md file.');
    }
  }
});

renderBtn.addEventListener('click', () => {
    const markdownText = markdownInput.value;
    if (markdownText) {
        renderMarkdown(markdownText);
    }
});
