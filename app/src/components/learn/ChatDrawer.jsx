import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import useChatContext from "../../hooks/useChatContext";

const MAX_TURNS = 10;
const MAX_MESSAGE_LENGTH = 2000;

export default function ChatDrawer({
  subsection,
  chatContext,
  messages,
  setMessages,
  getNoteText,
  setNoteText,
  completedIds,
  onClose,
}) {
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { systemPrompt, suggestedQuestions } = useChatContext({
    subsection,
    completedIds,
    llmResult: chatContext?.llmResult || null,
    messageCount: messages.length,
  });

  // Derive noteId from subsection's notes block
  const noteId = subsection?.blocks?.find(b => b.type === "notes")?.id || null;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Abort streaming on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isStreaming) return;
    setError(null);

    const userMsg = { role: "user", content: text.trim() };
    let updated = [...messages, userMsg];

    // Trim oldest pair if over max turns
    if (updated.length > MAX_TURNS * 2) {
      updated = updated.slice(2);
    }

    setMessages(updated);
    setInput("");
    setIsStreaming(true);
    setStreamingText("");

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forge-token": import.meta.env.VITE_FORGE_AUTH_TOKEN || "",
        },
        body: JSON.stringify({ messages: updated, systemPrompt }),
        signal: ac.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Chat unavailable");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop();
        for (const event of events) {
          const dataLine = event.split("\n").find(l => l.startsWith("data: "));
          if (!dataLine) continue;
          let payload;
          try { payload = JSON.parse(dataLine.slice(6)); } catch { continue; }
          if (payload.type === "delta") {
            fullText += payload.text;
            setStreamingText(fullText);
          } else if (payload.type === "error") {
            setError(payload.message);
          }
        }
      }

      if (fullText) {
        setMessages(prev => [...prev, { role: "assistant", content: fullText }]);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Something went wrong. Try rephrasing your question.");
      }
    } finally {
      setIsStreaming(false);
      setStreamingText("");
      abortRef.current = null;
    }
  }, [messages, setMessages, isStreaming, systemPrompt]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSuggestedClick = (question) => {
    sendMessage(question);
  };

  const charCount = input.length;
  const showCharWarning = charCount > 1500;

  return (
    <div className="w-96 max-lg:fixed max-lg:inset-0 max-lg:z-50 flex flex-col bg-surface-container rounded-xl border border-outline-variant/30 overflow-hidden max-lg:rounded-none max-lg:border-0">
      {/* Backdrop for tablet/mobile overlay */}
      <div
        className="hidden max-lg:block fixed inset-0 bg-black/40 -z-10"
        onClick={onClose}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/30 bg-surface-container-low">
        <h3 className="text-sm font-semibold text-on-surface truncate">
          Chat: {subsection?.title || ""}
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-surface-container transition-colors"
          title="Close chat"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-xl">close</span>
        </button>
      </div>

      {/* Suggested questions */}
      {messages.length === 0 && suggestedQuestions.length > 0 && (
        <div className="px-3 py-2 border-b border-outline-variant/20 flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSuggestedClick(q)}
              disabled={isStreaming}
              className="text-xs px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container hover:opacity-80 transition-opacity disabled:opacity-50 text-left"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0">
        {messages.length === 0 && !isStreaming && (
          <p className="text-sm text-on-surface-variant text-center mt-8">
            Ask a question about {subsection?.title || "this concept"}
          </p>
        )}

        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            message={msg}
            isStreaming={false}
            noteId={noteId}
            getNoteText={getNoteText}
            setNoteText={setNoteText}
          />
        ))}

        {isStreaming && streamingText && (
          <ChatMessage
            message={{ role: "assistant", content: streamingText }}
            isStreaming={true}
            noteId={null}
            getNoteText={getNoteText}
            setNoteText={setNoteText}
          />
        )}

        {error && (
          <div className="text-xs text-error bg-error-container rounded-lg px-3 py-2 mb-3">
            {error}
          </div>
        )}

        {messages.length > (MAX_TURNS - 1) * 2 && (
          <p className="text-xs text-on-surface-variant text-center mb-2">
            Older messages trimmed to keep the conversation focused.
          </p>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-outline-variant/30 p-3">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a question..."
              disabled={isStreaming}
              rows={1}
              maxLength={MAX_MESSAGE_LENGTH}
              className="w-full resize-none rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary disabled:opacity-50"
              style={{ minHeight: "36px", maxHeight: "96px" }}
              onInput={e => {
                e.target.style.height = "36px";
                e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
              }}
            />
            {showCharWarning && (
              <span className="absolute right-2 bottom-1 text-[10px] text-on-surface-variant">
                {charCount}/{MAX_MESSAGE_LENGTH}
              </span>
            )}
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
            className="p-2 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-40 flex-shrink-0"
            title="Send"
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
