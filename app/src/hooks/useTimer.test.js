// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useTimer from "./useTimer";

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("initializes idle with zeroed state", () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.elapsed).toBe(0);
    expect(result.current.formattedTime).toBe("0:00");
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isExpired).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.currentMilestone).toBeUndefined();
  });

  it("does not tick before start is called", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(result.current.elapsed).toBe(0);
  });

  it("counts up once started and formats elapsed time", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });
    expect(result.current.isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(65_000);
    });

    expect(result.current.elapsed).toBe(65);
    expect(result.current.formattedTime).toBe("1:05");
    expect(result.current.elapsedMinutes).toBe(1);
  });

  it("reports progress as a fraction of the limit, capped at 1", () => {
    const { result } = renderHook(() => useTimer(15));

    act(() => {
      result.current.start();
    });
    act(() => {
      vi.advanceTimersByTime(450_000); // 7:30 of a 15:00 limit
    });
    expect(result.current.progress).toBe(0.5);

    act(() => {
      vi.advanceTimersByTime(600_000); // well past the limit
    });
    expect(result.current.progress).toBe(1);
  });

  it("crosses pace milestones at 5, 10, and 15 minutes", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(299_000); // 4:59
    });
    expect(result.current.currentMilestone).toBeUndefined();

    act(() => {
      vi.advanceTimersByTime(1_000); // 5:00
    });
    expect(result.current.currentMilestone?.minutes).toBe(5);

    act(() => {
      vi.advanceTimersByTime(300_000); // 10:00
    });
    expect(result.current.currentMilestone?.minutes).toBe(10);

    act(() => {
      vi.advanceTimersByTime(300_000); // 15:00
    });
    expect(result.current.currentMilestone?.minutes).toBe(15);
  });

  it("flips isExpired exactly at the limit and keeps counting", () => {
    const { result } = renderHook(() => useTimer(15));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(899_000); // 14:59
    });
    expect(result.current.isExpired).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1_000); // 15:00
    });
    expect(result.current.isExpired).toBe(true);

    act(() => {
      vi.advanceTimersByTime(5_000);
    });
    expect(result.current.elapsed).toBe(905);
    expect(result.current.isExpired).toBe(true);
  });

  it("respects a custom limit", () => {
    const { result } = renderHook(() => useTimer(1));

    act(() => {
      result.current.start();
    });
    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(result.current.isExpired).toBe(true);
    expect(result.current.progress).toBe(1);
  });

  it("stop halts the countdown without clearing elapsed", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    act(() => {
      result.current.stop();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.elapsed).toBe(30);

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(result.current.elapsed).toBe(30);
  });

  it("start after stop restarts from zero", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    act(() => {
      result.current.stop();
    });
    act(() => {
      result.current.start();
    });

    expect(result.current.elapsed).toBe(0);

    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(result.current.elapsed).toBe(10);
  });

  it("reset zeroes state, stops the timer, and clears expiry", () => {
    const { result } = renderHook(() => useTimer(1));

    act(() => {
      result.current.start();
    });
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(result.current.isExpired).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.elapsed).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isExpired).toBe(false);
    expect(result.current.progress).toBe(0);

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(result.current.elapsed).toBe(0);
  });

  it("clears its interval on unmount", () => {
    const clearSpy = vi.spyOn(globalThis, "clearInterval");
    const { result, unmount } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });
    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    unmount();

    expect(clearSpy).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
});
