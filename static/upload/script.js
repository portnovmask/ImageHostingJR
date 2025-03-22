const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('fileInput');
const browseButton = document.getElementById('browseButton');
const uploadUrlInput = document.getElementById('uploadUrl');
const copyButton = document.getElementById('copyButton');

browseButton.addEventListener('click', () => {
  fileInput.click();
});

dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('dragover');
  const files = e.dataTransfer.files;
  if (files.length) {

    fileInput.files = files;
    handleFiles(files);
    uploadFile();
  }
});

fileInput.addEventListener('change', () => {
  handleFiles(fileInput.files);
});

function handleFiles(files) {
  const file = files[0];
  if (!file) return;

  if (!['image/jpeg','image/png','image/gif', 'image/jpg'].includes(file.type)) {
    // Ошибка
    dropArea.innerHTML = '';
    dropArea.innerHTML = `<div class="upload-area__icon">
                <img src="failed.png" alt="Upload Icon" width="70" height="50"/>
            </div>
            <p>Unsupported file type or size!</p>
            <p class="upload-area__subtext">Your file has wrong extension<br>or too big to upload</p>`;
    dropArea.classList.remove('success');
      dropArea.classList.add('error');
    setTimeout(() => {
      dropArea.innerHTML = '';
      dropArea.innerHTML = `<div class="upload-area__icon">
                <img src="upload.png" alt="Upload Icon" width="70" height="50"/>
            </div>
            <p>Select a file or drag and drop here</p>
            <p class="upload-area__subtext">Only support .jpg, .png and
                .gif.<br>Maximum file size is 5MB</p>`;
      dropArea.classList.remove('error');
    }, 4000)
    return;
  }

  if (file.size > 5 * 1024 * 1024) {

    dropArea.innerHTML = '';
    dropArea.innerHTML = `<div class="upload-area__icon">
                <img src="failed.png" alt="Upload Icon" width="70" height="50"/>
            </div>
            <p>Unsupported file type or size!</p>
            <p class="upload-area__subtext">Only 5MB of .jpg, .png and
                .gif.<br>Please try appropriate file</p>`;
    dropArea.classList.remove('success');
      dropArea.classList.add('error');
    setTimeout(() => {
      dropArea.innerHTML = '';
      dropArea.innerHTML = `<div class="upload-area__icon">
                <img src="upload.png" alt="Upload Icon" width="70" height="50"/>
            </div>
            <p>Select a file or drag and drop here</p>
            <p class="upload-area__subtext">Only support .jpg, .png and
                .gif.<br>Maximum file size is 5MB</p>`;
      dropArea.classList.remove('error');
    }, 4000)

    return;
  }

  dropArea.classList.remove('error');
  dropArea.innerHTML = '';
    dropArea.innerHTML = `<div class="upload-area__icon">
                <img src="success.png" alt="Upload Icon" width="70" height="50"/>
            </div>
            <p>File downloaded successfully!</p>
            <p class="upload-area__subtext">Your image added to gallery<br>Copy the link below to share</p>`;
    dropArea.classList.add('success');
    setTimeout(() => {
      dropArea.innerHTML = '';
      dropArea.innerHTML = `<div class="upload-area__icon">
                <img src="upload.png" alt="Upload Icon" width="70" height="50"/>
            </div>
            <p>Select a file or drag and drop here</p>
            <p class="upload-area__subtext">Only support .jpg, .png and
                .gif.<br>Maximum file size is 5MB</p>`;
      dropArea.classList.remove('success');
    }, 3000)

}



copyButton.addEventListener('click', () => {
  navigator.clipboard.writeText(uploadUrlInput.value)
    .then(() => {
      copyButton.textContent = 'Copied!';
      copyButton.style.backgroundColor = '#7B7B7B';
      setTimeout(() => {
        copyButton.innerHTML = '<img src="copy.png" alt="Copy" width="20" height="20">';
        copyButton.style.backgroundColor = '#007BFF';
      }, 1000);
    })
    .catch((err) => {
      console.error('Failed to copy:', err);
    });
});

fileInput.addEventListener('change', () => uploadFile());

function uploadFile() {
  const file = fileInput.files[0];
  if (!file) return alert('Выберите файл для загрузки.');

  fetch('/api/upload/', {
    method: 'POST',
    headers: {
      'Filename': file.name
    },
    body: file
  })
  .then(response => {
    document.getElementById('uploadUrl').value = response.headers.get('Location');

    copyButton.disabled = false;

    dropArea.classList.add('success');
    setTimeout(() => {
      dropArea.classList.remove('success');
    }, 2000)

  })
  .catch(error => {
    console.error('Ошибка загрузки:', error);
    dropArea.classList.add('error');
  });
}

document.getElementById('btnGoToImages').addEventListener('click', (event) => {
    window.location.href = '/images/';
});

