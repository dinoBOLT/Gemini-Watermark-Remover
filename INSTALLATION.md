# Installation Guide

## Quick Start (Chrome Extension)

Follow these simple steps to install and use the Gemini Watermark Remover extension.

> ⚠️ **IMPORTANT NOTE**: This project no longer uses Git LFS (Large File Storage) due to bandwidth quotas. The AI model must be downloaded manually (see Step 2).

### Step 1: Get the Code

You need to use **Git** to download this project. If you don't have Git installed, [download it here](https://www.google.com/search?q=https://git-scm.com/downloads) and install it (keep all default settings).

1. Open your **Terminal** (Command Prompt or PowerShell on Windows, Terminal on Mac/Linux):
2. Clone the repository or download the ZIP file:

```bash
git clone https://github.com/dinoBOLT/Gemini-Watermark-Remover.git
```

(If you are downloading the ZIP, extract it to a folder on your computer, e.g., `Documents/gemini-watermark-remover`).

### Step 2: Download the AI Model (Required)

Since Git LFS is obsolete for this project, you must download the AI model manually. **The extension will not work without this file.**

**Download the model (`lama_fp32.onnx`):**

👉 [Click here to download from Hugging Face](https://huggingface.co/your-username/gemini-watermark-remover/resolve/main/lama_fp32.onnx)

**Place the file:**

Move the downloaded `lama_fp32.onnx` file into the `src/assets/` folder inside the project directory.

Your folder structure must look like this:

```
gemini-watermark-remover/
├── src/
│   ├── assets/
│   │   └── lama_fp32.onnx  <-- The file goes here (approx. 200MB)
│   └── ...
├── manifest.json
└── ...
```

### Step 3: Load the Extension in Chrome

1. Open **Google Chrome**
2. Navigate to `chrome://extensions/` (or go to Menu → Extensions → Manage Extensions)
3. Enable **Developer mode** by toggling the switch in the top-right corner
4. Click the **"Load unpacked"** button
5. Select the `gemini-watermark-remover` folder (ensure it contains `manifest.json`)
6. The extension icon should now appear in your Chrome toolbar

### Step 4: Use the Extension

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

- **Error**: "Failed to load AI model" / "File not found"
  - **Solution**: You missed Step 2. The `lama_fp32.onnx` file is missing from `src/assets/`. Download it from the link above and place it there.

- **Error**: "File size exceeds limit"
  - **Solution**: The maximum file size is 50 MB. Try compressing your image first.

### Performance issues

- If processing is slow, close other Chrome tabs to free up memory
- The first run will be slower as the model initializes; subsequent runs will be faster

## System Requirements

- **Browser**: Google Chrome (version 90+) or Chromium-based browsers
- **RAM**: At least 4 GB recommended (8 GB for optimal performance)
- **Storage**: ~250 MB for the extension and model
- **Internet**: Required to download the initial model file from Hugging Face

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
2. Open an issue on the [GitHub repository](https://github.com/dinoBOLT/Gemini-Watermark-Remover/issues)
