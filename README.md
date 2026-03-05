<div align="center">

  <h1>Luminexis ✨</h1>

  <p>A lightweight, zero-dependency user idle detection library with warnings, auto-logout support, and cross-tab synchronization.</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/luminexis.svg)](https://www.npmjs.com/package/luminexis)
[![Downloads](https://img.shields.io/npm/dm/luminexis)](https://www.npmjs.com/package/luminexis)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/Zero%20Dependencies-2ecc71.svg)](https://github.com/dotjumpdot/luminexis)

**Version 1.0.0 - Production Release** 🎉

[View on npmjs.com](https://www.npmjs.com/package/luminexis)

</div>

---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
  - [Basic Auto-Logout](#basic-auto-logout)
  - [Save Draft on Idle](#save-draft-on-idle)
- [API Reference](#api-reference)
  - [Constructor](#constructor)
  - [Time Formats](#time-formats)
  - [Methods](#methods)
    - [`start()`](#start)
    - [`stop()`](#stop)
    - [`reset()`](#reset)
    - [`isIdle()`](#isidle)
    - [`isRunning()`](#isrunning)
    - [`getIdleTime()`](#getidletime)
    - [`getRemainingTime()`](#getremainingtime)
    - [`setTimeout(timeout)`](#settimeouttimeout)
    - [`getInfo()`](#getinfo)
    - [`destroy()`](#destroy)
  - [Events](#events)
- [Examples](#examples)
  - [Auto-Logout with Warning](#auto-logout-with-warning)
  - [Video Player Whitelist](#video-player-whitelist)
  - [Activity Dashboard](#activity-dashboard)
  - [Countdown Timer](#countdown-timer)
- [Browser Compatibility](#browser-compatibility)
- [Contributing](#contributing)
  - [Development Setup](#development-setup)
  - [Development Commands](#development-commands)
- [License](#license)
- [Changelog](#changelog)
- [Support](#support)

---

## About

Luminexis is a lightweight, zero-dependency library for detecting user idle state in web applications. It monitors user activity (mouse, keyboard, touch) and triggers events when the user becomes idle. Built with TypeScript from the ground up, it provides type-safe idle detection for modern web applications.

---

## Features

<div align="center">

  <table>
    <tr>
      <td align="center" width="25%">
        ⏱️ <br><b>Human-Readable Time</b>
      </td>
      <td align="center" width="25%">
        ⚠️ <br><b>Warning System</b>
      </td>
      <td align="center" width="25%">
        🚫 <br><b>Whitelist</b>
      </td>
      <td align="center" width="25%">
        📡 <br><b>Events</b>
      </td>
    </tr>
  </table>

</div>

- **Human-Readable Time**: Use formats like `'30s'`, `'5m'`, `'1h'`, `'2d'` instead of milliseconds
- **Warning System**: Fire events before idle trigger to warn users
- **Whitelist**: Ignore activity from specific elements (e.g., video players)
- **Events**: `idle`, `active`, `warning`, `tick` events for reactive programming
- **TypeScript Support**: Full type definitions included
- **Cross-Tab Sync**: Synchronize idle state across browser tabs
- **Dynamic Configuration**: Change timeout on the fly
- **Zero Dependencies**: Pure TypeScript implementation

---

## Installation

```bash
npm install luminexis
# or
yarn add luminexis
# or
pnpm add luminexis
# or
bun add luminexis
```

---

## Quick Start

### Basic Auto-Logout

```javascript
import Luminexis from "luminexis";

const idle = new Luminexis({
  timeout: "15m",
  warning: "1m",
  immediate: true,
});

idle.on("warning", () => {
  showNotification("You will be logged out in 1 minute due to inactivity");
});

idle.on("idle", () => {
  logout();
  window.location.href = "/login";
});
```

### Save Draft on Idle

```javascript
import Luminexis from "luminexis";

const idle = new Luminexis({ timeout: "30s" });

idle.on("idle", () => {
  saveDraft();
  showNotification("Draft auto-saved");
});

idle.on("active", () => {
  console.log("User is back");
});

idle.start();
```

---

## API Reference

### Constructor

```typescript
new Luminexis(options?: LuminexisOptions)
```

**Constructor Options:**

| Option      | Type               | Default        | Description                                  |
| ----------- | ------------------ | -------------- | -------------------------------------------- |
| `timeout`   | `string \| number` | `'5m'`         | Idle timeout duration (e.g., `'5m'`, `'1h'`) |
| `warning`   | `string \| number` | `null`         | Warning time before idle trigger             |
| `events`    | `string[]`         | Default events | Events that reset idle timer                 |
| `whitelist` | `string[]`         | `[]`           | CSS selectors for elements to ignore         |
| `immediate` | `boolean`          | `false`        | Start monitoring immediately                 |

### Time Formats

- `'30s'` - 30 seconds
- `'5m'` - 5 minutes
- `'1h'` - 1 hour
- `'1d'` - 1 day
- `'1w'` - 1 week
- `'1h30m'` - 1 hour 30 minutes
- `'2d12h'` - 2 days 12 hours

### Methods

#### `start()`

Begin monitoring user activity.

```javascript
const idle = new Luminexis({ timeout: "10m" });
idle.start();
```

#### `stop()`

Pause monitoring without resetting state.

```javascript
idle.stop();
```

#### `reset()`

Manually reset the idle timer.

```javascript
document.getElementById("custom-btn").addEventListener("click", () => {
  idle.reset();
});
```

#### `isIdle()`

Check if user is currently idle.

```javascript
if (idle.isIdle()) {
  console.log("User is AFK");
}
```

#### `isRunning()`

Check if monitoring is active.

```javascript
console.log(idle.isRunning()); // true or false
```

#### `getIdleTime()`

Get how long user has been idle (in milliseconds).

```javascript
const idleMs = idle.getIdleTime();
console.log(`Idle for ${idleMs / 1000} seconds`);
```

#### `getRemainingTime()`

Get time remaining until idle trigger (in milliseconds).

```javascript
const remainingMs = idle.getRemainingTime();
console.log(`Idle in ${remainingMs / 1000} seconds`);
```

#### `setTimeout(timeout)`

Dynamically change the timeout.

```javascript
idle.setTimeout("30m"); // Extend to 30 minutes
```

#### `getInfo()`

Get current configuration and state.

```javascript
const info = idle.getInfo();
console.log(info);
// {
//   timeout: 300000,
//   timeoutFormatted: '5m',
//   warning: 60000,
//   warningFormatted: '1m',
//   isIdle: false,
//   isRunning: true,
//   idleTime: 0,
//   remainingTime: 240000,
//   events: [...],
//   whitelist: [...]
// }
```

#### `destroy()`

Complete cleanup for SPA navigation.

```javascript
window.addEventListener("beforeunload", () => {
  idle.destroy();
});
```

### Events

| Event     | Callback                        | Description                          |
| --------- | ------------------------------- | ------------------------------------ |
| `idle`    | `() => void`                    | Fired when user becomes idle         |
| `active`  | `() => void`                    | Fired when user returns from idle    |
| `warning` | `(remainingMs: number) => void` | Fired when warning threshold reached |
| `tick`    | `(idleTime: number) => void`    | Fired every second while idle        |

---

## Examples

### Auto-Logout with Warning

```javascript
const idle = new Luminexis({
  timeout: "15m",
  warning: "1m",
  immediate: true,
});

idle.on("warning", () => {
  showModal("Your session will expire in 1 minute. Click to stay logged in.");
});

idle.on("idle", () => {
  logout();
  window.location.href = "/login";
});
```

### Video Player Whitelist

```javascript
const idle = new Luminexis({
  timeout: "5m",
  whitelist: [".video-player", ".live-stream", "[data-idle-ignore]"],
  immediate: true,
});

// User watching video won't trigger idle
// But clicking outside the player will reset the timer
```

### Activity Dashboard

```javascript
const idle = new Luminexis({ timeout: "1h" });

idle.on("tick", (idleTime) => {
  const minutes = Math.floor(idleTime / 1000 / 60);
  document.getElementById("idle-timer").textContent = `Idle: ${minutes}m`;
});

idle.on("active", () => {
  document.getElementById("status").textContent = "Active";
  document.getElementById("status").className = "badge green";
});

idle.on("idle", () => {
  document.getElementById("status").textContent = "Away";
  document.getElementById("status").className = "badge gray";
});

idle.start();
```

### Countdown Timer

```javascript
const idle = new Luminexis({ timeout: "5m" });

function updateCountdown() {
  const remaining = idle.getRemainingTime();
  const seconds = Math.ceil(remaining / 1000);
  document.getElementById("countdown").textContent = `${seconds}s`;
}

setInterval(updateCountdown, 1000);
idle.start();
```

---

## Browser Compatibility

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | 90+             |
| Firefox | 88+             |
| Safari  | 14+             |
| Edge    | 90+             |

---

## Contributing

Contributions are welcome! Please see [AGENTS.md](AGENTS.md) for guidelines.

### Development Setup

```bash
git clone https://github.com/dotjumpdot/luminexis.git
cd luminexis
bun install
```

### Development Commands

```bash
bun run build          # Build TypeScript
bun run test           # Run tests
bun run test:watch     # Run tests in watch mode
bun run test:coverage  # Run tests with coverage
bun run lint           # Run linter
```

---

## License

MIT License - Copyright (c) 2026 [DotJumpDot](https://github.com/dotjumpdot)

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## Support

- GitHub Issues: [Report a bug](https://github.com/dotjumpdot/luminexis/issues)
- Documentation: [Full API Reference](https://github.com/dotjumpdot/luminexis)
- npm Package: [luminexis](https://www.npmjs.com/package/luminexis)

---

<div align="center">

<b>Made with ❤️ by DotJumpDot</b>

[⬆ Back to Top](#luminexis-)

</div>
