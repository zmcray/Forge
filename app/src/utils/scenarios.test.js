import { describe, it, expect } from "vitest";
import { mergeScenario, validateMergedData } from "./scenarios";

const BASE_COMPANY = {
  id: "test-co",
  name: "Test Company",
  revenue: 50.0,
  context: "Base context",
  incomeStatement: {
    revenue: [45.0, 50.0],
    cogs: [30.0, 33.0],
    grossProfit: [15.0, 17.0],
    netIncome: [2.0, 3.0],
  },
  keyMetrics: {
    ebitda: 5.0,
    adjustedEbitda: 6.0,
    grossMargin: 34.0,
    revenueGrowth: 11.1,
  },
  questions: [
    { q: "Original question?", answer: "Original answer", type: "metric" },
  ],
  redFlags: ["Flag 1"],
  greenFlags: ["Flag A"],
};

describe("mergeScenario", () => {
  it("patches top-level scalar values", () => {
    const overlay = {
      id: "test-scenario",
      name: "Revenue Drop",
      description: "Revenue drops 20%",
      patches: {
        revenue: 40.0,
      },
    };

    const merged = mergeScenario(BASE_COMPANY, overlay);
    expect(merged.revenue).toBe(40.0);
    expect(merged.name).toBe("Test Company"); // name is not patched
  });

  it("patches nested objects recursively", () => {
    const overlay = {
      id: "s1",
      name: "Growth Flat",
      description: "desc",
      patches: {
        keyMetrics: {
          revenueGrowth: 0,
          adjustedEbitda: 4.5,
        },
      },
    };

    const merged = mergeScenario(BASE_COMPANY, overlay);
    expect(merged.keyMetrics.revenueGrowth).toBe(0);
    expect(merged.keyMetrics.adjustedEbitda).toBe(4.5);
    // Unpatched fields remain
    expect(merged.keyMetrics.grossMargin).toBe(34.0);
    expect(merged.keyMetrics.ebitda).toBe(5.0);
  });

  it("replaces questions when overlay provides them", () => {
    const overlay = {
      id: "s2",
      name: "New Qs",
      description: "desc",
      questions: [
        { q: "New question?", answer: "New answer", type: "risk" },
      ],
    };

    const merged = mergeScenario(BASE_COMPANY, overlay);
    expect(merged.questions).toHaveLength(1);
    expect(merged.questions[0].q).toBe("New question?");
  });

  it("adds scenario metadata", () => {
    const overlay = {
      id: "s3",
      name: "Scenario Name",
      description: "Scenario Desc",
      patches: { revenue: 30.0 },
    };

    const merged = mergeScenario(BASE_COMPANY, overlay);
    expect(merged._scenarioId).toBe("s3");
    expect(merged._scenarioName).toBe("Scenario Name");
    expect(merged._scenarioDescription).toBe("Scenario Desc");
    expect(merged._baseCompanyId).toBe("test-co");
  });

  it("does not mutate the base company", () => {
    const overlay = {
      id: "s4",
      name: "Mutate Test",
      description: "desc",
      patches: { revenue: 1.0 },
    };

    const before = BASE_COMPANY.revenue;
    mergeScenario(BASE_COMPANY, overlay);
    expect(BASE_COMPANY.revenue).toBe(before);
  });

  it("throws when patching a non-existent path", () => {
    const overlay = {
      id: "bad",
      name: "Bad",
      description: "desc",
      patches: {
        nonExistentField: 42,
      },
    };

    expect(() => mergeScenario(BASE_COMPANY, overlay)).toThrow("does not exist");
  });

  it("throws for non-existent nested path", () => {
    const overlay = {
      id: "bad2",
      name: "Bad Nested",
      description: "desc",
      patches: {
        keyMetrics: {
          fakeMetric: 99,
        },
      },
    };

    expect(() => mergeScenario(BASE_COMPANY, overlay)).toThrow("does not exist");
  });

  it("replaces array values directly", () => {
    const overlay = {
      id: "s5",
      name: "Array",
      description: "desc",
      patches: {
        incomeStatement: {
          revenue: [40.0, 35.0],
        },
      },
    };

    const merged = mergeScenario(BASE_COMPANY, overlay);
    expect(merged.incomeStatement.revenue).toEqual([40.0, 35.0]);
    // Other income statement fields unchanged
    expect(merged.incomeStatement.cogs).toEqual([30.0, 33.0]);
  });

  it("patches string values", () => {
    const overlay = {
      id: "s6",
      name: "Context Change",
      description: "desc",
      patches: {
        context: "New context here",
      },
    };

    const merged = mergeScenario(BASE_COMPANY, overlay);
    expect(merged.context).toBe("New context here");
  });
});

describe("validateMergedData", () => {
  it("returns empty array for valid data", () => {
    const issues = validateMergedData(BASE_COMPANY);
    expect(issues).toEqual([]);
  });

  it("detects NaN in top-level fields", () => {
    const bad = { ...BASE_COMPANY, revenue: NaN };
    const issues = validateMergedData(bad);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]).toContain("NaN");
  });

  it("detects NaN in nested fields", () => {
    const bad = {
      ...BASE_COMPANY,
      keyMetrics: { ...BASE_COMPANY.keyMetrics, ebitda: NaN },
    };
    const issues = validateMergedData(bad);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]).toContain("ebitda");
  });
});
