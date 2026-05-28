/**
 * Shared PDF tool utilities.
 * Uses pdf-lib loaded from CDN for client-side PDF processing.
 */
const PDFTools = {
  files: [],

  init(options = {}) {
    this.dropZone = document.getElementById("dropZone");
    this.fileInput = document.getElementById("fileInput");
    this.fileList = document.getElementById("fileList");
    this.actionBtn = document.getElementById("actionBtn");
    this.progressBar = document.getElementById("progressBar");
    this.progressFill = document.getElementById("progressFill");
    this.progressText = document.getElementById("progressText");
    this.resultArea = document.getElementById("resultArea");
    this.resultText = document.getElementById("resultText");
    this.downloadBtn = document.getElementById("downloadBtn");

    this.accept = options.accept || ".pdf";
    this.multiple = options.multiple !== false;
    this.maxFiles = options.maxFiles || 50;

    if (this.fileInput) {
      this.fileInput.accept = this.accept;
      this.fileInput.multiple = this.multiple;
    }

    this.bindEvents();
  },

  bindEvents() {
    if (this.dropZone) {
      this.dropZone.addEventListener("click", () => this.fileInput.click());
      this.dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        this.dropZone.classList.add("dragover");
      });
      this.dropZone.addEventListener("dragleave", () => {
        this.dropZone.classList.remove("dragover");
      });
      this.dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        this.dropZone.classList.remove("dragover");
        this.addFiles(e.dataTransfer.files);
      });
    }

    if (this.fileInput) {
      this.fileInput.addEventListener("change", () => {
        this.addFiles(this.fileInput.files);
        this.fileInput.value = "";
      });
    }
  },

  addFiles(fileList) {
    for (const file of fileList) {
      if (this.files.length >= this.maxFiles) break;
      this.files.push(file);
    }
    this.renderFileList();
    this.updateActionBtn();
  },

  removeFile(index) {
    this.files.splice(index, 1);
    this.renderFileList();
    this.updateActionBtn();
  },

  renderFileList() {
    if (!this.fileList) return;
    this.fileList.innerHTML = "";

    this.files.forEach((file, i) => {
      const item = document.createElement("div");
      item.className = "file-item";
      const ext = file.name.split(".").pop().toUpperCase();
      const size = this.formatSize(file.size);
      item.innerHTML = `
        <div class="file-item__icon"><i class="fas fa-file-pdf"></i></div>
        <div class="file-item__info">
          <div class="file-item__name">${this.escapeHtml(file.name)}</div>
          <div class="file-item__size">${ext} - ${size}</div>
        </div>
        <button class="file-item__remove" data-index="${i}" title="Remove">
          <i class="fas fa-times"></i>
        </button>
      `;
      item.querySelector(".file-item__remove").addEventListener("click", () => this.removeFile(i));
      this.fileList.appendChild(item);
    });
  },

  updateActionBtn() {
    if (this.actionBtn) {
      this.actionBtn.disabled = this.files.length === 0;
    }
  },

  showProgress(percent, text) {
    if (this.progressBar) {
      this.progressBar.classList.add("active");
      this.progressFill.style.width = percent + "%";
      if (this.progressText) this.progressText.textContent = text || "Processing...";
    }
  },

  hideProgress() {
    if (this.progressBar) this.progressBar.classList.remove("active");
  },

  showResult(text, blob, filename) {
    if (this.resultArea) {
      this.resultArea.classList.add("active");
      if (this.resultText) this.resultText.textContent = text;
      if (this.downloadBtn) {
        this.downloadBtn.onclick = () => this.downloadBlob(blob, filename);
      }
    }
  },

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  },

  escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },

  async readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  },

  reset() {
    this.files = [];
    this.renderFileList();
    this.updateActionBtn();
    this.hideProgress();
    if (this.resultArea) this.resultArea.classList.remove("active");
  }
};
