import { useMemo } from "react";
import { LEARN_INDEX } from "../data/learnIndex";
import { createStore, useStore } from "./progressStore";
import { loadJSON, saveJSON } from "../utils/storage";

const STORAGE_KEY = "forge-learn-progress";
const DEFAULT_STATE = { completedExercises: [], visitedSubsections: [] };

/** Flat list of all index subsections across all sections, with parent section index. */
function flattenSubsections() {
  const flat = [];
  for (let si = 0; si < LEARN_INDEX.length; si++) {
    const section = LEARN_INDEX[si];
    for (let ssi = 0; ssi < section.subsections.length; ssi++) {
      flat.push({ ...section.subsections[ssi], _sectionIndex: si, _subsectionIndex: ssi, _sectionTitle: section.title });
    }
  }
  return flat;
}

const ALL_STEPS = flattenSubsections();
const STEPS_BY_ID = new Map(ALL_STEPS.map((s) => [s.id, s]));

function loadProgress() {
  return loadJSON(STORAGE_KEY, {
    validate: (parsed) =>
      Array.isArray(parsed?.completedExercises) && Array.isArray(parsed?.visitedSubsections),
    fallback: DEFAULT_STATE,
  });
}

function saveProgress(progress) {
  saveJSON(STORAGE_KEY, progress);
}

/**
 * Exercise ids for a subsection. Accepts either a full learnContent subsection
 * or a lightweight index entry; resolution goes through the index by id so the
 * eager bundle never needs learnContent's block bodies.
 */
function exerciseIdsOf(subsection) {
  return STEPS_BY_ID.get(subsection.id)?.exerciseIds ?? [];
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
  const exerciseIds = exerciseIdsOf(subsection);
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
      const exerciseIds = exerciseIdsOf(subsection);
      if (exerciseIds.length === 0) return null;
      const completed = exerciseIds.filter((id) => completedExercises.includes(id)).length;
      return { completed, total: exerciseIds.length };
    };

    /** Returns the first subsection with incomplete exercises, or last if all done. */
    const getCurrentStep = () => {
      for (const step of ALL_STEPS) {
        if (step.exerciseIds.length === 0) {
          if (!visitedSubsections.includes(step.id)) return step;
          continue;
        }
        const done = step.exerciseIds.filter((id) => completedExercises.includes(id)).length;
        if (done < step.exerciseIds.length) return step;
      }
      return ALL_STEPS[ALL_STEPS.length - 1];
    };

    /** Returns whether a subsection is completed, in-progress, or locked. */
    const getStepStatus = (subsection) => {
      const exerciseIds = exerciseIdsOf(subsection);
      if (exerciseIds.length === 0) {
        return visitedSubsections.includes(subsection.id) ? "completed" : "locked";
      }
      const done = exerciseIds.filter((id) => completedExercises.includes(id)).length;
      if (done === exerciseIds.length) return "completed";
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
      totalExercises += step.exerciseIds.length;
      totalTimeEstimate += step.timeEstimate || 8;
      const done = step.exerciseIds.filter((id) => completedExercises.includes(id)).length;
      completedExercisesCount += done;
      if (step.exerciseIds.length > 0 && done === step.exerciseIds.length) {
        completedSteps++;
        completedTimeEstimate += step.timeEstimate || 8;
      } else if (step.exerciseIds.length === 0 && visitedSubsections.includes(step.id)) {
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
