# Changelog

All notable changes to Luminexis will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2026-03-05

### Added

- **Initial Release**: Complete idle detection library
  - **Idle Detection**: Automatic detection of user inactivity with configurable timeout
  - **Human-Readable Time**: Support for time formats like '30s', '5m', '1h', '2d', '1w', '1h30m'
  - **Warning System**: Optional warning event fired before idle trigger
  - **Event System**: `idle`, `active`, `warning`, `tick` events for reactive programming
  - **Whitelist**: CSS selector whitelist to ignore activity from specific elements
  - **TypeScript Support**: Full type definitions with generic type support
  - **Cross-Tab Sync**: Synchronize idle state across browser tabs
  - **Dynamic Configuration**: Change timeout dynamically with `setTimeout()`
  - **Zero Dependencies**: Pure TypeScript implementation with no external dependencies

### Features

- **Methods**: `start()`, `stop()`, `reset()`, `isIdle()`, `isRunning()`, `getIdleTime()`, `getRemainingTime()`, `setTimeout()`, `getInfo()`, `destroy()`
- **Events**: `idle`, `active`, `warning` (with remaining ms), `tick` (with idle time)
- **Configuration**: timeout, warning, events, whitelist, immediate options
- **Utilities**: Time parsing, event emission, whitelist checking

### API Examples

```javascript
// Basic usage with auto-logout
const idle = new Luminexis({
  timeout: "15m",
  warning: "1m",
  immediate: true,
});

idle.on("warning", () => {
  showNotification("You will be logged out in 1 minute");
});

idle.on("idle", () => {
  logout();
});

// Save draft on idle
const idle = new Luminexis({ timeout: "30s" });

idle.on("idle", () => {
  saveDraft();
});

idle.on("active", () => {
  console.log("User is back");
});

idle.start();

// Video player whitelist
const idle = new Luminexis({
  timeout: "5m",
  whitelist: [".video-player", ".live-stream", "[data-idle-ignore]"],
  immediate: true,
});
```

### Documentation

- Comprehensive README with all methods and examples
- Full TypeScript type definitions
- Jest test suite with 80%+ coverage
- ESLint configuration for code quality

---

## Release Checklist

- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md`
- [ ] Run all tests: `bun run test`
- [ ] Run linter: `bun run lint`
- [ ] Build project: `bun run build`
- [ ] Publish to npm: `bun publish`
