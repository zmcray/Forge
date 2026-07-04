import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import FocusView from "./FocusView";
import JourneyView from "./JourneyView";

export default function LearnHub({ learnProgress, onStartLesson }) {
  const [activeTab, setActiveTab] = useState("focus");
  const navigate = useNavigate();
  const { getCurrentStep, getStepIndex, getSubsectionProgress, overallStats, allSteps } =
    learnProgress;

  const currentStep = getCurrentStep();
  const currentStepIdx = getStepIndex(currentStep.id);
  const pct =
    overallStats.totalSteps > 0
      ? Math.round((overallStats.completedSteps / overallStats.totalSteps) * 100)
      : 0;

  // First text block as description for the continue card
  const stepDescription = useMemo(() => {
    const textBlock = (currentStep.blocks || []).find((b) => b.type === "text");
    return (
      textBlock?.content?.slice(0, 180) +
        (textBlock?.content?.length > 180 ? "..." : "") || ""
    );
  }, [currentStep]);

  // Objective completion: proportional to exercise completion within the subsection
  const objectiveStatuses = useMemo(() => {
    if (!currentStep.objectives) return [];
    const exercises = (currentStep.blocks || []).filter(
      (b) => b.type === "exercise" || b.type === "calculationExercise",
    );
    const completedCount = exercises.filter((e) => learnProgress.isComplete(e.id)).length;
    const totalExercises = exercises.length;
    // Mark objectives proportionally: if 2/3 exercises done, mark first 2/3 of objectives
    const objCount = currentStep.objectives.length;
    const doneObjectives =
      totalExercises > 0 ? Math.floor((completedCount / totalExercises) * objCount) : 0;
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
