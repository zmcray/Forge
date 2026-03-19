export function formatCurrency(val, decimals = 1) {
  if (val == null || isNaN(val)) return "$--";
  return `$${val.toFixed(decimals)}M`;
}

export function extractNumericValue(text) {
  const pctMatch = text.match(/([\d]+\.?\d*)%/);
  if (pctMatch) return { value: parseFloat(pctMatch[1]), unit: "%" };
  const dollarMatch = text.match(/\$([\d]+\.?\d*)M/);
  if (dollarMatch) return { value: parseFloat(dollarMatch[1]), unit: "$M" };
  const xMatch = text.match(/([\d]+\.?\d*)x/);
  if (xMatch) return { value: parseFloat(xMatch[1]), unit: "x" };
  return null;
}

export function formatUnit(unit) {
  if (unit === "%") return "%";
  if (unit === "$M") return "M";
  if (unit === "x") return "x";
  return "";
}

export function formatDelta(userVal, modelVal, unit) {
  const delta = userVal - modelVal;
  const sign = delta >= 0 ? "+" : "";
  if (unit === "%") return `${sign}${delta.toFixed(1)}pp`;
  if (unit === "$M") return `${sign}$${delta.toFixed(1)}M`;
  if (unit === "x") return `${sign}${delta.toFixed(1)}x`;
  return `${sign}${delta.toFixed(1)}`;
}

// Diagnostic scoring tolerance bands (industry-calibrated)
// Returns: "exact" | "close" | "off" | "way_off"
export function getDeltaBand(delta, unit) {
  const abs = Math.abs(delta);
  if (unit === "%") {
    if (abs < 0.5) return "exact";
    if (abs < 2) return "close";
    if (abs < 5) return "off";
    return "way_off";
  }
  if (unit === "x") {
    if (abs < 0.2) return "exact";
    if (abs < 0.5) return "close";
    if (abs < 1.5) return "off";
    return "way_off";
  }
  if (unit === "$M") {
    if (abs < 0.2) return "exact";
    if (abs < 1) return "close";
    if (abs < 3) return "off";
    return "way_off";
  }
  if (abs < 0.5) return "exact";
  if (abs < 2) return "close";
  if (abs < 5) return "off";
  return "way_off";
}

export const BAND_COLORS = {
  exact: "text-green-600",
  close: "text-amber-600",
  off: "text-orange-600",
  way_off: "text-red-600",
};

export const BAND_LABELS = {
  exact: "Exact",
  close: "Close",
  off: "Off",
  way_off: "Way Off",
};

export function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
