/**
 * Background Service Worker
 * Handles extension icon click to open the main application
 */

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ 
    url: chrome.runtime.getURL('index.html')
  });
});

// Log extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Gemini Watermark Remover installed successfully');
  } else if (details.reason === 'update') {
    console.log(`Gemini Watermark Remover updated to version ${chrome.runtime.getManifest().version}`);
  }
});
