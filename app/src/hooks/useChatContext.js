import { useMemo } from "react";
import { CHAT_MODES } from "./useChatMode";
import {
  CONTEXT_TYPES,
  buildLearnContext,
  buildPracticeContext,
} from "../utils/chatPrompts";

// systemPrompt returned here is a client-side preview only. The server
// (api/chat.js) rebuilds the authoritative prompt from `chatParams`; it never
// accepts a client-supplied system prompt (MCR-390).
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
      const built = buildPracticeContext({ practiceContext, title, messageCount, isSocratic });
      return {
        ...built,
        chatParams: {
          companyId: practiceContext?.companyId ?? null,
          scenarioId: practiceContext?.scenarioId ?? null,
          company: practiceContext?.generatedCompany ?? null,
        },
      };
    }

    const built = buildLearnContext({
      subsection,
      completedIds,
      llmResult,
      messageCount,
      isSocratic,
    });
    return {
      ...built,
      chatParams: {
        subsectionId: subsection?.id ?? null,
        completedCount: completedIds?.length || 0,
        llmResult: llmResult
          ? { score: llmResult.score, gaps: llmResult.gaps || [] }
          : null,
      },
    };
  }, [subsection, title, completedIds, llmResult, messageCount, mode, contextType, practiceContext]);
}
