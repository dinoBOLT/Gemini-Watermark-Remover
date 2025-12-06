# Installation Guide

## Quick Start (Chrome Extension)

Follow these simple steps to install and use the Gemini Watermark Remover extension:

### Step 1: Extract the Files

1. Download the `gemini-watermark-remover.zip` file
2. Extract it to a folder on your computer (e.g., `Documents/gemini-watermark-remover`)

### Step 2: Load the Extension in Chrome

1. Open **Google Chrome**
2. Navigate to `chrome://extensions/` (or go to Menu → Extensions → Manage Extensions)
3. Enable **Developer mode** by toggling the switch in the top-right corner
4. Click the **"Load unpacked"** button
5. Select the `gemini-watermark-remover` folder you extracted in Step 1
6. The extension icon should now appear in your Chrome toolbar

### Step 3: Use the Extension

1. Click the **Gemini Watermark Remover** icon in your toolbar
2. A new tab will open with the application interface
3. Drag and drop an image with a Gemini watermark, or click to browse
4. Wait for the AI to process the image (progress bar will show status)
5. Once complete, use the before/after slider to compare results
6. Click **"Download Image"** to save the cleaned image

## Troubleshooting

### Extension doesn't load

- **Error**: "Could not load icon"
  - **Solution**: Make sure you extracted the ZIP file completely. The `icons/` folder must contain `icon16.png`, `icon48.png`, and `icon128.png`.

- **Error**: "Manifest file is missing or unreadable"
  - **Solution**: Ensure you selected the correct folder (the one containing `manifest.json`, not a parent folder).

### Processing fails

- **Error**: "Failed to load AI model"
  - **Solution**: Check your internet connection for the first use. The model (199 MB) needs to be loaded once and will be cached.

- **Error**: "File size exceeds limit"
  - **Solution**: The maximum file size is 50 MB. Try compressing your image first.

### Performance issues

- If processing is slow, close other Chrome tabs to free up memory
- The first run will be slower as the model loads; subsequent runs will be faster

## System Requirements

- **Browser**: Google Chrome (version 90+) or Chromium-based browsers
- **RAM**: At least 4 GB recommended (8 GB for optimal performance)
- **Storage**: ~250 MB for the extension and model
- **Internet**: Required only for the first model download

## Privacy Note

All processing happens locally in your browser. No images or data are sent to any external server. You can verify this by checking the Network tab in Chrome DevTools while using the extension.

## Uninstallation

To remove the extension:

1. Go to `chrome://extensions/`
2. Find "Gemini Watermark Remover"
3. Click **"Remove"**
4. Delete the extracted folder from your computer

## Need Help?

If you encounter any issues not covered here, please:

1. Check the [README.md](README.md) for more information
2. Open an issue on the [GitHub repository](https://github.com/your-username/gemini-watermark-remover/issues)
