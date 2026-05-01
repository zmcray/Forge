const MIN_QUALITATIVE_CHARS = 50;

const INPUT_CLASS =
  "w-full border border-outline-variant rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 disabled:bg-surface-container disabled:text-on-surface-variant/50";

export default function CommitInput({ mode, disabled, value, onChange, numericValue, onNumericChange }) {
  if (mode === "quantitative") {
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Your answer</label>
          <input
            type="number"
            step="any"
            className={`${INPUT_CLASS} px-3 py-2 font-mono`}
            placeholder="Enter your numeric answer..."
            value={numericValue ?? ""}
            onChange={e => onNumericChange(e.target.value === "" ? null : parseFloat(e.target.value))}
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant/80 mb-1">Show your work (optional)</label>
          <textarea
            className={`${INPUT_CLASS} min-h-[60px]`}
            placeholder="Walk through your calculation..."
            value={value}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
    );
  }

  const charCount = value.length;
  const meetsMinimum = charCount >= MIN_QUALITATIVE_CHARS;

  return (
    <div>
      <textarea
        className={`${INPUT_CLASS} min-h-[100px]`}
        placeholder="Write your analysis here... (minimum 50 characters)"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      />
      <div className={`text-xs mt-1 ${meetsMinimum ? "text-green-600 dark:text-green-400" : "text-on-surface-variant/60"}`}>
        {charCount}/{MIN_QUALITATIVE_CHARS} characters {meetsMinimum ? "... ready to reveal" : "minimum"}
      </div>
    </div>
  );
}

CommitInput.MIN_QUALITATIVE_CHARS = MIN_QUALITATIVE_CHARS;
