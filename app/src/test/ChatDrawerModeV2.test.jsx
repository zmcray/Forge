// @vitest-environment jsdom
// MCR-101 / MCR-17: context-aware defaults, per-message mode pills, escape hatch.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ChatDrawer, { ESCAPE_HATCH_MESSAGE } from "../components/learn/ChatDrawer";
import { CHAT_MODES } from "../hooks/useChatMode";

vi.mock("../hooks/useChatContext", () => ({
  default: () => ({
    chatParams: { subsectionId: "test-sub" },
    suggestedQuestions: [],
  }),
}));

const defaultProps = () => ({
  subsection: { id: "test-sub", title: "Test Topic", blocks: [] },
  chatContext: null,
  messages: [],
  setMessages: vi.fn(),
  getNoteText: () => "",
  setNoteText: vi.fn(),
  completedIds: [],
  onClose: vi.fn(),
});

function makeStreamingFetch(chunks) {
  return vi.fn().mockImplementation(() => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          await new Promise(r => setTimeout(r, 0));
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });
    return Promise.resolve({ ok: true, body: stream });
  });
}

describe("ChatDrawer — socratic mode v2", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("context-aware defaults", () => {
    it("learn context defaults to Socratic on first run", () => {
      render(<ChatDrawer {...defaultProps()} />);
      expect(screen.getByRole("button", { name: "Socratic" })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: "Direct" })).toHaveAttribute("aria-pressed", "false");
    });

    it("practice context defaults to Direct on first run", () => {
      render(
        <ChatDrawer {...defaultProps()} contextType="practice" title="Coastal Fresh Foods" />
      );
      expect(screen.getByRole("button", { name: "Direct" })).toHaveAttribute("aria-pressed", "true");
    });

    it("an explicit choice on one surface does not leak to the other", () => {
      const learn = render(<ChatDrawer {...defaultProps()} />);
      fireEvent.click(screen.getByRole("button", { name: "Direct" }));
      learn.unmount();

      render(
        <ChatDrawer {...defaultProps()} contextType="practice" title="Coastal Fresh Foods" />
      );
      // Practice stays on its own (direct) default; learn choice persisted separately.
      expect(screen.getByRole("button", { name: "Direct" })).toHaveAttribute("aria-pressed", "true");
      expect(localStorage.getItem("forge-chat-mode-learn")).toBe(CHAT_MODES.DIRECT);
      expect(localStorage.getItem("forge-chat-mode-practice")).toBeNull();
    });
  });

  describe("per-message mode pill", () => {
    it("stamps the assistant reply with the mode active when it was generated", async () => {
      global.fetch = makeStreamingFetch([
        `data: ${JSON.stringify({ type: "delta", text: "guided reply" })}\n\n`,
        `data: ${JSON.stringify({ type: "done" })}\n\n`,
      ]);

      let messages = [];
      const setMessages = vi.fn().mockImplementation(updater => {
        messages = typeof updater === "function" ? updater(messages) : updater;
      });
      render(<ChatDrawer {...defaultProps()} messages={messages} setMessages={setMessages} />);

      const input = screen.getByPlaceholderText("Type a question...");
      fireEvent.change(input, { target: { value: "Q1" } });
      await act(async () => {
        fireEvent.click(screen.getByTitle("Send"));
        await new Promise(r => setTimeout(r, 20));
      });

      const assistant = messages.find(m => m.role === "assistant");
      expect(assistant).toMatchObject({ content: "guided reply", mode: CHAT_MODES.SOCRATIC });
    });

    it("renders a subtle Socratic pill on stamped assistant messages", () => {
      const messages = [
        { role: "user", content: "Q1" },
        { role: "assistant", content: "A1", mode: CHAT_MODES.SOCRATIC },
        { role: "assistant", content: "A2", mode: CHAT_MODES.DIRECT },
      ];
      render(<ChatDrawer {...defaultProps()} messages={messages} />);
      const pills = [screen.getByText("Socratic", { selector: "span" }), screen.getByText("Direct", { selector: "span" })];
      for (const pill of pills) {
        expect(pill.className).toContain("rounded-full");
      }
    });

    it("legacy assistant messages without a mode stamp render no pill", () => {
      const messages = [
        { role: "user", content: "Q1" },
        { role: "assistant", content: "A1" },
      ];
      render(<ChatDrawer {...defaultProps()} messages={messages} />);
      expect(screen.queryByText("Socratic", { selector: "span" })).not.toBeInTheDocument();
      expect(screen.queryByText("Direct", { selector: "span" })).not.toBeInTheDocument();
    });

    it("strips the mode stamp from the /api/chat payload", async () => {
      const fetchMock = makeStreamingFetch([
        `data: ${JSON.stringify({ type: "delta", text: "ok" })}\n\n`,
        `data: ${JSON.stringify({ type: "done" })}\n\n`,
      ]);
      global.fetch = fetchMock;

      const messages = [
        { role: "user", content: "Q1" },
        { role: "assistant", content: "A1", mode: CHAT_MODES.SOCRATIC },
      ];
      render(<ChatDrawer {...defaultProps()} messages={messages} setMessages={vi.fn()} />);

      fireEvent.change(screen.getByPlaceholderText("Type a question..."), { target: { value: "Q2" } });
      await act(async () => {
        fireEvent.click(screen.getByTitle("Send"));
        await new Promise(r => setTimeout(r, 5));
      });

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      for (const m of body.messages) {
        expect(m.mode).toBeUndefined();
        expect(Object.keys(m).sort()).toEqual(["content", "role"]);
      }
    });
  });

  describe("escape hatch", () => {
    const twoAssistantTurns = () => [
      { role: "user", content: "Q1" },
      { role: "assistant", content: "A1", mode: CHAT_MODES.SOCRATIC },
      { role: "user", content: "Q2" },
      { role: "assistant", content: "A2", mode: CHAT_MODES.SOCRATIC },
    ];

    it("appears in Socratic mode after 2 assistant turns", () => {
      render(<ChatDrawer {...defaultProps()} messages={twoAssistantTurns()} />);
      expect(screen.getByRole("button", { name: "Show me the reasoning" })).toBeInTheDocument();
    });

    it("does NOT appear before 2 assistant turns", () => {
      render(
        <ChatDrawer
          {...defaultProps()}
          messages={[
            { role: "user", content: "Q1" },
            { role: "assistant", content: "A1", mode: CHAT_MODES.SOCRATIC },
          ]}
        />
      );
      expect(screen.queryByRole("button", { name: "Show me the reasoning" })).not.toBeInTheDocument();
    });

    it("does NOT appear in Direct mode", () => {
      localStorage.setItem("forge-chat-mode-learn", CHAT_MODES.DIRECT);
      render(<ChatDrawer {...defaultProps()} messages={twoAssistantTurns()} />);
      expect(screen.queryByRole("button", { name: "Show me the reasoning" })).not.toBeInTheDocument();
    });

    it("mode-change dividers do not count as assistant turns", () => {
      const messages = [
        { role: "user", content: "Q1" },
        { role: "assistant", content: "A1", mode: CHAT_MODES.SOCRATIC },
        { role: "assistant", kind: "mode-change", content: "Switched to Socratic mode." },
      ];
      render(<ChatDrawer {...defaultProps()} messages={messages} />);
      expect(screen.queryByRole("button", { name: "Show me the reasoning" })).not.toBeInTheDocument();
    });

    it("clicking it sends the fixed user-visible message through the normal send path", async () => {
      const fetchMock = makeStreamingFetch([
        `data: ${JSON.stringify({ type: "delta", text: "here is the reasoning" })}\n\n`,
        `data: ${JSON.stringify({ type: "done" })}\n\n`,
      ]);
      global.fetch = fetchMock;

      let messages = twoAssistantTurns();
      const setMessages = vi.fn().mockImplementation(updater => {
        messages = typeof updater === "function" ? updater(messages) : updater;
      });
      render(<ChatDrawer {...defaultProps()} messages={messages} setMessages={setMessages} />);

      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Show me the reasoning" }));
        await new Promise(r => setTimeout(r, 5));
      });

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.messages.at(-1)).toEqual({ role: "user", content: ESCAPE_HATCH_MESSAGE });
      // No API change: mode string and params keep the existing contract.
      expect(body.mode).toBe(`learn-${CHAT_MODES.SOCRATIC}`);
      expect(body.systemPrompt).toBeUndefined();
      // The message is user-visible in the transcript.
      expect(messages.some(m => m.role === "user" && m.content === ESCAPE_HATCH_MESSAGE)).toBe(true);
    });
  });
});
