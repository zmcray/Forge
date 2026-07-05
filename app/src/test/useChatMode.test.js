// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useChatMode, { CHAT_MODES } from "../hooks/useChatMode";

const LEARN_KEY = "forge-chat-mode-learn";
const PRACTICE_KEY = "forge-chat-mode-practice";
const LEGACY_KEY = "forge-chat-mode";

describe("useChatMode", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("exports CHAT_MODES with DIRECT and SOCRATIC values", () => {
    expect(CHAT_MODES.DIRECT).toBe("direct");
    expect(CHAT_MODES.SOCRATIC).toBe("socratic");
  });

  describe("context-aware defaults", () => {
    it("learn context defaults to socratic when localStorage is empty", () => {
      const { result } = renderHook(() => useChatMode("learn"));
      expect(result.current.mode).toBe(CHAT_MODES.SOCRATIC);
    });

    it("practice context defaults to direct when localStorage is empty", () => {
      const { result } = renderHook(() => useChatMode("practice"));
      expect(result.current.mode).toBe(CHAT_MODES.DIRECT);
    });

    it("no-arg call behaves as learn", () => {
      const { result } = renderHook(() => useChatMode());
      expect(result.current.mode).toBe(CHAT_MODES.SOCRATIC);
    });

    it("unknown context falls back to learn semantics", () => {
      const { result } = renderHook(() => useChatMode("quickfire"));
      expect(result.current.mode).toBe(CHAT_MODES.SOCRATIC);
    });
  });

  describe("per-surface persistence", () => {
    it("setMode in learn writes the learn key without touching practice", () => {
      const { result } = renderHook(() => useChatMode("learn"));
      act(() => {
        result.current.setMode(CHAT_MODES.DIRECT);
      });
      expect(result.current.mode).toBe(CHAT_MODES.DIRECT);
      expect(localStorage.getItem(LEARN_KEY)).toBe(CHAT_MODES.DIRECT);
      expect(localStorage.getItem(PRACTICE_KEY)).toBeNull();
    });

    it("a choice on one surface does not change the other surface's mode", () => {
      const learn = renderHook(() => useChatMode("learn"));
      act(() => {
        learn.result.current.setMode(CHAT_MODES.DIRECT);
      });
      const practice = renderHook(() => useChatMode("practice"));
      expect(practice.result.current.mode).toBe(CHAT_MODES.DIRECT);
      act(() => {
        practice.result.current.setMode(CHAT_MODES.SOCRATIC);
      });
      expect(localStorage.getItem(LEARN_KEY)).toBe(CHAT_MODES.DIRECT);
      expect(localStorage.getItem(PRACTICE_KEY)).toBe(CHAT_MODES.SOCRATIC);
    });

    it("a fresh mount reads the persisted per-surface mode", () => {
      localStorage.setItem(PRACTICE_KEY, CHAT_MODES.SOCRATIC);
      const { result } = renderHook(() => useChatMode("practice"));
      expect(result.current.mode).toBe(CHAT_MODES.SOCRATIC);
    });

    it("invalid stored value falls back to the surface default", () => {
      localStorage.setItem(LEARN_KEY, "examiner");
      localStorage.setItem(PRACTICE_KEY, "examiner");
      expect(renderHook(() => useChatMode("learn")).result.current.mode).toBe(
        CHAT_MODES.SOCRATIC,
      );
      expect(renderHook(() => useChatMode("practice")).result.current.mode).toBe(
        CHAT_MODES.DIRECT,
      );
    });

    it("setMode('invalid') is a no-op (no state change, no write)", () => {
      const { result } = renderHook(() => useChatMode("practice"));
      act(() => {
        result.current.setMode("examiner");
      });
      expect(result.current.mode).toBe(CHAT_MODES.DIRECT);
      expect(localStorage.getItem(PRACTICE_KEY)).toBeNull();
    });
  });

  describe("legacy single-value migration", () => {
    it("seeds BOTH surface keys from a valid legacy value and removes the legacy key", () => {
      localStorage.setItem(LEGACY_KEY, CHAT_MODES.SOCRATIC);
      const { result } = renderHook(() => useChatMode("practice"));
      expect(result.current.mode).toBe(CHAT_MODES.SOCRATIC);
      expect(localStorage.getItem(LEARN_KEY)).toBe(CHAT_MODES.SOCRATIC);
      expect(localStorage.getItem(PRACTICE_KEY)).toBe(CHAT_MODES.SOCRATIC);
      expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
    });

    it("legacy 'direct' overrides the learn socratic default (explicit choice wins)", () => {
      localStorage.setItem(LEGACY_KEY, CHAT_MODES.DIRECT);
      const { result } = renderHook(() => useChatMode("learn"));
      expect(result.current.mode).toBe(CHAT_MODES.DIRECT);
    });

    it("migration does not overwrite an existing per-surface value", () => {
      localStorage.setItem(LEGACY_KEY, CHAT_MODES.DIRECT);
      localStorage.setItem(LEARN_KEY, CHAT_MODES.SOCRATIC);
      const { result } = renderHook(() => useChatMode("learn"));
      expect(result.current.mode).toBe(CHAT_MODES.SOCRATIC);
      // Practice was unseeded, so it still gets the legacy value.
      expect(localStorage.getItem(PRACTICE_KEY)).toBe(CHAT_MODES.DIRECT);
    });

    it("an invalid legacy value is discarded without seeding surfaces", () => {
      localStorage.setItem(LEGACY_KEY, "examiner");
      const { result } = renderHook(() => useChatMode("learn"));
      expect(result.current.mode).toBe(CHAT_MODES.SOCRATIC);
      expect(localStorage.getItem(LEARN_KEY)).toBeNull();
      expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
    });
  });

  describe("storage failure tolerance", () => {
    it("localStorage write failure does not crash the hook", () => {
      const setItemSpy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("QuotaExceededError");
        });
      const { result } = renderHook(() => useChatMode("practice"));
      expect(() => {
        act(() => {
          result.current.setMode(CHAT_MODES.SOCRATIC);
        });
      }).not.toThrow();
      // In-memory state still updates even if persistence fails
      expect(result.current.mode).toBe(CHAT_MODES.SOCRATIC);
      setItemSpy.mockRestore();
    });

    it("localStorage read failure in initializer falls back to the surface default", () => {
      const getItemSpy = vi
        .spyOn(Storage.prototype, "getItem")
        .mockImplementation(() => {
          throw new Error("SecurityError");
        });
      const { result } = renderHook(() => useChatMode("practice"));
      expect(result.current.mode).toBe(CHAT_MODES.DIRECT);
      getItemSpy.mockRestore();
    });
  });

  describe("cross-tab sync via storage events", () => {
    function emitStorage({ key, newValue }) {
      const event = new Event("storage");
      Object.defineProperty(event, "key", { value: key });
      Object.defineProperty(event, "newValue", { value: newValue });
      window.dispatchEvent(event);
    }

    it("a storage event on this surface's key updates local mode state", () => {
      const { result } = renderHook(() => useChatMode("practice"));
      expect(result.current.mode).toBe(CHAT_MODES.DIRECT);
      act(() => {
        emitStorage({ key: PRACTICE_KEY, newValue: CHAT_MODES.SOCRATIC });
      });
      expect(result.current.mode).toBe(CHAT_MODES.SOCRATIC);
    });

    it("a storage event on the OTHER surface's key is ignored", () => {
      const { result } = renderHook(() => useChatMode("practice"));
      act(() => {
        emitStorage({ key: LEARN_KEY, newValue: CHAT_MODES.SOCRATIC });
      });
      expect(result.current.mode).toBe(CHAT_MODES.DIRECT);
    });

    it("a storage event with an invalid value is ignored", () => {
      const { result } = renderHook(() => useChatMode("practice"));
      act(() => {
        emitStorage({ key: PRACTICE_KEY, newValue: "examiner" });
      });
      expect(result.current.mode).toBe(CHAT_MODES.DIRECT);
    });

    it("a storage event clearing the key resets to the surface default", () => {
      localStorage.setItem(LEARN_KEY, CHAT_MODES.DIRECT);
      const { result } = renderHook(() => useChatMode("learn"));
      expect(result.current.mode).toBe(CHAT_MODES.DIRECT);
      act(() => {
        emitStorage({ key: LEARN_KEY, newValue: null });
      });
      expect(result.current.mode).toBe(CHAT_MODES.SOCRATIC);
    });
  });
});
