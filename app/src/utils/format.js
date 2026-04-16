export function formatCurrency(val, decimals = 1) {
  if (val == null || isNaN(val)) return "$--";
  return `$${val.toFixed(decimals)}M`;
}

export function extractNumericValue(text) {
  // Matches optional negative sign or parenthetical negatives, optional $, commas, decimals
  const pctMatch = text.match(/[(-]?\s*\$?\s*([\d,]*\.?\d+)\s*%\s*\)?/);
  if (pctMatch) {
    const raw = parseFloat(pctMatch[1].replace(/,/g, ""));
    const neg = /^\(|^-/.test(text.trim());
    return { value: neg ? -raw : raw, unit: "%" };
  }
  const dollarMatch = text.match(/[(-]?\s*\$\s*([\d,]*\.?\d+)\s*M\s*\)?/);
  if (dollarMatch) {
    const raw = parseFloat(dollarMatch[1].replace(/,/g, ""));
    const neg = /\(\s*\$/.test(text) || /-\s*\$/.test(text);
    return { value: neg ? -raw : raw, unit: "$M" };
  }
  const xMatch = text.match(/[(-]?\s*([\d,]*\.?\d+)\s*x\s*\)?/);
  if (xMatch) {
    const raw = parseFloat(xMatch[1].replace(/,/g, ""));
    const neg = /^\(|^-/.test(text.trim());
    return { value: neg ? -raw : raw, unit: "x" };
  }
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
  const sign = delta >= 0 ? "+" : "-";
  const abs = Math.abs(delta);
  if (unit === "%") return `${sign}${abs.toFixed(1)}pp`;
  if (unit === "$M") return `${sign}$${abs.toFixed(1)}M`;
  if (unit === "x") return `${sign}${abs.toFixed(1)}x`;
  return `${sign}${abs.toFixed(1)}`;
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
