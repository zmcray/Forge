---
Created: 2026-07-05
Flow: standard
Linear Project: Forge
Linear Issue: MCR-95
Linear Branch: zack/mcr-95-per-company-data-layers-operations-aiopportunities
Task: Add operations, aiOpportunities, and implementationContext data layers for all 9 companies (foundation for Stage 2 consulting-wedge exercises F13/F14)
---

# Per-company data layers: operations, aiOpportunities, implementationContext

## Design

New file `app/src/data/companyOperations.js` keyed by company id, plus accessor `getOperationsProfile(companyId)`. Kept out of `companies.js` so the base file stays reviewable and the Stage 2 screens can lazy-import the layer; nothing outside tests imports it yet, so the eager bundle is untouched.

### Schema (per company)

- `operations`: 4-6 processes. Each: `{ id, name, description, headcount, costAllocation: { amount ($M), mapsTo (income-statement line), note }, manualSubProcesses[], currentTools[], dataQuality }`
- `aiOpportunities`: keyed by process id. Each: `{ feasibility (high|medium|low), ebitdaImpactRange: { low, high } ($M), recommendedTier (1|2|3), complexityNotes, dependencies[], risks[] }`
- `implementationContext`: `{ techStack[], itCapability (none|basic|moderate), managementOpenness, dataInfrastructure, regulatoryConstraints[] }`

### Invariants (enforced in `app/src/test/companyOperations.test.js`, written first)

- All 9 canonical company ids present with all three layers
- Every aiOpportunity key references an existing process id; every process has at least one opportunity assessment or is deliberately covered
- Enums valid (feasibility, tier, itCapability)
- `low <= high` on every impact range; sum of highs < 40% of `keyMetrics.ebitda`
- `headcount > 0`; per-company headcount sum <= employeeCount; costAllocation amounts sum <= revenue

### Content grounding

Processes and cost allocations hand-written against each company's actual income statement (COGS vs SGA split, headcount vs employeeCount). aiOpportunities calibrated to each company's realism: truenorth-saas moderate-to-high itCapability and deep-custom candidates; bright-dental / vitality-vet basic IT, off-the-shelf tier 1 plays.

## Outcome

(filled at wrap)
