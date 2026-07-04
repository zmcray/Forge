// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import useLLMEvaluation from "./useLLMEvaluation";
import { evaluateAnswer } from "../utils/evaluateAnswer";

vi.mock("../utils/evaluateAnswer", () => ({
  evaluateAnswer: vi.fn(),
}));

const PAYLOAD = {
  userAnswer: "my answer",
  modelAnswer: "model",
  questionText: "q",
  questionType: "risk",
  companyContext: "",
};

const RESULT = { score: 4, strengths: ["a"], gaps: ["b"], suggestion: "c" };

function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("useLLMEvaluation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts idle", () => {
    const { result } = renderHook(() => useLLMEvaluation({ resetKey: "k" }));
    expect(result.current.llmResult).toBeNull();
    expect(result.current.llmLoading).toBe(false);
    expect(result.current.llmError).toBeNull();
  });

  it("success path: loading then result, resolves status success", async () => {
    const d = deferred();
    evaluateAnswer.mockReturnValue(d.promise);
    const { result } = renderHook(() => useLLMEvaluation({ resetKey: "k" }));

    let outcome;
    act(() => {
      result.current.evaluate(PAYLOAD).then((o) => (outcome = o));
    });
    expect(result.current.llmLoading).toBe(true);
    expect(evaluateAnswer).toHaveBeenCalledWith(PAYLOAD);

    await act(async () => {
      d.resolve(RESULT);
      await d.promise;
    });
    expect(result.current.llmLoading).toBe(false);
    expect(result.current.llmResult).toEqual(RESULT);
    expect(result.current.llmError).toBeNull();
    expect(outcome).toEqual({ status: "success", data: RESULT });
  });

  it("error path: sets llmError and resolves status error (degraded state)", async () => {
    const err = new Error("boom");
    evaluateAnswer.mockRejectedValue(err);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { result } = renderHook(() => useLLMEvaluation({ resetKey: "k" }));

    let outcome;
    await act(async () => {
      outcome = await result.current.evaluate(PAYLOAD);
    });
    expect(result.current.llmLoading).toBe(false);
    expect(result.current.llmResult).toBeNull();
    expect(result.current.llmError).toBe(err);
    expect(outcome).toEqual({ status: "error", error: err });
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("ignores response arriving after unmount (abort on unmount)", async () => {
    const d = deferred();
    evaluateAnswer.mockReturnValue(d.promise);
    const { result, unmount } = renderHook(() =>
      useLLMEvaluation({ resetKey: "k" })
    );

    let outcome;
    act(() => {
      result.current.evaluate(PAYLOAD).then((o) => (outcome = o));
    });
    unmount();
    d.resolve(RESULT);
    await waitFor(() => expect(outcome).toEqual({ status: "stale" }));
  });

  it("stale response ignored after resetKey change", async () => {
    const d = deferred();
    evaluateAnswer.mockReturnValue(d.promise);
    const { result, rerender } = renderHook(
      ({ resetKey }) => useLLMEvaluation({ resetKey }),
      { initialProps: { resetKey: "a" } }
    );

    let outcome;
    act(() => {
      result.current.evaluate(PAYLOAD).then((o) => (outcome = o));
    });
    expect(result.current.llmLoading).toBe(true);

    rerender({ resetKey: "b" });
    // resetKey change clears state immediately
    expect(result.current.llmLoading).toBe(false);
    expect(result.current.llmResult).toBeNull();
    expect(result.current.llmError).toBeNull();

    await act(async () => {
      d.resolve(RESULT);
      await d.promise;
    });
    expect(outcome).toEqual({ status: "stale" });
    expect(result.current.llmResult).toBeNull();
  });

  it("a second evaluate supersedes the first (stale-response guard)", async () => {
    const d1 = deferred();
    const d2 = deferred();
    evaluateAnswer.mockReturnValueOnce(d1.promise).mockReturnValueOnce(d2.promise);
    const { result } = renderHook(() => useLLMEvaluation({ resetKey: "k" }));

    let first, second;
    act(() => {
      result.current.evaluate(PAYLOAD).then((o) => (first = o));
    });
    act(() => {
      result.current.evaluate(PAYLOAD).then((o) => (second = o));
    });

    await act(async () => {
      d1.resolve({ ...RESULT, score: 1 });
      d2.resolve(RESULT);
      await Promise.all([d1.promise, d2.promise]);
    });
    expect(first).toEqual({ status: "stale" });
    expect(second).toEqual({ status: "success", data: RESULT });
    expect(result.current.llmResult).toEqual(RESULT);
  });

  it("reset() clears state and marks inflight request stale", async () => {
    const d = deferred();
    evaluateAnswer.mockReturnValue(d.promise);
    const { result } = renderHook(() => useLLMEvaluation({ resetKey: "k" }));

    let outcome;
    act(() => {
      result.current.evaluate(PAYLOAD).then((o) => (outcome = o));
    });
    act(() => {
      result.current.reset();
    });
    expect(result.current.llmLoading).toBe(false);

    await act(async () => {
      d.resolve(RESULT);
      await d.promise;
    });
    expect(outcome).toEqual({ status: "stale" });
    expect(result.current.llmResult).toBeNull();
  });
});
