// Second arg accepts a bare number (legacy decimals positional) or an options object.
function normalizeOpts(opts) {
  return typeof opts === "number" ? { decimals: opts } : opts;
}

// Sign convention shared by all formatters: negatives always carry "-",
// `signed: true` adds "+" for strictly positive values, zero stays unsigned.
function signPrefix(val, signed) {
  if (val < 0) return "-";
  return signed && val > 0 ? "+" : "";
}

export function formatCurrency(val, opts = {}) {
  const { decimals = 1, signed = false } = normalizeOpts(opts);
  if (val == null || isNaN(val)) return "$--";
  return `${signPrefix(val, signed)}$${Math.abs(val).toFixed(decimals)}M`;
}

export function formatPercent(val, { decimals = 1, signed = false } = {}) {
  if (val == null || isNaN(val)) return "--%";
  return `${signPrefix(val, signed)}${Math.abs(val).toFixed(decimals)}%`;
}

export function formatMultiple(val, { decimals = 1, signed = false } = {}) {
  if (val == null || isNaN(val)) return "--x";
  return `${signPrefix(val, signed)}${Math.abs(val).toFixed(decimals)}x`;
}

export function formatCurrencyK(valInMillions, decimals = 0) {
  if (valInMillions == null || isNaN(valInMillions)) return "$--";
  const k = valInMillions * 1000;
  return `$${k.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}K`;
}

export function formatDataPoint(value, path) {
  if (value == null) return "N/A";
  if (Array.isArray(value)) value = value[value.length - 1];
  if (path === "keyMetrics.avgRevenuePerEmployee") return formatCurrencyK(value);
  return value;
}

export function extractNumericValue(text) {
  // Days first: working-capital answers like "DSO = ($6.8M / $48.2M) x 365 = 51.5 days"
  // would otherwise match the $M inside the formula. Word-boundary on "days?" avoids
  // false positives like "45-day benchmark".
  const daysMatch = text.match(/([\d,]*\.?\d+)\s*days?\b/i);
  if (daysMatch) {
    return { value: parseFloat(daysMatch[1].replace(/,/g, "")), unit: "days" };
  }
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
  if (unit === "days") return " days";
  return "";
}

export function formatDelta(userVal, modelVal, unit) {
  const delta = userVal - modelVal;
  const sign = delta >= 0 ? "+" : "-";
  const abs = Math.abs(delta);
  if (unit === "%") return `${sign}${abs.toFixed(1)}pp`;
  if (unit === "$M") return `${sign}$${abs.toFixed(1)}M`;
  if (unit === "x") return `${sign}${abs.toFixed(1)}x`;
  if (unit === "days") return `${sign}${abs.toFixed(1)} days`;
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
  if (unit === "days") {
    // Working-capital days metrics (DSO/DIO/DPO/CCC). Healthy bands sit in the 30-45 day
    // range, so a few days off is "close", but >15 days is a real miscalc.
    if (abs < 2) return "exact";
    if (abs < 5) return "close";
    if (abs < 15) return "off";
    return "way_off";
  }
  if (abs < 0.5) return "exact";
  if (abs < 2) return "close";
  if (abs < 5) return "off";
  return "way_off";
}

export const BAND_COLORS = {
  exact: "text-green-600 dark:text-green-400",
  close: "text-amber-600 dark:text-amber-400",
  off: "text-orange-600 dark:text-orange-400",
  way_off: "text-red-600 dark:text-red-400",
};

export const BAND_CHIP_COLORS = {
  exact: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  close: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  off: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
  way_off: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
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
