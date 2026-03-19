import { useState } from "react";
import { QUESTION_TYPES } from "../data/questionTypes";

export default function SessionSummary({ company, questions, elapsedMinutes, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!questions || questions.length === 0) return null;

  const avgScore = (questions.reduce((sum, q) => sum + q.score, 0) / questions.length).toFixed(1);
  const quantitative = questions.filter(q => q.delta != null);
  const avgDelta = quantitative.length > 0
    ? (quantitative.reduce((sum, q) => sum + Math.abs(q.delta), 0) / quantitative.length).toFixed(1)
    : null;

  const byType = {};
  for (const q of questions) {
    if (!byType[q.type]) byType[q.type] = [];
    byType[q.type].push(q.score);
  }

  const summaryText = [
    `Forge Practice Session -- ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
    `Company: ${company.name} (${company.industry})`,
    `Time: ${elapsedMinutes} min | Questions: ${questions.length} | Avg Score: ${avgScore}/5`,
    avgDelta ? `Quantitative Accuracy: avg ${avgDelta}pp off` : null,
    "",
    "By Category:",
    ...Object.entries(byType).map(([type, scores]) => {
      const info = QUESTION_TYPES[type];
      const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
      return `  ${info?.label || type}: ${avg}/5 (${scores.length} Qs)`;
    }),
  ].filter(Boolean).join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text in a textarea
      const ta = document.createElement("textarea");
      ta.value = summaryText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Session Summary</h2>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-gray-900">{elapsedMinutes}</p>
            <p className="text-xs text-gray-500">Minutes</p>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-blue-600">{avgScore}</p>
            <p className="text-xs text-gray-500">Avg Score</p>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-600">{questions.filter(q => q.score >= 4).length}</p>
            <p className="text-xs text-gray-500">Strong (4-5)</p>
          </div>
        </div>

        {Object.entries(byType).map(([type, scores]) => {
          const info = QUESTION_TYPES[type];
          const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
          return (
            <div key={type} className="flex items-center gap-2 text-sm mb-1.5">
              <span>{info?.icon}</span>
              <span className="text-gray-700 flex-1">{info?.label}</span>
              <span className="font-mono font-semibold">{avg}/5</span>
            </div>
          );
        })}

        <div className="flex gap-2 mt-5">
          <button
            onClick={handleCopy}
            className="flex-1 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copied ? "Copied!" : "Copy Summary"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
