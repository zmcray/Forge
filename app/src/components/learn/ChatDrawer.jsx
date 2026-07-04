import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import useChatContext from "../../hooks/useChatContext";
import useChatMode, { CHAT_MODES } from "../../hooks/useChatMode";

const MAX_TURNS = 10;
const MAX_MESSAGE_LENGTH = 2000;

const MODE_LABEL = {
  [CHAT_MODES.DIRECT]: "Direct",
  [CHAT_MODES.SOCRATIC]: "Socratic",
};

const resolvePracticeTitle = (practiceContext) => {
  if (!practiceContext) return "";
  if (typeof practiceContext === "string") return practiceContext;
  return (
    practiceContext.title ||
    practiceContext.name ||
    practiceContext.companyName ||
    practiceContext.company?.name ||
    practiceContext.questionTitle ||
    practiceContext.question?.title ||
    ""
  );
};

export default function ChatDrawer({
  subsection,
  contextType,
  practiceContext,
  title,
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
  const { mode, setMode } = useChatMode();
  const abortRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const pendingModeRef = useRef(null);
  const contextTitle = title || resolvePracticeTitle(practiceContext) || subsection?.title || "";
  const emptyStateSubject = contextTitle || "this topic";

  // Trim banner + system-prompt trim notification key off role-bearing messages
  // only. Mode-change dividers are UI-only and never sent to the LLM, so they
  // must not inflate the perceived turn count.
  const roleMessageCount = messages.filter(m => m.kind !== "mode-change").length;

  const { chatParams, suggestedQuestions } = useChatContext({
    subsection,
    contextType,
    practiceContext,
    title,
    completedIds,
    llmResult: chatContext?.llmResult || null,
    messageCount: roleMessageCount,
    mode,
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

    // Trim the oldest user/assistant pair if we're over budget. Counting and
    // slicing must operate on role-bearing messages only — divider rows are
    // UI-only and counting them inflates the budget. When we trim, dividers
    // anchored to the dropped prefix go with them, since the context they
    // referenced is no longer in the conversation.
    const roleMessages = updated.filter(m => m.kind !== "mode-change");
    if (roleMessages.length > MAX_TURNS * 2) {
      updated = roleMessages.slice(2);
    }

    setMessages(updated);
    setInput("");
    setIsStreaming(true);
    setStreamingText("");

    const ac = new AbortController();
    abortRef.current = ac;

    // Mode-change dividers are UI-only; strip them from the API payload so the
    // LLM sees a clean role/content history. The server assembles the system
    // prompt from `mode` + `chatParams` (MCR-390); mode was captured above and
    // reflects the state when send was clicked (D8 — in-flight uses old mode;
    // flips during stream apply on next turn).
    const apiMessages = updated
      .filter(m => m.kind !== "mode-change")
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // VITE_FORGE_AUTH_TOKEN is obfuscation, not auth: it ships in the
          // public JS bundle. Real abuse protection is server-side (rate
          // limiting + server-owned prompts).
          "x-forge-token": import.meta.env.VITE_FORGE_AUTH_TOKEN || "",
        },
        body: JSON.stringify({
          messages: apiMessages,
          mode: `${contextType === "practice" ? "practice" : "learn"}-${mode}`,
          params: chatParams,
        }),
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
        // If the user toggled mode while we were streaming, the divider was
        // deferred so the visible transcript stays chronologically honest:
        // the in-flight assistant reply was generated under the OLD prompt,
        // so it must render BEFORE the divider that announces the new mode.
        const pending = pendingModeRef.current;
        pendingModeRef.current = null;
        setMessages(prev => {
          const next = [...prev, { role: "assistant", content: fullText }];
          if (pending) {
            next.push({
              role: "assistant",
              kind: "mode-change",
              content: `Switched to ${MODE_LABEL[pending]} mode.`,
            });
          }
          return next;
        });
      } else if (pendingModeRef.current) {
        // Stream produced nothing (error or empty). Still flush the divider
        // so the user sees their toggle took effect.
        const pending = pendingModeRef.current;
        pendingModeRef.current = null;
        setMessages(prev => [
          ...prev,
          { role: "assistant", kind: "mode-change", content: `Switched to ${MODE_LABEL[pending]} mode.` },
        ]);
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
  }, [messages, setMessages, isStreaming, chatParams, mode, contextType]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSuggestedClick = (question) => {
    sendMessage(question);
  };

  const handleModeChange = (next) => {
    if (next === mode) return;
    setMode(next);
    // Only emit a divider if there's existing conversation to mark.
    if (messages.length === 0) return;
    // While streaming, the in-flight assistant reply was produced under the
    // OLD prompt. Defer the divider until the stream completes so the visible
    // transcript stays chronologically honest. Multiple flips during one
    // stream collapse to the final mode (`pendingModeRef` is overwritten).
    if (isStreaming) {
      pendingModeRef.current = next;
      return;
    }
    setMessages(prev => [
      ...prev,
      {
        role: "assistant",
        kind: "mode-change",
        content: `Switched to ${MODE_LABEL[next]} mode.`,
      },
    ]);
  };

  const charCount = input.length;
  const showCharWarning = charCount > 1500;

  return (
    <div className="w-96 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] max-lg:fixed max-lg:inset-0 max-lg:z-50 flex flex-col bg-surface-container rounded-xl border border-outline-variant/30 overflow-hidden max-lg:rounded-none max-lg:border-0">
      {/* Backdrop for tablet/mobile overlay */}
      <div
        className="hidden max-lg:block fixed inset-0 bg-black/40 -z-10"
        onClick={onClose}
      />

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-outline-variant/30 bg-surface-container-low">
        <h3 className="text-sm font-semibold text-on-surface truncate flex-1 min-w-0">
          {contextTitle ? `Chat: ${contextTitle}` : "Chat"}
        </h3>
        <div
          role="group"
          aria-label="Chat mode"
          className="flex items-center gap-0.5 rounded-full bg-surface-container p-0.5 flex-shrink-0"
        >
          {[CHAT_MODES.DIRECT, CHAT_MODES.SOCRATIC].map(m => {
            const active = mode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => handleModeChange(m)}
                aria-pressed={active}
                className={`text-xs px-2.5 py-0.5 rounded-full transition-colors ${
                  active
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:opacity-80"
                }`}
              >
                {MODE_LABEL[m]}
              </button>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-surface-container transition-colors flex-shrink-0"
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
            {mode === CHAT_MODES.SOCRATIC
              ? `I'll guide you with questions. Ask me to test you on ${emptyStateSubject}.`
              : `Ask a question about ${emptyStateSubject}`}
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

        {roleMessageCount > (MAX_TURNS - 1) * 2 && (
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
