import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import ChatDrawerHeader from "./ChatDrawerHeader";
import ChatComposer from "./ChatComposer";
import useChatContext from "../../hooks/useChatContext";
import useChatMode, { CHAT_MODES, MODE_LABEL } from "../../hooks/useChatMode";
import { useDialog } from "../../hooks/useDialog";
import { forgeFetch } from "../../utils/api";

const MAX_TURNS = 10;

// Escape hatch: a fixed user-visible message keeps the server contract
// unchanged (no new param, no validation surface) while reliably flipping
// the model into direct teaching for one concept.
export const ESCAPE_HATCH_MESSAGE =
  "Please switch to direct teaching for this concept and explain the reasoning.";

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
  const surface = contextType === "practice" ? "practice" : "learn";
  const { mode, setMode } = useChatMode(surface);
  const { dialogRef, dialogProps } = useDialog({ onClose });
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

    // Mode-change dividers are UI-only; strip them (and the per-message mode
    // stamp) from the API payload so the LLM sees a clean role/content
    // history. The server assembles the system prompt from `mode` +
    // `chatParams` (MCR-390); mode was captured above and reflects the state
    // when send was clicked (D8 — in-flight uses old mode; flips during
    // stream apply on next turn).
    const apiMessages = updated
      .filter(m => m.kind !== "mode-change")
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await forgeFetch(
        "/api/chat",
        {
          messages: apiMessages,
          mode: `${surface}-${mode}`,
          params: chatParams,
        },
        { stream: true, signal: ac.signal, fallbackError: "Chat unavailable" }
      );

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
        // The reply is stamped with the mode it was GENERATED under (the one
        // captured at send), which drives the per-message mode pill.
        const pending = pendingModeRef.current;
        pendingModeRef.current = null;
        setMessages(prev => {
          const next = [...prev, { role: "assistant", content: fullText, mode }];
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
  }, [messages, setMessages, isStreaming, chatParams, mode, surface]);

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

  // Escape hatch: after 2+ Socratic assistant turns the user has earned a
  // direct explanation on demand. Dividers don't count as turns.
  const assistantTurnCount = messages.filter(
    m => m.role === "assistant" && m.kind !== "mode-change"
  ).length;
  const showEscapeHatch =
    mode === CHAT_MODES.SOCRATIC && assistantTurnCount >= 2 && !isStreaming;

  return (
    <div
      ref={dialogRef}
      {...dialogProps}
      aria-label={contextTitle ? `Chat: ${contextTitle}` : "Chat"}
      className="w-96 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] max-lg:fixed max-lg:inset-0 max-lg:z-50 flex flex-col bg-surface-container rounded-xl border border-outline-variant/30 overflow-hidden max-lg:rounded-none max-lg:border-0">
      {/* Backdrop for tablet/mobile overlay */}
      <div
        className="hidden max-lg:block fixed inset-0 bg-black/40 -z-10"
        onClick={onClose}
      />

      <ChatDrawerHeader
        contextTitle={contextTitle}
        mode={mode}
        onModeChange={handleModeChange}
        onClose={onClose}
      />

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

      {showEscapeHatch && (
        <div className="px-3 pb-1">
          <button
            type="button"
            onClick={() => sendMessage(ESCAPE_HATCH_MESSAGE)}
            className="text-xs px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container hover:opacity-80 transition-opacity"
          >
            Show me the reasoning
          </button>
        </div>
      )}

      <ChatComposer
        input={input}
        setInput={setInput}
        isStreaming={isStreaming}
        onSend={sendMessage}
        inputRef={inputRef}
      />
    </div>
  );
}
