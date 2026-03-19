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
        className="border border-green-200 bg-green-50 rounded-lg p-3 my-3 flex items-center justify-between cursor-pointer hover:bg-green-100 transition-colors"
        onClick={() => setExpanded(true)}
      >
        <div className="flex items-center gap-2">
          <span className="text-green-600 text-lg">&#10003;</span>
          <span className="text-sm font-medium text-green-800">{exercise.q}</span>
        </div>
        <span className="text-xs text-green-600">Click to review</span>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden my-3">
      <div className="bg-blue-50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-blue-800">Exercise</span>
          {(phase === "done" || isComplete) && <span className="text-green-600">&#10003;</span>}
        </div>
        {isComplete && phase === "done" && (
          <button onClick={handleRedo} className="text-xs text-blue-600 hover:text-blue-800">
            Redo
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="text-gray-900 font-medium mb-3">{exercise.q}</p>

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
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${hasValidInput ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
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
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3 text-sm">
                <span className="font-semibold text-gray-500 text-xs uppercase">Your Answer</span>
                <p className="mt-1 text-gray-700">{committedText}</p>
              </div>
            )}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-900">
              <span className="font-semibold text-green-700 text-xs uppercase">Model Answer</span>
              <p className="mt-1">{exercise.answer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
