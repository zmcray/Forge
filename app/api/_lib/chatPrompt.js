// Server-side chat prompt assembly for /api/chat (MCR-390).
//
// The client sends only a mode enum plus small validated params (IDs into
// server-owned data, or a tightly schema-checked generated company). The
// actual system prompt is assembled HERE from server-owned templates and data,
// so the endpoint cannot be used as a general-purpose Claude proxy.

import { LEARN_CONTENT } from "../../src/data/learnContent.js";
import { COMPANIES } from "../../src/data/companies.js";
import { SCENARIOS } from "../../src/data/scenarios.js";
import { mergeScenario } from "../../src/utils/scenarios.js";
import {
  buildLearnContext,
  buildPracticeContext,
  buildPracticeChatContext,
} from "../../src/utils/chatPrompts.js";

export const CHAT_PROMPT_MODES = Object.freeze([
  "learn-direct",
  "learn-socratic",
  "practice-direct",
  "practice-socratic",
]);

// Caps for the small free-text params a client may still supply.
const MAX_GAP_ITEMS = 5;
const MAX_GAP_LENGTH = 300;
const MAX_SHORT_STRING = 120;
const MAX_TEXT_FIELD = 2000;
const MAX_FLAG_ITEMS = 10;
const MAX_FLAG_LENGTH = 300;
const MAX_QUESTIONS = 10;
const MAX_QUESTION_LENGTH = 500;
const MAX_ANSWER_LENGTH = 1500;
const MAX_METRIC_KEYS = 30;

export class ChatValidationError extends Error {}

function fail(message) {
  throw new ChatValidationError(message);
}

function optionalString(value, max, label) {
  if (value == null) return undefined;
  if (typeof value !== "string" || value.length > max) fail(`Invalid ${label}`);
  return value;
}

function requiredString(value, max, label) {
  if (typeof value !== "string" || !value.trim() || value.length > max) fail(`Invalid ${label}`);
  return value;
}

function optionalStringArray(value, maxItems, maxLength, label) {
  if (value == null) return undefined;
  if (!Array.isArray(value) || value.length > maxItems) fail(`Invalid ${label}`);
  for (const item of value) {
    if (typeof item !== "string" || item.length > maxLength) fail(`Invalid ${label}`);
  }
  return value;
}

// Numbers-only tree (numbers, arrays of numbers, nested objects of numbers).
// Financial statements carry no free text, so this closes them as an
// injection/proxy surface entirely.
function numericTree(value, label, depth = 0) {
  if (value == null) return undefined;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) fail(`Invalid ${label}`);
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length > 12) fail(`Invalid ${label}`);
    return value.map(v => numericTree(v, label, depth + 1));
  }
  if (typeof value === "object") {
    if (depth > 3) fail(`Invalid ${label}`);
    const entries = Object.entries(value);
    if (entries.length > MAX_METRIC_KEYS) fail(`Invalid ${label}`);
    const out = {};
    for (const [key, v] of entries) {
      if (key.length > 60) fail(`Invalid ${label}`);
      out[key] = numericTree(v, label, depth + 1);
    }
    return out;
  }
  fail(`Invalid ${label}`);
}

function validateLlmResult(llmResult) {
  if (llmResult == null) return null;
  if (typeof llmResult !== "object" || Array.isArray(llmResult)) fail("Invalid llmResult");
  const score = llmResult.score;
  if (!Number.isInteger(score) || score < 1 || score > 5) fail("Invalid llmResult score");
  const gaps = optionalStringArray(llmResult.gaps, MAX_GAP_ITEMS, MAX_GAP_LENGTH, "llmResult gaps") || [];
  return { score, gaps };
}

// Generated companies come from /api/generate and live only in the client, so
// the server cannot resolve them by ID. Accept them, but only through a strict
// schema with tight caps on every free-text field.
function validateGeneratedCompany(company) {
  if (typeof company !== "object" || company === null || Array.isArray(company)) {
    fail("Invalid company");
  }
  return {
    _generated: true,
    id: optionalString(company.id, MAX_SHORT_STRING, "company id"),
    name: requiredString(company.name, MAX_SHORT_STRING, "company name"),
    industry: optionalString(company.industry, MAX_SHORT_STRING, "company industry"),
    revenue: company.revenue == null ? undefined : numericTree(company.revenue, "company revenue"),
    description: optionalString(company.description, MAX_TEXT_FIELD, "company description"),
    context: optionalString(company.context, MAX_TEXT_FIELD, "company context"),
    keyMetrics: numericTree(company.keyMetrics, "keyMetrics"),
    incomeStatement: numericTree(company.incomeStatement, "incomeStatement"),
    balanceSheet: numericTree(company.balanceSheet, "balanceSheet"),
    cashFlow: numericTree(company.cashFlow, "cashFlow"),
    redFlags: optionalStringArray(company.redFlags, MAX_FLAG_ITEMS, MAX_FLAG_LENGTH, "redFlags"),
    greenFlags: optionalStringArray(company.greenFlags, MAX_FLAG_ITEMS, MAX_FLAG_LENGTH, "greenFlags"),
    questions: validateGeneratedQuestions(company.questions),
  };
}

function validateGeneratedQuestions(questions) {
  if (questions == null) return [];
  if (!Array.isArray(questions) || questions.length > MAX_QUESTIONS) fail("Invalid questions");
  return questions.map(q => {
    if (typeof q !== "object" || q === null) fail("Invalid questions");
    return {
      type: optionalString(q.type, 30, "question type"),
      q: requiredString(q.q ?? q.question, MAX_QUESTION_LENGTH, "question text"),
      answer: optionalString(q.answer ?? q.modelAnswer, MAX_ANSWER_LENGTH, "question answer"),
    };
  });
}

function findSubsection(subsectionId) {
  for (const section of LEARN_CONTENT) {
    const match = (section.subsections || []).find(sub => sub.id === subsectionId);
    if (match) return match;
  }
  return null;
}

function resolvePracticeCompany(params) {
  if (params.company != null) {
    return validateGeneratedCompany(params.company);
  }

  const companyId = requiredString(params.companyId, MAX_SHORT_STRING, "companyId");
  const base = COMPANIES.find(c => c.id === companyId);
  if (!base) fail("Unknown companyId");

  if (params.scenarioId == null) return base;

  const scenarioId = requiredString(params.scenarioId, MAX_SHORT_STRING, "scenarioId");
  const scenario = SCENARIOS.find(s => s.id === scenarioId && s.companyId === companyId);
  if (!scenario) fail("Unknown scenarioId");
  return mergeScenario(base, scenario);
}

// Assemble the authoritative system prompt from validated params.
// Throws ChatValidationError on any invalid input; callers map that to 400.
export function buildChatSystemPrompt({ mode, params, messageCount }) {
  if (!CHAT_PROMPT_MODES.includes(mode)) fail("Unknown mode");
  if (params == null || typeof params !== "object" || Array.isArray(params)) {
    fail("Invalid params");
  }

  const isSocratic = mode.endsWith("-socratic");

  if (mode.startsWith("practice-")) {
    const company = resolvePracticeCompany(params);
    const { systemPrompt } = buildPracticeContext({
      practiceContext: buildPracticeChatContext(company),
      title: company.name,
      messageCount,
      isSocratic,
    });
    return systemPrompt;
  }

  const subsection = findSubsection(requiredString(params.subsectionId, MAX_SHORT_STRING, "subsectionId"));
  if (!subsection) fail("Unknown subsectionId");

  const completedCount = params.completedCount ?? 0;
  if (!Number.isInteger(completedCount) || completedCount < 0 || completedCount > 10_000) {
    fail("Invalid completedCount");
  }

  const { systemPrompt } = buildLearnContext({
    subsection,
    completedIds: new Array(completedCount).fill(null),
    llmResult: validateLlmResult(params.llmResult),
    messageCount,
    isSocratic,
  });
  return systemPrompt;
}
