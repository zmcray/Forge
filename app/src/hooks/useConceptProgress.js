import { useState, useCallback } from "react";

const STORAGE_KEY = "forge-concepts";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { cards: {} };
  } catch {
    return { cards: {} };
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded)
  }
}

export default function useConceptProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const getCard = useCallback(
    (cardId) => progress.cards[cardId] || { notes: "", lastStudied: null, practiceAttempted: false },
    [progress]
  );

  const markStudied = useCallback((cardId) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        cards: {
          ...prev.cards,
          [cardId]: {
            ...prev.cards[cardId],
            lastStudied: new Date().toISOString(),
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const markPracticeAttempted = useCallback((cardId) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        cards: {
          ...prev.cards,
          [cardId]: {
            ...prev.cards[cardId],
            practiceAttempted: true,
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const setCardNotes = useCallback((cardId, text) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        cards: {
          ...prev.cards,
          [cardId]: {
            ...prev.cards[cardId],
            notes: text,
            lastUpdated: new Date().toISOString(),
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const getStudiedCount = useCallback(
    () => Object.values(progress.cards).filter((c) => c.lastStudied).length,
    [progress]
  );

  const getPracticeCount = useCallback(
    () => Object.values(progress.cards).filter((c) => c.practiceAttempted).length,
    [progress]
  );

  return {
    getCard,
    markStudied,
    markPracticeAttempted,
    setCardNotes,
    getStudiedCount,
    getPracticeCount,
  };
}
