// Background service worker for Featr extension
// Activates the Side Panel when clicking the extension icon

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error('Failed to set panel behavior:', error));
