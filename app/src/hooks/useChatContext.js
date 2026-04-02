import { useMemo } from "react";
import { COMPANIES } from "../data/companies";

const MAX_TURNS = 10;

export default function useChatContext({ subsection, completedIds, llmResult, messageCount }) {
  return useMemo(() => {
    if (!subsection) return { systemPrompt: "", suggestedQuestions: [] };

    // Extract only text blocks (exclude exercises, tables, companyData per eng review)
    const lessonText = (subsection.blocks || [])
      .filter(b => b.type === "text")
      .map(b => b.content)
      .join("\n\n");

    // Look up company data for any companyData blocks (summary only)
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

    // Build system prompt
    let prompt = `You are a PE deal analysis tutor helping a learner understand ${subsection.title}.
Keep responses concise (2-3 paragraphs max). Use Summit Mechanical Services numbers when giving examples. Format with markdown for clarity.

CURRENT LESSON:
${lessonText}

COMPANY DATA: ${companyContext || "N/A"}

LEARNER PROGRESS:
Completed exercises: ${completedIds?.length || 0}
Current: ${subsection.id} - ${subsection.title}`;

    // Add grading context if post-exercise trigger
    if (llmResult) {
      prompt += `\n\nRECENT EXERCISE RESULT:
Score: ${llmResult.score}/5
Gaps identified: ${(llmResult.gaps || []).join(", ")}
The learner clicked "dig deeper" after this result. Focus your explanations on the gaps above.`;
    }

    // Add trim notification if conversation is getting long (per eng review)
    if (messageCount && messageCount > (MAX_TURNS - 1) * 2) {
      prompt += "\n\nNote: earlier messages in this conversation were trimmed for length. Do not reference information from trimmed messages.";
    }

    // Build suggested questions
    const questions = [];

    // Static questions from subsection data
    if (subsection.suggestedQuestions) {
      questions.push(...subsection.suggestedQuestions);
    }

    // Dynamic questions from LLM grading gaps
    if (llmResult?.gaps) {
      for (const gap of llmResult.gaps) {
        questions.push(`Can you explain "${gap}" in more detail?`);
      }
    }

    // Default questions if none defined
    if (questions.length === 0) {
      questions.push(
        `What's the most important concept in ${subsection.title}?`,
        "Can you give me a real-world example?"
      );
    }

    return { systemPrompt: prompt, suggestedQuestions: questions };
  }, [subsection, completedIds, llmResult, messageCount]);
}
