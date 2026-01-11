const dropzone = document.getElementById('dropzone');

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

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const markdownText = e.target.result;
        const htmlContent = marked(markdownText);
        chrome.tabs.create({ url: 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent) });
      };
      reader.readAsText(file);
    } else {
      alert('Sleep een geldig .md-bestand.');
    }
  }
});
