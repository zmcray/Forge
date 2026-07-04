import { useState, useEffect, useRef, useCallback } from "react";
import { evaluateAnswer } from "../utils/evaluateAnswer";

/**
 * Shared LLM evaluation state machine with abort lifecycle.
 *
 * Owns { llmResult, llmLoading, llmError } and guards against stale
 * responses: each evaluate() call gets its own AbortController; the
 * previous inflight request is aborted on a new evaluate(), on reset(),
 * on resetKey change (e.g. route param), and on unmount. State also
 * clears when resetKey changes.
 *
 * evaluate(payload) resolves (never rejects) with one of:
 *   { status: "success", data }   fresh result, state updated
 *   { status: "error", error }    fresh failure, llmError set
 *   { status: "stale" }           superseded or aborted; state untouched
 * so call sites can gate side effects (scoring, progress marks) on freshness.
 */
export default function useLLMEvaluation({ resetKey } = {}) {
  const [llmResult, setLlmResult] = useState(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState(null);

  const abortRef = useRef(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLlmResult(null);
    setLlmLoading(false);
    setLlmError(null);
  }, []);

  // Clear state and abort inflight work when the target changes (skip mount).
  const mountedKeyRef = useRef(resetKey);
  useEffect(() => {
    if (Object.is(mountedKeyRef.current, resetKey)) return;
    mountedKeyRef.current = resetKey;
    reset();
  }, [resetKey, reset]);

  // Abort inflight work on unmount.
  useEffect(() => () => abortRef.current?.abort(), []);

  const evaluate = useCallback((payload) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLlmLoading(true);
    setLlmError(null);

    return evaluateAnswer(payload)
      .then((data) => {
        if (ctrl.signal.aborted) return { status: "stale" };
        setLlmResult(data);
        setLlmLoading(false);
        return { status: "success", data };
      })
      .catch((err) => {
        if (ctrl.signal.aborted) return { status: "stale" };
        console.warn("[Forge] LLM evaluation failed:", err);
        setLlmError(err ?? true);
        setLlmLoading(false);
        return { status: "error", error: err };
      });
  }, []);

  return { llmResult, llmLoading, llmError, evaluate, reset };
}
