/**
 * Shared LLM evaluation fetch for qualitative answers.
 * Returns: Promise<{ score, strengths, gaps, suggestion }>
 */
export function evaluateAnswer({ userAnswer, modelAnswer, questionText, questionType, companyContext }) {
  return fetch("/api/evaluate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forge-token": import.meta.env.VITE_FORGE_AUTH_TOKEN || "",
    },
    body: JSON.stringify({
      userAnswer,
      modelAnswer,
      questionText,
      questionType,
      companyContext: companyContext || "",
    }),
    signal: AbortSignal.timeout(15000),
  })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)));
}
