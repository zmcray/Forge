import { useState, useCallback } from "react";

const STORAGE_KEY = "forge-learn-progress";
const DEFAULT_STATE = { completedExercises: [], visitedSubsections: [] };

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

  return { markComplete, isComplete, markVisited, isVisited, getSubsectionProgress, resetSubsection, progress };
}

export { loadProgress, saveProgress };
