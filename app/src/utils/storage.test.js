import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { loadJSON, saveJSON, loadString, saveString } from "./storage";

const KEY = "forge-test-key";
const BACKUP = `${KEY}-corrupt-backup`;

let warnSpy;

beforeEach(() => {
  localStorage.clear();
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loadJSON / saveJSON", () => {
  it("round-trips a valid value", () => {
    saveJSON(KEY, { a: 1, list: [2, 3] });
    expect(loadJSON(KEY, { fallback: null })).toEqual({ a: 1, list: [2, 3] });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("returns fallback when the key is absent, without warning or backup", () => {
    const fallback = { fresh: true };
    expect(loadJSON(KEY, { fallback })).toBe(fallback);
    expect(warnSpy).not.toHaveBeenCalled();
    expect(localStorage.getItem(BACKUP)).toBeNull();
  });

  it("supports a lazy fallback function", () => {
    expect(loadJSON(KEY, { fallback: () => ({ made: "fresh" }) })).toEqual({ made: "fresh" });
  });

  it("warns, backs up raw bytes, and returns fallback on corrupt JSON", () => {
    localStorage.setItem(KEY, "not valid json{{{");
    const result = loadJSON(KEY, { fallback: { reset: true } });
    expect(result).toEqual({ reset: true });
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(warnSpy.mock.calls[0][0]).toContain(KEY);
    expect(localStorage.getItem(BACKUP)).toBe("not valid json{{{");
  });

  it("warns, backs up, and returns fallback when validate rejects the parsed shape", () => {
    localStorage.setItem(KEY, JSON.stringify({ wrong: "shape" }));
    const result = loadJSON(KEY, {
      validate: (parsed) => Array.isArray(parsed?.items),
      fallback: { items: [] },
    });
    expect(result).toEqual({ items: [] });
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(localStorage.getItem(BACKUP)).toBe(JSON.stringify({ wrong: "shape" }));
  });

  it("honors a custom backupKey", () => {
    localStorage.setItem(KEY, "garbage");
    loadJSON(KEY, { fallback: null, backupKey: "custom-backup" });
    expect(localStorage.getItem("custom-backup")).toBe("garbage");
    expect(localStorage.getItem(BACKUP)).toBeNull();
  });

  it("passes valid data through validate untouched", () => {
    localStorage.setItem(KEY, JSON.stringify({ items: [1] }));
    const result = loadJSON(KEY, {
      validate: (parsed) => Array.isArray(parsed?.items),
      fallback: { items: [] },
    });
    expect(result).toEqual({ items: [1] });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("warns and returns fallback when storage access throws", () => {
    vi.spyOn(localStorage, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    expect(loadJSON(KEY, { fallback: { safe: true } })).toEqual({ safe: true });
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it("warns (never silent) when saveJSON fails", () => {
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    saveJSON(KEY, { a: 1 });
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(warnSpy.mock.calls[0][0]).toContain(KEY);
  });

  it("warns when the value cannot be serialized", () => {
    const cyclic = {};
    cyclic.self = cyclic;
    saveJSON(KEY, cyclic);
    expect(warnSpy).toHaveBeenCalledOnce();
  });
});

describe("loadString / saveString", () => {
  it("round-trips a plain string", () => {
    saveString(KEY, "dark");
    expect(loadString(KEY, { fallback: "light" })).toBe("dark");
  });

  it("returns fallback when absent, without warning", () => {
    expect(loadString(KEY, { fallback: "light" })).toBe("light");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("warns and returns fallback when validate rejects the stored value", () => {
    localStorage.setItem(KEY, "banana");
    const result = loadString(KEY, {
      validate: (v) => v === "dark" || v === "light",
      fallback: "light",
    });
    expect(result).toBe("light");
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it("warns and returns fallback when storage access throws", () => {
    vi.spyOn(localStorage, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    expect(loadString(KEY, { fallback: "light" })).toBe("light");
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it("warns (never silent) when saveString fails", () => {
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    saveString(KEY, "dark");
    expect(warnSpy).toHaveBeenCalledOnce();
  });
});
