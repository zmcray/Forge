import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LEARN_CONTENT } from "../../data/learnContent";

export default function LearnHub({ learnProgress, onStartLesson }) {
  const [activeTab, setActiveTab] = useState("focus");
  const navigate = useNavigate();
  const {
    getCurrentStep, getStepIndex, getStepStatus,
    getSubsectionProgress, overallStats, allSteps,
  } = learnProgress;

  const currentStep = getCurrentStep();
  const currentStepIdx = getStepIndex(currentStep.id);
  const currentProgress = getSubsectionProgress(currentStep);
  const pct = overallStats.totalSteps > 0
    ? Math.round((overallStats.completedSteps / overallStats.totalSteps) * 100)
    : 0;

  // First text block as description for the continue card
  const stepDescription = useMemo(() => {
    const textBlock = (currentStep.blocks || []).find(b => b.type === "text");
    return textBlock?.content?.slice(0, 180) + (textBlock?.content?.length > 180 ? "..." : "") || "";
  }, [currentStep]);

  // Objective completion: proportional to exercise completion within the subsection
  const objectiveStatuses = useMemo(() => {
    if (!currentStep.objectives) return [];
    const exercises = (currentStep.blocks || []).filter(b => b.type === "exercise" || b.type === "calculationExercise");
    const completedCount = exercises.filter(e => learnProgress.isComplete(e.id)).length;
    const totalExercises = exercises.length;
    // Mark objectives proportionally: if 2/3 exercises done, mark first 2/3 of objectives
    const objCount = currentStep.objectives.length;
    const doneObjectives = totalExercises > 0
      ? Math.floor((completedCount / totalExercises) * objCount)
      : 0;
    return currentStep.objectives.map((obj, i) => ({
      text: obj,
      done: i < doneObjectives,
    }));
  }, [currentStep, learnProgress]);

  const handleContinue = () => {
    onStartLesson(currentStep._sectionIndex, currentStep._subsectionIndex);
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">
          Learn the Fundamentals
        </h2>
        <p className="text-sm text-on-surface-variant mt-2">
          PE financial statement analysis, step by step
        </p>
      </div>

      {/* View toggle tabs */}
      <div className="inline-flex bg-surface-container-low rounded-[10px] p-0.5 mb-7 ghost-border">
        <button
          onClick={() => setActiveTab("focus")}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "focus"
              ? "bg-primary/12 text-primary"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          Focus
        </button>
        <button
          onClick={() => setActiveTab("journey")}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "journey"
              ? "bg-primary/12 text-primary"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">route</span>
          Journey
        </button>
      </div>

      {activeTab === "focus" ? (
        <FocusView
          currentStep={currentStep}
          currentStepIdx={currentStepIdx}
          totalSteps={overallStats.totalSteps}
          stepDescription={stepDescription}
          currentProgress={currentProgress}
          objectiveStatuses={objectiveStatuses}
          pct={pct}
          overallStats={overallStats}
          onContinue={handleContinue}
          onNavigate={navigate}
        />
      ) : (
        <JourneyView
          allSteps={allSteps}
          currentStepId={currentStep.id}
          getStepStatus={learnProgress.getStepStatus}
          getSubsectionProgress={getSubsectionProgress}
          overallStats={overallStats}
          pct={pct}
          onStartLesson={onStartLesson}
          onNavigate={navigate}
        />
      )}
    </div>
  );
}

/* ===== FOCUS VIEW ===== */
function FocusView({
  currentStep, currentStepIdx, totalSteps, stepDescription,
  currentProgress, objectiveStatuses, pct, overallStats,
  onContinue, onNavigate,
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
              <li key={i} className="flex items-start gap-2.5 text-sm text-on-surface-variant">
                <span
                  className={`material-symbols-outlined text-[16px] mt-0.5 shrink-0 ${
                    obj.done ? "text-on-tertiary-container" : "text-outline-variant"
                  }`}
                  style={obj.done ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {obj.done ? "check_circle" : "radio_button_unchecked"}
                </span>
                <span className={obj.done ? "text-on-surface-variant/60" : ""}>{obj.text}</span>
              </li>
            ))}
          </ul>
          {currentStep.skillTags && (
            <div className="flex gap-1.5 flex-wrap">
              {currentStep.skillTags.map(tag => (
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
              <div className="text-xl font-bold text-on-surface" style={{ color: "#FFB74D" }}>
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
          <span className="material-symbols-outlined text-[24px] text-on-surface-variant mb-2">bolt</span>
          <div className="text-sm font-semibold font-headline text-on-surface">Quick Screen</div>
          <div className="text-xs text-outline-variant mt-0.5">
            60-second go/no-go decisions. Pattern recognition drill.
          </div>
        </button>
        <button
          onClick={() => onNavigate("/")}
          className="bg-surface-container-lowest ghost-border rounded-xl p-4 text-left hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-[24px] text-on-surface-variant mb-2">business</span>
          <div className="text-sm font-semibold font-headline text-on-surface">Explore Companies</div>
          <div className="text-xs text-outline-variant mt-0.5">
            Browse all 9 companies. Deep dive any industry.
          </div>
        </button>
      </div>
    </>
  );
}

/* ===== JOURNEY VIEW ===== */
function JourneyView({
  allSteps, currentStepId, getStepStatus, getSubsectionProgress,
  overallStats, pct, onStartLesson, onNavigate,
}) {
  // Group steps by section
  const sectionGroups = useMemo(() => {
    const groups = [];
    let currentTitle = null;
    let currentGroup = null;
    for (const step of allSteps) {
      if (step._sectionTitle !== currentTitle) {
        currentTitle = step._sectionTitle;
        currentGroup = { title: currentTitle, steps: [] };
        groups.push(currentGroup);
      }
      currentGroup.steps.push(step);
    }
    return groups;
  }, [allSteps]);

  return (
    <>
      {/* Journey header */}
      <div className="flex items-center gap-4 mb-7">
        <ProgressRing size={56} pct={pct} strokeWidth={4} fontSize={16} />
        <div>
          <div className="text-lg font-bold font-headline text-on-surface">Your Journey</div>
          <div className="text-sm text-outline-variant">
            {overallStats.completedSteps} of {overallStats.totalSteps} steps complete ... ~{overallStats.remainingTime} min remaining
          </div>
        </div>
      </div>

      {/* Vertical path grouped by section */}
      {sectionGroups.map((group, gi) => (
        <div key={gi} className="mb-6">
          <h4 className="text-[10px] uppercase tracking-widest text-outline-variant font-semibold mb-3 pl-1">
            {group.title}
          </h4>
          <div className="relative pl-7">
            {/* Vertical line */}
            <div className="absolute left-[13px] top-0 bottom-0 w-0.5 bg-outline-variant/20" />

            {group.steps.map((step) => {
              const status = getStepStatus(step);
              const isCurrent = step.id === currentStepId;
              const progress = getSubsectionProgress(step);
              const globalIdx = allSteps.indexOf(step);

              return (
                <div key={step.id} className="relative mb-1.5">
                  {/* Dot */}
                  <div
                    className={`absolute -left-[21px] top-3 w-3.5 h-3.5 rounded-full border-2 z-10 ${
                      status === "completed"
                        ? "bg-on-tertiary-container border-on-tertiary-container"
                        : isCurrent
                        ? "bg-primary border-primary shadow-[0_0_8px_rgba(var(--primary-rgb,160,196,255),0.4)]"
                        : "bg-surface-container-low border-outline-variant/30 opacity-30"
                    }`}
                  />

                  {/* Card */}
                  <div
                    className={`rounded-[10px] px-4 py-2.5 transition-colors ${
                      isCurrent
                        ? "bg-primary/8"
                        : status === "locked"
                        ? "opacity-40"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`text-sm font-medium ${status === "completed" ? "text-on-surface-variant/60" : "text-on-surface"}`}>
                        {status === "completed" && (
                          <span className="text-on-tertiary-container mr-1.5">&#10003;</span>
                        )}
                        {step.title}
                      </div>
                      {progress && status === "completed" && (
                        <span className="text-xs font-semibold text-on-tertiary-container flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          {progress.completed}/{progress.total}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-outline-variant">
                      <span className="material-symbols-outlined text-[13px]">timer</span>
                      {status === "completed" ? `${step.timeEstimate || 8}m` : `~${step.timeEstimate || 8}m`}
                      {isCurrent && <span className="text-primary font-medium">In progress</span>}
                    </div>

                    {/* Skill tags and CTA on active node */}
                    {isCurrent && (
                      <>
                        {step.skillTags && (
                          <div className="flex gap-1.5 flex-wrap mt-2">
                            {step.skillTags.map(tag => (
                              <span key={tag} className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => onStartLesson(step._sectionIndex, step._subsectionIndex)}
                          className="inline-flex items-center gap-1.5 mt-2.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary/15 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                          Continue
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Reference modules */}
      <div className="mt-4 pt-4 border-t border-outline-variant/20">
        <h4 className="text-[10px] uppercase tracking-widest text-outline-variant font-semibold mb-3 pl-1">
          Reference & Practice Modules
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { path: "/learn/concepts", icon: "lightbulb", label: "Key Concepts", desc: "Deep-dive concept cards" },
            { path: "/learn/compare", icon: "compare_arrows", label: "Cross-Industry Compare", desc: "Compare companies side by side" },
            { path: "/learn/levers", icon: "account_tree", label: "Value Creation Levers", desc: "Revenue, margin, multiple, debt" },
            { path: "/learn/bridge", icon: "stacked_bar_chart", label: "Bridge Calculator", desc: "Model value creation waterfalls" },
            { path: "/learn/playbooks", icon: "assignment", label: "Playbooks", desc: "Operating playbooks and frameworks" },
          ].map(m => (
            <button
              key={m.path}
              onClick={() => onNavigate(m.path)}
              className="flex items-center gap-3 bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-left hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">{m.icon}</span>
              <div>
                <div className="text-sm font-medium text-on-surface">{m.label}</div>
                <div className="text-[11px] text-outline-variant">{m.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ===== PROGRESS RING ===== */
function ProgressRing({ size = 90, pct = 0, strokeWidth = 5, fontSize = 20 }) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth={strokeWidth}
          className="stroke-outline-variant/10"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-primary transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-headline font-extrabold text-primary"
        style={{ fontSize }}
      >
        {pct}%
      </div>
    </div>
  );
}
