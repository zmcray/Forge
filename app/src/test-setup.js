import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement scrollIntoView
if (typeof Element !== "undefined") {
  Element.prototype.scrollIntoView = () => {};
}

// Node 24+ ships a half-enabled experimental globalThis.localStorage without
// the Storage API (no .clear, no .getItem, etc.) when --localstorage-file is
// unset. The stub wins over jsdom's real Storage. Force-replace it with an
// in-memory shim so tests work on Node 20 (CI) through Node 25+ (local dev).
// The cleaner --no-experimental-webstorage flag is NOT viable here because
// Node 20 rejects unknown flags in NODE_OPTIONS and vitest's poolOptions
// execArgv doesn't propagate to workers in vitest 4.1. See
// docs/solutions/test-failures/node-25-webstorage-breaks-jsdom-tests.md
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
