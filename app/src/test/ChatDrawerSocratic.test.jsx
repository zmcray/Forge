// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ChatDrawer from "../components/learn/ChatDrawer";
import { CHAT_MODES } from "../hooks/useChatMode";

// Mock useChatContext so we can observe which mode the drawer passes through.
// systemPrompt encodes the mode so fetch-body assertions can verify which
// prompt was active at fetch start (this is the load-bearing T1 invariant).
vi.mock("../hooks/useChatContext", () => ({
  default: ({ mode }) => ({
    systemPrompt: `mock-prompt-mode=${mode}`,
    suggestedQuestions: ["seed-q-a", "seed-q-b"],
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

describe("ChatDrawer — Socratic toggle", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("pill toggle UI", () => {
    it("renders both Direct and Socratic buttons with aria-pressed reflecting state", () => {
      render(<ChatDrawer {...defaultProps()} />);
      const direct = screen.getByRole("button", { name: "Direct" });
      const socratic = screen.getByRole("button", { name: "Socratic" });
      expect(direct).toHaveAttribute("aria-pressed", "true");
      expect(socratic).toHaveAttribute("aria-pressed", "false");
    });

    it("clicking Socratic toggles aria-pressed and persists to localStorage", () => {
      render(<ChatDrawer {...defaultProps()} />);
      fireEvent.click(screen.getByRole("button", { name: "Socratic" }));
      expect(screen.getByRole("button", { name: "Direct" })).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByRole("button", { name: "Socratic" })).toHaveAttribute("aria-pressed", "true");
      expect(localStorage.getItem("forge-chat-mode")).toBe(CHAT_MODES.SOCRATIC);
    });

    it("clicking the already-active mode is a no-op (no divider inserted)", () => {
      const setMessages = vi.fn();
      render(
        <ChatDrawer
          {...defaultProps()}
          messages={[{ role: "user", content: "hi" }]}
          setMessages={setMessages}
        />
      );
      fireEvent.click(screen.getByRole("button", { name: "Direct" }));
      expect(setMessages).not.toHaveBeenCalled();
    });

    it("flipping mode with non-empty messages inserts a kind: 'mode-change' divider", () => {
      const setMessages = vi.fn();
      render(
        <ChatDrawer
          {...defaultProps()}
          messages={[{ role: "user", content: "hi" }]}
          setMessages={setMessages}
        />
      );
      fireEvent.click(screen.getByRole("button", { name: "Socratic" }));
      expect(setMessages).toHaveBeenCalledTimes(1);
      const updater = setMessages.mock.calls[0][0];
      const next = updater([{ role: "user", content: "hi" }]);
      expect(next).toHaveLength(2);
      expect(next[1]).toMatchObject({
        role: "assistant",
        kind: "mode-change",
        content: "Switched to Socratic mode.",
      });
    });

    it("flipping mode with empty messages does NOT insert a divider", () => {
      const setMessages = vi.fn();
      render(<ChatDrawer {...defaultProps()} messages={[]} setMessages={setMessages} />);
      fireEvent.click(screen.getByRole("button", { name: "Socratic" }));
      expect(setMessages).not.toHaveBeenCalled();
    });

    it("mode persists across drawer unmount/remount via localStorage", () => {
      const { unmount } = render(<ChatDrawer {...defaultProps()} />);
      fireEvent.click(screen.getByRole("button", { name: "Socratic" }));
      unmount();
      render(<ChatDrawer {...defaultProps()} />);
      expect(screen.getByRole("button", { name: "Socratic" })).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("empty-state copy", () => {
    it("Direct mode shows 'Ask a question about ...'", () => {
      render(<ChatDrawer {...defaultProps()} />);
      expect(screen.getByText(/Ask a question about Test Topic/)).toBeInTheDocument();
    });

    it("Socratic mode shows the guided-by-questions copy", () => {
      localStorage.setItem("forge-chat-mode", CHAT_MODES.SOCRATIC);
      render(<ChatDrawer {...defaultProps()} />);
      expect(screen.getByText(/I'll guide you with questions\. Ask me to test you on Test Topic/)).toBeInTheDocument();
    });
  });

  describe("ChatMessage divider rendering", () => {
    it("renders a mode-change marker as inline italic text, not a chat bubble", () => {
      const messages = [
        { role: "user", content: "hi" },
        { role: "assistant", kind: "mode-change", content: "Switched to Socratic mode." },
      ];
      render(<ChatDrawer {...defaultProps()} messages={messages} />);
      const divider = screen.getByText("Switched to Socratic mode.");
      expect(divider.className).toContain("italic");
      // The divider must NOT be inside a chat bubble (which has bg-secondary-container)
      expect(divider.className).not.toContain("bg-secondary-container");
    });
  });

  describe("API payload filtering and mid-stream invariant (T1)", () => {
    function makeStreamingFetch(chunks) {
      // ReadableStream that emits chunks then closes.
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

    it("strips kind:'mode-change' messages from the /api/chat payload", async () => {
      const fetchMock = makeStreamingFetch([
        `data: ${JSON.stringify({ type: "delta", text: "ok" })}\n\n`,
        `data: ${JSON.stringify({ type: "done" })}\n\n`,
      ]);
      global.fetch = fetchMock;

      const setMessages = vi.fn();
      const messages = [
        { role: "user", content: "Q1" },
        { role: "assistant", content: "A1" },
        { role: "assistant", kind: "mode-change", content: "Switched to Socratic mode." },
      ];
      render(
        <ChatDrawer {...defaultProps()} messages={messages} setMessages={setMessages} />
      );

      const input = screen.getByPlaceholderText("Type a question...");
      fireEvent.change(input, { target: { value: "Q2" } });
      await act(async () => {
        fireEvent.click(screen.getByTitle("Send"));
        await new Promise(r => setTimeout(r, 5));
      });

      expect(fetchMock).toHaveBeenCalled();
      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      // Mode-change marker is filtered out; user/assistant content remains.
      expect(body.messages).toHaveLength(3); // Q1, A1, Q2 — divider stripped
      for (const m of body.messages) {
        expect(m.kind).toBeUndefined();
        expect(["user", "assistant"]).toContain(m.role);
      }
      expect(body.messages.map(m => m.content)).toEqual(["Q1", "A1", "Q2"]);
    });

    it("[Codex P1 #1] mid-stream divider is DEFERRED to land AFTER the in-flight assistant message", async () => {
      let releaseStream;
      const streamReady = new Promise(r => { releaseStream = r; });

      const fetchMock = vi.fn().mockImplementation(() => {
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "delta", text: "in-flight reply" })}\n\n`));
            await streamReady;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
            controller.close();
          },
        });
        return Promise.resolve({ ok: true, body: stream });
      });
      global.fetch = fetchMock;

      // We capture every setMessages call so we can replay them and observe
      // the final transcript ordering exactly as the live drawer would.
      let messages = [{ role: "user", content: "prior" }];
      const setMessages = vi.fn().mockImplementation(updater => {
        messages = typeof updater === "function" ? updater(messages) : updater;
      });

      const { rerender } = render(
        <ChatDrawer
          {...defaultProps()}
          messages={messages}
          setMessages={setMessages}
        />
      );

      const input = screen.getByPlaceholderText("Type a question...");
      fireEvent.change(input, { target: { value: "Q1" } });
      await act(async () => {
        fireEvent.click(screen.getByTitle("Send"));
        await new Promise(r => setTimeout(r, 5));
      });

      // Mid-stream, flip to Socratic. The divider must NOT appear yet.
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Socratic" }));
        await new Promise(r => setTimeout(r, 5));
      });
      expect(messages.some(m => m.kind === "mode-change")).toBe(false);

      // Release the stream. Assistant reply lands first, then the divider.
      await act(async () => {
        releaseStream();
        await new Promise(r => setTimeout(r, 20));
      });
      // Re-render so the test pumps any remaining state.
      rerender(<ChatDrawer {...defaultProps()} messages={messages} setMessages={setMessages} />);

      const lastTwo = messages.slice(-2);
      expect(lastTwo[0]).toMatchObject({ role: "assistant", content: "in-flight reply" });
      expect(lastTwo[1]).toMatchObject({
        role: "assistant",
        kind: "mode-change",
        content: "Switched to Socratic mode.",
      });
    });

    it("[Codex P1 #2] trim drops oldest role pair regardless of dividers; never strands assistant-first history", async () => {
      const fetchMock = makeStreamingFetch([
        `data: ${JSON.stringify({ type: "delta", text: "ok" })}\n\n`,
        `data: ${JSON.stringify({ type: "done" })}\n\n`,
      ]);
      global.fetch = fetchMock;

      // Build a history that's at the budget cap (20 role messages) plus one
      // mode-change divider mixed in. The trim path must drop the OLDEST
      // user/assistant pair (indices 0+1 in the role-only view), not the
      // first two raw rows (which would include the divider in some orderings).
      const history = [];
      for (let i = 0; i < 10; i++) {
        history.push({ role: "user", content: `U${i}` });
        history.push({ role: "assistant", content: `A${i}` });
      }
      // Insert a divider in the middle
      history.splice(7, 0, { role: "assistant", kind: "mode-change", content: "Switched to Socratic mode." });

      let messages = history;
      const setMessages = vi.fn().mockImplementation(updater => {
        messages = typeof updater === "function" ? updater(messages) : updater;
      });

      render(<ChatDrawer {...defaultProps()} messages={messages} setMessages={setMessages} />);

      const input = screen.getByPlaceholderText("Type a question...");
      fireEvent.change(input, { target: { value: "U10" } });
      await act(async () => {
        fireEvent.click(screen.getByTitle("Send"));
        await new Promise(r => setTimeout(r, 5));
      });

      // After send + trim, the conversation should NOT lead with an assistant
      // message. The first message should still be a user role.
      const firstRoleMessage = messages.find(m => m.kind !== "mode-change");
      expect(firstRoleMessage.role).toBe("user");
      // And the dropped pair should be the OLDEST one: U0/A0 should be gone.
      const contents = messages.filter(m => m.kind !== "mode-change").map(m => m.content);
      expect(contents).not.toContain("U0");
      expect(contents).not.toContain("A0");
      // U1, A1, ..., U10 should all still be present
      expect(contents).toContain("U1");
      expect(contents).toContain("U10");
    });

    it("[Codex P2 #3] trim banner does not trigger when only dividers inflate messages.length", () => {
      // 17 role messages + 1 divider = messages.length 18, which would have
      // tripped the old `messages.length > (MAX_TURNS - 1) * 2 = 18` banner
      // condition (false at 18, true at 19). Add a divider to push raw length
      // to 19 with only 18 role messages — banner must NOT show.
      const history = [];
      for (let i = 0; i < 9; i++) {
        history.push({ role: "user", content: `U${i}` });
        history.push({ role: "assistant", content: `A${i}` });
      }
      history.push({ role: "assistant", kind: "mode-change", content: "Switched." });
      // 18 role messages + 1 divider = 19 raw rows. roleMessageCount = 18.
      // Banner threshold: roleMessageCount > 18 is false, so no banner.

      render(<ChatDrawer {...defaultProps()} messages={history} setMessages={vi.fn()} />);
      expect(screen.queryByText(/Older messages trimmed/)).not.toBeInTheDocument();
    });

    it("[T1] mid-stream mode flip: in-flight fetch keeps Direct prompt; next message uses Socratic prompt", async () => {
      let releaseStream;
      const streamReady = new Promise(r => { releaseStream = r; });

      const fetchMock = vi.fn().mockImplementation(() => {
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            // First chunk arrives quickly so the user can interact with the UI.
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "delta", text: "partial" })}\n\n`));
            // Then we wait for the test to release us before completing.
            await streamReady;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
            controller.close();
          },
        });
        return Promise.resolve({ ok: true, body: stream });
      });
      global.fetch = fetchMock;

      const setMessages = vi.fn();
      // Pass non-empty messages so the divider would actually insert if user flips.
      render(
        <ChatDrawer
          {...defaultProps()}
          messages={[{ role: "user", content: "prior" }]}
          setMessages={setMessages}
        />
      );

      const input = screen.getByPlaceholderText("Type a question...");
      fireEvent.change(input, { target: { value: "Q1" } });

      // Send under Direct mode. Fetch starts; the streaming response is held open.
      await act(async () => {
        fireEvent.click(screen.getByTitle("Send"));
        await new Promise(r => setTimeout(r, 5));
      });

      // First fetch was made under Direct.
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const firstBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(firstBody.systemPrompt).toBe(`mock-prompt-mode=${CHAT_MODES.DIRECT}`);

      // Mid-stream, flip to Socratic. The in-flight fetch must NOT be re-issued.
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Socratic" }));
        await new Promise(r => setTimeout(r, 5));
      });
      expect(fetchMock).toHaveBeenCalledTimes(1); // still 1 — no re-issue

      // Release the stream so it completes.
      await act(async () => {
        releaseStream();
        await new Promise(r => setTimeout(r, 10));
      });

      // Now send a second message. Fetch should be called with the Socratic prompt.
      fireEvent.change(input, { target: { value: "Q2" } });
      await act(async () => {
        fireEvent.click(screen.getByTitle("Send"));
        await new Promise(r => setTimeout(r, 5));
      });
      expect(fetchMock).toHaveBeenCalledTimes(2);
      const secondBody = JSON.parse(fetchMock.mock.calls[1][1].body);
      expect(secondBody.systemPrompt).toBe(`mock-prompt-mode=${CHAT_MODES.SOCRATIC}`);
    });
  });
});
