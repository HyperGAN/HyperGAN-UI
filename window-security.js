'use strict';

function webPreferences() {
  return { nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true };
}

function isApplicationNavigation(destination, startURL) {
  try {
    const target = new URL(destination);
    const start = new URL(startURL);
    return target.protocol === start.protocol && target.origin === start.origin && target.pathname === start.pathname;
  } catch (_) {
    return false;
  }
}

function restrictNavigation(webContents, startURL) {
  webContents.on('will-navigate', (event, destination) => {
    if (!isApplicationNavigation(destination, startURL)) event.preventDefault();
  });
  webContents.on('new-window', event => event.preventDefault());
  if (typeof webContents.setWindowOpenHandler === 'function') {
    webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  }
}

module.exports = { webPreferences, isApplicationNavigation, restrictNavigation };
