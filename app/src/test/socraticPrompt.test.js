// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useChatContext from "../hooks/useChatContext";
import { CHAT_MODES } from "../hooks/useChatMode";
import { LEARN_CONTENT } from "../data/learnContent";

const PROMPT_BUDGET = 4500;

function getLongestSubsection() {
  let max = { subsection: null, len: 0 };
  for (const section of LEARN_CONTENT) {
    for (const sub of section.subsections || []) {
      const text = (sub.blocks || [])
        .filter(b => b.type === "text")
        .map(b => b.content)
        .join("\n\n");
      if (text.length > max.len) max = { subsection: sub, len: text.length };
    }
  }
  return max.subsection;
}

describe("Socratic prompt budget", () => {
  it("Socratic prompt for the longest existing subsection stays under 4500 chars", () => {
    const subsection = getLongestSubsection();
    expect(subsection).not.toBeNull();
    const { result } = renderHook(() =>
      useChatContext({ subsection, completedIds: [], llmResult: null, messageCount: 0, mode: CHAT_MODES.SOCRATIC })
    );
    expect(result.current.systemPrompt.length).toBeLessThan(PROMPT_BUDGET);
  });

  it("Socratic prompt always includes the rule against direct answers and the 1-2 questions rule", () => {
    const subsection = getLongestSubsection();
    const { result } = renderHook(() =>
      useChatContext({ subsection, completedIds: [], llmResult: null, messageCount: 0, mode: CHAT_MODES.SOCRATIC })
    );
    expect(result.current.systemPrompt).toMatch(/do not give direct answers/i);
    expect(result.current.systemPrompt).toMatch(/1-2 probing questions/);
  });

  it("Socratic + grading-gaps clause coexists when llmResult is present", () => {
    const subsection = getLongestSubsection();
    const llmResult = { score: 2, gaps: ["growth-rate sustainability"] };
    const { result } = renderHook(() =>
      useChatContext({ subsection, completedIds: [], llmResult, messageCount: 0, mode: CHAT_MODES.SOCRATIC })
    );
    const prompt = result.current.systemPrompt;
    expect(prompt).toMatch(/do not give direct answers/i);
    expect(prompt).toContain("growth-rate sustainability");
    expect(prompt.length).toBeLessThan(PROMPT_BUDGET);
  });
});
