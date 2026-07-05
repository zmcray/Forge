import { useState, useEffect } from "react";
import CommitInput from "../CommitInput";
import DeltaDisplay from "../DeltaDisplay";
import { STATUS_CHIP_COLORS } from "../../utils/format";

/**
 * Commit-first quantitative micro-exercise for a value lever. The user must
 * commit a number before the model answer and worked solution reveal.
 * Pass/fail is judged against the exercise's own tolerance; the DeltaDisplay
 * band gives finer-grained feedback on how far off the answer was.
 */
export default function LeverQuantExercise({ exercise, resetKey }) {
  const [numericAnswer, setNumericAnswer] = useState(null);
  const [work, setWork] = useState("");
  const [phase, setPhase] = useState("commit");

  useEffect(() => {
    setNumericAnswer(null);
    setWork("");
    setPhase("commit");
  }, [resetKey]);

  const passed =
    phase === "done" && Math.abs(numericAnswer - exercise.answer) <= exercise.tolerance;

  return (
    <div className="border border-outline-variant/40 rounded-lg overflow-hidden mt-4">
      <div className="bg-primary-container text-on-primary-container px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-semibold">Quick Math</span>
        {phase === "done" ? (
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${passed ? STATUS_CHIP_COLORS.success : STATUS_CHIP_COLORS.error}`}
            >
              {passed ? "PASSED" : "MISS"}
            </span>
            <button onClick={() => setPhase("commit")} className="text-xs hover:opacity-80">
              Try Again
            </button>
          </div>
        ) : (
          <span className="text-xs opacity-80">Commit a number first</span>
        )}
      </div>
      <div className="p-4 bg-surface-container-lowest">
        <p className="text-on-surface font-medium mb-3">{exercise.prompt}</p>

        {phase === "commit" && (
          <div>
            <CommitInput
              mode="quantitative"
              disabled={false}
              value={work}
              onChange={setWork}
              numericValue={numericAnswer}
              onNumericChange={setNumericAnswer}
            />
            <div className="mt-3">
              <button
                onClick={() => setPhase("done")}
                disabled={numericAnswer == null}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${numericAnswer != null ? "bg-primary text-on-primary hover:opacity-90" : "bg-surface-container-high text-outline-variant cursor-not-allowed"}`}
              >
                Check Answer
              </button>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div>
            <DeltaDisplay
              committedNumeric={numericAnswer}
              modelExtracted={{ value: exercise.answer, unit: exercise.unit }}
            />
            <div className="bg-tertiary-container border border-on-tertiary-container/30 rounded-lg p-3 text-sm text-on-tertiary-container">
              <div className="font-semibold text-xs uppercase mb-1">Worked Solution</div>
              <p>{exercise.solution}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
