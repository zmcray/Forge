// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test/renderWithProviders";
import RankingStage from "./RankingStage";
import { COMPANIES } from "../../data/companies";
import { OPERATIONS_PROFILES } from "../../data/companyOperations";
import { computeIdealTop3 } from "../../utils/rankingScore";

const company = COMPANIES.find((c) => c.id === "summit-hvac");
const profile = OPERATIONS_PROFILES["summit-hvac"];
const opName = (id) => profile.operations.find((op) => op.id === id).name;

function renderStage() {
  renderWithProviders(
    <RankingStage
      company={company}
      operations={profile.operations}
      aiOpportunities={profile.aiOpportunities}
      implementationContext={profile.implementationContext}
    />,
  );
}

function pick(ids) {
  for (const id of ids) {
    // Process picker buttons carry the FTE subtitle; ranked rows do not.
    fireEvent.click(screen.getByRole("button", { name: new RegExp(`${opName(id)}.*FTEs`) }));
  }
}

describe("RankingStage", () => {
  beforeEach(() => localStorage.clear());

  it("requires exactly 3 picks before commit", () => {
    renderStage();
    const commit = () => screen.getByRole("button", { name: /commit ranking/i });
    expect(commit()).toBeDisabled();
    pick(["dispatch-scheduling", "procurement"]);
    expect(commit()).toBeDisabled();
    expect(commit()).toHaveTextContent("2/3");
    pick(["backoffice-ar-ap"]);
    expect(commit()).not.toBeDisabled();
  });

  it("supports remove and reorder of ranked picks", () => {
    renderStage();
    pick(["dispatch-scheduling", "procurement", "backoffice-ar-ap"]);
    fireEvent.click(screen.getByRole("button", { name: `Move ${opName("procurement")} up` }));
    const rows = screen.getAllByRole("listitem");
    expect(rows[0]).toHaveTextContent(opName("procurement"));
    fireEvent.click(screen.getByRole("button", { name: `Remove ${opName("backoffice-ar-ap")}` }));
    expect(screen.getByRole("button", { name: /commit ranking/i })).toHaveTextContent("2/3");
  });

  it("grades deterministically and reveals the matrix on commit", () => {
    renderStage();
    const ideal = computeIdealTop3(profile.aiOpportunities);
    pick(ideal);
    fireEvent.click(screen.getByRole("button", { name: /commit ranking/i }));
    expect(screen.getByText("5/5")).toBeInTheDocument();
    expect(screen.getByText(/matched the model's/i)).toBeInTheDocument();
    expect(screen.getByText("Nothing. You found all three.")).toBeInTheDocument();
    // Matrix renders feasibility rows and tier chips
    expect(screen.getByText("Higher impact")).toBeInTheDocument();
    expect(screen.getAllByText(/Tier \d/).length).toBeGreaterThan(0);
    // Technical readiness context
    expect(screen.getByText("Technical readiness")).toBeInTheDocument();
  });

  it("explains missed picks via complexity notes and risks", () => {
    renderStage();
    const ideal = computeIdealTop3(profile.aiOpportunities);
    const wrong = profile.operations.map((op) => op.id).filter((id) => !ideal.includes(id));
    const picks = [...wrong, ...ideal].slice(0, 3); // 2 wrong + ideal #1
    pick(picks);
    fireEvent.click(screen.getByRole("button", { name: /commit ranking/i }));
    const missed = ideal.filter((id) => !picks.includes(id));
    expect(missed.length).toBeGreaterThan(0);
    for (const id of missed) {
      expect(
        screen.getByText(profile.aiOpportunities[id].complexityNotes),
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Risks: ${profile.aiOpportunities[id].risks.join("; ")}`),
      ).toBeInTheDocument();
    }
  });

  it("persists the deterministic score with the stage2-rank atom", () => {
    renderStage();
    const ideal = computeIdealTop3(profile.aiOpportunities);
    pick(ideal);
    fireEvent.click(screen.getByRole("button", { name: /commit ranking/i }));
    const data = JSON.parse(localStorage.getItem("forge-data"));
    const question = data.sessions[0].questions[0];
    expect(question.type).toBe("opportunity-ranking");
    expect(question.score).toBe(5);
    expect(question.delta).toBeNull();
    expect(question.atomId).toBe("stage2-rank-summit-hvac");
    expect(question.atomType).toBe("opportunity-ranking");
  });
});
