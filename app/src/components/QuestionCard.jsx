import { useState } from "react";
import { QUESTION_TYPES } from "../data/questionTypes";
import { extractNumericValue, getScoreChipClass, STATUS_CHIP_COLORS } from "../utils/format";
import { LLMGrading, LLMFeedbackSkeleton } from "./LLMFeedback";
import CommitInput from "./CommitInput";
import DeltaDisplay from "./DeltaDisplay";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import useLLMEvaluation from "../hooks/useLLMEvaluation";

export default function QuestionCard({ question, index, onScore, companyContext }) {
  const [phase, setPhase] = useState("commit"); // commit, hint, reveal, scored
  const [selfScore, setSelfScore] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [numericAnswer, setNumericAnswer] = useState(null);
  const [committedText, setCommittedText] = useState("");
  const [committedNumeric, setCommittedNumeric] = useState(null);

  // LLM evaluation state (qualitative only, orthogonal to phase)
  const { llmResult, llmLoading, llmError, evaluate, reset: resetLLM } =
    useLLMEvaluation();

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
      evaluate({
        userAnswer: textAnswer,
        modelAnswer: question.answer,
        questionText: question.q,
        questionType: question.type,
        companyContext: companyContext || "",
      }).then((outcome) => {
        if (outcome.status !== "success") return;
        const data = outcome.data;
        // Auto-score using the LLM's score
        setSelfScore(data.score);
        setPhase("scored");
        onScore(question.type, data.score, {
          delta: null,
          unit: null,
          aiScore: data.score,
          atomId: question.id ?? null,
          atomType: question.id ? "company-question" : null,
          feedback: {
            strengths: data.strengths ?? [],
            gaps: data.gaps ?? [],
            suggestion: data.suggestion ?? "",
          },
        });
      });
    }
  };

  const handleSelfScore = (n) => {
    setSelfScore(n);
    setPhase("scored");
    onScore(question.type, n, {
      delta:
        committedNumeric !== null && modelExtracted
          ? committedNumeric - modelExtracted.value
          : null,
      unit: modelExtracted?.unit || null,
      atomId: question.id ?? null,
      atomType: question.id ? "company-question" : null,
      feedback: null,
    });
  };

  const handleRetry = () => {
    setPhase("commit");
    setSelfScore(null);
    setTextAnswer("");
    setNumericAnswer(null);
    setCommittedText("");
    setCommittedNumeric(null);
    resetLLM();
  };

  const modelExtracted = isQuantitative
    ? extractNumericValue(question.answer)
    : null;

  // Keyboard shortcuts: Enter reveals a committable answer; 1-5 self-scores
  // when the self-score UI is showing (quantitative always, qualitative only
  // on LLM failure). The hook ignores keys while typing in inputs/textareas.
  const canReveal = (phase === "commit" || phase === "hint") && hasValidInput;
  const canSelfScore =
    phase === "reveal" && (isQuantitative || (!isQuantitative && llmError));
  useKeyboardShortcuts({
    enabled: canReveal || canSelfScore,
    onReveal: canReveal ? handleReveal : null,
    onScore: canSelfScore ? handleSelfScore : null,
  });

  // Shared answer comparison grid
  const answerComparison = (
    <div
      className={`grid ${isQuantitative ? "grid-cols-1" : "grid-cols-2"} gap-3 mb-4`}
    >
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-sm">
        <span className="font-semibold text-on-surface-variant text-xs uppercase">
          Your Answer
        </span>
        {isQuantitative && committedNumeric !== null && (
          <p className="mt-1 font-mono font-semibold text-on-surface">
            {committedNumeric}
          </p>
        )}
        {committedText && <p className="mt-1 text-on-surface-variant">{committedText}</p>}
      </div>
      <div className="bg-secondary-container rounded-lg p-3 text-sm">
        <span className="font-semibold text-on-secondary-container text-xs uppercase tracking-wide">
          Model Answer
        </span>
        <p className="mt-1 text-on-surface">{question.answer}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-surface-container border border-outline-variant/30 rounded-lg overflow-hidden mb-4">
      <div className="bg-surface-container-low px-4 py-3 flex items-center justify-between border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="text-lg">{typeInfo.icon}</span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeInfo.color}`}
          >
            {typeInfo.label}
          </span>
          <span className="text-sm font-medium text-on-surface-variant">
            Question {index + 1}
          </span>
        </div>
        {selfScore !== null && (
          <div
            className={`text-sm font-semibold px-2 py-0.5 rounded ${getScoreChipClass(selfScore, { warnAt: 2 })}`}
          >
            {selfScore}/5{!isQuantitative && " AI"}
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-on-surface font-medium mb-3">{question.q}</p>

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
                className="px-3 py-1.5 text-sm bg-warning-container text-on-warning-container border border-on-warning-container/20 rounded-lg hover:bg-warning-container/70 transition-colors"
              >
                Show Hint
              </button>
              <button
                onClick={handleReveal}
                disabled={!hasValidInput}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${hasValidInput ? "bg-primary text-on-primary hover:opacity-90" : "bg-surface-container text-on-surface-variant/40 cursor-not-allowed"}`}
              >
                Reveal Answer
              </button>
            </div>
          </div>
        )}

        {/* HINT phase */}
        {phase === "hint" && (
          <div>
            <div className="bg-warning-container border border-on-warning-container/20 rounded-lg p-3 mb-3 text-sm text-on-warning-container">
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
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${hasValidInput ? "bg-primary text-on-primary hover:opacity-90" : "bg-surface-container text-on-surface-variant/40 cursor-not-allowed"}`}
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

            {/* Keyword fallback if LLM failed or unavailable */}
            {!isQuantitative && !llmLoading && !llmResult && question.keywords && committedText && (
              <>
                {llmError && (
                  <p className="text-xs text-warning mb-2">
                    AI grading unavailable. Showing keyword match instead.
                  </p>
                )}
                <KeywordFeedback
                  text={committedText}
                  keywords={question.keywords}
                />
              </>
            )}

            {/* Self-score: quantitative always, qualitative only if LLM failed */}
            {(isQuantitative || (!isQuantitative && llmError)) && (
              <div>
                <p className="text-sm font-medium text-on-surface-variant mb-2">
                  How close was your analysis? Rate yourself:
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => handleSelfScore(n)}
                      className="w-10 h-10 rounded-lg border-2 border-outline-variant hover:border-primary hover:bg-primary/10 font-semibold text-on-surface-variant transition-all"
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-on-surface-variant/60 mt-1">
                  1 = completely off &nbsp; 3 = right direction &nbsp; 5 = nailed
                  it
                </p>
              </div>
            )}
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

            {/* Keyword fallback if LLM failed or unavailable */}
            {!isQuantitative && !llmResult && question.keywords && committedText && (
              <>
                {llmError && (
                  <p className="text-xs text-warning mb-2">
                    AI grading unavailable. Showing keyword match instead.
                  </p>
                )}
                <KeywordFeedback
                  text={committedText}
                  keywords={question.keywords}
                />
              </>
            )}

            <button
              onClick={handleRetry}
              className="px-3 py-1.5 text-sm font-medium text-on-secondary-container bg-secondary-container border border-outline-variant/30 rounded-lg hover:opacity-90 transition-colors"
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
    <div className="bg-secondary-container/50 border border-outline-variant/30 rounded-lg p-3 mb-3 text-sm">
      <p className="font-semibold text-on-secondary-container mb-1">
        Key Factors: {found.length}/{keywords.length} identified
      </p>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {keywords.map((k) => (
          <span
            key={k}
            className={`text-xs px-2 py-0.5 rounded-full ${found.includes(k) ? STATUS_CHIP_COLORS.success : STATUS_CHIP_COLORS.error}`}
          >
            {found.includes(k) ? "\u2713" : "\u2717"} {k}
          </span>
        ))}
      </div>
    </div>
  );
}

