#!/usr/bin/env node
// One-shot, idempotent reconciliation of income statements to stated keyMetrics EBITDA [MCR-386].
//
// Canonical identity: EBITDA = netIncome + interestExpense + depreciation + amortization
// (latest year). The stated keyMetrics.ebitda is kept (it anchors model answers and
// add-back stories); income statement lines are adjusted so the identity holds while
// every statement still foots (grossProfit - sga - ownerComp - D - A - interest + other = NI).
//
// Per-company levers were chosen to avoid every figure quoted in question text, hints,
// answers, and red flags:
// - summit-hvac    (+0.8): sga 6.1 -> 5.3, NI 2.3 -> 3.1 (cashFlow.netIncome synced)
// - coastal-foods  (+0.9): dep 1.2 -> 2.1 offset by otherIncome 0 -> 0.9; NI 0.2 pinned
//                          by the "net income dropped 78%" question (cashFlow.da synced)
// - precision      (+1.4): sga 2.0 -> 1.3 and ownerComp 1.4 -> 0.7, NI 1.3 -> 2.7
//                          (dep 0.7 and 43% gross margin are pinned by questions)
// - bright-dental  (+0.3): otherIncome 0.1 -> 0.4, NI 0.4 -> 0.7 (SGA growth 36% pinned)
// - apex-logistics (+0.6): interest 0.8 -> 1.4 offset by otherIncome 0.1 -> 0.7; NI 0.6
//                          and D&A 2.0 pinned by the FCF question
// - truenorth-saas (-0.7): sga 7.2 -> 7.9, NI 2.4 -> 1.7 (cashFlow.netIncome synced)
// - vitality-vet   (-0.3): sga 2.8 -> 3.1, NI 1.3 -> 1.0 (cashFlow.netIncome synced)
// - meridian       (+0.2): interest [0.4,0.5] -> [0.6,0.7] offset by otherIncome
//                          [0.1,0.1] -> [0.3,0.3] in BOTH years, preserving the pinned
//                          YoY deltas ("interest increased $0.1M", NI flat at $2.1M)
//
// Idempotent: each edit is applied only if the pre-change string is still present;
// re-running reports "applied 0".

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const file = join(dirname(fileURLToPath(import.meta.url)), "../src/data/companies.js");
let src = readFileSync(file, "utf8");

// [company, description, oldString, newString]
const EDITS = [
  // summit-hvac
  ["summit-hvac", "sgaExpense", "sgaExpense: [5.2, 6.1],", "sgaExpense: [5.2, 5.3],"],
  ["summit-hvac", "netIncome", "netIncome: [1.6, 2.3],", "netIncome: [1.6, 3.1],"],
  [
    "summit-hvac",
    "cashFlow.netIncome",
    "netIncome: 2.3, da: 1.2,",
    "netIncome: 3.1, da: 1.2,",
  ],
  // coastal-foods
  [
    "coastal-foods",
    "depreciation",
    "depreciation: [1.1, 1.2],",
    "depreciation: [1.1, 2.1],",
  ],
  [
    "coastal-foods",
    "otherIncome",
    "otherIncome: [0.0, 0.0],",
    "otherIncome: [0.0, 0.9],",
  ],
  [
    "coastal-foods",
    "cashFlow.da",
    "netIncome: 0.2, da: 1.2,",
    "netIncome: 0.2, da: 2.1,",
  ],
  // precision-manufacturing
  [
    "precision-manufacturing",
    "sgaExpense",
    "sgaExpense: [1.8, 2.0],",
    "sgaExpense: [1.8, 1.3],",
  ],
  [
    "precision-manufacturing",
    "ownerComp",
    "ownerComp: [1.2, 1.4],",
    "ownerComp: [1.2, 0.7],",
  ],
  [
    "precision-manufacturing",
    "netIncome",
    "netIncome: [0.9, 1.3],\n      addBacks: { ownerPerks: 0.3,",
    "netIncome: [0.9, 2.7],\n      addBacks: { ownerPerks: 0.3,",
  ],
  [
    "precision-manufacturing",
    "cashFlow.netIncome",
    "netIncome: 1.3, da: 0.7,",
    "netIncome: 2.7, da: 0.7,",
  ],
  // bright-dental
  [
    "bright-dental",
    "otherIncome",
    "otherIncome: [0.1, 0.1],\n      netIncome: [0.3, 0.4],",
    "otherIncome: [0.1, 0.4],\n      netIncome: [0.3, 0.7],",
  ],
  [
    "bright-dental",
    "cashFlow.netIncome",
    "netIncome: 0.4, da: 0.8,",
    "netIncome: 0.7, da: 0.8,",
  ],
  // apex-logistics
  [
    "apex-logistics",
    "interestExpense",
    "interestExpense: [0.7, 0.8],",
    "interestExpense: [0.7, 1.4],",
  ],
  [
    "apex-logistics",
    "otherIncome",
    "otherIncome: [0.1, 0.1],\n      netIncome: [2.6, 0.6],",
    "otherIncome: [0.1, 0.7],\n      netIncome: [2.6, 0.6],",
  ],
  // truenorth-saas
  ["truenorth-saas", "sgaExpense", "sgaExpense: [5.8, 7.2],", "sgaExpense: [5.8, 7.9],"],
  ["truenorth-saas", "netIncome", "netIncome: [1.6, 2.4],", "netIncome: [1.6, 1.7],"],
  [
    "truenorth-saas",
    "cashFlow.netIncome",
    "netIncome: 2.4, da: 0.8,",
    "netIncome: 1.7, da: 0.8,",
  ],
  // vitality-vet
  ["vitality-vet", "sgaExpense", "sgaExpense: [2.3, 2.8],", "sgaExpense: [2.3, 3.1],"],
  [
    "vitality-vet",
    "netIncome",
    "netIncome: [0.9, 1.3],\n      addBacks: { ownerPerks: 0.15,",
    "netIncome: [0.9, 1.0],\n      addBacks: { ownerPerks: 0.15,",
  ],
  [
    "vitality-vet",
    "cashFlow.netIncome",
    "netIncome: 1.3, da: 0.5,",
    "netIncome: 1.0, da: 0.5,",
  ],
  // meridian-fulfillment (both years, preserving YoY deltas)
  [
    "meridian-fulfillment",
    "interestExpense",
    "interestExpense: [0.4, 0.5],",
    "interestExpense: [0.6, 0.7],",
  ],
  [
    "meridian-fulfillment",
    "otherIncome",
    "otherIncome: [0.1, 0.1],\n      netIncome: [2.1, 2.1],",
    "otherIncome: [0.3, 0.3],\n      netIncome: [2.1, 2.1],",
  ],
];

let applied = 0;
for (const [company, desc, oldStr, newStr] of EDITS) {
  const count = src.split(oldStr).length - 1;
  if (count === 0) {
    if (!src.includes(newStr)) {
      console.error(
        `ERROR: ${company} ${desc}: neither old nor new value found. Aborting without writing.`,
      );
      process.exit(1);
    }
    continue; // already applied
  }
  if (count > 1) {
    console.error(
      `ERROR: ${company} ${desc}: old value matched ${count} times, expected 1. Aborting without writing.`,
    );
    process.exit(1);
  }
  src = src.replace(oldStr, newStr);
  applied += 1;
  console.log(`applied: ${company} ${desc}`);
}

if (applied > 0) writeFileSync(file, src);
console.log(`Applied ${applied} of ${EDITS.length} edits.`);
