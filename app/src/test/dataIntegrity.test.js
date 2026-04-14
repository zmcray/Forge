import { describe, it, expect } from "vitest";
import { LEARN_CONTENT } from "../data/learnContent";
import { COMPARISONS } from "../data/comparisons";
import { COMPANIES } from "../data/companies";
import { VALUE_LEVERS, LEVER_CATEGORIES } from "../data/valueLevers";
import { resolveDataPath } from "../utils/resolveDataPath";

const VALID_CATEGORIES = ["revenue", "margin", "organizational", "technology", "strategic"];

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

  describe("Company difficulty field", () => {
    it("every company has a difficulty field with value 1, 2, or 3", () => {
      for (const company of COMPANIES) {
        expect([1, 2, 3]).toContain(company.difficulty);
      }
    });

    it("at least one company per difficulty level exists", () => {
      const levels = new Set(COMPANIES.map((c) => c.difficulty));
      expect(levels.has(1)).toBe(true);
      expect(levels.has(2)).toBe(true);
      expect(levels.has(3)).toBe(true);
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

  describe("Value Creation Levers", () => {
    it("has exactly 15 levers", () => {
      expect(VALUE_LEVERS).toHaveLength(15);
    });

    it("every lever has a unique id", () => {
      const ids = new Set();
      for (const lever of VALUE_LEVERS) {
        expect(ids.has(lever.id), `Duplicate lever id: ${lever.id}`).toBe(false);
        ids.add(lever.id);
      }
    });

    it("every lever has a valid category", () => {
      for (const lever of VALUE_LEVERS) {
        expect(
          VALID_CATEGORIES,
          `Lever "${lever.id}" has invalid category "${lever.category}"`
        ).toContain(lever.category);
      }
    });

    it("every lever has exactly 2 company examples", () => {
      for (const lever of VALUE_LEVERS) {
        expect(
          lever.companyExamples,
          `Lever "${lever.id}" must have 2 companyExamples`
        ).toHaveLength(2);
      }
    });

    it("every company example references a canonical company id", () => {
      for (const lever of VALUE_LEVERS) {
        for (const example of lever.companyExamples) {
          const company = COMPANIES.find((c) => c.id === example.companyId);
          expect(
            company,
            `Lever "${lever.id}" references unknown companyId "${example.companyId}"`
          ).toBeDefined();
        }
      }
    });

    it("every dataPoints path resolves to a defined value", () => {
      for (const lever of VALUE_LEVERS) {
        for (const example of lever.companyExamples) {
          const company = COMPANIES.find((c) => c.id === example.companyId);
          for (const dp of example.dataPoints) {
            const value = resolveDataPath(company, dp.path);
            expect(
              value,
              `Lever "${lever.id}" -> "${example.companyId}" path "${dp.path}" did not resolve`
            ).toBeDefined();
          }
        }
      }
    });

    it("every exercise has non-empty acceptance criteria", () => {
      for (const lever of VALUE_LEVERS) {
        expect(lever.exercise, `Lever "${lever.id}" missing exercise`).toBeDefined();
        expect(
          Array.isArray(lever.exercise.acceptanceCriteria) && lever.exercise.acceptanceCriteria.length > 0,
          `Lever "${lever.id}" must have non-empty acceptanceCriteria`
        ).toBe(true);
      }
    });

    it("LEVER_CATEGORIES covers all four categories", () => {
      for (const cat of VALID_CATEGORIES) {
        expect(LEVER_CATEGORIES[cat]).toBeDefined();
      }
    });
  });
});
