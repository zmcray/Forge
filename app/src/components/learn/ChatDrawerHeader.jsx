import { CHAT_MODES, MODE_LABEL } from "../../hooks/useChatMode";

export default function ChatDrawerHeader({ contextTitle, mode, onModeChange, onClose }) {
  return (
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
              onClick={() => onModeChange(m)}
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
  );
}
