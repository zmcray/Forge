// One-shot script to inject stable IDs into companies.js question objects.
// Adds `id: "{companyId}-qN",` as the first property of each question.
// Idempotent: skips questions that already have an id.
//
// Run: node scripts/inject-question-ids.mjs

import fs from "node:fs";
import path from "node:path";

const FILE = path.resolve("app/src/data/companies.js");
const src = fs.readFileSync(FILE, "utf8");
const lines = src.split("\n");

let currentCompanyId = null;
let inQuestionsArray = false;
let questionDepth = 0; // 0 = not inside an object, 1 = inside the question object literal
let questionCounter = 0;
let pendingInsert = false;
const out = [];
let changed = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Detect company id: matches `    id: "summit-hvac",` at depth 4-spaces
  const idMatch = line.match(/^    id: "([^"]+)",\s*$/);
  if (idMatch && !inQuestionsArray) {
    currentCompanyId = idMatch[1];
    questionCounter = 0;
  }

  // Enter questions array
  if (line.match(/^    questions: \[\s*$/)) {
    inQuestionsArray = true;
    out.push(line);
    continue;
  }

  // Exit questions array (matches `    ]` at correct indent)
  if (inQuestionsArray && line.match(/^    \]\s*$/)) {
    inQuestionsArray = false;
    questionDepth = 0;
    out.push(line);
    continue;
  }

  if (inQuestionsArray) {
    // Detect start of a question object: `      {`
    if (line.match(/^      \{\s*$/) && questionDepth === 0) {
      questionDepth = 1;
      questionCounter++;
      pendingInsert = true;
      out.push(line);
      continue;
    }

    // First property line inside the question object
    if (questionDepth === 1 && pendingInsert) {
      // Skip if id already present (idempotence)
      if (line.match(/^        id: /)) {
        pendingInsert = false;
        out.push(line);
        continue;
      }
      // Insert id line before this property
      const id = `${currentCompanyId}-q${questionCounter}`;
      out.push(`        id: "${id}",`);
      pendingInsert = false;
      changed++;
      out.push(line);
      continue;
    }

    // Detect end of a question object: `      },` or `      }`
    if (questionDepth === 1 && line.match(/^      \},?\s*$/)) {
      questionDepth = 0;
      out.push(line);
      continue;
    }
  }

  out.push(line);
}

fs.writeFileSync(FILE, out.join("\n"));
console.log(`Injected ${changed} question IDs across companies.js`);
