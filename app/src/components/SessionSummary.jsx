import { useState } from "react";
import { QUESTION_TYPES } from "../data/questionTypes";
import { average, averageScore, averageAbsDelta } from "../utils/scoreMath";

export default function SessionSummary({ company, questions, elapsedMinutes, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!questions || questions.length === 0) return null;

  const avgScore = averageScore(questions).toFixed(1);
  const avgDelta = averageAbsDelta(questions)?.toFixed(1) ?? null;

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
      const avg = average(scores).toFixed(1);
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
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-lg font-bold text-on-surface mb-4">Session Summary</h2>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center bg-surface-container-low rounded-lg p-3">
            <p className="text-2xl font-bold text-on-surface">{elapsedMinutes}</p>
            <p className="text-xs text-on-surface-variant">Minutes</p>
          </div>
          <div className="text-center bg-surface-container-low rounded-lg p-3">
            <p className="text-2xl font-bold text-primary">{avgScore}</p>
            <p className="text-xs text-on-surface-variant">Avg Score</p>
          </div>
          <div className="text-center bg-surface-container-low rounded-lg p-3">
            <p className="text-2xl font-bold text-on-tertiary-container">{questions.filter(q => q.score >= 4).length}</p>
            <p className="text-xs text-on-surface-variant">Strong (4-5)</p>
          </div>
        </div>

        {Object.entries(byType).map(([type, scores]) => {
          const info = QUESTION_TYPES[type];
          const avg = average(scores).toFixed(1);
          return (
            <div key={type} className="flex items-center gap-2 text-sm mb-1.5">
              <span>{info?.icon}</span>
              <span className="text-on-surface-variant flex-1">{info?.label}</span>
              <span className="font-mono font-semibold">{avg}/5</span>
            </div>
          );
        })}

        <div className="flex gap-2 mt-5">
          <button
            onClick={handleCopy}
            className="flex-1 px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity"
          >
            {copied ? "Copied!" : "Copy Summary"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium bg-surface-container-lowest border border-outline-variant rounded-lg hover:bg-surface-container transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
