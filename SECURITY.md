# Runtime status

The renderer disables Node integration, uses context isolation and sandboxing,
and blocks navigation and popup windows outside the application document.
The security event tests run with `node --test tests/window-security.test.cjs`.

These controls are partial mitigation. This legacy application still selects
Electron 9.2.0, which embeds an unsupported Node.js and Chromium runtime. Updating
the developer's standalone Node.js does not update Electron. A supported Electron
migration, complete October 2026 native security qualification, a renderer build
and a GUI smoke test remain required before treating the application as patched.
The isolated event tests do not establish GUI compatibility or fix the bundled
runtime. Existing installed copies must be rebuilt and restarted separately.
