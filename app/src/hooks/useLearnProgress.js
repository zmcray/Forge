import { useState, useCallback, useMemo } from "react";
import { LEARN_CONTENT } from "../data/learnContent";

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

export default function useLearnProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const markComplete = useCallback((exerciseId) => {
    setProgress(prev => {
      if (prev.completedExercises.includes(exerciseId)) return prev;
      const next = {
        ...prev,
        completedExercises: [...prev.completedExercises, exerciseId],
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const isComplete = useCallback((exerciseId) => {
    return progress.completedExercises.includes(exerciseId);
  }, [progress.completedExercises]);

  const markVisited = useCallback((subsectionId) => {
    setProgress(prev => {
      if (prev.visitedSubsections.includes(subsectionId)) return prev;
      const next = {
        ...prev,
        visitedSubsections: [...prev.visitedSubsections, subsectionId],
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const isVisited = useCallback((subsectionId) => {
    return progress.visitedSubsections.includes(subsectionId);
  }, [progress.visitedSubsections]);

  const getSubsectionProgress = useCallback((subsection) => {
    const exercises = (subsection.blocks || []).filter(b => b.type === "exercise" || b.type === "calculationExercise");
    if (exercises.length === 0) return null;
    const completed = exercises.filter(e => progress.completedExercises.includes(e.id)).length;
    return { completed, total: exercises.length };
  }, [progress.completedExercises]);

  const resetSubsection = useCallback((subsection) => {
    const exerciseIds = (subsection.blocks || [])
      .filter(b => b.type === "exercise" || b.type === "calculationExercise")
      .map(b => b.id);
    if (exerciseIds.length === 0) return;
    setProgress(prev => {
      const next = {
        ...prev,
        completedExercises: prev.completedExercises.filter(id => !exerciseIds.includes(id)),
      };
      saveProgress(next);
      return next;
    });
  }, []);

  /** Returns the first subsection with incomplete exercises, or last if all done. */
  const getCurrentStep = useCallback(() => {
    for (const step of ALL_STEPS) {
      const exercises = (step.blocks || []).filter(b => b.type === "exercise" || b.type === "calculationExercise");
      if (exercises.length === 0) {
        if (!progress.visitedSubsections.includes(step.id)) return step;
        continue;
      }
      const done = exercises.filter(e => progress.completedExercises.includes(e.id)).length;
      if (done < exercises.length) return step;
    }
    return ALL_STEPS[ALL_STEPS.length - 1];
  }, [progress.completedExercises, progress.visitedSubsections]);

  /** Returns 0-based index of a subsection in the flat step list. */
  const getStepIndex = useCallback((subsectionId) => {
    return ALL_STEPS.findIndex(s => s.id === subsectionId);
  }, []);

  /** Returns whether a subsection is completed, in-progress, or locked. */
  const getStepStatus = useCallback((subsection) => {
    const exercises = (subsection.blocks || []).filter(b => b.type === "exercise" || b.type === "calculationExercise");
    if (exercises.length === 0) {
      return progress.visitedSubsections.includes(subsection.id) ? "completed" : "locked";
    }
    const done = exercises.filter(e => progress.completedExercises.includes(e.id)).length;
    if (done === exercises.length) return "completed";
    if (done > 0 || progress.visitedSubsections.includes(subsection.id)) return "active";
    return "locked";
  }, [progress.completedExercises, progress.visitedSubsections]);

  /** Aggregate stats for the hub. */
  const overallStats = useMemo(() => {
    let completedSteps = 0;
    let completedExercises = 0;
    let totalExercises = 0;
    let totalTimeEstimate = 0;
    let completedTimeEstimate = 0;
    for (const step of ALL_STEPS) {
      const exercises = (step.blocks || []).filter(b => b.type === "exercise" || b.type === "calculationExercise");
      totalExercises += exercises.length;
      totalTimeEstimate += step.timeEstimate || 8;
      const done = exercises.filter(e => progress.completedExercises.includes(e.id)).length;
      completedExercises += done;
      if (exercises.length > 0 && done === exercises.length) {
        completedSteps++;
        completedTimeEstimate += step.timeEstimate || 8;
      } else if (exercises.length === 0 && progress.visitedSubsections.includes(step.id)) {
        completedSteps++;
        completedTimeEstimate += step.timeEstimate || 8;
      }
    }
    return {
      completedSteps,
      totalSteps: ALL_STEPS.length,
      completedExercises,
      totalExercises,
      remainingTime: totalTimeEstimate - completedTimeEstimate,
    };
  }, [progress.completedExercises, progress.visitedSubsections]);

  return {
    markComplete, isComplete, markVisited, isVisited,
    getSubsectionProgress, resetSubsection, progress,
    getCurrentStep, getStepIndex, getStepStatus, overallStats, allSteps: ALL_STEPS,
  };
}

export { loadProgress, saveProgress };
