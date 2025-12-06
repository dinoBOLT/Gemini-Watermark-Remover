/**
 * Configuration file for Gemini Watermark Remover
 * All constants and settings are centralized here for easy maintenance
 */

export const CONFIG = {
  // Model settings
  MODEL: {
    PATH: 'src/assets/lama_fp32.onnx',
    INPUT_SIZE: 512,
    EXECUTION_PROVIDER: 'wasm',
    OPTIMIZATION_LEVEL: 'basic',
    NUM_THREADS: 1
  },

  // Watermark detection settings
  WATERMARK: {
    // Default watermark region (percentage of image dimensions)
    HEIGHT_RATIO: 0.15,  // 15% from bottom
    WIDTH_RATIO: 0.15,   // 15% from right
    
    // Extended region for better blending (used in final composition)
    EXTENDED_RATIO: 0.16,
    
    // Position
    POSITION: 'bottom-right'  // Future: support other positions
  },

  // Image processing settings
  IMAGE: {
    MAX_FILE_SIZE: 50 * 1024 * 1024,  // 50 MB
    ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    OUTPUT_FORMAT: 'image/png',
    OUTPUT_QUALITY: 1.0
  },

  // UI settings
  UI: {
    PROGRESS_STEPS: {
      FILE_READ: 5,
      MODEL_CHECK: 10,
      MODEL_DOWNLOAD_START: 10,
      MODEL_DOWNLOAD_END: 40,
      MODEL_INIT: 45,
      MODEL_READY: 50,
      PREPROCESSING: 60,
      INFERENCE: 70,
      POSTPROCESSING: 90,
      COMPLETE: 100
    },
    ANIMATION_DELAY: 500,  // ms
    LOG_MAX_LINES: 100
  },

  // Error messages
  ERRORS: {
    INVALID_FILE_TYPE: 'Please select a valid image file (PNG, JPEG, WebP)',
    FILE_TOO_LARGE: 'File size exceeds 50 MB limit',
    MODEL_LOAD_FAILED: 'Failed to load AI model',
    PROCESSING_FAILED: 'Image processing failed',
    WORKER_ERROR: 'Worker initialization failed'
  },

  // ONNX Runtime settings
  ONNX: {
    WASM_PATHS: 'src/lib/',
    PROXY: false
  }
};
