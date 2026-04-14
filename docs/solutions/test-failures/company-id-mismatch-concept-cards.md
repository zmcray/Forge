---
title: Company ID Mismatch in Concept Cards Data
category: test-failures
date: 2026-04-01
severity: high
tags:
  - data-integrity
  - test-driven-catch
  - cross-file-dependency
  - source-of-truth-violation
components:
  - conceptCards.js
  - companies.js
  - dataIntegrity.test.js
---

# Company ID Mismatch in Concept Cards Data

## Problem

After creating `conceptCards.js` with 8 PE concept cards referencing company examples, data integrity tests failed with 3 company ID mismatches. The concept cards used IDs from the planning document (`truenorth-analytics`, `ironclad-builders`, `vitality-pet`) that didn't match the canonical IDs in `companies.js` (`truenorth-saas`, `ironclad-construction`, `vitality-vet`).

**Symptom:** `dataIntegrity.test.js` reported "companyId not found in COMPANIES" for three concept cards.

**Impact:** Any concept card referencing these IDs would fail to resolve company data at runtime, showing empty or broken `CompanyDataPanel` components.

## Root Cause

The plan document (`docs/plans/2026-03-29-001-feat-concept-cards-and-cross-industry-comparison.md`) used informal/abbreviated company names as IDs rather than the canonical slugs defined in `companies.js`. When implementing `conceptCards.js`, the plan's IDs were copied verbatim without cross-referencing the actual data source.

The three mismatches:

| Plan Document ID | Canonical ID (companies.js) | Company |
|---|---|---|
| `truenorth-analytics` | `truenorth-saas` | TrueNorth Analytics |
| `ironclad-builders` | `ironclad-construction` | Ironclad Builders |
| `vitality-pet` | `vitality-vet` | Vitality Pet Wellness |

The naming pattern: plans used descriptive names (what the company does informally) while `companies.js` uses industry-specific slugs (what the company actually is categorized as).

## Investigation Steps

1. Ran `npm test` after implementing concept cards. 3 failures in `dataIntegrity.test.js`.
2. Read the test output: each failure pointed to a specific `companyId` not found in the COMPANIES array.
3. Opened `companies.js` and searched for the failing IDs. Found the canonical versions.
4. Confirmed the plan document was the source of the incorrect IDs.
5. Applied fixes in `conceptCards.js`, re-ran tests. All 223 tests passed.

## Working Solution

Updated three company IDs in `conceptCards.js`:

```javascript
// Before (from plan document)
companies: ["truenorth-analytics", "summit-hvac"]
companies: ["truenorth-analytics", "brightsmile-dental", "ironclad-builders"]
companies: ["meridian-fulfillment", "coastal-foods", "truenorth-analytics"]
companies: ["brightsmile-dental", "vitality-pet"]

// After (canonical IDs from companies.js)
companies: ["truenorth-saas", "summit-hvac"]
companies: ["truenorth-saas", "bright-dental", "ironclad-construction"]
companies: ["meridian-fulfillment", "coastal-foods", "truenorth-saas"]
companies: ["bright-dental", "vitality-vet"]
```

**Canonical company IDs** (source of truth: `app/src/data/companies.js`):
- `summit-hvac`
- `coastal-foods`
- `precision-manufacturing`
- `bright-dental`
- `apex-logistics`
- `truenorth-saas`
- `ironclad-construction`
- `vitality-vet`
- `meridian-fulfillment`

## Verification

All 223 tests pass across 25 test files after the fix, including:
- `dataIntegrity.test.js`: validates every `companyId` reference in concept cards, comparisons, and learn content exists in COMPANIES
- `ComparisonView.test.jsx` and `ComparisonList.test.jsx`: verify company data resolution works end-to-end

## Prevention

### Process-Level

1. **Always cross-reference `companies.js` when adding company references.** Plan documents use informal names. The canonical IDs are in `companies.js` and nowhere else.

2. **Run data integrity tests early.** The `dataIntegrity.test.js` suite catches cross-file reference errors at test time. Run `npm test` after any data file changes, not just after component changes.

3. **Treat plan documents as intent, not implementation.** Plans describe what to build. The codebase's existing data files are the source of truth for IDs, schemas, and field names.

### Test Pattern

The data integrity test that caught this:

```javascript
// dataIntegrity.test.js
it("every concept card companyId exists in COMPANIES", () => {
  for (const card of CONCEPT_CARDS) {
    for (const companyId of card.companies) {
      const found = COMPANIES.find(c => c.id === companyId);
      expect(found, `companyId "${companyId}" not found in COMPANIES (card: ${card.id})`).toBeTruthy();
    }
  }
});
```

This pattern should be applied whenever a new data file references entities from another data file.

### Checklist for New Data Files

- [ ] List all cross-file ID references
- [ ] Verify each ID against its source file (not the plan)
- [ ] Run `npm test` and confirm data integrity tests pass
- [ ] If adding a new data file with cross-references, add a corresponding integrity test

## Related

- `app/src/data/companies.js` ... canonical company definitions
- `app/src/data/conceptCards.js` ... concept card data (where the fix was applied)
- `app/src/data/comparisons.js` ... cross-industry comparisons (same pattern, IDs were correct)
- `app/src/test/dataIntegrity.test.js` ... the test suite that caught the issue
- `docs/plans/2026-03-29-001-feat-concept-cards-and-cross-industry-comparison.md` ... plan document (source of incorrect IDs)
