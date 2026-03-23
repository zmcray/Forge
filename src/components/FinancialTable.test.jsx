// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FinancialTable from "./FinancialTable";

const mockCompany = {
  name: "Test Co",
  incomeStatement: {
    years: [2024, 2025],
    revenue: [28.1, 32.5],
    cogs: [18.3, 20.8],
    grossProfit: [9.8, 11.7],
    sgaExpense: [5.2, 6.1],
    ownerComp: [1.8, 2.0],
    depreciation: [0.9, 1.1],
    amortization: [0.1, 0.1],
    interestExpense: [0.3, 0.3],
    otherIncome: [0.1, 0.2],
    netIncome: [1.6, 2.3],
    addBacks: { ownerPerks: 0.4, oneTimeExpenses: 0.3, aboveMarketRent: 0.2 },
  },
  balanceSheet: {
    cash: 1.8, ar: 4.2, inventory: 0.8, otherCurrentAssets: 0.3,
    ppe: 3.5, goodwill: 0, otherLtAssets: 0.2,
    ap: 2.1, currentDebt: 0.5, accruedExpenses: 1.2,
    ltDebt: 2.8, otherLtLiabilities: 0.4, equity: 3.8,
  },
  cashFlow: {
    netIncome: 2.3, da: 1.2, changeWc: -0.4, capex: -1.5,
    debtPayments: -0.6, distributions: -1.0,
  },
  keyMetrics: {
    ebitda: 4.6, adjustedEbitda: 5.5, ebitdaMargin: 14.2, adjustedEbitdaMargin: 16.9,
    grossMargin: 36.0, revenueGrowth: 15.7,
    recurringRevenuePct: 35, customerConcentration: 12,
    employeeCount: 127, avgRevenuePerEmployee: 0.256,
  },
};

describe("FinancialTable", () => {
  it("renders income statement view", () => {
    render(<FinancialTable company={mockCompany} view="income" />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Gross Profit")).toBeInTheDocument();
    expect(screen.getByText("Net Income")).toBeInTheDocument();
  });

  it("renders year headers in income statement", () => {
    render(<FinancialTable company={mockCompany} view="income" />);
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
  });

  it("renders balance sheet view", () => {
    render(<FinancialTable company={mockCompany} view="balance" />);
    expect(screen.getByText("Cash")).toBeInTheDocument();
    expect(screen.getByText("Total Assets")).toBeInTheDocument();
  });

  it("renders cash flow view", () => {
    render(<FinancialTable company={mockCompany} view="cashflow" />);
    expect(screen.getByText(/Net Income/)).toBeInTheDocument();
    expect(screen.getByText(/Capital Expenditures/)).toBeInTheDocument();
  });

  it("renders key metrics view", () => {
    render(<FinancialTable company={mockCompany} view="metrics" />);
    expect(screen.getByText("EBITDA")).toBeInTheDocument();
    expect(screen.getByText("Adjusted EBITDA")).toBeInTheDocument();
  });
});
