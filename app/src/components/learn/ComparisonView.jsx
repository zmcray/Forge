import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { COMPARISONS } from "../../data/comparisons";
import { COMPANIES } from "../../data/companies";
import { resolveDataPath } from "../../utils/resolveDataPath";
import useNotes from "../../hooks/useNotes";

function formatDataValue(value, dp) {
  if (value == null || value === undefined) return "N/A";
  // Handle array values (e.g., incomeStatement.revenue => [28.1, 32.5])
  if (Array.isArray(value)) {
    if (dp.arrayIndex != null) {
      value = value[dp.arrayIndex];
    } else {
      // Show the most recent year (last element)
      value = value[value.length - 1];
    }
  }
  const prefix = dp.prefix || "";
  const suffix = dp.suffix || "";
  return `${prefix}${value}${suffix}`;
}

export default function ComparisonView() {
  const { comparisonId } = useParams();
  const navigate = useNavigate();
  const { getNoteText, setNoteText } = useNotes();

  const comparison = COMPARISONS.find((c) => c.id === comparisonId);
  const [insightRevealed, setInsightRevealed] = useState(false);

  if (!comparison) {
    return (
      <div className="text-center py-12">
        <p className="text-on-surface-variant">Comparison not found.</p>
        <button
          onClick={() => navigate("/learn/compare")}
          className="mt-4 text-sm text-primary hover:opacity-80"
        >
          Back to comparisons
        </button>
      </div>
    );
  }

  const companies = comparison.companies.map((id) =>
    COMPANIES.find((c) => c.id === id)
  ).filter(Boolean);

  const currentIndex = COMPARISONS.findIndex((c) => c.id === comparisonId);
  const prevComparison = currentIndex > 0 ? COMPARISONS[currentIndex - 1] : null;
  const nextComparison = currentIndex < COMPARISONS.length - 1 ? COMPARISONS[currentIndex + 1] : null;

  return (
    <div>
      {/* Back link */}
      <button
        onClick={() => navigate("/learn/compare")}
        className="text-sm text-on-surface-variant hover:text-on-surface mb-4 inline-flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        All Comparisons
      </button>

      {/* Header */}
      <h2 className="text-xl font-bold text-on-surface mb-1">{comparison.title}</h2>
      <p className="text-sm text-on-surface-variant mb-2">{comparison.subtitle}</p>
      <p className="text-sm text-on-surface-variant mb-6">{comparison.description}</p>

      {/* Data grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {companies.map((co) => (
          <div
            key={co.id}
            className="bg-surface-container-lowest ghost-border rounded-xl p-4"
          >
            <h3 className="text-sm font-bold text-on-surface mb-0.5">{co.name}</h3>
            <p className="text-xs text-on-surface-variant mb-3">{co.industry}</p>
            <div className="space-y-2">
              {comparison.dataPoints.map((dp) => {
                const value = resolveDataPath(co, dp.path);
                return (
                  <div key={dp.label} className="flex justify-between items-center">
                    <span className="text-xs text-on-surface-variant">{dp.label}</span>
                    <span className="text-sm font-semibold text-on-surface font-mono">
                      {formatDataValue(value, dp)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Analysis prompts */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-4">
          Think About It
        </h3>
        <div className="space-y-4">
          {comparison.analysisPrompts.map((prompt, i) => {
            const noteId = `compare-${comparison.id}-${i}`;
            const noteText = getNoteText(noteId);

            return (
              <div
                key={i}
                className="border border-outline-variant/30 rounded-lg overflow-hidden"
              >
                <div className="bg-surface-container-low px-4 py-2">
                  <p className="text-sm font-medium text-on-surface">{prompt}</p>
                </div>
                <div className="p-3">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(noteId, e.target.value)}
                    placeholder="Type your analysis here..."
                    className="w-full min-h-[80px] text-sm text-on-surface bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-3 resize-y focus:outline-none focus:border-primary/50 placeholder:text-outline-variant"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Insight */}
      <div className="mb-8">
        {!insightRevealed ? (
          <button
            onClick={() => setInsightRevealed(true)}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity"
          >
            Reveal Key Insight
          </button>
        ) : (
          <div className="bg-tertiary-container border border-on-tertiary-container/30 rounded-lg p-4">
            <p className="font-semibold text-on-tertiary-container text-xs uppercase mb-2">Key Insight</p>
            <p className="text-sm text-on-tertiary-container">{comparison.keyInsight}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-outline-variant/30">
        <button
          onClick={() => prevComparison && navigate(`/learn/compare/${prevComparison.id}`)}
          disabled={!prevComparison}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${!prevComparison ? "text-outline-variant cursor-not-allowed" : "text-on-surface-variant hover:bg-surface-container-low"}`}
        >
          Previous
        </button>
        <button
          onClick={() => nextComparison && navigate(`/learn/compare/${nextComparison.id}`)}
          disabled={!nextComparison}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${!nextComparison ? "text-outline-variant cursor-not-allowed" : "bg-primary text-on-primary hover:opacity-90"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
