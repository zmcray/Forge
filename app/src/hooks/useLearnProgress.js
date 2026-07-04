import { useMemo } from "react";
import { LEARN_CONTENT } from "../data/learnContent";
import { createStore, useStore } from "./progressStore";

const STORAGE_KEY = "forge-learn-progress";
const DEFAULT_STATE = { completedExercises: [], visitedSubsections: [] };

/** Flat list of all subsections across all sections, with parent section index. */
function flattenSubsections() {
  const flat = [];
  for (let si = 0; si < LEARN_CONTENT.length; si++) {
    const section = LEARN_CONTENT[si];
    for (let ssi = 0; ssi < section.subsections.length; ssi++) {
      flat.push({ ...section.subsections[ssi], _sectionIndex: si, _subsectionIndex: ssi, _sectionTitle: section.title });
    }
  }
  return flat;
}

const ALL_STEPS = flattenSubsections();

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.completedExercises) || !Array.isArray(parsed.visitedSubsections)) {
      console.warn(`[Forge] Invalid shape in ${STORAGE_KEY}, resetting`);
      return DEFAULT_STATE;
    }
    return parsed;
  } catch (err) {
    console.warn(`[Forge] Corrupt data in ${STORAGE_KEY}, resetting:`, err.message);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) localStorage.setItem(`${STORAGE_KEY}-corrupt-backup`, raw);
    } catch {}
    return DEFAULT_STATE;
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn(`[Forge] Failed to save ${STORAGE_KEY}:`, err.message);
  }
}

function exercisesOf(subsection) {
  return (subsection.blocks || []).filter(
    (b) => b.type === "exercise" || b.type === "calculationExercise",
  );
}

// Shared module-level store: App.jsx's copy and the Learn module's copy see the
// same state, so the home-screen ModuleCard no longer goes stale after learn
// activity (MCR-423).
const store = createStore({ load: loadProgress, save: saveProgress });

// Module-stable mutators: safe in effect deps, shared across all instances.
const markComplete = (exerciseId) =>
  store.setState((prev) => {
    if (prev.completedExercises.includes(exerciseId)) return prev;
    return { ...prev, completedExercises: [...prev.completedExercises, exerciseId] };
  });

const markVisited = (subsectionId) =>
  store.setState((prev) => {
    if (prev.visitedSubsections.includes(subsectionId)) return prev;
    return { ...prev, visitedSubsections: [...prev.visitedSubsections, subsectionId] };
  });

const resetSubsection = (subsection) => {
  const exerciseIds = exercisesOf(subsection).map((b) => b.id);
  if (exerciseIds.length === 0) return;
  store.setState((prev) => ({
    ...prev,
    completedExercises: prev.completedExercises.filter((id) => !exerciseIds.includes(id)),
  }));
};

/** Returns 0-based index of a subsection in the flat step list. */
const getStepIndex = (subsectionId) => ALL_STEPS.findIndex((s) => s.id === subsectionId);

export default function useLearnProgress() {
  const progress = useStore(store);

  // Stable return identity: consumers use this object (or its members) as
  // useMemo/useEffect deps, so a fresh object every render defeats memoization.
  return useMemo(() => {
    const { completedExercises, visitedSubsections } = progress;

    const isComplete = (exerciseId) => completedExercises.includes(exerciseId);
    const isVisited = (subsectionId) => visitedSubsections.includes(subsectionId);

    const getSubsectionProgress = (subsection) => {
      const exercises = exercisesOf(subsection);
      if (exercises.length === 0) return null;
      const completed = exercises.filter((e) => completedExercises.includes(e.id)).length;
      return { completed, total: exercises.length };
    };

    /** Returns the first subsection with incomplete exercises, or last if all done. */
    const getCurrentStep = () => {
      for (const step of ALL_STEPS) {
        const exercises = exercisesOf(step);
        if (exercises.length === 0) {
          if (!visitedSubsections.includes(step.id)) return step;
          continue;
        }
        const done = exercises.filter((e) => completedExercises.includes(e.id)).length;
        if (done < exercises.length) return step;
      }
      return ALL_STEPS[ALL_STEPS.length - 1];
    };

    /** Returns whether a subsection is completed, in-progress, or locked. */
    const getStepStatus = (subsection) => {
      const exercises = exercisesOf(subsection);
      if (exercises.length === 0) {
        return visitedSubsections.includes(subsection.id) ? "completed" : "locked";
      }
      const done = exercises.filter((e) => completedExercises.includes(e.id)).length;
      if (done === exercises.length) return "completed";
      if (done > 0 || visitedSubsections.includes(subsection.id)) return "active";
      return "locked";
    };

    /** Aggregate stats for the hub. */
    let completedSteps = 0;
    let completedExercisesCount = 0;
    let totalExercises = 0;
    let totalTimeEstimate = 0;
    let completedTimeEstimate = 0;
    for (const step of ALL_STEPS) {
      const exercises = exercisesOf(step);
      totalExercises += exercises.length;
      totalTimeEstimate += step.timeEstimate || 8;
      const done = exercises.filter((e) => completedExercises.includes(e.id)).length;
      completedExercisesCount += done;
      if (exercises.length > 0 && done === exercises.length) {
        completedSteps++;
        completedTimeEstimate += step.timeEstimate || 8;
      } else if (exercises.length === 0 && visitedSubsections.includes(step.id)) {
        completedSteps++;
        completedTimeEstimate += step.timeEstimate || 8;
      }
    }
    const overallStats = {
      completedSteps,
      totalSteps: ALL_STEPS.length,
      completedExercises: completedExercisesCount,
      totalExercises,
      remainingTime: totalTimeEstimate - completedTimeEstimate,
    };

    return {
      markComplete, isComplete, markVisited, isVisited,
      getSubsectionProgress, resetSubsection, progress,
      getCurrentStep, getStepIndex, getStepStatus, overallStats, allSteps: ALL_STEPS,
    };
  }, [progress]);
}

export { loadProgress, saveProgress };
