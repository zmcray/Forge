// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useChatMode, { CHAT_MODES } from "../hooks/useChatMode";

const STORAGE_KEY = "forge-chat-mode";

describe("useChatMode", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("exports CHAT_MODES with DIRECT and SOCRATIC values", () => {
    expect(CHAT_MODES.DIRECT).toBe("direct");
    expect(CHAT_MODES.SOCRATIC).toBe("socratic");
  });

  it("defaults to direct when localStorage is empty", () => {
    const { result } = renderHook(() => useChatMode());
    expect(result.current.mode).toBe(CHAT_MODES.DIRECT);
  });

  it("setMode('socratic') updates state and writes to localStorage", () => {
    const { result } = renderHook(() => useChatMode());
    act(() => {
      result.current.setMode(CHAT_MODES.SOCRATIC);
    });
    expect(result.current.mode).toBe(CHAT_MODES.SOCRATIC);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(CHAT_MODES.SOCRATIC);
  });

  it("a fresh mount reads the persisted mode", () => {
    localStorage.setItem(STORAGE_KEY, CHAT_MODES.SOCRATIC);
    const { result } = renderHook(() => useChatMode());
    expect(result.current.mode).toBe(CHAT_MODES.SOCRATIC);
  });

  it("invalid stored value falls back to direct", () => {
    localStorage.setItem(STORAGE_KEY, "examiner");
    const { result } = renderHook(() => useChatMode());
    expect(result.current.mode).toBe(CHAT_MODES.DIRECT);
  });

  it("setMode('invalid') is a no-op (no state change, no write)", () => {
    const { result } = renderHook(() => useChatMode());
    act(() => {
      result.current.setMode("examiner");
    });
    expect(result.current.mode).toBe(CHAT_MODES.DIRECT);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("localStorage write failure does not crash the hook", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    const { result } = renderHook(() => useChatMode());
    expect(() => {
      act(() => {
        result.current.setMode(CHAT_MODES.SOCRATIC);
      });
    }).not.toThrow();
    // In-memory state still updates even if persistence fails
    expect(result.current.mode).toBe(CHAT_MODES.SOCRATIC);
    setItemSpy.mockRestore();
  });

  it("localStorage read failure in initializer falls back to default", () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    const { result } = renderHook(() => useChatMode());
    expect(result.current.mode).toBe(CHAT_MODES.DIRECT);
    getItemSpy.mockRestore();
  });
});
