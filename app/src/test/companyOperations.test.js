import { describe, it, expect } from "vitest";
import { COMPANIES } from "../data/companies";
import { OPERATIONS_PROFILES, getOperationsProfile } from "../data/companyOperations";

const COMPANY_IDS = COMPANIES.map((c) => c.id);
const FEASIBILITY = ["high", "medium", "low"];
const TIERS = [1, 2, 3];
const IT_CAPABILITY = ["none", "basic", "moderate"];

describe("companyOperations data integrity", () => {
  it("covers exactly the 9 canonical companies", () => {
    expect(Object.keys(OPERATIONS_PROFILES).sort()).toEqual([...COMPANY_IDS].sort());
    expect(COMPANY_IDS).toHaveLength(9);
  });

  it("getOperationsProfile resolves known ids and returns null for unknown", () => {
    expect(getOperationsProfile("summit-hvac")).toBe(OPERATIONS_PROFILES["summit-hvac"]);
    expect(getOperationsProfile("nope")).toBeNull();
  });

  COMPANY_IDS.forEach((id) => {
    describe(id, () => {
      const profile = OPERATIONS_PROFILES[id];
      const company = COMPANIES.find((c) => c.id === id);

      it("has all three layers", () => {
        expect(profile).toBeTruthy();
        expect(Array.isArray(profile.operations)).toBe(true);
        expect(profile.aiOpportunities).toBeTypeOf("object");
        expect(profile.implementationContext).toBeTypeOf("object");
      });

      it("has 4-6 processes with complete, well-formed fields", () => {
        expect(profile.operations.length).toBeGreaterThanOrEqual(4);
        expect(profile.operations.length).toBeLessThanOrEqual(6);
        const ids = profile.operations.map((p) => p.id);
        expect(new Set(ids).size).toBe(ids.length);
        profile.operations.forEach((p) => {
          expect(p.id).toMatch(/^[a-z0-9-]+$/);
          expect(p.name.length).toBeGreaterThan(2);
          expect(p.description.length).toBeGreaterThan(20);
          expect(p.headcount).toBeGreaterThan(0);
          expect(p.costAllocation.amount).toBeGreaterThan(0);
          expect(typeof p.costAllocation.mapsTo).toBe("string");
          expect(p.costAllocation.mapsTo.length).toBeGreaterThan(0);
          expect(p.manualSubProcesses.length).toBeGreaterThanOrEqual(1);
          expect(p.currentTools.length).toBeGreaterThanOrEqual(1);
          expect(p.dataQuality.length).toBeGreaterThan(10);
        });
      });

      it("cost allocations map to real income-statement lines and stay under revenue", () => {
        const validLines = Object.keys(company.incomeStatement).filter(
          (k) => k !== "years" && k !== "addBacks"
        );
        let total = 0;
        profile.operations.forEach((p) => {
          expect(validLines).toContain(p.costAllocation.mapsTo);
          total += p.costAllocation.amount;
        });
        expect(total).toBeLessThanOrEqual(company.revenue);
      });

      it("headcount stays within the company's employee count", () => {
        const total = profile.operations.reduce((s, p) => s + p.headcount, 0);
        expect(total).toBeLessThanOrEqual(company.keyMetrics.employeeCount);
      });

      it("every aiOpportunity references an existing process, and every process is assessed", () => {
        const processIds = profile.operations.map((p) => p.id);
        const oppIds = Object.keys(profile.aiOpportunities);
        oppIds.forEach((oid) => expect(processIds).toContain(oid));
        processIds.forEach((pid) => expect(oppIds).toContain(pid));
      });

      it("aiOpportunities have valid enums, ranges, and narrative fields", () => {
        Object.values(profile.aiOpportunities).forEach((opp) => {
          expect(FEASIBILITY).toContain(opp.feasibility);
          expect(TIERS).toContain(opp.recommendedTier);
          expect(opp.ebitdaImpactRange.low).toBeGreaterThanOrEqual(0);
          expect(opp.ebitdaImpactRange.low).toBeLessThanOrEqual(opp.ebitdaImpactRange.high);
          expect(opp.complexityNotes.length).toBeGreaterThan(10);
          expect(Array.isArray(opp.dependencies)).toBe(true);
          expect(opp.risks.length).toBeGreaterThanOrEqual(1);
        });
      });

      it("sum of impact highs stays well under EBITDA (< 40%)", () => {
        const sumHigh = Object.values(profile.aiOpportunities).reduce(
          (s, o) => s + o.ebitdaImpactRange.high,
          0
        );
        expect(sumHigh).toBeLessThan(company.keyMetrics.ebitda * 0.4);
      });

      it("implementationContext is complete with valid itCapability", () => {
        const ctx = profile.implementationContext;
        expect(ctx.techStack.length).toBeGreaterThanOrEqual(2);
        expect(IT_CAPABILITY).toContain(ctx.itCapability);
        expect(ctx.managementOpenness.length).toBeGreaterThan(10);
        expect(ctx.dataInfrastructure.length).toBeGreaterThan(10);
        expect(Array.isArray(ctx.regulatoryConstraints)).toBe(true);
      });
    });
  });
});
