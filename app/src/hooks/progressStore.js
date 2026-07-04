import { useSyncExternalStore } from "react";
import { isRecord, stripNonRecords } from "../utils/normalizeRecordMap";
import { loadJSON, saveJSON } from "../utils/storage";

/**
 * Module-level shared store over a localStorage key.
 *
 * Every hook instance backed by the same store shares one state snapshot and
 * re-renders on any write, killing the per-instance-useState class of bugs:
 * stale copies (App.jsx home screen) and lost writes (useNotes full-object
 * saves clobbering another instance's notes).
 *
 * Load is lazy (first snapshot read) and invalidated when the last subscriber
 * unmounts, so tests that reset localStorage between renders get a fresh read.
 */
export function createStore({ load, save }) {
  let state;
  let loaded = false;
  const listeners = new Set();

  const getSnapshot = () => {
    if (!loaded) {
      state = load();
      loaded = true;
    }
    return state;
  };

  const setState = (updater) => {
    const prev = getSnapshot();
    const next = typeof updater === "function" ? updater(prev) : updater;
    if (next === prev) return; // bail-out: no save, no notify
    state = next;
    save(next);
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      // Reload from storage on next mount once nobody is watching.
      if (listeners.size === 0) loaded = false;
    };
  };

  return { getSnapshot, setState, subscribe };
}

/** Subscribe a component to a store created by createStore. */
export function useStore(store) {
  return useSyncExternalStore(store.subscribe, store.getSnapshot);
}

/**
 * Store specialized for the entity-progress shape shared by the concept,
 * lever, playbook, and bridge hooks: `{ [containerKey]: { [id]: record } }`
 * persisted under storageKey, with corrupt shapes collapsing to the default
 * and garbage inner values stripped once at load (see normalizeRecordMap).
 */
export function createProgressStore({ storageKey, containerKey }) {
  const DEFAULT_STATE = { [containerKey]: {} };

  const load = () => {
    const parsed = loadJSON(storageKey, {
      validate: (data) => isRecord(data) && isRecord(data[containerKey]),
      fallback: DEFAULT_STATE,
    });
    if (parsed === DEFAULT_STATE) return DEFAULT_STATE;
    // Null/garbage inner values crash count consumers; strip once at load.
    return { ...parsed, [containerKey]: stripNonRecords(parsed[containerKey]) };
  };

  const save = (data) => saveJSON(storageKey, data);

  const store = createStore({ load, save });

  const getRecords = (snapshot) =>
    isRecord(snapshot?.[containerKey]) ? snapshot[containerKey] : {};

  /** Merge a patch (object, or function of the existing record) into one record. */
  const patchRecord = (id, patch) => {
    store.setState((prev) => {
      const records = getRecords(prev);
      const existing = isRecord(records[id]) ? records[id] : {};
      const changes = typeof patch === "function" ? patch(existing) : patch;
      return {
        ...prev,
        [containerKey]: { ...records, [id]: { ...existing, ...changes } },
      };
    });
  };

  return { ...store, getRecords, patchRecord };
}
