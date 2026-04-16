// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "../../test/renderWithProviders";
import { Routes, Route } from "react-router-dom";
import PlaybookList from "./PlaybookList";
import PlaybookDetail from "./PlaybookDetail";
import { PLAYBOOKS } from "../../data/playbooks";
import { COMPANIES } from "../../data/companies";
import { VALUE_LEVERS } from "../../data/valueLevers";

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

function renderPlaybooks(route = "/learn/playbooks") {
  return renderWithProviders(
    <Routes>
      <Route path="learn/playbooks" element={<PlaybookList />} />
      <Route path="learn/playbooks/:playbookId" element={<PlaybookDetail />} />
    </Routes>,
    { route }
  );
}

describe("PlaybookList", () => {
  it("renders all 9 playbook cards", () => {
    renderPlaybooks();
    // Each card shows the company name
    for (const p of PLAYBOOKS) {
      const company = COMPANIES.find((c) => c.id === p.companyId);
      expect(screen.getByText(company.name)).toBeTruthy();
    }
  });

  it("shows entry metrics on each card", () => {
    renderPlaybooks();
    // Check Summit's revenue tag
    expect(screen.getByText("$32.5M revenue")).toBeTruthy();
  });
});

describe("PlaybookDetail", () => {
  const summitRoute = `/learn/playbooks/${PLAYBOOKS[0].id}`;
  const summit = PLAYBOOKS[0];
  const summitCompany = COMPANIES.find((c) => c.id === summit.companyId);

  it("renders company name and description", () => {
    renderPlaybooks(summitRoute);
    expect(screen.getByText(summitCompany.name)).toBeTruthy();
    expect(screen.getByText(summit.description)).toBeTruthy();
  });

  it("renders all 3 phase headers", () => {
    renderPlaybooks(summitRoute);
    expect(screen.getByText("Foundation & Quick Wins")).toBeTruthy();
    expect(screen.getByText("Optimize & Scale")).toBeTruthy();
    expect(screen.getByText("Scale & Exit Prep")).toBeTruthy();
  });

  it("renders initiative cards with all required fields", () => {
    renderPlaybooks(summitRoute);
    const firstInit = summit.timeline["months-1-6"].initiatives[0];
    expect(screen.getByText(firstInit.name)).toBeTruthy();
    expect(screen.getByText(firstInit.owner)).toBeTruthy();
    expect(screen.getByText(firstInit.timeline)).toBeTruthy();
  });

  it("renders lever link on initiative cards", () => {
    renderPlaybooks(summitRoute);
    // Financial controls lever should be linked
    const lever = VALUE_LEVERS.find((l) => l.id === "financial-controls");
    // Button text includes the arrow entity
    const leverButtons = screen.getAllByText((content) =>
      content.includes(lever.title)
    );
    expect(leverButtons.length).toBeGreaterThan(0);
  });

  it("renders dependencies on initiatives that have them", () => {
    renderPlaybooks(summitRoute);
    // summit-init-002 depends on summit-init-001; may appear multiple times
    const depElements = screen.getAllByText("summit-init-001");
    expect(depElements.length).toBeGreaterThan(0);
  });

  it("renders Golden Year analysis panel", () => {
    renderPlaybooks(summitRoute);
    expect(screen.getByText("Golden Year Analysis")).toBeTruthy();
    // year1Ebitda may appear in multiple places, use getAllByText
    const ebitdaElements = screen.getAllByText(summit.goldenYearAnalysis.year1Ebitda);
    expect(ebitdaElements.length).toBeGreaterThan(0);
    const vsPlanElements = screen.getAllByText(summit.goldenYearAnalysis.year1VsPlan);
    expect(vsPlanElements.length).toBeGreaterThan(0);
  });

  it("renders exercise prompt", () => {
    renderPlaybooks(summitRoute);
    expect(screen.getByText(summit.exercise.prompt)).toBeTruthy();
  });

  it("exercise submit button is disabled with <50 characters", () => {
    renderPlaybooks(summitRoute);
    const submitBtn = screen.getByText("Submit & Evaluate");
    expect(submitBtn.disabled).toBe(true);
  });

  it("shows not-found state for invalid playbookId", () => {
    renderPlaybooks("/learn/playbooks/nonexistent-playbook");
    expect(screen.getByText("Playbook not found")).toBeTruthy();
  });

  it("renders prev/next navigation", () => {
    renderPlaybooks(summitRoute);
    // Summit is first, so no prev, but next should be Coastal
    const coastalCompany = COMPANIES.find((c) => c.id === PLAYBOOKS[1].companyId);
    expect(screen.getByText(coastalCompany.name)).toBeTruthy();
  });

  it("renders expected value creation in phase blocks", () => {
    renderPlaybooks(summitRoute);
    const ev = summit.timeline["months-1-6"].expectedValueCreation;
    const dollarElements = screen.getAllByText(ev.ebitdaDollars);
    expect(dollarElements.length).toBeGreaterThan(0);
  });

  it("persists visit to localStorage on mount", () => {
    renderPlaybooks(summitRoute);
    const stored = JSON.parse(localStorageMock.getItem("forge-playbooks"));
    expect(stored.playbooks[summit.id].lastVisited).toBeTruthy();
  });
});
