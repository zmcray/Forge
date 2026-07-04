import { useState, useCallback } from "react";
import { isRecord, stripNonRecords } from "../utils/normalizeRecordMap";

const STORAGE_KEY = "forge-concepts";
const DEFAULT_STATE = { cards: {} };
const DEFAULT_CARD = { notes: "", lastStudied: null, practiceAttempted: false };

function getCards(progress) {
  return isRecord(progress?.cards) ? progress.cards : {};
}

function loadProgress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!isRecord(parsed) || !isRecord(parsed.cards)) return DEFAULT_STATE;
    // Null/garbage inner values crash count consumers; strip once at load.
    return { ...parsed, cards: stripNonRecords(parsed.cards) };
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

export default function useConceptProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const getCard = useCallback(
    (cardId) => getCards(progress)[cardId] || DEFAULT_CARD,
    [progress],
  );

  const markStudied = useCallback((cardId) => {
    setProgress((prev) => {
      const cards = getCards(prev);
      const next = {
        ...prev,
        cards: {
          ...cards,
          [cardId]: {
            ...cards[cardId],
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
      const cards = getCards(prev);
      const next = {
        ...prev,
        cards: {
          ...cards,
          [cardId]: {
            ...cards[cardId],
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
      const cards = getCards(prev);
      const next = {
        ...prev,
        cards: {
          ...cards,
          [cardId]: {
            ...cards[cardId],
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
    () => Object.values(getCards(progress)).filter((c) => c.lastStudied).length,
    [progress],
  );

  const getPracticeCount = useCallback(
    () => Object.values(getCards(progress)).filter((c) => c.practiceAttempted).length,
    [progress],
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
