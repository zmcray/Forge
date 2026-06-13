// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { mockParse, mockJsonSchemaOutputFormat } = vi.hoisted(() => ({
  mockParse: vi.fn(),
  mockJsonSchemaOutputFormat: vi.fn(schema => ({ type: "json_schema", schema })),
}));

vi.mock("@anthropic-ai/sdk", () => ({
  default: class MockAnthropic {
    messages = {
      parse: mockParse,
    };
  },
}));

vi.mock("@anthropic-ai/sdk/helpers/json-schema", () => ({
  jsonSchemaOutputFormat: mockJsonSchemaOutputFormat,
}));

function makeCompany(overrides = {}) {
  return {
    name: "Atlas Specialty Services",
    industry: "Business Services",
    description: "Regional compliance services provider with recurring customer contracts.",
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
      { q: "What is adjusted EBITDA margin?", hint: "Divide adjusted EBITDA by revenue.", answer: "13%.", type: "metric" },
      { q: "What are the add-backs?", hint: "Use owner perks and one-time expenses.", answer: "$0.5M.", type: "adjustment" },
      { q: "What is the enterprise value at 6x?", hint: "Multiply adjusted EBITDA by 6.", answer: "$15.6M.", type: "valuation" },
      { q: "What is the key risk?", hint: "Look at founder dependence.", answer: "Founder-led sales.", type: "risk", keywords: ["founder", "sales"] },
      { q: "What diligence matters most?", hint: "Look at recurring contracts.", answer: "Contract quality.", type: "diagnostic", keywords: ["contracts"] },
      { q: "Would you invest?", hint: "Balance growth and founder risk.", answer: "Qualified yes.", type: "thesis", keywords: ["growth", "risk"] },
    ],
    ...overrides,
  };
}

function makeRequest({ method = "POST", headers = {} } = {}) {
  return new Request("http://localhost/api/generate", {
    method,
    headers: { "content-type": "application/json", ...headers },
    body: method === "POST" ? JSON.stringify({}) : undefined,
  });
}

describe("api/generate", () => {
  let POST;

  beforeEach(async () => {
    vi.resetModules();
    mockParse.mockReset();
    mockJsonSchemaOutputFormat.mockClear();
    delete process.env.FORGE_AUTH_TOKEN;
    delete process.env.ANTHROPIC_API_KEY;
    const mod = await import("../../api/generate.js");
    POST = mod.POST;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.FORGE_AUTH_TOKEN;
    delete process.env.ANTHROPIC_API_KEY;
  });

  it("returns 405 for non-POST requests", async () => {
    const res = await POST(makeRequest({ method: "GET" }));
    expect(res.status).toBe(405);
  });

  it("returns 401 when auth token is configured but missing", async () => {
    process.env.FORGE_AUTH_TOKEN = "secret";
    const res = await POST(makeRequest());
    expect(res.status).toBe(401);
    expect(mockParse).not.toHaveBeenCalled();
  });

  it("generates a normalized company with structured output", async () => {
    mockParse.mockResolvedValueOnce({ parsed_output: makeCompany() });

    const res = await POST(makeRequest());
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toMatch(/^generated-atlas-specialty-services-/);
    expect(data._generated).toBe(true);
    expect(data.questions[0].id).toBe("generated-atlas-specialty-services-q1");
    expect(mockJsonSchemaOutputFormat).toHaveBeenCalledOnce();
    expect(mockParse).toHaveBeenCalledWith(
      expect.objectContaining({
        // Must be a structured-output-capable model (Sonnet 4.5 is not; 4.6 is).
        model: "claude-sonnet-4-6",
        messages: [{ role: "user", content: expect.stringContaining("Generate one realistic") }],
        output_config: expect.objectContaining({ format: expect.any(Object) }),
      }),
    );
  });

  it("retries once when the first generated company is financially inconsistent", async () => {
    mockParse
      .mockResolvedValueOnce({
        parsed_output: makeCompany({
          incomeStatement: { ...makeCompany().incomeStatement, grossProfit: [6.4, 12] },
        }),
      })
      .mockResolvedValueOnce({ parsed_output: makeCompany({ name: "Boreal Field Services" }) });

    const res = await POST(makeRequest());
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(mockParse).toHaveBeenCalledTimes(2);
    expect(data.name).toBe("Boreal Field Services");
    expect(data._warnings).toBeUndefined();
  });

  it("returns warnings if both attempts are inconsistent", async () => {
    const inconsistent = makeCompany({
      incomeStatement: { ...makeCompany().incomeStatement, grossProfit: [6.4, 12] },
    });
    mockParse
      .mockResolvedValueOnce({ parsed_output: inconsistent })
      .mockResolvedValueOnce({ parsed_output: inconsistent });

    const res = await POST(makeRequest());
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(mockParse).toHaveBeenCalledTimes(2);
    expect(data._warnings).toContain("Gross profit mismatch in year 2");
  });

  it("returns 502 when the Anthropic call fails", async () => {
    mockParse.mockRejectedValueOnce(new Error("network down"));

    const res = await POST(makeRequest());
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.error).toContain("Generation failed");
  });
});
