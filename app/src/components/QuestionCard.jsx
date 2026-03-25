import { useState } from "react";
import { QUESTION_TYPES } from "../data/questionTypes";
import { extractNumericValue } from "../utils/format";
import CommitInput from "./CommitInput";
import DeltaDisplay from "./DeltaDisplay";

export default function QuestionCard({ question, index, onScore, companyContext }) {
  const [phase, setPhase] = useState("commit"); // commit, hint, reveal, scored
  const [selfScore, setSelfScore] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [numericAnswer, setNumericAnswer] = useState(null);
  const [committedText, setCommittedText] = useState("");
  const [committedNumeric, setCommittedNumeric] = useState(null);

  // LLM evaluation state (qualitative only, orthogonal to phase)
  const [llmResult, setLlmResult] = useState(null);
  const [llmLoading, setLlmLoading] = useState(false);

  const typeInfo = QUESTION_TYPES[question.type];
  const isQuantitative = typeInfo.inputMode === "quantitative";

  const hasValidInput = isQuantitative
    ? numericAnswer !== null && !isNaN(numericAnswer)
    : textAnswer.trim().length >= CommitInput.MIN_QUALITATIVE_CHARS;

  const handleReveal = () => {
    setCommittedText(textAnswer);
    setCommittedNumeric(numericAnswer);
    setPhase("reveal");

    // Fire LLM evaluation for qualitative questions
    if (!isQuantitative) {
      setLlmLoading(true);
      fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forge-token": import.meta.env.VITE_FORGE_AUTH_TOKEN || "",
        },
        body: JSON.stringify({
          userAnswer: textAnswer,
          modelAnswer: question.answer,
          questionText: question.q,
          questionType: question.type,
          companyContext: companyContext || "",
        }),
        signal: AbortSignal.timeout(15000),
      })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then(setLlmResult)
        .catch(() => {}) // fallback to keyword matching
        .finally(() => setLlmLoading(false));
    }
  };

  const handleSelfScore = (n) => {
    setSelfScore(n);
    setPhase("scored");

    if (isQuantitative) {
      onScore(question.type, n, {
        delta:
          committedNumeric !== null && modelExtracted
            ? committedNumeric - modelExtracted.value
            : null,
        unit: modelExtracted?.unit || null,
      });
    } else {
      onScore(question.type, n, {
        delta: null,
        unit: null,
        selfScore: n,
        aiScore: llmResult?.score || null,
      });
    }
  };

  const handleRetry = () => {
    setPhase("commit");
    setSelfScore(null);
    setTextAnswer("");
    setNumericAnswer(null);
    setCommittedText("");
    setCommittedNumeric(null);
    setLlmResult(null);
    setLlmLoading(false);
  };

  const modelExtracted = isQuantitative
    ? extractNumericValue(question.answer)
    : null;

  // Shared answer comparison grid
  const answerComparison = (
    <div
      className={`grid ${isQuantitative ? "grid-cols-1" : "grid-cols-2"} gap-3 mb-4`}
    >
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
        <span className="font-semibold text-gray-500 text-xs uppercase">
          Your Answer
        </span>
        {isQuantitative && committedNumeric !== null && (
          <p className="mt-1 font-mono font-semibold text-gray-900">
            {committedNumeric}
          </p>
        )}
        {committedText && <p className="mt-1 text-gray-700">{committedText}</p>}
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-900">
        <span className="font-semibold text-green-700 text-xs uppercase">
          Model Answer
        </span>
        <p className="mt-1">{question.answer}</p>
      </div>
    </div>
  );

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{typeInfo.icon}</span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeInfo.color}`}
          >
            {typeInfo.label}
          </span>
          <span className="text-sm font-medium text-gray-700">
            Question {index + 1}
          </span>
        </div>
        {selfScore !== null && (
          <div
            className={`text-sm font-semibold px-2 py-0.5 rounded ${selfScore >= 4 ? "bg-green-100 text-green-800" : selfScore >= 2 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}
          >
            {selfScore}/5
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-gray-900 font-medium mb-3">{question.q}</p>

        {/* COMMIT phase */}
        {phase === "commit" && (
          <div>
            <CommitInput
              mode={typeInfo.inputMode}
              disabled={false}
              value={textAnswer}
              onChange={setTextAnswer}
              numericValue={numericAnswer}
              onNumericChange={setNumericAnswer}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setPhase("hint")}
                className="px-3 py-1.5 text-sm bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
              >
                Show Hint
              </button>
              <button
                onClick={handleReveal}
                disabled={!hasValidInput}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${hasValidInput ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                Reveal Answer
              </button>
            </div>
          </div>
        )}

        {/* HINT phase */}
        {phase === "hint" && (
          <div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 text-sm text-amber-800">
              <span className="font-semibold">Hint:</span> {question.hint}
            </div>
            <CommitInput
              mode={typeInfo.inputMode}
              disabled={false}
              value={textAnswer}
              onChange={setTextAnswer}
              numericValue={numericAnswer}
              onNumericChange={setNumericAnswer}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleReveal}
                disabled={!hasValidInput}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${hasValidInput ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                Reveal Answer
              </button>
            </div>
          </div>
        )}

        {/* REVEAL phase */}
        {phase === "reveal" && (
          <div>
            {isQuantitative && (
              <DeltaDisplay
                committedNumeric={committedNumeric}
                modelExtracted={modelExtracted}
              />
            )}

            {answerComparison}

            {/* LLM grading (qualitative): show inline on reveal */}
            {!isQuantitative && llmLoading && <LLMFeedbackSkeleton />}
            {!isQuantitative && llmResult && (
              <LLMGrading result={llmResult} />
            )}

            {/* Keyword fallback only if LLM failed */}
            {!isQuantitative && !llmLoading && !llmResult && question.keywords && committedText && (
              <KeywordFeedback
                text={committedText}
                keywords={question.keywords}
              />
            )}

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                How close was your analysis? Rate yourself:
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => handleSelfScore(n)}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-semibold text-gray-700 transition-all"
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                1 = completely off &nbsp; 3 = right direction &nbsp; 5 = nailed
                it
              </p>
            </div>
          </div>
        )}

        {/* SCORED phase */}
        {phase === "scored" && (
          <div>
            {isQuantitative && (
              <DeltaDisplay
                committedNumeric={committedNumeric}
                modelExtracted={modelExtracted}
              />
            )}

            {answerComparison}

            {/* LLM grading persists in scored phase */}
            {!isQuantitative && llmResult && (
              <LLMGrading result={llmResult} />
            )}

            {/* Keyword fallback only if LLM failed */}
            {!isQuantitative && !llmResult && question.keywords && committedText && (
              <KeywordFeedback
                text={committedText}
                keywords={question.keywords}
              />
            )}

            <button
              onClick={handleRetry}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function KeywordFeedback({ text, keywords }) {
  const lower = text.toLowerCase();
  const found = keywords.filter((k) => lower.includes(k.toLowerCase()));

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 text-sm">
      <p className="font-semibold text-blue-800 mb-1">
        Key Factors: {found.length}/{keywords.length} identified
      </p>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {keywords.map((k) => (
          <span
            key={k}
            className={`text-xs px-2 py-0.5 rounded-full ${found.includes(k) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {found.includes(k) ? "\u2713" : "\u2717"} {k}
          </span>
        ))}
      </div>
    </div>
  );
}

function LLMFeedbackSkeleton() {
  return (
    <div className="animate-pulse space-y-2 mb-4">
      <div className="bg-green-50/50 border border-green-100 rounded-lg p-3">
        <div className="h-3 w-28 bg-green-100 rounded mb-2" />
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-green-100/60 rounded" />
          <div className="h-3 w-4/5 bg-green-100/60 rounded" />
        </div>
      </div>
      <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-3">
        <div className="h-3 w-24 bg-amber-100 rounded mb-2" />
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-amber-100/60 rounded" />
          <div className="h-3 w-3/5 bg-amber-100/60 rounded" />
        </div>
      </div>
      <p className="text-xs text-gray-400 italic">
        Analyzing your response...
      </p>
    </div>
  );
}

function LLMGrading({ result }) {
  return (
    <div className="space-y-3 mb-4">
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold px-2 py-0.5 rounded ${result.score >= 4 ? "bg-green-100 text-green-800" : result.score >= 3 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
          {result.score}/5
        </span>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">AI Assessment</span>
      </div>

      {/* What you got right */}
      {result.strengths.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="font-semibold text-green-800 text-xs uppercase mb-1">What You Got Right</p>
          <ul className="text-sm text-green-900 space-y-1">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="shrink-0">&#10003;</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* What you missed */}
      {result.gaps.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="font-semibold text-red-800 text-xs uppercase mb-1">What You Missed</p>
          <ul className="text-sm text-red-900 space-y-1">
            {result.gaps.map((g, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="shrink-0">&#10007;</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next time */}
      {result.suggestion && (
        <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <span className="font-semibold text-gray-700">Next time:</span> {result.suggestion}
        </p>
      )}
    </div>
  );
}
