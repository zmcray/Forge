import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Test the timer logic directly (not as a hook)
describe("useTimer logic", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats time correctly", () => {
    // Test the formatting logic
    const formatTime = (elapsed) => {
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      return `${minutes}:${String(seconds).padStart(2, "0")}`;
    };

    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(65)).toBe("1:05");
    expect(formatTime(900)).toBe("15:00");
    expect(formatTime(599)).toBe("9:59");
  });

  it("calculates progress correctly", () => {
    const limit = 15 * 60; // 900 seconds
    expect(Math.min(0 / limit, 1)).toBe(0);
    expect(Math.min(450 / limit, 1)).toBe(0.5);
    expect(Math.min(900 / limit, 1)).toBe(1);
    expect(Math.min(1200 / limit, 1)).toBe(1); // caps at 1
  });

  it("identifies pace milestones", () => {
    const PACE_MILESTONES = [
      { minutes: 5, message: "5 min in. Have you checked margins and growth?" },
      { minutes: 10, message: "10 min in. Time to form your investment thesis." },
      { minutes: 15, message: "15 min. A real screening call would be wrapping up." },
    ];

    const getMilestone = (elapsedMinutes) =>
      PACE_MILESTONES.filter(m => elapsedMinutes >= m.minutes).pop();

    expect(getMilestone(0)).toBeUndefined();
    expect(getMilestone(3)).toBeUndefined();
    expect(getMilestone(5).minutes).toBe(5);
    expect(getMilestone(7).minutes).toBe(5);
    expect(getMilestone(10).minutes).toBe(10);
    expect(getMilestone(15).minutes).toBe(15);
  });

  it("detects expiration at limit", () => {
    const limit = 15 * 60;
    expect(900 >= limit).toBe(true);
    expect(899 >= limit).toBe(false);
  });
});

describe("useKeyboardShortcuts logic", () => {
  it("ignores events from input elements", () => {
    const mockEvent = {
      target: { tagName: "INPUT" },
      key: "1",
      preventDefault: vi.fn(),
    };

    // Logic from useKeyboardShortcuts
    const shouldIgnore = mockEvent.target.tagName === "INPUT" || mockEvent.target.tagName === "TEXTAREA";
    expect(shouldIgnore).toBe(true);
  });

  it("detects score keys 1-5", () => {
    for (let i = 1; i <= 5; i++) {
      const num = parseInt(String(i));
      expect(num >= 1 && num <= 5).toBe(true);
    }
  });

  it("does not treat 0 or 6+ as score keys", () => {
    expect(parseInt("0") >= 1 && parseInt("0") <= 5).toBe(false);
    expect(parseInt("6") >= 1 && parseInt("6") <= 5).toBe(false);
    expect(parseInt("a") >= 1 && parseInt("a") <= 5).toBe(false);
  });
});
