// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/renderWithProviders";
import ProgressDashboard from "./ProgressDashboard";

function seedSessions(questions) {
  localStorage.setItem(
    "forge-data",
    JSON.stringify({
      version: 2,
      sessions: [
        {
          date: "2026-07-03",
          companyId: "summit-hvac",
          duration: 600,
          questions,
        },
      ],
      streak: { current: 3, lastDate: "2026-07-03" },
    })
  );
}

const q = (type, score, extra = {}) => ({
  type,
  score,
  delta: null,
  unit: null,
  atomId: null,
  atomType: null,
  feedback: null,
  timestamp: "2026-07-03T12:00:00.000Z",
  ...extra,
});

describe("ProgressDashboard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders empty-state stats with no persisted sessions", () => {
    renderWithProviders(<ProgressDashboard />);
    expect(screen.getByText("Questions Completed")).toBeInTheDocument();
    // Total questions, strong answers, and day streak all read 0
    expect(screen.getAllByText("0")).toHaveLength(3);
    // No focus areas or quantitative accuracy blocks without data
    expect(screen.queryByText("Focus Areas")).not.toBeInTheDocument();
    expect(screen.queryByText("Quantitative Accuracy")).not.toBeInTheDocument();
  });

  it("computes stats from seeded sessions: totals, average, strong answers, streak", () => {
    seedSessions([
      q("metric", 5, { delta: 0.5, unit: "%" }),
      q("metric", 4, { delta: -1.5, unit: "%" }),
      q("risk", 2),
      q("risk", 1),
    ]);
    renderWithProviders(<ProgressDashboard />);

    expect(screen.getByText("4")).toBeInTheDocument(); // questions completed
    expect(screen.getByText("3.0")).toBeInTheDocument(); // average score
    expect(screen.getByText("2")).toBeInTheDocument(); // strong answers (4-5)
    expect(screen.getByText("3")).toBeInTheDocument(); // day streak
  });

  it("shows quantitative accuracy from persisted deltas", () => {
    seedSessions([
      q("metric", 5, { delta: 0.5, unit: "%" }),
      q("metric", 4, { delta: -1.5, unit: "%" }),
      q("risk", 3),
    ]);
    renderWithProviders(<ProgressDashboard />);

    expect(screen.getByText("Quantitative Accuracy")).toBeInTheDocument();
    // (|0.5| + |-1.5|) / 2 = 1.0pp across 2 questions
    expect(screen.getByText("1.0pp")).toBeInTheDocument();
    expect(screen.getByText(/across 2 questions/)).toBeInTheDocument();
  });

  it("surfaces categories under 3.0 as focus areas", () => {
    seedSessions([q("metric", 5), q("risk", 2), q("risk", 1)]);
    renderWithProviders(<ProgressDashboard />);

    expect(screen.getByText("Focus Areas")).toBeInTheDocument();
    // Appears once in the category list and once in the focus-area callout
    expect(screen.getAllByText(/Risk Assessment/)).toHaveLength(2);
    expect(screen.getByText(/avg 1\.5\/5/)).toBeInTheDocument();
    // Strong category is not flagged
    expect(screen.queryByText(/avg 5\.0\/5/)).not.toBeInTheDocument();
  });

  it("shows the all-clear message when every category averages 3.0+", () => {
    seedSessions([q("metric", 5), q("risk", 4), q("thesis", 3)]);
    renderWithProviders(<ProgressDashboard />);

    expect(screen.getByText("Focus Areas")).toBeInTheDocument();
    expect(screen.getByText(/All categories at 3\.0\+/)).toBeInTheDocument();
  });
});
