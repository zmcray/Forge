// Deep merge base company data with scenario overlay.
// Validates that all overlay paths exist in the base.
export function mergeScenario(base, overlay) {
  const merged = structuredClone(base);

  if (overlay.patches) {
    applyPatches(merged, overlay.patches, []);
  }

  // Replace questions if scenario provides them
  if (overlay.questions) {
    merged.questions = overlay.questions;
  }

  // Add scenario metadata
  merged._scenarioId = overlay.id;
  merged._scenarioName = overlay.name;
  merged._scenarioDescription = overlay.description;
  merged._baseCompanyId = base.id;

  return merged;
}

function applyPatches(target, patches, path) {
  for (const [key, value] of Object.entries(patches)) {
    const currentPath = [...path, key];

    if (!(key in target)) {
      throw new Error(
        `Scenario patch error: path "${currentPath.join(".")}" does not exist in base company data. ` +
        `Check for typos in the scenario overlay.`
      );
    }

    if (value !== null && typeof value === "object" && !Array.isArray(value) &&
        typeof target[key] === "object" && !Array.isArray(target[key])) {
      applyPatches(target[key], value, currentPath);
    } else {
      target[key] = value;
    }
  }
}

// Validate that merged scenario data doesn't contain NaN or null in numeric fields
export function validateMergedData(company) {
  const issues = [];

  function check(obj, path) {
    for (const [key, value] of Object.entries(obj)) {
      const p = `${path}.${key}`;
      if (typeof value === "number" && isNaN(value)) {
        issues.push(`NaN at ${p}`);
      }
      if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        check(value, p);
      }
    }
  }

  check(company, "company");
  return issues;
}
