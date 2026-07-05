import { createStore } from "./progressStore";
import { isRecord, stripNonRecords } from "../utils/normalizeRecordMap";
import { loadJSON, saveJSON } from "../utils/storage";
import { DEFAULT_SRS_STATE, processScores } from "../utils/srs";

/**
 * Shared store for SRS scheduling state, persisted under its OWN key
 * (`forge-srs`), not inside `forge-data`: scores are the record of what
 * happened, SRS state is derived-but-stateful scheduling that can be rebuilt
 * or reset without touching the score-of-record.
 *
 * Shape: { version: 1, atoms: { [atomId]: atom }, lastProcessed: ISO | null }
 */
export const SRS_STORAGE_KEY = "forge-srs";

const load = () => {
  const parsed = loadJSON(SRS_STORAGE_KEY, {
    validate: (data) => isRecord(data) && isRecord(data.atoms),
    fallback: DEFAULT_SRS_STATE,
  });
  if (parsed === DEFAULT_SRS_STATE) return DEFAULT_SRS_STATE;
  return {
    version: 1,
    atoms: stripNonRecords(parsed.atoms),
    lastProcessed: typeof parsed.lastProcessed === "string" ? parsed.lastProcessed : null,
  };
};

export const srsStore = createStore({
  load,
  save: (data) => saveJSON(SRS_STORAGE_KEY, data),
});

/**
 * Fold score entries (from forge-data sessions) into SRS state. Watermarked
 * and idempotent: with nothing new, processScores returns the same reference
 * and the store bails out without saving or notifying.
 */
export const ingestScores = (scores) =>
  srsStore.setState((prev) => processScores(prev, scores));
