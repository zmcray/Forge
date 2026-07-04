import { useMemo } from "react";
import { createProgressStore, useStore } from "./progressStore";

const DEFAULT_CARD = { notes: "", lastStudied: null, practiceAttempted: false };

const store = createProgressStore({ storageKey: "forge-concepts", containerKey: "cards" });

// Module-stable mutators: safe in effect deps, shared across all instances.
const markStudied = (cardId) => store.patchRecord(cardId, { lastStudied: new Date().toISOString() });
const markPracticeAttempted = (cardId) => store.patchRecord(cardId, { practiceAttempted: true });
const setCardNotes = (cardId, text) =>
  store.patchRecord(cardId, { notes: text, lastUpdated: new Date().toISOString() });

export default function useConceptProgress() {
  const progress = useStore(store);

  return useMemo(() => {
    const cards = store.getRecords(progress);
    return {
      getCard: (cardId) => cards[cardId] || DEFAULT_CARD,
      markStudied,
      markPracticeAttempted,
      setCardNotes,
      getStudiedCount: () => Object.values(cards).filter((c) => c.lastStudied).length,
      getPracticeCount: () => Object.values(cards).filter((c) => c.practiceAttempted).length,
    };
  }, [progress]);
}
