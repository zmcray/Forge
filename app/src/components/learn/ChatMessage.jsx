import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export default function ChatMessage({
  message,
  isStreaming,
  noteId,
  getNoteText,
  setNoteText,
}) {
  const [saved, setSaved] = useState(false);
  const isUser = message.role === "user";

  const handleSave = () => {
    if (!noteId || !setNoteText) return;
    const existing = getNoteText(noteId);
    const combined = existing
      ? existing + "\n--- (from AI chat) ---\n" + message.content
      : message.content;
    setNoteText(noteId, combined);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 ${
          isUser
            ? "bg-surface-container-low text-on-surface"
            : "bg-secondary-container text-on-surface"
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : isStreaming ? (
          <div className="text-sm whitespace-pre-wrap">
            {message.content}
            <span className="inline-block w-1.5 h-4 bg-on-surface/60 animate-pulse ml-0.5 align-text-bottom" />
          </div>
        ) : (
          <div className="text-sm prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-code:text-xs prose-code:bg-surface-container-low prose-code:px-1 prose-code:rounded">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
              disallowedElements={["script"]}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {!isUser && !isStreaming && noteId && (
          <div className="mt-1 flex justify-end">
            {saved ? (
              <span className="text-xs text-primary">Saved!</span>
            ) : (
              <button
                onClick={handleSave}
                className="text-xs text-primary hover:opacity-80 transition-opacity"
              >
                Save to Notes
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
