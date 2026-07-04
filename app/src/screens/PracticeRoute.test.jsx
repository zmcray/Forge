// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ScoringProvider } from "../contexts/ScoringContext";
import { OnboardingProvider } from "../contexts/OnboardingContext";
import PracticeRoute from "./PracticeRoute";

// MCR-407 regression suite: the practice timer must live inside the practice
// route. Ticks may only re-render the practice subtree, and the interval must
// die when the route unmounts (navigation away, unmount, etc).

let chromeRenders = 0;
let homeRenders = 0;

// Always-mounted sibling, standing in for AppShell chrome above the routes.
function ChromeProbe() {
  chromeRenders += 1;
  const navigate = useNavigate();
  return <button onClick={() => navigate("/")}>go-home</button>;
}

function HomeProbe() {
  homeRenders += 1;
  return <div>home-probe</div>;
}

function renderApp(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ScoringProvider>
        <OnboardingProvider>
          <ChromeProbe />
          <Routes>
            <Route path="/" element={<HomeProbe />} />
            <Route path="/practice/:companyId" element={<PracticeRoute />} />
          </Routes>
        </OnboardingProvider>
      </ScoringProvider>
    </MemoryRouter>
  );
}

describe("PracticeRoute timer containment (MCR-407)", () => {
  beforeEach(() => {
    chromeRenders = 0;
    homeRenders = 0;
    localStorage.clear();
    vi.useFakeTimers();
    // startPractice fires a warmup OPTIONS ping; keep jsdom quiet.
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: true })));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("deep link starts a session with a ticking timer", () => {
    const baseline = vi.getTimerCount();
    renderApp("/practice/summit-hvac");

    expect(screen.getByText("Summit Mechanical Services")).toBeTruthy();
    expect(vi.getTimerCount()).toBeGreaterThan(baseline);

    act(() => {
      vi.advanceTimersByTime(61_000);
    });
    expect(screen.getByText("1:01")).toBeTruthy();
  });

  it("clears the interval when the practice route unmounts", () => {
    const baseline = vi.getTimerCount();
    const { unmount } = renderApp("/practice/summit-hvac");
    expect(vi.getTimerCount()).toBeGreaterThan(baseline);

    unmount();
    expect(vi.getTimerCount()).toBe(baseline);
  });

  it("navigating away from practice stops ticks", () => {
    const baseline = vi.getTimerCount();
    renderApp("/practice/summit-hvac");

    act(() => {
      vi.advanceTimersByTime(3_000);
    });

    fireEvent.click(screen.getByText("go-home"));
    expect(screen.getByText("home-probe")).toBeTruthy();
    expect(vi.getTimerCount()).toBe(baseline);

    // No stray interval left behind: advancing time schedules no work.
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(vi.getTimerCount()).toBe(baseline);
  });

  it("timer ticks do not re-render components outside the practice subtree", () => {
    renderApp("/practice/summit-hvac");
    const chromeAfterMount = chromeRenders;

    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    expect(screen.getByText("0:05")).toBeTruthy(); // ticks reached TimerBar
    expect(chromeRenders).toBe(chromeAfterMount); // ...and nothing above it
    expect(homeRenders).toBe(0); // home route never rendered at all
  });
});
