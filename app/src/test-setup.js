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
