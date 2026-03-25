import { useState } from "react";
import CommitInput from "../CommitInput";
import DeltaDisplay from "../DeltaDisplay";
import { extractNumericValue } from "../../utils/format";

export default function LearnExercise({ exercise, isComplete, onComplete }) {
  const [phase, setPhase] = useState(isComplete ? "done" : "commit"); // commit, reveal, done
  const [textAnswer, setTextAnswer] = useState("");
  const [numericAnswer, setNumericAnswer] = useState(null);
  const [committedText, setCommittedText] = useState("");
  const [committedNumeric, setCommittedNumeric] = useState(null);
  const [expanded, setExpanded] = useState(!isComplete);

  const mode = exercise.inputMode || "qualitative";
  const isQuantitative = mode === "quantitative";

  const hasValidInput = isQuantitative
    ? numericAnswer !== null && !isNaN(numericAnswer)
    : textAnswer.trim().length >= CommitInput.MIN_QUALITATIVE_CHARS;

  const handleReveal = () => {
    setCommittedText(textAnswer);
    setCommittedNumeric(numericAnswer);
    setPhase("done");
    onComplete(exercise.id);
  };

  const handleRedo = () => {
    setTextAnswer("");
    setNumericAnswer(null);
    setCommittedText("");
    setCommittedNumeric(null);
    setPhase("commit");
    setExpanded(true);
  };

  const modelExtracted = isQuantitative ? extractNumericValue(exercise.answer) : null;

  // Collapsed completed state
  if (!expanded && isComplete) {
    return (
      <div
        className="border border-on-tertiary-container/30 bg-tertiary-container rounded-lg p-3 my-3 flex items-center justify-between cursor-pointer hover:opacity-90 transition-colors"
        onClick={() => setExpanded(true)}
      >
        <div className="flex items-center gap-2">
          <span className="text-on-tertiary-container text-lg">&#10003;</span>
          <span className="text-sm font-medium text-on-tertiary-container">{exercise.q}</span>
        </div>
        <span className="text-xs text-on-tertiary-container">Click to review</span>
      </div>
    );
  }

  return (
    <div className="border border-outline-variant/30 rounded-lg overflow-hidden my-3">
      <div className="bg-secondary-container px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-on-surface">Exercise</span>
          {(phase === "done" || isComplete) && <span className="text-on-tertiary-container">&#10003;</span>}
        </div>
        {isComplete && phase === "done" && (
          <button onClick={handleRedo} className="text-xs text-primary hover:opacity-80">
            Redo
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="text-on-surface font-medium mb-3">{exercise.q}</p>

        {phase === "commit" && (
          <div>
            <CommitInput
              mode={mode}
              disabled={false}
              value={textAnswer}
              onChange={setTextAnswer}
              numericValue={numericAnswer}
              onNumericChange={setNumericAnswer}
            />
            <div className="mt-3">
              <button
                onClick={handleReveal}
                disabled={!hasValidInput}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${hasValidInput ? "bg-primary text-on-primary hover:opacity-90" : "bg-surface-container-high text-outline-variant cursor-not-allowed"}`}
              >
                Reveal Answer
              </button>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div>
            {isQuantitative && <DeltaDisplay committedNumeric={committedNumeric} modelExtracted={modelExtracted} />}
            {committedText && (
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 mb-3 text-sm">
                <span className="font-semibold text-outline-variant text-xs uppercase">Your Answer</span>
                <p className="mt-1 text-on-surface-variant">{committedText}</p>
              </div>
            )}
            <div className="bg-tertiary-container border border-on-tertiary-container/30 rounded-lg p-3 text-sm text-on-tertiary-container">
              <span className="font-semibold text-on-tertiary-container text-xs uppercase">Model Answer</span>
              <p className="mt-1">{exercise.answer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
