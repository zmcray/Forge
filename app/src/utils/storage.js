/**
 * Canonical localStorage persistence seam (MCR-416).
 *
 * One error contract for every persisted key, replacing the hand-rolled
 * try/getItem/parse/validate/fallback blocks that had drifted into three
 * divergent strategies. The contract:
 *
 * - Missing key: return fallback silently (first run is not an error).
 * - Corrupt JSON or failed validate: console.warn with the key and reason,
 *   preserve the raw bytes under `<key>-corrupt-backup` (recovery path,
 *   matches the useScoring/useLearnProgress convention), return fallback.
 * - Save failure (quota, disabled storage, unserializable value): warn.
 *   Never silent; in-memory state still advances, persistence just degrades.
 */

const resolveFallback = (fallback) =>
  typeof fallback === "function" ? fallback() : fallback;

/** Best-effort raw-bytes backup of a corrupt payload. Failure to back up never blocks the reset. */
function backupCorrupt(key, backupKey) {
  try {
    const raw = localStorage.getItem(key);
    if (raw != null) localStorage.setItem(backupKey ?? `${key}-corrupt-backup`, raw);
  } catch (err) {
    console.warn(`[Forge] Could not back up corrupt ${key}:`, err.message);
  }
}

/**
 * Load and parse a JSON payload from localStorage.
 *
 * @param {string} key
 * @param {Object} options
 * @param {(parsed: unknown) => boolean} [options.validate]  shape check; falsy result treats the payload as corrupt
 * @param {*} [options.fallback]  value (or lazy factory) returned when the key is absent or corrupt
 * @param {string} [options.backupKey]  override for the corrupt-backup key (default `<key>-corrupt-backup`)
 */
export function loadJSON(key, { validate, fallback, backupKey } = {}) {
  let raw;
  try {
    raw = localStorage.getItem(key);
  } catch (err) {
    console.warn(`[Forge] Could not read ${key}:`, err.message);
    return resolveFallback(fallback);
  }
  if (raw == null) return resolveFallback(fallback);

  try {
    const parsed = JSON.parse(raw);
    if (validate && !validate(parsed)) {
      console.warn(`[Forge] Invalid shape in ${key}, resetting`);
      backupCorrupt(key, backupKey);
      return resolveFallback(fallback);
    }
    return parsed;
  } catch (err) {
    console.warn(`[Forge] Corrupt data in ${key}, resetting:`, err.message);
    backupCorrupt(key, backupKey);
    return resolveFallback(fallback);
  }
}

/** Serialize and persist a JSON payload. Warns (never silent) on quota/serialization failure. */
export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[Forge] Failed to save ${key}:`, err.message);
  }
}

/**
 * Load a plain-string value (enum-style keys like theme or chat mode).
 * No corrupt-backup: the raw value is tiny and already human-readable in the warn.
 */
export function loadString(key, { validate, fallback } = {}) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return resolveFallback(fallback);
    if (validate && !validate(raw)) {
      console.warn(`[Forge] Invalid value in ${key} ("${raw}"), resetting`);
      return resolveFallback(fallback);
    }
    return raw;
  } catch (err) {
    console.warn(`[Forge] Could not read ${key}:`, err.message);
    return resolveFallback(fallback);
  }
}

/** Persist a plain-string value. Warns (never silent) on failure. */
export function saveString(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`[Forge] Failed to save ${key}:`, err.message);
  }
}
