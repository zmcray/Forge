export default function BridgeExercise({ exerciseTarget, userMoic, onCheck, lastResult }) {
  const handleSubmit = () => {
    onCheck();
  };

  return (
    <div className="border border-outline-variant/40 rounded-lg overflow-hidden">
      <div className="bg-primary-container text-on-primary-container px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Exercise</span>
          <span className="text-xs font-mono">Target: {exerciseTarget.moic.toFixed(1)}x MOIC</span>
        </div>
        {lastResult && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${lastResult.passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {lastResult.passed ? "PASSED" : "MISS"}
          </span>
        )}
      </div>
      <div className="p-4 bg-surface-container-lowest">
        <p className="text-on-surface font-medium mb-3">{exerciseTarget.prompt}</p>

        <div className="flex items-baseline justify-between mb-4 pt-3 border-t border-outline-variant/30">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">
              Your MOIC
            </div>
            <div className="text-2xl font-bold font-mono text-on-surface">
              {userMoic.toFixed(2)}x
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">
              Target
            </div>
            <div className="text-2xl font-bold font-mono text-on-surface-variant">
              {exerciseTarget.moic.toFixed(2)}x
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full px-3 py-2 text-sm font-semibold rounded-lg bg-primary text-on-primary hover:opacity-90 transition-colors"
        >
          Check My Answer
        </button>

        {lastResult && (
          <div
            className={`mt-3 rounded-lg p-3 text-sm ${lastResult.passed ? "bg-tertiary-container border border-on-tertiary-container/30 text-on-tertiary-container" : "bg-error-container/30 border border-on-error-container/20 text-on-surface"}`}
          >
            {lastResult.passed ? (
              <p>
                Hit it. Your MOIC of {lastResult.userMoic.toFixed(2)}x is within
                {" "}{(lastResult.delta).toFixed(2)} of the {lastResult.targetMoic.toFixed(1)}x target.
              </p>
            ) : (
              <p>
                You are at {lastResult.userMoic.toFixed(2)}x vs the {lastResult.targetMoic.toFixed(1)}x target.
                Gap: {lastResult.delta.toFixed(2)}x. Adjust the sliders and try again.
              </p>
            )}
            <p className="mt-2 text-xs opacity-90">
              <span className="font-semibold uppercase tracking-wide">Hint:</span> {exerciseTarget.hint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
