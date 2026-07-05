import { describe, it, expect } from "vitest";
import { LEARN_CONTENT } from "./learnContent";
import { LEARN_INDEX } from "./learnIndex";

// Drift guard: LEARN_INDEX is a hand-written derived artifact so the eager
// bundle never imports learnContent. This test is the only module that
// imports both; it re-derives the index from the canonical content and
// asserts exact equality. Any content change that isn't mirrored into
// learnIndex.js fails here at write time.
function deriveIndex() {
  return LEARN_CONTENT.map((section) => ({
    id: section.id,
    title: section.title,
    subsections: section.subsections.map((sub) => ({
      id: sub.id,
      title: sub.title,
      timeEstimate: sub.timeEstimate,
      skillTags: sub.skillTags,
      exerciseIds: (sub.blocks || [])
        .filter((b) => b.type === "exercise" || b.type === "calculationExercise")
        .map((b) => b.id),
    })),
  }));
}

describe("learnIndex", () => {
  it("exactly matches the index derived from learnContent", () => {
    expect(LEARN_INDEX).toEqual(deriveIndex());
  });

  it("covers every subsection with a unique id", () => {
    const ids = LEARN_INDEX.flatMap((s) => s.subsections.map((sub) => sub.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBe(LEARN_CONTENT.reduce((n, s) => n + s.subsections.length, 0));
  });
});
