// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import ChatDrawer from "../components/learn/ChatDrawer";

// Mock useChatContext
vi.mock("../hooks/useChatContext", () => ({
  default: () => ({
    systemPrompt: "You are a tutor.",
    suggestedQuestions: ["What is EBITDA?"],
  }),
}));

// Helper to create a mock fetch that streams SSE events
function createMockStreamFetch(events) {
  return vi.fn().mockResolvedValue({
    ok: true,
    body: {
      getReader: () => {
        let index = 0;
        const encoder = new TextEncoder();
        return {
          read: () => {
            if (index < events.length) {
              const chunk = encoder.encode(events[index]);
              index++;
              return Promise.resolve({ done: false, value: chunk });
            }
            return Promise.resolve({ done: true, value: undefined });
          },
          cancel: vi.fn(),
        };
      },
    },
  });
}

describe("ChatDrawer Advanced", () => {
  const defaultProps = {
    subsection: { id: "test-sub", title: "Test Topic", blocks: [] },
    chatContext: null,
    messages: [],
    setMessages: vi.fn(),
    getNoteText: () => "",
    setNoteText: vi.fn(),
    completedIds: [],
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends message on Enter key (not Shift+Enter)", () => {
    const setMessages = vi.fn();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: { getReader: () => ({ read: () => Promise.resolve({ done: true, value: undefined }) }) },
    });

    render(<ChatDrawer {...defaultProps} setMessages={setMessages} />);
    const textarea = screen.getByPlaceholderText("Type a question...");
    fireEvent.change(textarea, { target: { value: "Test question" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(setMessages).toHaveBeenCalled();
    delete global.fetch;
  });

  it("does not send message on Shift+Enter", () => {
    const setMessages = vi.fn();
    render(<ChatDrawer {...defaultProps} setMessages={setMessages} />);
    const textarea = screen.getByPlaceholderText("Type a question...");
    fireEvent.change(textarea, { target: { value: "Test question" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });

    expect(setMessages).not.toHaveBeenCalled();
  });

  it("does not send empty message", () => {
    const setMessages = vi.fn();
    render(<ChatDrawer {...defaultProps} setMessages={setMessages} />);
    const sendButton = screen.getByTitle("Send");
    fireEvent.click(sendButton);

    expect(setMessages).not.toHaveBeenCalled();
  });

  it("parses SSE events correctly from streamed response", async () => {
    const setMessages = vi.fn();
    const events = [
      'data: {"type":"delta","text":"Hello"}\n\n',
      'data: {"type":"delta","text":" world"}\n\n',
      'data: {"type":"done"}\n\n',
    ];
    global.fetch = createMockStreamFetch(events);

    render(<ChatDrawer {...defaultProps} setMessages={setMessages} />);

    const textarea = screen.getByPlaceholderText("Type a question...");
    fireEvent.change(textarea, { target: { value: "Test" } });

    await act(async () => {
      fireEvent.click(screen.getByTitle("Send"));
    });

    // Wait for streaming to complete and final message to be set
    await waitFor(() => {
      const lastCall = setMessages.mock.calls[setMessages.mock.calls.length - 1];
      // The last call should be the functional updater that adds the assistant message
      expect(lastCall).toBeDefined();
    });

    delete global.fetch;
  });

  it("handles malformed JSON in SSE event gracefully", async () => {
    const setMessages = vi.fn();
    const events = [
      'data: {"type":"delta","text":"Good"}\n\n',
      'data: not-valid-json\n\n',
      'data: {"type":"delta","text":" response"}\n\n',
      'data: {"type":"done"}\n\n',
    ];
    global.fetch = createMockStreamFetch(events);

    render(<ChatDrawer {...defaultProps} setMessages={setMessages} />);

    const textarea = screen.getByPlaceholderText("Type a question...");
    fireEvent.change(textarea, { target: { value: "Test" } });

    await act(async () => {
      fireEvent.click(screen.getByTitle("Send"));
    });

    // Should not crash, should still render normally
    await waitFor(() => {
      expect(setMessages).toHaveBeenCalled();
    });

    delete global.fetch;
  });

  it("handles SSE error event from server", async () => {
    const events = [
      'data: {"type":"error","message":"Rate limited"}\n\n',
    ];
    global.fetch = createMockStreamFetch(events);

    render(<ChatDrawer {...defaultProps} />);

    const textarea = screen.getByPlaceholderText("Type a question...");
    fireEvent.change(textarea, { target: { value: "Test" } });

    await act(async () => {
      fireEvent.click(screen.getByTitle("Send"));
    });

    await waitFor(() => {
      expect(screen.getByText("Rate limited")).toBeInTheDocument();
    });

    delete global.fetch;
  });

  it("handles fetch failure gracefully", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Server error" }),
    });

    render(<ChatDrawer {...defaultProps} />);

    const textarea = screen.getByPlaceholderText("Type a question...");
    fireEvent.change(textarea, { target: { value: "Test" } });

    await act(async () => {
      fireEvent.click(screen.getByTitle("Send"));
    });

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });

    delete global.fetch;
  });

  it("trims messages when over max turns", async () => {
    // Create 20 messages (10 turns worth)
    const manyMessages = Array.from({ length: 20 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `Message ${i}`,
    }));

    render(<ChatDrawer {...defaultProps} messages={manyMessages} />);

    // Should show trimming notice
    expect(screen.getByText(/Older messages trimmed/)).toBeInTheDocument();
  });

  it("clicking suggested question sends it immediately", async () => {
    const setMessages = vi.fn();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: { getReader: () => ({ read: () => Promise.resolve({ done: true, value: undefined }) }) },
    });

    render(<ChatDrawer {...defaultProps} setMessages={setMessages} />);

    await act(async () => {
      fireEvent.click(screen.getByText("What is EBITDA?"));
    });

    // Should have called setMessages with the user message
    expect(setMessages).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ role: "user", content: "What is EBITDA?" }),
      ])
    );

    delete global.fetch;
  });
});
