/**
 * Main Application
 * Orchestrates the entire watermark removal process
 */

import { CONFIG } from './config.js';
import { validateImageFile, loadImageFromFile, createLogger, formatFileSize } from './utils.js';
import { modelManager } from './model-manager.js';
import { preprocessImage, postprocessImage, composeFinalImage, resizeImageForModel } from './image-processor.js';
import { UIManager } from './ui-manager.js';

/**
 * Application class
 */
class Application {
  constructor() {
    this.logger = null;
    this.uiManager = null;
    this.currentImageBitmap = null;
  }

  /**
   * Initialize the application
   */
  async init() {
    // Get DOM elements
    const elements = {
      dropZone: document.getElementById('dropZone'),
      fileInput: document.getElementById('fileInput'),
      progressContainer: document.getElementById('progressContainer'),
      progressBar: document.getElementById('progressBar'),
      progressText: document.getElementById('progressText'),
      resultArea: document.getElementById('resultArea'),
      previewImg: document.getElementById('previewImg'),
      downloadLink: document.getElementById('downloadLink'),
      resetBtn: document.getElementById('resetBtn'),
      logArea: document.getElementById('logArea'),
      comparisonContainer: document.getElementById('comparisonContainer')
    };

    // Initialize logger
    this.logger = createLogger(elements.logArea);
    this.logger.info('Application initialized');

    // Initialize UI manager
    this.uiManager = new UIManager(elements, this.logger);

    // Setup event handlers
    this.uiManager.setupDragAndDrop((file) => this.handleFileSelection(file));
    this.uiManager.setupResetButton(() => this.handleReset());

    this.logger.info('Ready to process images');
  }

  /**
   * Handle file selection
   * @param {File} file - Selected file
   */
  async handleFileSelection(file) {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      this.uiManager.showError(validation.error);
      return;
    }

    this.logger.info(`File selected: ${file.name} (${formatFileSize(file.size)})`);

    // Start processing
    this.uiManager.setProcessing();

    try {
      await this.processImage(file);
    } catch (error) {
      this.logger.error(`Processing failed: ${error.message}`);
      this.uiManager.showError(`${CONFIG.ERRORS.PROCESSING_FAILED}: ${error.message}`);
      this.uiManager.reset();
    }
  }

  /**
   * Process image through the entire pipeline
   * @param {File} file - Image file to process
   */
  async processImage(file) {
    // Step 1: Load image
    this.uiManager.updateProgress(
      CONFIG.UI.PROGRESS_STEPS.FILE_READ,
      'Loading image...'
    );
    
    const imageBitmap = await loadImageFromFile(file);
    this.currentImageBitmap = imageBitmap;
    
    this.logger.info(`Image loaded: ${imageBitmap.width}x${imageBitmap.height}px`);

    // Step 2: Initialize model
    this.uiManager.updateProgress(
      CONFIG.UI.PROGRESS_STEPS.MODEL_CHECK,
      'Checking AI model...'
    );

    await modelManager.initialize((percent, bytes) => {
      if (bytes !== null) {
        this.uiManager.updateProgress(
          percent,
          `Downloading model (${formatFileSize(bytes)})...`
        );
      } else {
        this.uiManager.updateProgress(
          percent,
          'Initializing neural engine...'
        );
      }
    });

    // Step 3: Prepare input
    this.uiManager.updateProgress(
      CONFIG.UI.PROGRESS_STEPS.PREPROCESSING,
      'Preparing image for AI processing...'
    );

    const resizedImageData = resizeImageForModel(imageBitmap);
    const { imageTensor, maskTensor } = preprocessImage(resizedImageData);
    
    this.logger.info(`Preprocessed to ${CONFIG.MODEL.INPUT_SIZE}x${CONFIG.MODEL.INPUT_SIZE}px`);

    // Step 4: Run inference
    this.uiManager.updateProgress(
      CONFIG.UI.PROGRESS_STEPS.INFERENCE,
      'Removing watermark with AI...'
    );

    // Small delay to allow UI update
    await new Promise(resolve => setTimeout(resolve, 100));

    const outputTensor = await modelManager.runInference({
      image: imageTensor,
      mask: maskTensor
    });

    this.logger.info('AI processing complete');

    // Step 5: Postprocess
    this.uiManager.updateProgress(
      CONFIG.UI.PROGRESS_STEPS.POSTPROCESSING,
      'Composing final high-resolution image...'
    );

    const processedImageData = postprocessImage(
      outputTensor,
      CONFIG.MODEL.INPUT_SIZE,
      CONFIG.MODEL.INPUT_SIZE
    );

    // Step 6: Compose final image
    const finalDataUrl = composeFinalImage(imageBitmap, processedImageData);
    
    this.logger.info('Final image composed at original resolution');

    // Step 7: Show result
    this.uiManager.updateProgress(
      CONFIG.UI.PROGRESS_STEPS.COMPLETE,
      'Complete!'
    );

    // Create original data URL for comparison
    const originalCanvas = document.createElement('canvas');
    originalCanvas.width = imageBitmap.width;
    originalCanvas.height = imageBitmap.height;
    const ctx = originalCanvas.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0);
    const originalDataUrl = originalCanvas.toDataURL('image/png');

    this.uiManager.showResult(finalDataUrl, originalDataUrl);
  }

  /**
   * Handle reset action
   */
  handleReset() {
    this.currentImageBitmap = null;
    this.logger.info('Reset - Ready for new image');
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new Application();
    app.init();
  });
} else {
  const app = new Application();
  app.init();
}
