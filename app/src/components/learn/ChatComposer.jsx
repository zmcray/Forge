const MAX_MESSAGE_LENGTH = 2000;

export default function ChatComposer({ input, setInput, isStreaming, onSend, inputRef }) {
  const charCount = input.length;
  const showCharWarning = charCount > 1500;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(input);
    }
  };

  return (
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
          onClick={() => onSend(input)}
          disabled={!input.trim() || isStreaming}
          className="p-2 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-40 flex-shrink-0"
          title="Send"
        >
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </div>
    </div>
  );
}
