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

export default function useChatContext({
  subsection,
  completedIds,
  llmResult,
  messageCount,
  mode = CHAT_MODES.DIRECT,
}) {
  return useMemo(() => {
    if (!subsection) return { systemPrompt: "", suggestedQuestions: [] };

    const isSocratic = mode === CHAT_MODES.SOCRATIC;

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
  }, [subsection, completedIds, llmResult, messageCount, mode]);
}
