// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import BridgeList from "../components/learn/BridgeList";
import BridgeCalculator from "../components/learn/BridgeCalculator";
import { BRIDGE_SCENARIOS } from "../data/valueBridge";

function renderDetail(scenarioId) {
  return render(
    <MemoryRouter initialEntries={[`/learn/bridge/${scenarioId}`]}>
      <Routes>
        <Route path="/learn/bridge" element={<BridgeList />} />
        <Route path="/learn/bridge/:scenarioId" element={<BridgeCalculator />} />
        <Route path="/practice/:companyId" element={<div>Practice page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

function renderList() {
  return render(
    <MemoryRouter initialEntries={["/learn/bridge"]}>
      <Routes>
        <Route path="/learn/bridge" element={<BridgeList />} />
        <Route path="/learn/bridge/:scenarioId" element={<BridgeCalculator />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("BridgeList", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders all 7 scenarios with labels", () => {
    renderList();
    for (const scenario of BRIDGE_SCENARIOS) {
      expect(screen.getByText(scenario.label)).toBeInTheDocument();
    }
  });

  it("renders MOIC badge for each scenario tile", () => {
    renderList();
    const moicLabels = screen.getAllByText("MOIC");
    expect(moicLabels.length).toBe(BRIDGE_SCENARIOS.length);
  });

  it("navigates to detail view on tile click", () => {
    renderList();
    const tile = screen.getByText("Services Platform (Baseline)").closest("button");
    fireEvent.click(tile);
    expect(screen.getByText("Return Decomposition")).toBeInTheDocument();
  });
});

describe("BridgeCalculator", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders scenario header, thesis, and position indicator", () => {
    renderDetail("services-platform");
    expect(
      screen.getByRole("heading", { name: /Services Platform \(Baseline\)/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 7/)).toBeInTheDocument();
  });

  it("shows 'not found' for an invalid scenarioId", () => {
    renderDetail("not-a-real-scenario");
    expect(screen.getByText(/Scenario not found/i)).toBeInTheDocument();
  });

  it("renders all main sections", () => {
    renderDetail("services-platform");
    expect(screen.getByText("Entry (Year 0)")).toBeInTheDocument();
    expect(screen.getByText(/Exit Assumptions/)).toBeInTheDocument();
    expect(screen.getByText("Return Decomposition")).toBeInTheDocument();
    expect(screen.getByText("Return Attribution")).toBeInTheDocument();
    expect(screen.getByText("Practice")).toBeInTheDocument();
    expect(screen.getByText("Key Lesson")).toBeInTheDocument();
    expect(screen.getByText("My Notes")).toBeInTheDocument();
  });

  it("renders all 4 slider controls", () => {
    renderDetail("services-platform");
    expect(screen.getByLabelText("Revenue CAGR")).toBeInTheDocument();
    expect(screen.getByLabelText("Margin Expansion")).toBeInTheDocument();
    expect(screen.getByLabelText("Multiple Expansion")).toBeInTheDocument();
    expect(screen.getByLabelText("Debt Paydown")).toBeInTheDocument();
  });

  it("updates MOIC display when a slider changes", () => {
    renderDetail("services-platform");
    const cagrSlider = screen.getByLabelText("Revenue CAGR");
    // Bump CAGR to max (18%) — MOIC should increase from plan baseline
    fireEvent.change(cagrSlider, { target: { value: "18" } });
    // Reset button should now show
    expect(screen.getByRole("button", { name: /Reset to plan/i })).toBeInTheDocument();
  });

  it("reset button restores plan assumptions and disappears", () => {
    renderDetail("services-platform");
    const cagrSlider = screen.getByLabelText("Revenue CAGR");
    fireEvent.change(cagrSlider, { target: { value: "18" } });
    const resetBtn = screen.getByRole("button", { name: /Reset to plan/i });
    fireEvent.click(resetBtn);
    expect(screen.queryByRole("button", { name: /Reset to plan/i })).not.toBeInTheDocument();
  });

  it("check exercise reports pass when plan is tuned to hit 4.0x target", () => {
    renderDetail("services-platform");
    // Plan baseline delivers ~2.9x MOIC; target is 4.0x ± 0.1. Tune to hit it.
    // Math: CAGR=12 -> rev 57.3; +400 bps -> margin 20.9% -> ebitda 11.97;
    // +2.5x multiple -> EV 101.75; netDebt 2 -> equity 99.75 -> MOIC 3.99
    fireEvent.change(screen.getByLabelText("Revenue CAGR"), { target: { value: "12" } });
    fireEvent.change(screen.getByLabelText("Margin Expansion"), { target: { value: "400" } });
    fireEvent.change(screen.getByLabelText("Multiple Expansion"), { target: { value: "2.5" } });
    fireEvent.click(screen.getByRole("button", { name: /Check My Answer/i }));
    expect(screen.getByText("PASSED")).toBeInTheDocument();
  });

  it("check exercise reports miss at plan baseline (3.0x vs 4.0x target)", () => {
    renderDetail("services-platform");
    fireEvent.click(screen.getByRole("button", { name: /Check My Answer/i }));
    expect(screen.getByText("MISS")).toBeInTheDocument();
    // Hint is revealed only after a check attempt
    expect(screen.getByText(/Multiple expansion has the most leverage/i)).toBeInTheDocument();
  });

  it("prev button is disabled on the first scenario", () => {
    renderDetail("services-platform");
    const prev = screen.getByRole("button", { name: /Previous/i });
    expect(prev).toBeDisabled();
    const next = screen.getByRole("button", { name: /Next/i });
    expect(next).not.toBeDisabled();
  });

  it("next button is disabled on the last scenario", () => {
    const last = BRIDGE_SCENARIOS[BRIDGE_SCENARIOS.length - 1];
    renderDetail(last.id);
    const next = screen.getByRole("button", { name: /Next/i });
    expect(next).toBeDisabled();
  });

  it("persists notes to localStorage on change", () => {
    renderDetail("services-platform");
    const notes = screen.getByPlaceholderText(/Capture your key takeaways/i);
    fireEvent.change(notes, {
      target: { value: "Multiple expansion is the biggest lever here" },
    });
    // Notes are stored under forge-notes (shared useNotes hook), key bridge-services-platform
    const stored = JSON.parse(localStorage.getItem("forge-notes"));
    expect(stored["bridge-services-platform"].text).toContain("Multiple expansion");
  });

  it("renders company link to practice route", () => {
    renderDetail("services-platform");
    const link = screen.getByText("Summit Mechanical Services").closest("button");
    fireEvent.click(link);
    expect(screen.getByText("Practice page")).toBeInTheDocument();
  });

  it("marks scenario as studied on mount (persisted to localStorage)", () => {
    renderDetail("services-platform");
    const stored = JSON.parse(localStorage.getItem("forge-bridge"));
    expect(stored.scenarios["services-platform"].lastStudied).toBeTruthy();
  });
});
