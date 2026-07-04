// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, within } from "@testing-library/react";
import App from "../App";
import { renderWithProviders } from "./renderWithProviders";

vi.mock("../components/learn/ChatDrawer", () => ({
  default: ({ title, contextType, practiceContext, onClose }) => (
    <div data-testid="practice-chat-drawer">
      <span data-testid="chat-title">{title}</span>
      <span data-testid="chat-context-type">{contextType}</span>
      <span data-testid="chat-company-name">{practiceContext?.companyName}</span>
      <span data-testid="chat-company-revenue">{practiceContext?.revenue}</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

function markOnboardingComplete() {
  localStorage.setItem(
    "forge-onboarding",
    JSON.stringify({
      introCompleted: true,
      introStep: 0,
      introSkippedAt: null,
      softGateBypasses: ["practice-before-learn"],
      firstVisit: "2026-06-11T00:00:00.000Z",
      lastVisit: "2026-06-11T00:00:00.000Z",
    }),
  );
}

function stubMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function makeGeneratedCompany() {
  return {
    id: "generated-atlas-specialty-services-123",
    _generated: true,
    name: "Atlas Specialty Services",
    industry: "Business Services",
    description: "Regional compliance services provider with recurring contracts.",
    revenue: 20,
    difficulty: 2,
    context: "Founder wants a partial exit and needs help professionalizing sales.",
    incomeStatement: {
      years: [2024, 2025],
      revenue: [16, 20],
      cogs: [9.6, 12],
      grossProfit: [6.4, 8],
      sgaExpense: [3.1, 4],
      ownerComp: [0.8, 0.9],
      depreciation: [0.4, 0.5],
      amortization: [0.1, 0.1],
      interestExpense: [0.2, 0.3],
      otherIncome: [0, 0],
      netIncome: [0.9, 1.2],
      addBacks: { ownerPerks: 0.2, oneTimeExpenses: 0.3, aboveMarketRent: 0 },
    },
    balanceSheet: {
      cash: 1.1,
      ar: 2.8,
      inventory: 0.2,
      otherCurrentAssets: 0.1,
      ppe: 2.5,
      goodwill: 0,
      otherLtAssets: 0.2,
      ap: 1.4,
      currentDebt: 0.3,
      accruedExpenses: 0.6,
      ltDebt: 2.1,
      otherLtLiabilities: 0.1,
      equity: 2.4,
    },
    cashFlow: {
      netIncome: 1.2,
      da: 0.6,
      changeWc: -0.4,
      capex: -0.5,
      debtPayments: -0.3,
      distributions: -0.4,
    },
    keyMetrics: {
      ebitda: 2.1,
      adjustedEbitda: 2.6,
      ebitdaMargin: 10.5,
      adjustedEbitdaMargin: 13,
      grossMargin: 40,
      revenueGrowth: 25,
      recurringRevenuePct: 62,
      customerConcentration: 18,
      employeeCount: 54,
      avgRevenuePerEmployee: 0.37,
    },
    redFlags: ["Founder controls key enterprise relationships", "Working capital grows with revenue"],
    greenFlags: ["62% recurring revenue", "Low capex intensity", "Healthy revenue growth"],
    questions: [
      { id: "generated-q1", q: "What is adjusted EBITDA margin?", hint: "Divide adjusted EBITDA by revenue.", answer: "13%.", type: "metric" },
      { id: "generated-q2", q: "What is the key risk?", hint: "Look at founder dependence.", answer: "Founder-led sales.", type: "risk", keywords: ["founder"] },
    ],
  };
}

describe("Practice chat integration", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    stubMatchMedia();
    markOnboardingComplete();
  });

  it("opens company-aware chat from a selected practice case", async () => {
    renderWithProviders(<App />);

    fireEvent.click(screen.getByText("Summit Mechanical Services"));
    expect(await screen.findByText("Analysis Questions")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /ask ai/i }));

    const drawer = await screen.findByTestId("practice-chat-drawer");
    expect(within(drawer).getByTestId("chat-title").textContent).toBe("Summit Mechanical Services");
    expect(within(drawer).getByTestId("chat-context-type").textContent).toBe("practice");
    expect(within(drawer).getByTestId("chat-company-name").textContent).toBe("Summit Mechanical Services");
    expect(within(drawer).getByTestId("chat-company-revenue").textContent).toBe("32.5");
  });

  it("hydrates practice state from a direct company URL before opening chat", async () => {
    renderWithProviders(<App />, { route: "/practice/coastal-foods" });

    expect(await screen.findByText("Coastal Fresh Foods")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /ask ai/i }));

    const drawer = await screen.findByTestId("practice-chat-drawer");
    expect(within(drawer).getByTestId("chat-title").textContent).toBe("Coastal Fresh Foods");
    expect(within(drawer).getByTestId("chat-context-type").textContent).toBe("practice");
    expect(within(drawer).getByTestId("chat-company-name").textContent).toBe("Coastal Fresh Foods");
  });

  it("generates a session-only company card and opens it in practice", async () => {
    const generatedCompany = makeGeneratedCompany();
    global.fetch = vi.fn((url) => {
      if (url === "/api/generate") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(generatedCompany),
        });
      }
      return Promise.reject(new Error("warmup skipped"));
    });

    renderWithProviders(<App />);

    fireEvent.click(screen.getByRole("button", { name: /generate random company/i }));

    expect(await screen.findByText("Generated Cases")).toBeInTheDocument();
    expect(screen.getByText("Atlas Specialty Services")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      "/api/generate",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "x-forge-token": "" }),
      }),
    );

    fireEvent.click(screen.getByText("Atlas Specialty Services"));

    expect(await screen.findByText("Analysis Questions")).toBeInTheDocument();
    expect(screen.getByText("Atlas Specialty Services")).toBeInTheDocument();
  });
});
