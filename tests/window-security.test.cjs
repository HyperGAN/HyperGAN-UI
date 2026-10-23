const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { webPreferences, isApplicationNavigation, restrictNavigation } = require('../window-security');

test('renderers have no Node integration and retain isolation and sandboxing', () => {
  assert.deepEqual(webPreferences(), { nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true });
});

test('normal SPA fragment navigation stays within the application document', () => {
  assert.equal(isApplicationNavigation('file:///app/build/index.html#/models', 'file:///app/build/index.html'), true);
  assert.equal(isApplicationNavigation('http://localhost:3000/#/models', 'http://localhost:3000'), true);
});

test('external URLs, other local files, executable URLs and malformed inputs are blocked', () => {
  const start = 'file:///app/build/index.html';
  for (const target of ['https://example.com/', 'file:///etc/passwd', 'javascript:alert(1)', 'data:text/html,test', 'invalid']) {
    assert.equal(isApplicationNavigation(target, start), false, target);
  }
  assert.equal(isApplicationNavigation('http://localhost:3000.attacker.example/', 'http://localhost:3000/'), false);
});

test('navigation and popup events are actually prevented', () => {
  const contents = new EventEmitter();
  let prevented = 0;
  let popupHandler;
  contents.setWindowOpenHandler = handler => { popupHandler = handler; };
  restrictNavigation(contents, 'file:///app/build/index.html');
  contents.emit('will-navigate', { preventDefault: () => prevented++ }, 'https://example.com');
  contents.emit('new-window', { preventDefault: () => prevented++ });
  assert.equal(prevented, 2);
  assert.deepEqual(popupHandler(), { action: 'deny' });
});

test('Electron 9 legacy popup API remains supported', () => {
  const contents = new EventEmitter();
  restrictNavigation(contents, 'file:///app/build/index.html');
  let prevented = false;
  contents.emit('new-window', { preventDefault: () => { prevented = true; } });
  assert.equal(prevented, true);
});
