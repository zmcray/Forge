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
  const [hasConfirmedScore, setHasConfirmedScore] = useState(false);

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
      // Quantitative: score immediately (no calibration)
      onScore(question.type, n, {
        delta:
          committedNumeric !== null && modelExtracted
            ? committedNumeric - modelExtracted.value
            : null,
        unit: modelExtracted?.unit || null,
      });
      setHasConfirmedScore(true);
    }
    // Qualitative: wait for user to confirm via calibration card
  };

  const handleConfirmScore = (finalScore) => {
    onScore(question.type, finalScore, {
      delta: null,
      unit: null,
      selfScore,
      aiScore: llmResult?.score || null,
    });
    setSelfScore(finalScore);
    setHasConfirmedScore(true);
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

            {!isQuantitative && question.keywords && committedText && (
              <KeywordFeedback
                text={committedText}
                keywords={question.keywords}
              />
            )}

            {answerComparison}

            {/* LLM loading skeleton (qualitative only, shown below answers) */}
            {!isQuantitative && llmLoading && <LLMFeedbackSkeleton />}

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

            {!isQuantitative && question.keywords && committedText && (
              <KeywordFeedback
                text={committedText}
                keywords={question.keywords}
              />
            )}

            {answerComparison}

            {/* AI Calibration (qualitative only) */}
            {!isQuantitative && !hasConfirmedScore && (
              <AICalibrationCard
                selfScore={selfScore}
                llmResult={llmResult}
                llmLoading={llmLoading}
                onConfirm={handleConfirmScore}
              />
            )}

            {/* Show LLM feedback summary after confirmed (qualitative) */}
            {!isQuantitative && hasConfirmedScore && llmResult && (
              <LLMFeedbackSummary result={llmResult} />
            )}
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

function AICalibrationCard({ selfScore, llmResult, llmLoading, onConfirm }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mt-3">
      <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Calibration
      </div>
      <div className="p-3 space-y-3">
        {/* LLM feedback content */}
        {llmLoading && <LLMFeedbackSkeleton />}

        {llmResult && (
          <>
            {/* Strengths */}
            {llmResult.strengths.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="font-semibold text-green-800 text-xs uppercase mb-1">
                  Strengths Identified
                </p>
                <ul className="text-sm text-green-900 space-y-1">
                  {llmResult.strengths.map((s, i) => (
                    <li key={i} className="flex gap-1.5">
                      <span className="shrink-0">&#10003;</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gaps */}
            {llmResult.gaps.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="font-semibold text-amber-800 text-xs uppercase mb-1">
                  Areas to Develop
                </p>
                <ul className="text-sm text-amber-900 space-y-1">
                  {llmResult.gaps.map((g, i) => (
                    <li key={i} className="flex gap-1.5">
                      <span className="shrink-0">&#8594;</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestion */}
            {llmResult.suggestion && (
              <p className="text-xs text-gray-600 italic">
                {llmResult.suggestion}
              </p>
            )}

            {/* Score comparison */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-500">Your score:</span>
              <span className="text-sm font-semibold text-blue-700">
                {selfScore}/5
              </span>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">AI assessment:</span>
              <span className="text-sm font-semibold text-gray-600">
                {llmResult.score}/5
              </span>
            </div>
          </>
        )}

        {/* Confirm buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onConfirm(selfScore)}
            className="px-3 py-1.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Keep {selfScore}
          </button>
          {llmResult && llmResult.score !== selfScore && (
            <button
              onClick={() => onConfirm(llmResult.score)}
              className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Adjust to {llmResult.score}
            </button>
          )}
          {/* Full override buttons (collapsed) */}
          {llmResult && (
            <div className="flex gap-1 ml-auto">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => onConfirm(n)}
                  className={`w-7 h-7 rounded text-xs font-semibold transition-all ${
                    n === selfScore
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LLMFeedbackSummary({ result }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-3 text-sm">
      <div className="flex gap-4">
        {result.strengths.length > 0 && (
          <div className="flex-1">
            <p className="font-semibold text-green-700 text-xs uppercase mb-1">
              Strengths
            </p>
            <ul className="text-xs text-green-800 space-y-0.5">
              {result.strengths.map((s, i) => (
                <li key={i}>&#10003; {s}</li>
              ))}
            </ul>
          </div>
        )}
        {result.gaps.length > 0 && (
          <div className="flex-1">
            <p className="font-semibold text-amber-700 text-xs uppercase mb-1">
              Areas to Develop
            </p>
            <ul className="text-xs text-amber-800 space-y-0.5">
              {result.gaps.map((g, i) => (
                <li key={i}>&#8594; {g}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {result.suggestion && (
        <p className="text-xs text-gray-500 italic mt-2">
          {result.suggestion}
        </p>
      )}
    </div>
  );
}
