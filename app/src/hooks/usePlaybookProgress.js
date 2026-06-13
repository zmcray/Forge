import { useState, useCallback } from "react";

const STORAGE_KEY = "forge-playbooks";
const DEFAULT_STATE = { playbooks: {} };
const DEFAULT_PLAYBOOK = {
  notes: "",
  lastVisited: null,
  exerciseAttempted: false,
  exerciseScore: null,
  goldenYearGuess: null,
};

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getPlaybooks(progress) {
  return isRecord(progress?.playbooks) ? progress.playbooks : {};
}

function loadProgress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return isRecord(parsed) && isRecord(parsed.playbooks) ? parsed : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
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
    (playbookId) => getPlaybooks(progress)[playbookId] || DEFAULT_PLAYBOOK,
    [progress],
  );

  const markVisited = useCallback((playbookId) => {
    setProgress((prev) => {
      const playbooks = getPlaybooks(prev);
      const next = {
        ...prev,
        playbooks: {
          ...playbooks,
          [playbookId]: {
            ...playbooks[playbookId],
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
      const playbooks = getPlaybooks(prev);
      const next = {
        ...prev,
        playbooks: {
          ...playbooks,
          [playbookId]: {
            ...playbooks[playbookId],
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
      const playbooks = getPlaybooks(prev);
      const next = {
        ...prev,
        playbooks: {
          ...playbooks,
          [playbookId]: {
            ...playbooks[playbookId],
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
      const playbooks = getPlaybooks(prev);
      const next = {
        ...prev,
        playbooks: {
          ...playbooks,
          [playbookId]: {
            ...playbooks[playbookId],
            goldenYearGuess: guess,
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const getVisitedCount = useCallback(
    () => Object.values(getPlaybooks(progress)).filter((p) => p.lastVisited).length,
    [progress],
  );

  const getExerciseCount = useCallback(
    () => Object.values(getPlaybooks(progress)).filter((p) => p.exerciseAttempted).length,
    [progress],
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
