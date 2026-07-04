/**
 * Shape-hardening helpers for persisted localStorage payloads.
 *
 * Top-level shape checks are not enough: `{"cards":{"x":null}}` passes an
 * isRecord(parsed.cards) gate and then crashes the first consumer that does
 * `Object.values(cards).filter((c) => c.lastStudied)`. Sanitize once at load
 * so every consumer downstream can trust inner values are plain objects.
 */

export function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Return a copy of a record map with all non-record inner values dropped.
 * `{a: null, b: "junk", c: {…}}` becomes `{c: {…}}`. Non-record input
 * collapses to an empty map.
 */
export function stripNonRecords(map) {
  if (!isRecord(map)) return {};
  return Object.fromEntries(Object.entries(map).filter(([, v]) => isRecord(v)));
}
