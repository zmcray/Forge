/**
 * Compact lesson navigation header.
 * Shows back button, current step name, step position, and prev/next arrows.
 * Replaces the old full sidebar tree.
 */
export default function LearnNav({ currentStep, stepIndex, totalSteps, isFirst, isLast, onBack, onPrev, onNext }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-outline-variant/20">
      {/* Back to hub */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors shrink-0"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Overview
      </button>

      {/* Spacer */}
      <div className="flex-1 min-w-0 text-center">
        <span className="text-sm font-medium text-on-surface truncate">
          {currentStep?.title}
        </span>
        <span className="text-xs text-outline-variant ml-2">
          Step {stepIndex + 1} of {totalSteps}
        </span>
      </div>

      {/* Prev / Next */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className={`p-1.5 rounded-lg transition-colors ${
            isFirst
              ? "text-outline-variant/30 cursor-not-allowed"
              : "text-on-surface-variant hover:bg-surface-container-low"
          }`}
          title="Previous step"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>
        <button
          onClick={onNext}
          disabled={isLast}
          className={`p-1.5 rounded-lg transition-colors ${
            isLast
              ? "text-outline-variant/30 cursor-not-allowed"
              : "text-on-surface-variant hover:bg-surface-container-low"
          }`}
          title="Next step"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
