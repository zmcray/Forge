import { describe, it, expect } from "vitest";
import { CONCEPT_CARDS } from "../data/conceptCards";
import { COMPANIES } from "../data/companies";
import { resolveDataPath } from "../utils/resolveDataPath";

describe("Concept Cards Data Integrity", () => {
  it("has 8 concept cards", () => {
    expect(CONCEPT_CARDS).toHaveLength(8);
  });

  it("every card has a unique id", () => {
    const ids = CONCEPT_CARDS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every card has required fields", () => {
    for (const card of CONCEPT_CARDS) {
      expect(card.id, `Card missing id`).toBeTruthy();
      expect(card.title, `Card ${card.id} missing title`).toBeTruthy();
      expect(card.oneLiner, `Card ${card.id} missing oneLiner`).toBeTruthy();
      expect(card.whyItMatters, `Card ${card.id} missing whyItMatters`).toBeTruthy();
      expect(card.howToSpot.length, `Card ${card.id} has no howToSpot items`).toBeGreaterThan(0);
      expect(card.redFlags.length, `Card ${card.id} has no redFlags`).toBeGreaterThan(0);
      expect(card.companyExamples.length, `Card ${card.id} has no companyExamples`).toBeGreaterThan(0);
      expect(card.practicePrompt, `Card ${card.id} missing practicePrompt`).toBeDefined();
      expect(card.practicePrompt.question, `Card ${card.id} practicePrompt missing question`).toBeTruthy();
      expect(card.practicePrompt.type, `Card ${card.id} practicePrompt missing type`).toBeTruthy();
      expect(card.practicePrompt.modelAnswer, `Card ${card.id} practicePrompt missing modelAnswer`).toBeTruthy();
    }
  });

  it("every companyId in companyExamples exists in COMPANIES", () => {
    for (const card of CONCEPT_CARDS) {
      for (const ex of card.companyExamples) {
        const company = COMPANIES.find((c) => c.id === ex.companyId);
        expect(
          company,
          `companyId "${ex.companyId}" in card "${card.id}" not found in COMPANIES`
        ).toBeDefined();
      }
    }
  });

  it("every dataPoints path resolves to a defined value", () => {
    for (const card of CONCEPT_CARDS) {
      for (const ex of card.companyExamples) {
        const company = COMPANIES.find((c) => c.id === ex.companyId);
        if (!company) continue;
        for (const dp of ex.dataPoints) {
          const value = resolveDataPath(company, dp.path);
          expect(
            value,
            `Path "${dp.path}" for company "${ex.companyId}" in card "${card.id}" resolved to undefined`
          ).toBeDefined();
        }
      }
    }
  });

  it("every company example has an insight", () => {
    for (const card of CONCEPT_CARDS) {
      for (const ex of card.companyExamples) {
        expect(
          ex.insight,
          `Missing insight for company "${ex.companyId}" in card "${card.id}"`
        ).toBeTruthy();
      }
    }
  });

  it("practice prompt types are valid question types", () => {
    const validTypes = ["risk", "diagnostic", "thesis", "adjustment", "valuation", "metric"];
    for (const card of CONCEPT_CARDS) {
      expect(
        validTypes.includes(card.practicePrompt.type),
        `Card "${card.id}" has invalid practicePrompt type: ${card.practicePrompt.type}`
      ).toBe(true);
    }
  });
});
