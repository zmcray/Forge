// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useConceptProgress from "./useConceptProgress";

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe("useConceptProgress", () => {
  it("returns default card state when none is stored", () => {
    const { result } = renderHook(() => useConceptProgress());
    expect(result.current.getCard("ebitda")).toEqual({
      notes: "",
      lastStudied: null,
      practiceAttempted: false,
    });
  });

  it("markStudied persists under forge-concepts", () => {
    const { result } = renderHook(() => useConceptProgress());

    act(() => {
      result.current.markStudied("ebitda");
    });

    const stored = JSON.parse(localStorageMock.getItem("forge-concepts"));
    expect(stored.cards.ebitda.lastStudied).toBeTruthy();
    expect(result.current.getStudiedCount()).toBe(1);
  });

  it("falls back to defaults on corrupt top-level shape", () => {
    localStorageMock.setItem("forge-concepts", JSON.stringify({ cards: [1, 2] }));

    const { result } = renderHook(() => useConceptProgress());
    expect(result.current.getStudiedCount()).toBe(0);
  });
});

describe("useConceptProgress corrupt inner values", () => {
  it("loads null card entries without throwing and counts skip them", () => {
    localStorageMock.setItem(
      "forge-concepts",
      JSON.stringify({ cards: { bad: null, alsoBad: 7, good: { lastStudied: "2026-07-01", practiceAttempted: true } } }),
    );

    const { result } = renderHook(() => useConceptProgress());
    expect(result.current.getStudiedCount()).toBe(1);
    expect(result.current.getPracticeCount()).toBe(1);
    expect(result.current.getCard("bad")).toEqual({
      notes: "",
      lastStudied: null,
      practiceAttempted: false,
    });
  });
});
