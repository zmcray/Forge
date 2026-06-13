import { useMemo } from "react";
import { COMPANIES } from "../data/companies";
import { CHAT_MODES } from "./useChatMode";

const MAX_TURNS = 10;

const DIRECT_INTRO_TEMPLATE = (title) =>
  `You are a PE deal analysis tutor helping a learner understand ${title}.
Keep responses concise (2-3 paragraphs max). Use Summit Mechanical Services numbers when giving examples. Format with markdown for clarity.`;

const SOCRATIC_INTRO_TEMPLATE = (title) =>
  `You are a Socratic PE deal analysis tutor helping a learner understand ${title}.

Rules:
- Do not give direct answers. Lead the learner to the insight by asking 1-2 probing questions per turn.
- Each turn: ask, do not lecture. Maximum 3 sentences before your question(s).
- Ground questions in concrete numbers from the lesson when possible (Summit Mechanical Services or other companies referenced below).
- After about 3 rounds where the learner is clearly stuck, offer one sentence of scaffolding and then ask another question.
- If the learner asks "just tell me the answer," respond with one focused question that points at the key insight; do not capitulate.
- Format with markdown for clarity. Bold the question.`;

const PRACTICE_DIRECT_INTRO_TEMPLATE = (companyName) =>
  `You are a PE deal analysis partner helping a learner analyze ${companyName}.
Keep responses concise (2-3 paragraphs max). Be direct, practical, and grounded in the company data below. State assumptions clearly and connect observations to diligence, valuation, EBITDA quality, cash flow, management risk, customer concentration, and deal structure when relevant. Format with markdown for clarity.`;

const PRACTICE_SOCRATIC_INTRO_TEMPLATE = (companyName) =>
  `You are a Socratic PE deal analysis partner helping a learner analyze ${companyName}.

Rules:
- Do not give direct answers. Lead the learner to the investment insight by asking 1-2 probing questions per turn.
- Keep the learner in commit-first mode: ask for their view on risks, valuation, diligence priorities, or thesis before explaining.
- Ground every question in concrete company facts supplied below.
- Maximum 3 sentences before your question(s).
- After about 3 rounds where the learner is clearly stuck, offer one sentence of scaffolding and then ask another question.
- If the learner asks "just tell me the answer," respond with one focused question that points at the key investment issue; do not capitulate.
- Format with markdown for clarity. Bold the question.`;

const CONTEXT_TYPES = Object.freeze({
  LEARN: "learn",
  PRACTICE: "practice",
});

function isPresent(value) {
  if (value == null) return false;
  if (Array.isArray(value)) return value.some(isPresent);
  if (typeof value === "object") return Object.values(value).some(isPresent);
  return String(value).trim().length > 0;
}

function possessive(name) {
  return name.endsWith("s") ? `${name}'` : `${name}'s`;
}

function formatLabel(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase())
    .replace(/\bEbitda\b/g, "EBITDA")
    .replace(/\bCogs\b/g, "COGS")
    .replace(/\bSga\b/g, "SGA")
    .replace(/\bAr\b/g, "AR")
    .replace(/\bAp\b/g, "AP")
    .replace(/\bWc\b/g, "WC");
}

function formatInlineValue(value) {
  if (!isPresent(value)) return "N/A";
  if (Array.isArray(value)) return value.map(formatInlineValue).join(", ");
  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([, entryValue]) => isPresent(entryValue))
      .map(([key, entryValue]) => `${formatLabel(key)}: ${formatInlineValue(entryValue)}`)
      .join("; ");
  }
  return String(value);
}

function formatListItem(item) {
  if (item == null) return null;
  if (typeof item !== "object") return String(item);
  if (item.q || item.question) {
    const parts = [item.q || item.question];
    if (item.type) parts.push(`Type: ${item.type}`);
    if (item.hint) parts.push(`Hint: ${item.hint}`);
    if (item.modelAnswer) parts.push(`Model answer: ${item.modelAnswer}`);
    return parts.join(" | ");
  }
  return formatInlineValue(item);
}

function formatSection(value) {
  if (!isPresent(value)) return "N/A";
  if (Array.isArray(value)) {
    return value
      .map(formatListItem)
      .filter(Boolean)
      .map(item => `- ${item}`)
      .join("\n");
  }
  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([, entryValue]) => isPresent(entryValue))
      .map(([key, entryValue]) => `- ${formatLabel(key)}: ${formatInlineValue(entryValue)}`)
      .join("\n");
  }
  return String(value);
}

function getPracticeCompany(practiceContext) {
  return practiceContext?.company || practiceContext?.companyData || {};
}

function getPracticeCompanyName(practiceContext, title) {
  const company = getPracticeCompany(practiceContext);
  return practiceContext?.companyName || company.name || practiceContext?.name || title || "this company";
}

function getPracticeFinancials(practiceContext) {
  const company = getPracticeCompany(practiceContext);
  if (practiceContext?.financials || company.financials) {
    return practiceContext?.financials || company.financials;
  }

  return {
    incomeStatement: practiceContext?.incomeStatement || company.incomeStatement,
    balanceSheet: practiceContext?.balanceSheet || company.balanceSheet,
    cashFlow: practiceContext?.cashFlow || company.cashFlow,
  };
}

function getPracticeQuestions(practiceContext) {
  const company = getPracticeCompany(practiceContext);
  const questions = practiceContext?.questions || company.questions || [];
  const currentQuestion = practiceContext?.currentQuestion || practiceContext?.question;
  return currentQuestion ? [currentQuestion, ...questions] : questions;
}

function getPracticeContextValue(practiceContext, key) {
  const company = getPracticeCompany(practiceContext);
  return practiceContext?.[key] ?? company[key];
}

function buildLearnContext({
  subsection,
  completedIds,
  llmResult,
  messageCount,
  isSocratic,
}) {
  if (!subsection) return { systemPrompt: "", suggestedQuestions: [] };

  const lessonText = (subsection.blocks || [])
    .filter(b => b.type === "text")
    .map(b => b.content)
    .join("\n\n");

  const companyIds = (subsection.blocks || [])
    .filter(b => b.type === "companyData")
    .map(b => b.companyId);
  const companyContext = companyIds
    .map(id => {
      const company = COMPANIES.find(c => c.id === id);
      if (!company) return null;
      return `${company.name} (${company.industry}, $${company.revenue || company.keyMetrics?.revenue || "N/A"})`;
    })
    .filter(Boolean)
    .join(", ");

  const intro = isSocratic
    ? SOCRATIC_INTRO_TEMPLATE(subsection.title)
    : DIRECT_INTRO_TEMPLATE(subsection.title);

  let prompt = `${intro}

CURRENT LESSON:
${lessonText}

COMPANY DATA: ${companyContext || "N/A"}

LEARNER PROGRESS:
Completed exercises: ${completedIds?.length || 0}
Current: ${subsection.id} - ${subsection.title}`;

  if (llmResult) {
    prompt += `\n\nRECENT EXERCISE RESULT:
Score: ${llmResult.score}/5
Gaps identified: ${(llmResult.gaps || []).join(", ")}
The learner clicked "dig deeper" after this result. Focus your explanations on the gaps above.`;
  }

  if (messageCount && messageCount > (MAX_TURNS - 1) * 2) {
    prompt += "\n\nNote: earlier messages in this conversation were trimmed for length. Do not reference information from trimmed messages.";
  }

  const questions = [];

  if (isSocratic) {
    if (llmResult?.gaps) {
      for (const gap of llmResult.gaps) {
        questions.push(`Want me to test you on "${gap}"?`);
      }
    }
    if (questions.length === 0) {
      questions.push(
        `Test my understanding of ${subsection.title}`,
        `Walk me through the reasoning behind ${subsection.title}`
      );
    }
  } else {
    if (subsection.suggestedQuestions) {
      questions.push(...subsection.suggestedQuestions);
    }
    if (llmResult?.gaps) {
      for (const gap of llmResult.gaps) {
        questions.push(`Can you explain "${gap}" in more detail?`);
      }
    }
    if (questions.length === 0) {
      questions.push(
        `What's the most important concept in ${subsection.title}?`,
        "Can you give me a real-world example?"
      );
    }
  }

  return { systemPrompt: prompt, suggestedQuestions: questions };
}

function buildPracticeContext({ practiceContext, title, messageCount, isSocratic }) {
  if (!practiceContext) return { systemPrompt: "", suggestedQuestions: [] };

  const company = getPracticeCompany(practiceContext);
  const companyName = getPracticeCompanyName(practiceContext, title);
  const context = [
    practiceContext.companyContext,
    practiceContext.context,
    practiceContext.description,
    practiceContext.scenarioName ? `Scenario: ${practiceContext.scenarioName}` : null,
    practiceContext.scenarioDescription,
    company.description,
    company.context,
  ].filter(isPresent).join("\n");
  const financials = getPracticeFinancials(practiceContext);
  const metrics = practiceContext.metrics || practiceContext.keyMetrics || company.keyMetrics;
  const questions = getPracticeQuestions(practiceContext);
  const redFlags = getPracticeContextValue(practiceContext, "redFlags");
  const greenFlags = getPracticeContextValue(practiceContext, "greenFlags");

  const companySummary = {
    name: companyName,
    industry: practiceContext.industry ?? company.industry,
    revenue: practiceContext.revenue ?? company.revenue,
  };

  const intro = isSocratic
    ? PRACTICE_SOCRATIC_INTRO_TEMPLATE(companyName)
    : PRACTICE_DIRECT_INTRO_TEMPLATE(companyName);

  let prompt = `${intro}

PRACTICE COMPANY:
${formatSection(companySummary)}

COMPANY CONTEXT:
${formatSection(context)}

FINANCIALS:
${formatSection(financials)}

KEY METRICS:
${formatSection(metrics)}

QUESTIONS:
${formatSection(questions)}

RED FLAGS:
${formatSection(redFlags)}

GREEN FLAGS:
${formatSection(greenFlags)}

Focus on helping the learner form a PE investment view on this specific company. Do not switch into lesson-tutor mode unless the learner explicitly asks for a concept refresher.`;

  if (messageCount && messageCount > (MAX_TURNS - 1) * 2) {
    prompt += "\n\nNote: earlier messages in this conversation were trimmed for length. Do not reference information from trimmed messages.";
  }

  const defaultSuggestedQuestions = isSocratic
    ? [
        `Test my thesis on ${companyName}`,
        `Ask me to identify ${possessive(companyName)} biggest diligence risk`,
        `Challenge my valuation logic for ${companyName}`,
      ]
    : [
        `What are the top diligence priorities for ${companyName}?`,
        `Walk me through ${possessive(companyName)} EBITDA quality`,
        `What valuation range would fit ${companyName}?`,
      ];
  const suppliedSuggestedQuestions = practiceContext.suggestedQuestions || [];
  const suggestedQuestions = [
    ...suppliedSuggestedQuestions,
    ...defaultSuggestedQuestions.filter(question => !suppliedSuggestedQuestions.includes(question)),
  ];

  return { systemPrompt: prompt, suggestedQuestions };
}

export default function useChatContext({
  subsection,
  title,
  completedIds,
  llmResult,
  messageCount,
  mode = CHAT_MODES.DIRECT,
  contextType = CONTEXT_TYPES.LEARN,
  practiceContext = null,
}) {
  return useMemo(() => {
    const isSocratic = mode === CHAT_MODES.SOCRATIC;

    if (contextType === CONTEXT_TYPES.PRACTICE) {
      return buildPracticeContext({ practiceContext, title, messageCount, isSocratic });
    }

    return buildLearnContext({
      subsection,
      completedIds,
      llmResult,
      messageCount,
      isSocratic,
    });
  }, [subsection, title, completedIds, llmResult, messageCount, mode, contextType, practiceContext]);
}
