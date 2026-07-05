// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, act } from "@testing-library/react";
import { renderWithProviders } from "../test/renderWithProviders";
import ReviewScreen from "./ReviewScreen";

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

const dueAtom = (atomType, over = {}) => ({
  atomType,
  ease: 2.5,
  interval: 1,
  nextDue: iso(-1),
  lastSeen: iso(-2),
  consecutiveFails: 0,
  history: [{ score: 4, timestamp: iso(-2) }],
  ...over,
});

function seedSrs(atoms) {
  localStorage.setItem(
    "forge-srs",
    JSON.stringify({ version: 1, atoms, lastProcessed: iso(-2) }),
  );
}

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe("ReviewScreen", () => {
  it("shows the empty state when nothing is due", () => {
    renderWithProviders(<ReviewScreen />);
    expect(screen.getByText("Nothing due for review.")).toBeTruthy();
  });

  it("renders a self-mark card for a due concept atom with a learn link", () => {
    seedSrs({ "ebitda-add-backs": dueAtom("concept") });
    renderWithProviders(<ReviewScreen />);
    expect(screen.getByText("EBITDA Add-backs")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Open in Learn/ }).getAttribute("href")).toBe(
      "/learn/concepts/ebitda-add-backs",
    );
    expect(screen.getByRole("button", { name: "Again" })).toBeTruthy();
  });

  it("self-marking feeds the SRS through addScore and reschedules the atom", async () => {
    seedSrs({ "ebitda-add-backs": dueAtom("concept") });
    renderWithProviders(<ReviewScreen />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Good" }));
    });

    // Review entry landed in the score-of-record ...
    const data = JSON.parse(localStorage.getItem("forge-data"));
    const entry = data.sessions.at(-1).questions.at(-1);
    expect(entry).toMatchObject({ atomId: "ebitda-add-backs", atomType: "concept", score: 4 });

    // ... and the SRS rescheduled it out of the due queue.
    const srs = JSON.parse(localStorage.getItem("forge-srs"));
    expect(Date.parse(srs.atoms["ebitda-add-backs"].nextDue)).toBeGreaterThan(Date.now());
    expect(screen.getByText(/1 atom reviewed/)).toBeTruthy();
  });

  it("replays company-question atoms through QuestionCard", () => {
    seedSrs({ "summit-hvac-q1": dueAtom("company-question") });
    renderWithProviders(<ReviewScreen />);
    // Commit-first flow: the reveal gate is present, self-mark buttons are not.
    expect(screen.getByRole("button", { name: /Reveal/i })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Again" })).toBeNull();
  });

  it("skips atoms whose content no longer resolves", () => {
    seedSrs({ "deleted-atom": dueAtom("concept"), "ebitda-add-backs": dueAtom("concept") });
    renderWithProviders(<ReviewScreen />);
    expect(screen.getByText("EBITDA Add-backs")).toBeTruthy();
  });
});
