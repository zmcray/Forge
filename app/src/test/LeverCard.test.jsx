// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import LeverCard from "../components/learn/LeverCard";
import LeverList from "../components/learn/LeverList";
import { VALUE_LEVERS } from "../data/valueLevers";

vi.mock("../utils/evaluateAnswer", () => ({
  evaluateAnswer: vi.fn(() =>
    Promise.resolve({
      score: 4,
      strengths: ["Identifies pricing power"],
      gaps: ["Missing churn risk"],
      suggestion: "Consider customer concentration",
    })
  ),
}));

function renderDetail(leverId) {
  return render(
    <MemoryRouter initialEntries={[`/learn/levers/${leverId}`]}>
      <Routes>
        <Route path="/learn/levers" element={<LeverList />} />
        <Route path="/learn/levers/:leverId" element={<LeverCard />} />
        <Route path="/practice/:companyId" element={<div>Practice page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

function renderList() {
  return render(
    <MemoryRouter initialEntries={["/learn/levers"]}>
      <Routes>
        <Route path="/learn/levers" element={<LeverList />} />
        <Route path="/learn/levers/:leverId" element={<LeverCard />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("LeverList", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders all 15 levers", () => {
    renderList();
    for (const lever of VALUE_LEVERS) {
      expect(screen.getByText(lever.title)).toBeInTheDocument();
    }
  });

  it("groups levers by category", () => {
    renderList();
    expect(screen.getByText("Revenue Levers")).toBeInTheDocument();
    expect(screen.getByText("Margin Levers")).toBeInTheDocument();
    expect(screen.getByText("Organizational Levers")).toBeInTheDocument();
    expect(screen.getByText("Technology Levers")).toBeInTheDocument();
    expect(screen.getByText("Strategic Levers")).toBeInTheDocument();
  });
});

describe("LeverCard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders lever header, category, and position indicator", () => {
    renderDetail("pricing-optimization");
    expect(screen.getByRole("heading", { name: /Pricing Optimization/i })).toBeInTheDocument();
    expect(screen.getByText("Revenue Levers")).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 15/)).toBeInTheDocument();
  });

  it("renders all main sections for a valid lever", () => {
    renderDetail("pricing-optimization");
    expect(screen.getByText("When to Deploy")).toBeInTheDocument();
    expect(screen.getByText("Typical Impact")).toBeInTheDocument();
    expect(screen.getByText("Business Type Fit")).toBeInTheDocument();
    expect(screen.getByText("Red Flags")).toBeInTheDocument();
    expect(screen.getByText("Applied Examples")).toBeInTheDocument();
    expect(screen.getByText("Practice")).toBeInTheDocument();
    expect(screen.getByText("My Notes")).toBeInTheDocument();
  });

  it("shows 'not found' for an invalid leverId", () => {
    renderDetail("not-a-real-lever");
    expect(screen.getByText(/Lever not found/i)).toBeInTheDocument();
  });

  it("renders both company examples with resolved real data", () => {
    renderDetail("pricing-optimization");
    expect(screen.getByText("Summit Mechanical Services")).toBeInTheDocument();
    expect(screen.getByText("TrueNorth Analytics")).toBeInTheDocument();
    // Real revenue for summit-hvac is 32.5 per companies.js
    expect(screen.getAllByText(/32\.5/).length).toBeGreaterThan(0);
  });

  it("has 'See Company' navigation links pointing to practice routes", () => {
    renderDetail("pricing-optimization");
    const seeCompanyButtons = screen.getAllByText(/See Company/);
    expect(seeCompanyButtons.length).toBeGreaterThanOrEqual(2);
  });

  it("gates the exercise reveal button on 50-char minimum", () => {
    renderDetail("pricing-optimization");
    const revealBtn = screen.getByRole("button", { name: /Reveal Rubric/i });
    expect(revealBtn).toBeDisabled();
  });

  it("reveals rubric and fires LLM grading when enough chars entered", async () => {
    renderDetail("pricing-optimization");
    const textarea = screen.getByPlaceholderText(/Write your analysis/i);
    fireEvent.change(textarea, {
      target: {
        value:
          "Pricing optimization should be prioritized before cost cutting because services firms with low price transparency have material pricing power headroom.",
      },
    });
    const revealBtn = screen.getByRole("button", { name: /Reveal Rubric/i });
    expect(revealBtn).not.toBeDisabled();
    fireEvent.click(revealBtn);
    expect(await screen.findByText(/A Strong Answer Covers/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Answer/i)).toBeInTheDocument();
  });

  it("renders prev/next buttons with correct disabled state on first lever", () => {
    renderDetail("pricing-optimization");
    const prev = screen.getByRole("button", { name: /Previous/i });
    expect(prev).toBeDisabled();
    const next = screen.getByRole("button", { name: /Next/i });
    expect(next).not.toBeDisabled();
  });

  it("disables next button on the last lever", () => {
    const lastLever = VALUE_LEVERS[VALUE_LEVERS.length - 1];
    renderDetail(lastLever.id);
    const next = screen.getByRole("button", { name: /Next/i });
    expect(next).toBeDisabled();
  });

  it("persists notes to localStorage on change", () => {
    renderDetail("pricing-optimization");
    const notes = screen.getByPlaceholderText(/Capture your key takeaways/i);
    fireEvent.change(notes, { target: { value: "Key insight: sales comp is the leakage risk" } });
    const stored = JSON.parse(localStorage.getItem("forge-levers"));
    expect(stored.levers["pricing-optimization"].notes).toContain("Key insight");
  });
});
