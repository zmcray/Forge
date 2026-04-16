/**
 * Resolves a dotted path against a company data object.
 * resolveDataPath(company, "keyMetrics.customerConcentration") => 12
 * resolveDataPath(company, "incomeStatement.revenue") => [28.1, 32.5]
 * Returns undefined if the path does not resolve.
 */
const BLOCKED = new Set(["__proto__", "constructor", "prototype"]);

export function resolveDataPath(company, path) {
  const parts = path.split(".");
  let current = company;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    if (BLOCKED.has(part)) return undefined;
    current = current[part];
  }
  return current;
}
