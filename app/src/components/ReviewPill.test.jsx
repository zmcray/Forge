// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/renderWithProviders";
import ReviewPill from "./ReviewPill";

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

const iso = (offsetDays) => new Date(Date.now() + offsetDays * 86400000).toISOString();

const dueAtom = (atomType = "concept") => ({
  atomType,
  ease: 2.5,
  interval: 1,
  nextDue: iso(-2),
  lastSeen: iso(-3),
  consecutiveFails: 0,
  history: [{ score: 4, timestamp: iso(-3) }],
});

function seedSrs(atoms) {
  localStorage.setItem(
    "forge-srs",
    JSON.stringify({ version: 1, atoms, lastProcessed: iso(-3) }),
  );
}

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe("ReviewPill", () => {
  it("renders nothing when no atoms are due", () => {
    const { container } = renderWithProviders(<ReviewPill />);
    expect(container.querySelector("button")).toBeNull();
  });

  it("renders the due count when atoms are due", () => {
    seedSrs({ "ebitda-add-backs": dueAtom(), "summit-hvac-q1": dueAtom("company-question") });
    renderWithProviders(<ReviewPill />);
    expect(screen.getByRole("button", { name: /Review \(2 due\)/ })).toBeTruthy();
  });

  it("ignores atoms scheduled in the future", () => {
    seedSrs({ future: { ...dueAtom(), nextDue: iso(2) } });
    const { container } = renderWithProviders(<ReviewPill />);
    expect(container.querySelector("button")).toBeNull();
  });
});
