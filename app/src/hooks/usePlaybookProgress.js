import { useState, useCallback } from "react";

const STORAGE_KEY = "forge-playbooks";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { playbooks: {} };
  } catch {
    return { playbooks: {} };
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded)
  }
}

export default function usePlaybookProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const getPlaybook = useCallback(
    (playbookId) =>
      progress.playbooks[playbookId] || {
        notes: "",
        lastVisited: null,
        exerciseAttempted: false,
        exerciseScore: null,
        goldenYearGuess: null,
      },
    [progress]
  );

  const markVisited = useCallback((playbookId) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        playbooks: {
          ...prev.playbooks,
          [playbookId]: {
            ...prev.playbooks[playbookId],
            lastVisited: new Date().toISOString(),
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const markExerciseAttempted = useCallback((playbookId, score = null) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        playbooks: {
          ...prev.playbooks,
          [playbookId]: {
            ...prev.playbooks[playbookId],
            exerciseAttempted: true,
            exerciseScore: score,
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const setPlaybookNotes = useCallback((playbookId, text) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        playbooks: {
          ...prev.playbooks,
          [playbookId]: {
            ...prev.playbooks[playbookId],
            notes: text,
            lastUpdated: new Date().toISOString(),
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const setGoldenYearGuess = useCallback((playbookId, guess) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        playbooks: {
          ...prev.playbooks,
          [playbookId]: {
            ...prev.playbooks[playbookId],
            goldenYearGuess: guess,
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const getVisitedCount = useCallback(
    () => Object.values(progress.playbooks).filter((p) => p.lastVisited).length,
    [progress]
  );

  const getExerciseCount = useCallback(
    () => Object.values(progress.playbooks).filter((p) => p.exerciseAttempted).length,
    [progress]
  );

  return {
    getPlaybook,
    markVisited,
    markExerciseAttempted,
    setPlaybookNotes,
    setGoldenYearGuess,
    getVisitedCount,
    getExerciseCount,
  };
}
