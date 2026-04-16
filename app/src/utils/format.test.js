import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  extractNumericValue,
  formatUnit,
  formatDelta,
  getDeltaBand,
  shuffleArray,
  BAND_COLORS,
  BAND_LABELS,
} from "./format";

describe("formatCurrency", () => {
  it("formats positive values", () => {
    expect(formatCurrency(5.5)).toBe("$5.5M");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.0M");
  });

  it("handles custom decimal places", () => {
    expect(formatCurrency(5.567, 2)).toBe("$5.57M");
    expect(formatCurrency(5.567, 0)).toBe("$6M");
  });

  it("returns fallback for null", () => {
    expect(formatCurrency(null)).toBe("$--");
  });

  it("returns fallback for undefined", () => {
    expect(formatCurrency(undefined)).toBe("$--");
  });

  it("returns fallback for NaN", () => {
    expect(formatCurrency(NaN)).toBe("$--");
  });
});

describe("extractNumericValue", () => {
  it("extracts percentage values", () => {
    const result = extractNumericValue("Adjusted EBITDA margin is ~16.9%");
    expect(result).toEqual({ value: 16.9, unit: "%" });
  });

  it("extracts dollar-M values", () => {
    const result = extractNumericValue("EBITDA of $5.5M");
    expect(result).toEqual({ value: 5.5, unit: "$M" });
  });

  it("extracts multiple values", () => {
    const result = extractNumericValue("Trading at 6.5x EBITDA");
    expect(result).toEqual({ value: 6.5, unit: "x" });
  });

  it("returns null for no match", () => {
    expect(extractNumericValue("No numbers here")).toBeNull();
  });

  it("extracts integer percentages", () => {
    const result = extractNumericValue("Growth of 15%");
    expect(result).toEqual({ value: 15, unit: "%" });
  });

  it("extracts negative percentages", () => {
    expect(extractNumericValue("-5%")).toEqual({ value: -5, unit: "%" });
  });

  it("extracts parenthetical negative dollar values", () => {
    expect(extractNumericValue("($5.0M)")).toEqual({ value: -5.0, unit: "$M" });
  });

  it("extracts comma-separated dollar values", () => {
    expect(extractNumericValue("$1,234.5M")).toEqual({ value: 1234.5, unit: "$M" });
  });

  it("extracts decimal-only percentages", () => {
    expect(extractNumericValue(".5%")).toEqual({ value: 0.5, unit: "%" });
  });

  it("extracts negative multiples", () => {
    expect(extractNumericValue("-3.2x")).toEqual({ value: -3.2, unit: "x" });
  });

  it("extracts parenthetical negative percentages", () => {
    expect(extractNumericValue("(12.5%)")).toEqual({ value: -12.5, unit: "%" });
  });

  it("extracts negative dollar values with dash", () => {
    expect(extractNumericValue("-$5M")).toEqual({ value: -5, unit: "$M" });
  });
});

describe("formatUnit", () => {
  it("formats percentage unit", () => {
    expect(formatUnit("%")).toBe("%");
  });

  it("formats dollar-M unit", () => {
    expect(formatUnit("$M")).toBe("M");
  });

  it("formats multiple unit", () => {
    expect(formatUnit("x")).toBe("x");
  });

  it("returns empty string for unknown", () => {
    expect(formatUnit("bps")).toBe("");
  });
});

describe("formatDelta", () => {
  it("formats positive percentage delta", () => {
    expect(formatDelta(18.5, 16.9, "%")).toBe("+1.6pp");
  });

  it("formats negative percentage delta", () => {
    expect(formatDelta(14.0, 16.9, "%")).toBe("-2.9pp");
  });

  it("formats dollar-M delta", () => {
    expect(formatDelta(6.0, 5.5, "$M")).toBe("+$0.5M");
  });

  it("formats multiple delta", () => {
    expect(formatDelta(5.0, 6.5, "x")).toBe("-1.5x");
  });

  it("formats zero delta", () => {
    expect(formatDelta(5.0, 5.0, "%")).toBe("+0.0pp");
  });

  it("formats negative dollar-M delta with correct sign placement", () => {
    expect(formatDelta(2.5, 5.5, "$M")).toBe("-$3.0M");
  });

  it("formats large negative dollar-M delta", () => {
    expect(formatDelta(1.0, 10.0, "$M")).toBe("-$9.0M");
  });
});

describe("getDeltaBand", () => {
  describe("percentage thresholds", () => {
    it("returns exact for < 0.5pp", () => {
      expect(getDeltaBand(0.3, "%")).toBe("exact");
    });

    it("returns close for 0.5-2pp", () => {
      expect(getDeltaBand(1.5, "%")).toBe("close");
    });

    it("returns off for 2-5pp", () => {
      expect(getDeltaBand(3.0, "%")).toBe("off");
    });

    it("returns way_off for > 5pp", () => {
      expect(getDeltaBand(7.0, "%")).toBe("way_off");
    });

    it("uses absolute value for negatives", () => {
      expect(getDeltaBand(-0.3, "%")).toBe("exact");
      expect(getDeltaBand(-3.0, "%")).toBe("off");
    });
  });

  describe("multiple (x) thresholds", () => {
    it("returns exact for < 0.2x", () => {
      expect(getDeltaBand(0.1, "x")).toBe("exact");
    });

    it("returns close for 0.2-0.5x", () => {
      expect(getDeltaBand(0.3, "x")).toBe("close");
    });

    it("returns off for 0.5-1.5x", () => {
      expect(getDeltaBand(1.0, "x")).toBe("off");
    });

    it("returns way_off for > 1.5x", () => {
      expect(getDeltaBand(2.0, "x")).toBe("way_off");
    });
  });

  describe("dollar-M thresholds", () => {
    it("returns exact for < 0.2M", () => {
      expect(getDeltaBand(0.1, "$M")).toBe("exact");
    });

    it("returns close for 0.2-1M", () => {
      expect(getDeltaBand(0.5, "$M")).toBe("close");
    });

    it("returns off for 1-3M", () => {
      expect(getDeltaBand(2.0, "$M")).toBe("off");
    });

    it("returns way_off for > 3M", () => {
      expect(getDeltaBand(5.0, "$M")).toBe("way_off");
    });
  });
});

describe("BAND_COLORS and BAND_LABELS", () => {
  it("has color for all bands", () => {
    expect(BAND_COLORS.exact).toBeDefined();
    expect(BAND_COLORS.close).toBeDefined();
    expect(BAND_COLORS.off).toBeDefined();
    expect(BAND_COLORS.way_off).toBeDefined();
  });

  it("has label for all bands", () => {
    expect(BAND_LABELS.exact).toBe("Exact");
    expect(BAND_LABELS.close).toBe("Close");
    expect(BAND_LABELS.off).toBe("Off");
    expect(BAND_LABELS.way_off).toBe("Way Off");
  });
});

describe("shuffleArray", () => {
  it("returns a new array with same elements", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result).toHaveLength(5);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("does not mutate the original", () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    shuffleArray(input);
    expect(input).toEqual(copy);
  });

  it("handles empty array", () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it("handles single element", () => {
    expect(shuffleArray([42])).toEqual([42]);
  });
});
