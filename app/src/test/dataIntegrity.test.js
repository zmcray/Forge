import { describe, it, expect } from "vitest";
import { LEARN_CONTENT } from "../data/learnContent";
import { COMPARISONS } from "../data/comparisons";
import { COMPANIES } from "../data/companies";
import { resolveDataPath } from "../utils/resolveDataPath";

describe("Data Integrity", () => {
  describe("Concept card company references", () => {
    const section4 = LEARN_CONTENT.find((s) => s.id === "s4");

    it("Section 4 (Key Concepts) exists", () => {
      expect(section4).toBeDefined();
    });

    it("has 8 subsections", () => {
      expect(section4.subsections).toHaveLength(8);
    });

    it("every companyData block references a valid company", () => {
      for (const sub of section4.subsections) {
        for (const block of sub.blocks) {
          if (block.type === "companyData") {
            const company = COMPANIES.find((c) => c.id === block.companyId);
            expect(company, `companyId "${block.companyId}" in subsection "${sub.id}" not found in COMPANIES`).toBeDefined();
          }
        }
      }
    });

    it("every exercise has a unique id", () => {
      const ids = new Set();
      for (const sub of section4.subsections) {
        for (const block of sub.blocks) {
          if (block.type === "exercise") {
            expect(ids.has(block.id), `Duplicate exercise id: ${block.id}`).toBe(false);
            ids.add(block.id);
          }
        }
      }
    });

    it("every notes block has a unique id", () => {
      const ids = new Set();
      for (const sub of section4.subsections) {
        for (const block of sub.blocks) {
          if (block.type === "notes") {
            expect(ids.has(block.id), `Duplicate notes id: ${block.id}`).toBe(false);
            ids.add(block.id);
          }
        }
      }
    });
  });

  describe("Comparisons data", () => {
    it("has 4 comparisons", () => {
      expect(COMPARISONS).toHaveLength(4);
    });

    it("every comparison has a unique id", () => {
      const ids = COMPARISONS.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("every companyId in comparisons exists in COMPANIES", () => {
      for (const comp of COMPARISONS) {
        for (const companyId of comp.companies) {
          const company = COMPANIES.find((c) => c.id === companyId);
          expect(company, `companyId "${companyId}" in comparison "${comp.id}" not found`).toBeDefined();
        }
      }
    });

    it("every dataPoints path resolves to a defined value for each company", () => {
      for (const comp of COMPARISONS) {
        for (const companyId of comp.companies) {
          const company = COMPANIES.find((c) => c.id === companyId);
          for (const dp of comp.dataPoints) {
            const value = resolveDataPath(company, dp.path);
            expect(value, `Path "${dp.path}" for company "${companyId}" in comparison "${comp.id}" resolved to undefined`).toBeDefined();
          }
        }
      }
    });

    it("every comparison has at least one analysis prompt", () => {
      for (const comp of COMPARISONS) {
        expect(comp.analysisPrompts.length).toBeGreaterThan(0);
      }
    });

    it("every comparison has a key insight", () => {
      for (const comp of COMPARISONS) {
        expect(comp.keyInsight).toBeTruthy();
      }
    });
  });

  describe("resolveDataPath utility", () => {
    const summit = COMPANIES.find((c) => c.id === "summit-hvac");

    it("resolves top-level fields", () => {
      expect(resolveDataPath(summit, "revenue")).toBe(32.5);
    });

    it("resolves nested fields", () => {
      expect(resolveDataPath(summit, "keyMetrics.customerConcentration")).toBe(12);
    });

    it("resolves array fields", () => {
      expect(resolveDataPath(summit, "incomeStatement.revenue")).toEqual([28.1, 32.5]);
    });

    it("returns undefined for non-existent paths", () => {
      expect(resolveDataPath(summit, "nonExistent.path")).toBeUndefined();
    });

    it("returns undefined for null company", () => {
      expect(resolveDataPath(null, "revenue")).toBeUndefined();
    });
  });
});
