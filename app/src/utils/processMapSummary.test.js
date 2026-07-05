import { describe, it, expect } from "vitest";
import { buildProcessMapSummary, MAX_SUMMARY_LENGTH } from "./processMapSummary";
import { OPERATIONS_PROFILES } from "../data/companyOperations";

describe("buildProcessMapSummary", () => {
  it("includes name, headcount, cost line, and sub-processes per operation", () => {
    const summary = buildProcessMapSummary(
      OPERATIONS_PROFILES["summit-hvac"].operations,
    );
    expect(summary).toContain("Dispatch & Scheduling");
    expect(summary).toContain("6 FTEs");
    expect(summary).toContain("$0.7M");
    expect(summary).toContain("SG&A");
    expect(summary).toContain("Phone-based intake of emergency service calls");
  });

  it("stays under the /api/evaluate field cap for every live profile", () => {
    for (const [companyId, profile] of Object.entries(OPERATIONS_PROFILES)) {
      const summary = buildProcessMapSummary(profile.operations);
      expect(summary.length, companyId).toBeLessThanOrEqual(MAX_SUMMARY_LENGTH);
      expect(summary.length, companyId).toBeGreaterThan(100);
    }
  });

  it("truncates pathological input at the cap", () => {
    const huge = Array.from({ length: 200 }, (_, i) => ({
      id: `p${i}`,
      name: `Process ${i}`,
      headcount: 5,
      costAllocation: { amount: 1, mapsTo: "cogs" },
      manualSubProcesses: ["x".repeat(200)],
      currentTools: ["Excel"],
      dataQuality: "y".repeat(200),
    }));
    const summary = buildProcessMapSummary(huge);
    expect(summary.length).toBeLessThanOrEqual(MAX_SUMMARY_LENGTH);
  });
});
