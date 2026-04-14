---
title: Node 25 Native localStorage Breaks jsdom Test Environment
category: test-failures
date: 2026-04-13
severity: high
tags:
  - test-environment
  - node-25
  - vitest
  - jsdom
  - localStorage
  - webstorage
  - cross-version-compat
components:
  - app/src/test-setup.js
  - app/vite.config.js
related:
  - https://github.com/vitest-dev/vitest/issues/8757
  - https://nodejs.org/en/blog/release/v25.0.0
  - https://nodejs.org/en/blog/release/v25.2.1
---

# Node 25 Native localStorage Breaks jsdom Test Environment

## Problem

After upgrading to Node 25.9.0, 31 pre-existing tests across 4 files in the Forge repo started failing with `TypeError: localStorage.clear is not a function`. The failing files all used `// @vitest-environment jsdom` and called `localStorage.clear()` in `beforeEach`. This is a known Node 25 bug tracked at [vitest-dev/vitest#8757](https://github.com/vitest-dev/vitest/issues/8757) — vitest maintainers confirmed it as "a bug of Node 25," empty Proxy regardless of DOM env.

**Symptom:**

```
TypeError: localStorage.clear is not a function
 ❯ src/test/useConceptProgress.test.js:8:18
    6| describe("useConceptProgress", () => {
    7|   beforeEach(() => {
    8|     localStorage.clear();
     |                  ^
    9|   });
```

**Impact:** 31 tests failing across:
- `src/test/useConceptProgress.test.js`
- `src/test/useOnboarding.test.js`
- `src/test/ComparisonView.test.jsx`
- `src/test/LearnModuleChat.test.jsx`

Paradoxically, other test files using `Object.defineProperty(globalThis, "localStorage", mock)` worked fine — because they explicitly overrode the broken native before it could cause damage.

## Root Cause

Node 24+ added experimental Web Storage API behind the `--experimental-webstorage` flag. **Node 25.0.0 (Oct 2025) unflagged it and enabled `globalThis.localStorage` by default at process startup.**

Version timeline:

| Version | Behavior |
|---|---|
| Node 22 | `--experimental-webstorage` added behind flag (opt-in) |
| Node 25.0.0 | Flag removed, `globalThis.localStorage` enabled by default. Stability: 1.2 (RC) |
| Node 25.2.0 | Made no-path behavior spec-compliant (throw on access). Broke Jest/Vitest/Vite widely |
| Node 25.2.1 | Reverted the throw-on-access behavior. Strict spec enforcement deferred to Node 26 |
| Node 25.9.0 (this repo) | No-path state: `globalThis.localStorage` is an **empty-object Proxy**, not a real `Storage` instance. Has no `getItem`/`setItem`/`clear`. `.__proto__` returns null |

Key detail: when `--localstorage-file=PATH` is not provided, Node creates a half-initialized Proxy stub instead of a full `Storage` object. A warning appears in stderr: `Warning: --localstorage-file was provided without a valid path`.

**Why jsdom doesn't save you:** jsdom's test environment setup checks if `globalThis.localStorage` is already defined and does not overwrite it. So Node's Proxy stub wins, and jsdom's real `Storage` instance never gets installed. This is not a jsdom bug — jsdom is behaving correctly. Node 25's default-enabled stub is clobbering the test environment before jsdom can set up.

Verified in a plain Node REPL (no vitest, no jsdom):

```bash
$ node -e "console.log(typeof globalThis.localStorage)"
object

$ node -e "console.log(Object.getOwnPropertyNames(globalThis.localStorage.__proto__))"
TypeError: Cannot convert undefined or null to object
```

## Investigation Steps

1. Ran `npm test` and saw 31 failures across 4 unrelated files — suspicious pattern (same symptom in every file, all with jsdom env declared).
2. Read one failing file — `localStorage.clear is not a function` pointed at a line where jsdom should have provided localStorage but hadn't.
3. Checked that all 4 failing files had `// @vitest-environment jsdom` at the top. They did.
4. Confirmed `jsdom` was installed (`ls node_modules/jsdom` showed the package).
5. Smoke-tested jsdom directly: `node -e "const {JSDOM} = require('jsdom'); const d = new JSDOM('', {url:'http://localhost/'}); console.log(typeof d.window.localStorage.clear)"` returned `"function"`. So jsdom itself was fine.
6. Checked `globalThis.localStorage` directly in plain Node. It was defined as an `"object"` but its `__proto__` was null — a broken stub.
7. Noticed the stderr warning: `Warning: --localstorage-file was provided without a valid path`. This pointed to Node's experimental webstorage feature.
8. Root cause identified: Node 25 ships a half-enabled native localStorage that survives inside vitest's jsdom environment and blocks jsdom's own implementation.

## Working Solution (what we shipped, commit 7e29f0e)

**Shim `globalThis.localStorage` with a functional in-memory Storage implementation in `src/test-setup.js` before any tests run.** The vitest config already loads this file via `setupFiles: ["./src/test-setup.js"]`.

```javascript
// app/src/test-setup.js
import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement scrollIntoView
if (typeof Element !== "undefined") {
  Element.prototype.scrollIntoView = () => {};
}

// Node 24+ ships a half-enabled experimental localStorage that lacks .clear()
// and other Storage API methods. When jsdom runs inside Node's localStorage
// shim, the broken native wins. Replace with a functional in-memory store.
if (typeof globalThis !== "undefined") {
  const createStorage = () => {
    let store = {};
    return {
      getItem: (key) => (key in store ? store[key] : null),
      setItem: (key, value) => {
        store[key] = String(value);
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      key: (index) => Object.keys(store)[index] ?? null,
      get length() {
        return Object.keys(store).length;
      },
    };
  };

  Object.defineProperty(globalThis, "localStorage", {
    value: createStorage(),
    writable: true,
    configurable: true,
  });
}
```

The `Object.defineProperty` with `configurable: true, writable: true` is the critical part. A plain assignment (`globalThis.localStorage = shim`) does not work because the native Proxy is non-configurable.

**Verification:** 270/270 tests passing after the shim, up from 239/270 before.

## Approaches tried and why the shim won

Three approaches were tested against the constraint that CI runs Node 20 while local dev runs Node 25.9.0:

### Attempt 1 — vitest `poolOptions.forks.execArgv` (FAILED)

```javascript
// vite.config.js
test: {
  pool: "forks",
  poolOptions: {
    forks: {
      execArgv: ["--no-experimental-webstorage"],
    },
  },
},
```

**Result:** 43 tests failed with the same `localStorage.clear is not a function` error. The vitest tinypool workers in vitest 4.1.0 do not inherit `execArgv` from this config — or the flag is applied too late in the worker startup sequence to prevent the webstorage stub from being created.

### Attempt 2 — `NODE_OPTIONS=--no-experimental-webstorage` (FAILED ON CI)

```json
"scripts": {
  "test": "NODE_OPTIONS=--no-experimental-webstorage vitest run"
}
```

**Result:** 282/282 passing locally on Node 25.9.0. Failed on CI (Node 20) with:

```
node: --no-experimental-webstorage is not allowed in NODE_OPTIONS
```

Two problems:

1. **Node 20 predates the webstorage feature entirely** — Node 22 is when the `--experimental-webstorage` flag was introduced. Node 20 has no knowledge of the flag and rejects it unconditionally.
2. **Node enforces a security allowlist for `NODE_OPTIONS`** — even if the flag were recognized, Node may refuse to allow it via environment variable. The allowlist exists to prevent malicious env vars from changing Node's runtime behavior.

This means the "canonical" NODE_OPTIONS approach is not viable in any project whose CI runs on Node 20 or earlier, or whose team members might be on older Node versions.

### Attempt 3 — `globalThis.localStorage` shim (WORKS EVERYWHERE)

```javascript
// app/src/test-setup.js
if (typeof globalThis !== "undefined") {
  const createStorage = () => {
    let store = {};
    return {
      getItem: (key) => (key in store ? store[key] : null),
      setItem: (key, value) => {
        store[key] = String(value);
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      key: (index) => Object.keys(store)[index] ?? null,
      get length() {
        return Object.keys(store).length;
      },
    };
  };

  Object.defineProperty(globalThis, "localStorage", {
    value: createStorage(),
    writable: true,
    configurable: true,
  });
}
```

**Result:** 284/284 passing locally (Node 25.9.0) and on CI (Node 20). Cross-version safe because it never touches Node flags. It simply replaces whatever `globalThis.localStorage` is defined (native stub on Node 25, nothing on Node 20 + jsdom which provides its own) with a functional in-memory Storage.

The `Object.defineProperty` with `configurable: true, writable: true` is the critical part. On Node 25, the native Proxy stub is non-configurable via plain assignment but can be overwritten via `defineProperty`.

## Lesson

The "better" solution (disable the flag at process level) is correct in theory but breaks on CI where the Node version doesn't recognize the flag. **Cross-version portability beats theoretical purity when you're shipping to a mixed-Node environment.** The shim is ugly but bulletproof.

If the project ever standardizes on Node 22+ across CI and local dev, revisit this doc and consider the NODE_OPTIONS approach again. Until then, the shim is the ship-it answer.

## Prevention

### 1. Pin Node version in `package.json`

Prevent silent Node upgrades from breaking the test suite:

```json
{
  "engines": {
    "node": ">=22.12.0 <26.0.0"
  }
}
```

Also add `.nvmrc` with the current LTS version (`22.12.0`) for local dev parity:

```bash
echo "22.12.0" > .nvmrc
```

### 2. CI multi-version matrix

Run tests on Node 22 LTS (production target) and Node 25 (bleeding edge) to catch regressions early. Example `.github/workflows/ci.yml`:

```yaml
strategy:
  matrix:
    node-version: [22.12.0, 25.x]
  fail-fast: false
```

### 3. Set `NODE_OPTIONS` in CI as belt-and-suspenders

Even after the `execArgv` fix lands, belt-and-suspenders via environment variable:

```yaml
env:
  NODE_OPTIONS: "--no-experimental-webstorage"
```

This covers any developer running tests on Node 25 locally without the updated `vite.config.js` loaded.

### 4. Verify test environment health at startup

Add a guard in `src/test-setup.js` that throws loudly if `localStorage` doesn't have the expected Storage API:

```javascript
if (typeof localStorage.clear !== "function") {
  throw new Error("localStorage.clear missing — test environment broken. Check Node version and vitest config.");
}
```

Fail-fast beats 31 confusing test errors.

### 5. Watch the vitest issue for canonical guidance

Subscribe to [vitest-dev/vitest#8757](https://github.com/vitest-dev/vitest/issues/8757) for updates. Node 26 will reintroduce spec-compliant behavior, and the mitigation may change.

## Related

- `docs/solutions/test-failures/company-id-mismatch-concept-cards.md` — different kind of test failure (data integrity, not environment), but same test suite
- [vitest-dev/vitest#8757](https://github.com/vitest-dev/vitest/issues/8757) — canonical issue tracking this across the vitest ecosystem
- [nodejs/node#57658](https://github.com/nodejs/node/issues/57658) — the original "unflag --experimental-webstorage" issue that introduced this behavior

## Sources

- [Node.js CLI API docs — `--experimental-webstorage`, `--localstorage-file`](https://nodejs.org/api/cli.html)
- [Node.js Globals docs — `globalThis.localStorage`](https://nodejs.org/api/globals.html)
- [Node.js 25.0.0 release notes](https://nodejs.org/en/blog/release/v25.0.0) — unflagged web storage
- [Node.js 25.2.1 release notes](https://nodejs.org/en/blog/release/v25.2.1) — reverted the throw-on-access behavior
- [vitest issue #8757 — "Node v25 breaks tests with Web Storage API"](https://github.com/vitest-dev/vitest/issues/8757)
- [Zenn: "Tests Using LocalStorage May Fail in Node.js v25"](https://zenn.dev/mima_ita/articles/775119d66803bf?locale=en)

## Verification Command

Quick check that your environment is affected:

```bash
node -e "try { localStorage.clear(); console.log('OK'); } catch(e) { console.log('BROKEN:', e.message); }"
```

If the output is `BROKEN: localStorage.clear is not a function`, your test environment needs the shim or the `execArgv` fix applied.
