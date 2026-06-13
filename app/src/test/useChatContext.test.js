// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useChatContext from "../hooks/useChatContext";
import { CHAT_MODES } from "../hooks/useChatMode";

describe("useChatContext", () => {
  const baseSubsection = {
    id: "test-sub",
    title: "Test Subsection",
    blocks: [
      { type: "text", content: "This is lesson text." },
      { type: "exercise", id: "ex1", q: "Test?", answer: "Answer" },
      { type: "text", content: "More lesson text." },
      { type: "companyData", companyId: "summit-hvac" },
    ],
    suggestedQuestions: ["What is EBITDA?", "Why do add-backs matter?"],
  };

  it("returns empty prompt and questions when subsection is null", () => {
    const { result } = renderHook(() =>
      useChatContext({ subsection: null, completedIds: [], llmResult: null, messageCount: 0 })
    );
    expect(result.current.systemPrompt).toBe("");
    expect(result.current.suggestedQuestions).toEqual([]);
  });

  it("builds system prompt from text blocks only", () => {
    const { result } = renderHook(() =>
      useChatContext({ subsection: baseSubsection, completedIds: [], llmResult: null, messageCount: 0 })
    );
    const prompt = result.current.systemPrompt;
    expect(prompt).toContain("This is lesson text.");
    expect(prompt).toContain("More lesson text.");
    expect(prompt).toContain("Test Subsection");
    // Should NOT include exercise content in the lesson text section
    expect(prompt).not.toContain("Test?");
  });

  it("returns suggestedQuestions from subsection data", () => {
    const { result } = renderHook(() =>
      useChatContext({ subsection: baseSubsection, completedIds: [], llmResult: null, messageCount: 0 })
    );
    expect(result.current.suggestedQuestions).toContain("What is EBITDA?");
    expect(result.current.suggestedQuestions).toContain("Why do add-backs matter?");
  });

  it("adds LLM gap questions when llmResult is provided", () => {
    const llmResult = { score: 2, gaps: ["customer concentration", "margin analysis"] };
    const { result } = renderHook(() =>
      useChatContext({ subsection: baseSubsection, completedIds: [], llmResult, messageCount: 0 })
    );
    expect(result.current.suggestedQuestions).toContain('Can you explain "customer concentration" in more detail?');
    expect(result.current.suggestedQuestions).toContain('Can you explain "margin analysis" in more detail?');
    expect(result.current.systemPrompt).toContain("Score: 2/5");
    expect(result.current.systemPrompt).toContain("customer concentration");
  });

  it("provides default questions when none are defined", () => {
    const sub = { ...baseSubsection, suggestedQuestions: undefined };
    const { result } = renderHook(() =>
      useChatContext({ subsection: sub, completedIds: [], llmResult: null, messageCount: 0 })
    );
    expect(result.current.suggestedQuestions.length).toBeGreaterThan(0);
    expect(result.current.suggestedQuestions[0]).toContain("Test Subsection");
  });

  it("adds trim notification when message count is high", () => {
    const { result } = renderHook(() =>
      useChatContext({ subsection: baseSubsection, completedIds: [], llmResult: null, messageCount: 20 })
    );
    expect(result.current.systemPrompt).toContain("trimmed for length");
  });

  it("does not add trim notification when message count is low", () => {
    const { result } = renderHook(() =>
      useChatContext({ subsection: baseSubsection, completedIds: [], llmResult: null, messageCount: 4 })
    );
    expect(result.current.systemPrompt).not.toContain("trimmed for length");
  });

  it("includes company context for companyData blocks", () => {
    const { result } = renderHook(() =>
      useChatContext({ subsection: baseSubsection, completedIds: [], llmResult: null, messageCount: 0 })
    );
    expect(result.current.systemPrompt).toContain("Summit");
  });

  it("keeps existing learn prompt behavior when contextType='learn'", () => {
    const { result } = renderHook(() =>
      useChatContext({ subsection: baseSubsection, completedIds: [], llmResult: null, messageCount: 0, contextType: "learn" })
    );
    expect(result.current.systemPrompt).toContain("You are a PE deal analysis tutor");
    expect(result.current.systemPrompt).toContain("CURRENT LESSON:");
    expect(result.current.systemPrompt).toContain("Test Subsection");
    expect(result.current.suggestedQuestions).toContain("What is EBITDA?");
  });

  describe("practice context", () => {
    const practiceContext = {
      companyName: "Coastal Fresh Foods",
      industry: "Food Distribution",
      revenue: 48.2,
      context: "Second-gen owner wants to grow but lacks capital.",
      description: "Regional specialty food distributor serving restaurants and grocery chains.",
      scenarioName: "Margin squeeze",
      scenarioDescription: "Transportation costs remain elevated and pricing power is uncertain.",
      keyMetrics: {
        adjustedEbitda: 3.9,
        grossMargin: 19.1,
        customerConcentration: 22,
      },
      incomeStatement: {
        years: [2024, 2025],
        revenue: [45.8, 48.2],
        grossProfit: [9.2, 9.2],
      },
      balanceSheet: {
        cash: 0.4,
        ar: 6.8,
      },
      cashFlow: {
        netIncome: 0.2,
        changeWc: -1.1,
      },
      redFlags: ["Gross margin compressed 100bps despite revenue growth"],
      greenFlags: ["60% recurring revenue from contracted accounts"],
      questions: [
        {
          question: "Revenue grew 5.2% but net income dropped 78%. What's happening here?",
          type: "diagnostic",
          modelAnswer: "Gross profit was flat despite higher revenue, signaling cost pass-through issues.",
        },
      ],
      suggestedQuestions: ["How should I underwrite Coastal's gross margin compression?"],
    };

    it("builds a company-analysis prompt from the practice integration shape", () => {
      const { result } = renderHook(() =>
        useChatContext({
          contextType: "practice",
          practiceContext,
          messageCount: 0,
          mode: CHAT_MODES.DIRECT,
        })
      );
      const prompt = result.current.systemPrompt;
      expect(prompt).toContain("PE deal analysis partner");
      expect(prompt).not.toContain("PE deal analysis tutor");
      expect(prompt).not.toContain("CURRENT LESSON:");
      expect(prompt).toContain("Coastal Fresh Foods");
      expect(prompt).toContain("Food Distribution");
      expect(prompt).toContain("Margin squeeze");
      expect(prompt).toContain("Transportation costs remain elevated");
      expect(prompt).toContain("Customer Concentration: 22");
      expect(prompt).toContain("Revenue: 45.8, 48.2");
      expect(prompt).toContain("Gross margin compressed 100bps");
      expect(prompt).toContain("60% recurring revenue");
      expect(prompt).toContain("Revenue grew 5.2%");
      expect(prompt).toContain("Model answer: Gross profit was flat despite higher revenue");
    });

    it("uses supplied practice suggestions and adds company-specific defaults", () => {
      const { result } = renderHook(() =>
        useChatContext({
          contextType: "practice",
          practiceContext,
          messageCount: 0,
          mode: CHAT_MODES.DIRECT,
        })
      );
      expect(result.current.suggestedQuestions[0]).toBe("How should I underwrite Coastal's gross margin compression?");
      expect(result.current.suggestedQuestions).toContain("Walk me through Coastal Fresh Foods' EBITDA quality");
      expect(result.current.suggestedQuestions).toContain("What valuation range would fit Coastal Fresh Foods?");
    });

    it("keeps practice Socratic mode question-led and accepts missing optional fields", () => {
      const { result } = renderHook(() =>
        useChatContext({
          contextType: "practice",
          title: "Apex Last-Mile Logistics",
          practiceContext: {
            keyMetrics: { revenueGrowth: -8.6 },
            redFlags: ["Revenue declined 8.6%"],
          },
          messageCount: 0,
          mode: CHAT_MODES.SOCRATIC,
        })
      );
      const prompt = result.current.systemPrompt;
      expect(prompt).toContain("Apex Last-Mile Logistics");
      expect(prompt).toContain("Do not give direct answers");
      expect(prompt).toContain("commit-first mode");
      expect(prompt).toContain("Revenue Growth: -8.6");
      expect(prompt).toContain("Revenue declined 8.6%");
      expect(result.current.suggestedQuestions).toContain("Test my thesis on Apex Last-Mile Logistics");
      expect(result.current.suggestedQuestions).toContain("Challenge my valuation logic for Apex Last-Mile Logistics");
    });
  });

  describe("mode branching", () => {
    it("defaults mode to direct when undefined", () => {
      const { result } = renderHook(() =>
        useChatContext({ subsection: baseSubsection, completedIds: [], llmResult: null, messageCount: 0 })
      );
      // Direct prompt is concise; Socratic prompt has the "Do not give direct answers" rule
      expect(result.current.systemPrompt).not.toContain("Do not give direct answers");
      expect(result.current.systemPrompt).toContain("Keep responses concise");
    });

    it("mode='direct' produces the Direct prompt", () => {
      const { result } = renderHook(() =>
        useChatContext({ subsection: baseSubsection, completedIds: [], llmResult: null, messageCount: 0, mode: CHAT_MODES.DIRECT })
      );
      expect(result.current.systemPrompt).toContain("Keep responses concise");
      expect(result.current.systemPrompt).not.toContain("Do not give direct answers");
    });

    it("mode='socratic' produces the Socratic prompt with key rules", () => {
      const { result } = renderHook(() =>
        useChatContext({ subsection: baseSubsection, completedIds: [], llmResult: null, messageCount: 0, mode: CHAT_MODES.SOCRATIC })
      );
      const prompt = result.current.systemPrompt;
      expect(prompt).toContain("Do not give direct answers");
      expect(prompt).toContain("1-2 probing questions");
      expect(prompt).toContain("Bold the question");
    });

    it("Direct mode uses subsection.suggestedQuestions seeds (existing behavior)", () => {
      const { result } = renderHook(() =>
        useChatContext({ subsection: baseSubsection, completedIds: [], llmResult: null, messageCount: 0, mode: CHAT_MODES.DIRECT })
      );
      expect(result.current.suggestedQuestions).toContain("What is EBITDA?");
    });

    it("Socratic mode does NOT use subsection.suggestedQuestions (different framing)", () => {
      const { result } = renderHook(() =>
        useChatContext({ subsection: baseSubsection, completedIds: [], llmResult: null, messageCount: 0, mode: CHAT_MODES.SOCRATIC })
      );
      expect(result.current.suggestedQuestions).not.toContain("What is EBITDA?");
      expect(result.current.suggestedQuestions[0]).toMatch(/test my understanding|walk me through/i);
    });

    it("Socratic mode + llmResult.gaps uses 'Want me to test you on' framing", () => {
      const llmResult = { score: 2, gaps: ["customer concentration", "margin analysis"] };
      const { result } = renderHook(() =>
        useChatContext({ subsection: baseSubsection, completedIds: [], llmResult, messageCount: 0, mode: CHAT_MODES.SOCRATIC })
      );
      expect(result.current.suggestedQuestions).toContain('Want me to test you on "customer concentration"?');
      expect(result.current.suggestedQuestions).toContain('Want me to test you on "margin analysis"?');
    });

    it("both modes include CURRENT LESSON, COMPANY DATA, LEARNER PROGRESS sections identically", () => {
      const direct = renderHook(() =>
        useChatContext({ subsection: baseSubsection, completedIds: ["a", "b"], llmResult: null, messageCount: 0, mode: CHAT_MODES.DIRECT })
      ).result.current.systemPrompt;
      const socratic = renderHook(() =>
        useChatContext({ subsection: baseSubsection, completedIds: ["a", "b"], llmResult: null, messageCount: 0, mode: CHAT_MODES.SOCRATIC })
      ).result.current.systemPrompt;
      for (const marker of ["CURRENT LESSON:", "COMPANY DATA:", "LEARNER PROGRESS:", "This is lesson text.", "Completed exercises: 2"]) {
        expect(direct).toContain(marker);
        expect(socratic).toContain(marker);
      }
    });

    it("trim notification is appended in both modes", () => {
      const direct = renderHook(() =>
        useChatContext({ subsection: baseSubsection, completedIds: [], llmResult: null, messageCount: 20, mode: CHAT_MODES.DIRECT })
      ).result.current.systemPrompt;
      const socratic = renderHook(() =>
        useChatContext({ subsection: baseSubsection, completedIds: [], llmResult: null, messageCount: 20, mode: CHAT_MODES.SOCRATIC })
      ).result.current.systemPrompt;
      expect(direct).toContain("trimmed for length");
      expect(socratic).toContain("trimmed for length");
    });

    it("Socratic mode + grading-gaps clause coexists in the system prompt", () => {
      const llmResult = { score: 2, gaps: ["customer concentration"] };
      const { result } = renderHook(() =>
        useChatContext({ subsection: baseSubsection, completedIds: [], llmResult, messageCount: 0, mode: CHAT_MODES.SOCRATIC })
      );
      const prompt = result.current.systemPrompt;
      expect(prompt).toContain("Do not give direct answers");
      expect(prompt).toContain("Score: 2/5");
      expect(prompt).toContain("customer concentration");
    });
  });
});
