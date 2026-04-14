const MIN_QUALITATIVE_CHARS = 50;

export default function CommitInput({ mode, disabled, value, onChange, numericValue, onNumericChange }) {
  if (mode === "quantitative") {
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your answer</label>
          <input
            type="number"
            step="any"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
            placeholder="Enter your numeric answer..."
            value={numericValue ?? ""}
            onChange={e => onNumericChange(e.target.value === "" ? null : parseFloat(e.target.value))}
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Show your work (optional)</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[60px] focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
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
        className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
        placeholder="Write your analysis here... (minimum 50 characters)"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      />
      <div className={`text-xs mt-1 ${meetsMinimum ? "text-green-600" : "text-gray-400"}`}>
        {charCount}/{MIN_QUALITATIVE_CHARS} characters {meetsMinimum ? "... ready to reveal" : "minimum"}
      </div>
    </div>
  );
}

CommitInput.MIN_QUALITATIVE_CHARS = MIN_QUALITATIVE_CHARS;
