import { forgeFetch } from "./api";

/**
 * Shared LLM evaluation fetch for qualitative answers.
 * Returns: Promise<{ score, strengths, gaps, suggestion }>
 * Rejects with a typed ApiError (`.status`) on non-OK responses.
 */
export function evaluateAnswer({ userAnswer, modelAnswer, questionText, questionType, companyContext }) {
  return forgeFetch(
    "/api/evaluate",
    {
      userAnswer,
      modelAnswer,
      questionText,
      questionType,
      companyContext: companyContext || "",
    },
    { timeoutMs: 15000 }
  );
}
