import ProgressRing from "./ProgressRing";

export default function FocusView({
  currentStep,
  currentStepIdx,
  totalSteps,
  stepDescription,
  objectiveStatuses,
  pct,
  overallStats,
  onContinue,
  onNavigate,
}) {
  const isFirstTime = overallStats.completedSteps === 0;

  return (
    <>
      {/* Continue card */}
      <div className="bg-surface-container-lowest ghost-border rounded-2xl p-8 mb-6 bg-gradient-to-br from-primary/[0.04] to-transparent">
        <div className="flex items-start gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs text-on-surface-variant">
                {isFirstTime ? "Start here" : "Pick up where you left off"}
              </span>
              <span className="text-[10px] font-semibold bg-primary/12 text-primary px-2 py-0.5 rounded-full">
                Step {currentStepIdx + 1} / {totalSteps}
              </span>
            </div>
            <h3 className="text-2xl font-extrabold font-headline text-on-surface mb-2">
              {currentStep.title}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-5 max-w-xl">
              {stepDescription}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={onContinue}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-on-primary bg-gradient-to-r from-primary to-primary-container hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                {isFirstTime ? "Start" : "Continue"}
              </button>
              <span className="text-sm text-on-surface-variant">
                ~{currentStep.timeEstimate || 8} min
              </span>
            </div>
          </div>

          {/* Progress ring */}
          <div className="text-center shrink-0">
            <ProgressRing size={90} pct={pct} strokeWidth={5} />
            <div className="text-xs text-outline-variant mt-1">
              {overallStats.completedSteps} of {overallStats.totalSteps}
            </div>
          </div>
        </div>
      </div>

      {/* Objectives + progress grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Objectives card */}
        <div className="col-span-2 bg-surface-container-lowest ghost-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">
              What you'll cover
            </h4>
            <span className="text-[11px] text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
              Learn + Practice
            </span>
          </div>
          <ul className="space-y-2 mb-4">
            {objectiveStatuses.map((obj, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-on-surface-variant"
              >
                <span
                  className={`material-symbols-outlined text-[16px] mt-0.5 shrink-0 ${
                    obj.done ? "text-on-tertiary-container" : "text-outline-variant"
                  }`}
                  style={obj.done ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {obj.done ? "check_circle" : "radio_button_unchecked"}
                </span>
                <span className={obj.done ? "text-on-surface-variant/60" : ""}>
                  {obj.text}
                </span>
              </li>
            ))}
          </ul>
          {currentStep.skillTags && (
            <div className="flex gap-1.5 flex-wrap">
              {currentStep.skillTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats card */}
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <div className="text-sm text-on-surface-variant mb-3">Overall progress</div>
          <div className="flex gap-6">
            <div>
              <div className="text-xl font-bold text-on-tertiary-container">
                {overallStats.completedExercises}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-outline-variant">
                Exercises
              </div>
            </div>
            <div>
              <div
                className="text-xl font-bold text-on-surface"
                style={{ color: "#FFB74D" }}
              >
                ~{overallStats.remainingTime}m
              </div>
              <div className="text-[10px] uppercase tracking-widest text-outline-variant">
                Remaining
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary actions */}
      <h4 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-3">
        Also available
      </h4>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate("/quickfire")}
          className="bg-surface-container-lowest ghost-border rounded-xl p-4 text-left hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-[24px] text-on-surface-variant mb-2">
            bolt
          </span>
          <div className="text-sm font-semibold font-headline text-on-surface">
            Quick Screen
          </div>
          <div className="text-xs text-outline-variant mt-0.5">
            60-second go/no-go decisions. Pattern recognition drill.
          </div>
        </button>
        <button
          onClick={() => onNavigate("/")}
          className="bg-surface-container-lowest ghost-border rounded-xl p-4 text-left hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-[24px] text-on-surface-variant mb-2">
            business
          </span>
          <div className="text-sm font-semibold font-headline text-on-surface">
            Explore Companies
          </div>
          <div className="text-xs text-outline-variant mt-0.5">
            Browse all 9 companies. Deep dive any industry.
          </div>
        </button>
      </div>
    </>
  );
}
