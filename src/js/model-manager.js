/**
 * Model Manager
 * Handles ONNX model loading, caching, and inference
 */

import { CONFIG } from './config.js';

/**
 * Model Manager class
 * Singleton pattern to ensure only one model instance
 */
class ModelManager {
  constructor() {
    this.session = null;
    this.modelBuffer = null;
    this.isInitialized = false;
    this.initializationPromise = null;
  }

  /**
   * Initialize ONNX Runtime environment
   */
  initializeOnnxRuntime() {
    if (typeof ort === 'undefined') {
      throw new Error('ONNX Runtime not loaded');
    }
    
    ort.env.wasm.wasmPaths = CONFIG.ONNX.WASM_PATHS;
    ort.env.wasm.numThreads = CONFIG.MODEL.NUM_THREADS;
    ort.env.wasm.proxy = CONFIG.ONNX.PROXY;
  }

  /**
   * Fetch model with progress tracking
   * @param {string} url - Model URL
   * @param {Function} onProgress - Progress callback (percent, bytesLoaded)
   * @returns {Promise<Uint8Array>} - Model buffer
   */
  async fetchModelWithProgress(url, onProgress) {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch model: ${response.statusText}`);
    }
    
    const contentLength = parseInt(response.headers.get('Content-Length') || '0', 10);
    const reader = response.body.getReader();
    
    let receivedLength = 0;
    const chunks = [];
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      receivedLength += value.length;
      
      // Calculate progress
      if (contentLength > 0 && onProgress) {
        const percent = Math.round((receivedLength / contentLength) * 100);
        onProgress(percent, receivedLength);
      }
    }
    
    // Combine chunks into single Uint8Array
    const allChunks = new Uint8Array(receivedLength);
    let position = 0;
    for (const chunk of chunks) {
      allChunks.set(chunk, position);
      position += chunk.length;
    }
    
    return allChunks;
  }

  /**
   * Initialize the model
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<void>}
   */
  async initialize(onProgress) {
    // If already initialized, return immediately
    if (this.isInitialized) {
      return;
    }
    
    // If initialization is in progress, wait for it
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    // Start initialization
    this.initializationPromise = (async () => {
      try {
        // Initialize ONNX Runtime
        this.initializeOnnxRuntime();
        
        // Load model buffer if not cached
        if (!this.modelBuffer) {
          this.modelBuffer = await this.fetchModelWithProgress(
            CONFIG.MODEL.PATH,
            (percent, bytes) => {
              if (onProgress) {
                const startPercent = CONFIG.UI.PROGRESS_STEPS.MODEL_DOWNLOAD_START;
                const endPercent = CONFIG.UI.PROGRESS_STEPS.MODEL_DOWNLOAD_END;
                const progressPercent = startPercent + (percent / 100) * (endPercent - startPercent);
                onProgress(Math.round(progressPercent), bytes);
              }
            }
          );
        }
        
        // Create inference session
        if (onProgress) {
          onProgress(CONFIG.UI.PROGRESS_STEPS.MODEL_INIT, null);
        }
        
        this.session = await ort.InferenceSession.create(this.modelBuffer, {
          executionProviders: [CONFIG.MODEL.EXECUTION_PROVIDER],
          graphOptimizationLevel: CONFIG.MODEL.OPTIMIZATION_LEVEL
        });
        
        this.isInitialized = true;
        
        if (onProgress) {
          onProgress(CONFIG.UI.PROGRESS_STEPS.MODEL_READY, null);
        }
      } catch (error) {
        this.initializationPromise = null;
        throw new Error(`${CONFIG.ERRORS.MODEL_LOAD_FAILED}: ${error.message}`);
      }
    })();
    
    return this.initializationPromise;
  }

  /**
   * Run inference on input tensors
   * @param {Object} feeds - Input tensors { image: Tensor, mask: Tensor }
   * @returns {Promise<Tensor>} - Output tensor
   */
  async runInference(feeds) {
    if (!this.isInitialized || !this.session) {
      throw new Error('Model not initialized. Call initialize() first.');
    }
    
    try {
      const results = await this.session.run(feeds);
      
      // Get first output (LaMa model has single output)
      const outputName = Object.keys(results)[0];
      return results[outputName];
    } catch (error) {
      throw new Error(`Inference failed: ${error.message}`);
    }
  }

  /**
   * Release model resources
   */
  async dispose() {
    if (this.session) {
      await this.session.release();
      this.session = null;
    }
    this.isInitialized = false;
    this.initializationPromise = null;
    // Keep modelBuffer cached for faster reinitialization
  }

  /**
   * Clear all cached data including model buffer
   */
  clearCache() {
    this.dispose();
    this.modelBuffer = null;
  }

  /**
   * Get model info
   * @returns {Object} - Model information
   */
  getInfo() {
    return {
      isInitialized: this.isInitialized,
      hasModelBuffer: this.modelBuffer !== null,
      modelPath: CONFIG.MODEL.PATH,
      inputSize: CONFIG.MODEL.INPUT_SIZE
    };
  }
}

// Export singleton instance
export const modelManager = new ModelManager();
