import { useState, useCallback } from "react";

const STORAGE_KEY = "forge-learn-progress";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completedExercises: [], visitedSubsections: [] };
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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
    const exercises = (subsection.blocks || []).filter(b => b.type === "exercise");
    if (exercises.length === 0) return null;
    const completed = exercises.filter(e => progress.completedExercises.includes(e.id)).length;
    return { completed, total: exercises.length };
  }, [progress.completedExercises]);

  return { markComplete, isComplete, markVisited, isVisited, getSubsectionProgress };
}
