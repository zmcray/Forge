// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useConceptProgress from "../hooks/useConceptProgress";

describe("useConceptProgress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns defaults for unknown card", () => {
    const { result } = renderHook(() => useConceptProgress());
    const card = result.current.getCard("nonexistent");
    expect(card.notes).toBe("");
    expect(card.lastStudied).toBeNull();
    expect(card.practiceAttempted).toBe(false);
  });

  it("marks a card as studied", () => {
    const { result } = renderHook(() => useConceptProgress());
    act(() => result.current.markStudied("ebitda-add-backs"));
    const card = result.current.getCard("ebitda-add-backs");
    expect(card.lastStudied).toBeTruthy();
  });

  it("marks practice attempted", () => {
    const { result } = renderHook(() => useConceptProgress());
    act(() => result.current.markPracticeAttempted("lbo-economics"));
    const card = result.current.getCard("lbo-economics");
    expect(card.practiceAttempted).toBe(true);
  });

  it("saves and retrieves card notes", () => {
    const { result } = renderHook(() => useConceptProgress());
    act(() => result.current.setCardNotes("margin-drivers", "Key insight about margins"));
    const card = result.current.getCard("margin-drivers");
    expect(card.notes).toBe("Key insight about margins");
  });

  it("counts studied cards", () => {
    const { result } = renderHook(() => useConceptProgress());
    expect(result.current.getStudiedCount()).toBe(0);
    act(() => result.current.markStudied("ebitda-add-backs"));
    act(() => result.current.markStudied("lbo-economics"));
    expect(result.current.getStudiedCount()).toBe(2);
  });

  it("counts practiced cards", () => {
    const { result } = renderHook(() => useConceptProgress());
    expect(result.current.getPracticeCount()).toBe(0);
    act(() => result.current.markPracticeAttempted("cash-conversion"));
    expect(result.current.getPracticeCount()).toBe(1);
  });

  it("persists to localStorage", () => {
    const { result } = renderHook(() => useConceptProgress());
    act(() => result.current.markStudied("ebitda-add-backs"));

    const stored = JSON.parse(localStorage.getItem("forge-concepts"));
    expect(stored.cards["ebitda-add-backs"].lastStudied).toBeTruthy();
  });

  it("loads from localStorage on init", () => {
    localStorage.setItem(
      "forge-concepts",
      JSON.stringify({
        cards: {
          "ebitda-add-backs": {
            lastStudied: "2026-01-01T00:00:00.000Z",
            practiceAttempted: true,
          },
        },
      })
    );

    const { result } = renderHook(() => useConceptProgress());
    const card = result.current.getCard("ebitda-add-backs");
    expect(card.lastStudied).toBe("2026-01-01T00:00:00.000Z");
    expect(card.practiceAttempted).toBe(true);
  });
});
