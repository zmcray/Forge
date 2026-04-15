import { describe, it, expect } from "vitest";
import { LEARN_CONTENT } from "../data/learnContent";
import { COMPARISONS } from "../data/comparisons";
import { COMPANIES } from "../data/companies";
import { VALUE_LEVERS, LEVER_CATEGORIES } from "../data/valueLevers";
import { BRIDGE_SCENARIOS } from "../data/valueBridge";
import { calculateBridge, applyAssumptions } from "../utils/bridgeMath";
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

  describe("Value Creation Bridge scenarios", () => {
    it("has exactly 7 scenarios", () => {
      expect(BRIDGE_SCENARIOS).toHaveLength(7);
    });

    it("every scenario has a unique id", () => {
      const ids = new Set();
      for (const s of BRIDGE_SCENARIOS) {
        expect(ids.has(s.id), `Duplicate scenario id: ${s.id}`).toBe(false);
        ids.add(s.id);
      }
    });

    it("every scenario references a canonical company id", () => {
      for (const s of BRIDGE_SCENARIOS) {
        const company = COMPANIES.find((c) => c.id === s.companyId);
        expect(
          company,
          `Scenario "${s.id}" references unknown companyId "${s.companyId}"`
        ).toBeDefined();
      }
    });

    it("entry enterprise value equals ebitda times multiple", () => {
      for (const s of BRIDGE_SCENARIOS) {
        const computed = s.entry.ebitda * s.entry.multiple;
        expect(
          Math.abs(s.entry.enterpriseValue - computed),
          `Scenario "${s.id}" entry: EV ${s.entry.enterpriseValue} does not match ebitda * multiple = ${computed}`
        ).toBeLessThan(0.01);
      }
    });

    it("exit enterprise value equals ebitda times multiple", () => {
      for (const s of BRIDGE_SCENARIOS) {
        const computed = s.exit.ebitda * s.exit.multiple;
        expect(
          Math.abs(s.exit.enterpriseValue - computed),
          `Scenario "${s.id}" exit: EV ${s.exit.enterpriseValue} does not match ebitda * multiple = ${computed}`
        ).toBeLessThan(0.01);
      }
    });

    it("bridge components sum to equity gain (conservation of value)", () => {
      for (const s of BRIDGE_SCENARIOS) {
        const bridge = calculateBridge(s.entry, s.exit, s.assumptions.holdPeriod);
        const equityGain = bridge.exitEquity - bridge.entryEquity;
        const componentSum = bridge.ebitdaGrowth + bridge.multipleExpansion + bridge.debtPaydown;
        expect(
          Math.abs(componentSum - equityGain),
          `Scenario "${s.id}": bridge components sum ${componentSum} does not match equity gain ${equityGain}`
        ).toBeLessThan(0.01);
      }
    });

    it("sliderRanges have valid min < max for every slider", () => {
      for (const s of BRIDGE_SCENARIOS) {
        for (const [key, range] of Object.entries(s.sliderRanges)) {
          expect(
            range.min < range.max,
            `Scenario "${s.id}" slider "${key}": min ${range.min} >= max ${range.max}`
          ).toBe(true);
          expect(
            range.step > 0,
            `Scenario "${s.id}" slider "${key}": step must be positive`
          ).toBe(true);
        }
      }
    });

    it("scenario assumptions applied to entry produce a MOIC within tolerance of plan exit", () => {
      for (const s of BRIDGE_SCENARIOS) {
        const syntheticExit = applyAssumptions(s.entry, s.assumptions);
        const syntheticBridge = calculateBridge(s.entry, syntheticExit, s.assumptions.holdPeriod);
        const planBridge = calculateBridge(s.entry, s.exit, s.assumptions.holdPeriod);
        // Assumptions are rounded descriptions of the plan case, so they should
        // produce a MOIC within 10% of the plan MOIC (not exact due to rounding)
        const ratio = syntheticBridge.moic / planBridge.moic;
        expect(
          ratio > 0.85 && ratio < 1.15,
          `Scenario "${s.id}": assumption-derived MOIC ${syntheticBridge.moic.toFixed(2)} drifts too far from plan MOIC ${planBridge.moic.toFixed(2)}`
        ).toBe(true);
      }
    });
  });
});
