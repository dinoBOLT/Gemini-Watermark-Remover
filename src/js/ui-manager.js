/**
 * UI Manager
 * Handles all user interface interactions and updates
 */

import { CONFIG } from './config.js';
import { formatFileSize } from './utils.js';

/**
 * UI Manager class
 */
export class UIManager {
  constructor(elements, logger) {
    this.elements = elements;
    this.logger = logger;
    this.currentState = 'idle';  // idle, processing, result
  }

  /**
   * Update progress bar
   * @param {number} percent - Progress percentage (0-100)
   * @param {string} message - Progress message
   */
  updateProgress(percent, message) {
    const { progressContainer, progressBar, progressText } = this.elements;
    
    progressContainer.style.display = 'block';
    progressBar.style.width = `${percent}%`;
    progressText.innerText = `${percent}% - ${message}`;
    
    if (this.logger) {
      this.logger.info(message);
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    if (this.logger) {
      this.logger.error(message);
    }
    
    // Show error in UI
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span class="error-text">${message}</span>
        <button class="error-close">×</button>
      </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      errorDiv.classList.add('fade-out');
      setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
    
    // Close button
    errorDiv.querySelector('.error-close').addEventListener('click', () => {
      errorDiv.classList.add('fade-out');
      setTimeout(() => errorDiv.remove(), 300);
    });
  }

  /**
   * Show result
   * @param {string} dataUrl - Processed image data URL
   * @param {string} originalDataUrl - Original image data URL (optional)
   */
  showResult(dataUrl, originalDataUrl = null) {
    const { progressContainer, resultArea, previewImg, downloadLink, comparisonContainer } = this.elements;
    
    setTimeout(() => {
      progressContainer.style.display = 'none';
      resultArea.style.display = 'block';
      previewImg.src = dataUrl;
      downloadLink.href = dataUrl;
      downloadLink.download = `gemini-clean-${Date.now()}.png`;
      
      // Setup comparison slider if original is provided
      if (originalDataUrl && comparisonContainer) {
        this.setupComparisonSlider(originalDataUrl, dataUrl);
      }
      
      this.currentState = 'result';
      
      if (this.logger) {
        this.logger.info('Processing complete! Image ready for download.');
      }
    }, CONFIG.UI.ANIMATION_DELAY);
  }

  /**
   * Setup before/after comparison slider
   * @param {string} beforeUrl - Original image URL
   * @param {string} afterUrl - Processed image URL
   */
  setupComparisonSlider(beforeUrl, afterUrl) {
    const { comparisonContainer } = this.elements;
    if (!comparisonContainer) return;
    
    comparisonContainer.style.display = 'block';
    comparisonContainer.innerHTML = `
      <div class="comparison-wrapper">
        <div class="comparison-images">
          <img src="${afterUrl}" class="comparison-after" alt="After">
          <div class="comparison-before-wrapper" style="width: 50%;">
            <img src="${beforeUrl}" class="comparison-before" alt="Before">
          </div>
        </div>
        <input type="range" min="0" max="100" value="50" class="comparison-slider">
        <div class="comparison-labels">
          <span class="label-before">Original</span>
          <span class="label-after">Cleaned</span>
        </div>
      </div>
    `;
    
    const slider = comparisonContainer.querySelector('.comparison-slider');
    const beforeWrapper = comparisonContainer.querySelector('.comparison-before-wrapper');
    
    slider.addEventListener('input', (e) => {
      const value = e.target.value;
      beforeWrapper.style.width = `${value}%`;
    });
  }

  /**
   * Reset UI to initial state
   */
  reset() {
    const { dropZone, resultArea, progressContainer, fileInput, comparisonContainer } = this.elements;
    
    resultArea.style.display = 'none';
    dropZone.style.display = 'flex';
    progressContainer.style.display = 'none';
    
    if (comparisonContainer) {
      comparisonContainer.style.display = 'none';
      comparisonContainer.innerHTML = '';
    }
    
    fileInput.value = '';
    
    if (this.logger) {
      this.logger.clear();
    }
    
    this.currentState = 'idle';
  }

  /**
   * Set processing state
   */
  setProcessing() {
    const { dropZone, resultArea } = this.elements;
    
    dropZone.style.display = 'none';
    resultArea.style.display = 'none';
    
    this.currentState = 'processing';
  }

  /**
   * Setup drag and drop handlers
   * @param {Function} onFileSelected - Callback when file is selected
   */
  setupDragAndDrop(onFileSelected) {
    const { dropZone, fileInput } = this.elements;
    
    // Click to browse
    dropZone.addEventListener('click', () => fileInput.click());
    
    // Drag over
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
    
    // Drag leave
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });
    
    // Drop
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      
      if (e.dataTransfer.files.length > 0) {
        onFileSelected(e.dataTransfer.files[0]);
      }
    });
    
    // File input change
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        onFileSelected(fileInput.files[0]);
      }
    });
  }

  /**
   * Setup reset button
   * @param {Function} onReset - Callback when reset is clicked
   */
  setupResetButton(onReset) {
    const { resetBtn } = this.elements;
    
    resetBtn.addEventListener('click', () => {
      this.reset();
      if (onReset) onReset();
    });
  }

  /**
   * Get current state
   * @returns {string} - Current UI state
   */
  getState() {
    return this.currentState;
  }
}
