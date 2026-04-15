import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BRIDGE_SCENARIOS } from "../../data/valueBridge";
import { COMPANIES } from "../../data/companies";
import {
  calculateBridge,
  applyAssumptions,
  gradeExercise,
} from "../../utils/bridgeMath";
import useBridgeProgress from "../../hooks/useBridgeProgress";
import useNotes from "../../hooks/useNotes";
import BridgeSliders from "./BridgeSliders";
import BridgeWaterfall from "./BridgeWaterfall";
import BridgeAttribution from "./BridgeAttribution";
import BridgeExercise from "./BridgeExercise";

export default function BridgeCalculator() {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const { markStudied, markExerciseAttempted, setCustomAssumptions } = useBridgeProgress();
  const { getNoteText, setNoteText } = useNotes();

  const scenario = BRIDGE_SCENARIOS.find((s) => s.id === scenarioId);

  const [userAssumptions, setUserAssumptions] = useState(
    scenario ? { ...scenario.assumptions } : null
  );
  const [lastResult, setLastResult] = useState(null);

  // Mark studied on mount
  useEffect(() => {
    if (scenario) markStudied(scenarioId);
  }, [scenarioId, scenario, markStudied]);

  // Reset state when navigating to a different scenario
  useEffect(() => {
    if (scenario) {
      setUserAssumptions({ ...scenario.assumptions });
      setLastResult(null);
    }
  }, [scenarioId, scenario]);

  // Derive exit and bridge from current user assumptions
  const userExit = useMemo(
    () => (scenario && userAssumptions ? applyAssumptions(scenario.entry, userAssumptions) : null),
    [scenario, userAssumptions]
  );
  const bridge = useMemo(
    () =>
      scenario && userExit
        ? calculateBridge(scenario.entry, userExit, userAssumptions.holdPeriod)
        : null,
    [scenario, userExit, userAssumptions]
  );

  if (!scenario) {
    return (
      <div className="text-center py-12">
        <p className="text-on-surface-variant">Scenario not found.</p>
        <button
          onClick={() => navigate("/learn/bridge")}
          className="mt-4 text-sm text-primary hover:opacity-80"
        >
          Back to scenarios
        </button>
      </div>
    );
  }

  const company = COMPANIES.find((c) => c.id === scenario.companyId);
  const currentIndex = BRIDGE_SCENARIOS.findIndex((s) => s.id === scenarioId);
  const prevScenario = currentIndex > 0 ? BRIDGE_SCENARIOS[currentIndex - 1] : null;
  const nextScenario =
    currentIndex < BRIDGE_SCENARIOS.length - 1 ? BRIDGE_SCENARIOS[currentIndex + 1] : null;

  const planAssumptions = scenario.assumptions;
  const isDirty = Object.keys(planAssumptions).some(
    (k) => userAssumptions[k] !== planAssumptions[k]
  );

  const handleSliderChange = (key, value) => {
    setUserAssumptions((prev) => {
      const next = { ...prev, [key]: value };
      setCustomAssumptions(scenarioId, next);
      return next;
    });
    setLastResult(null);
  };

  const handleReset = () => {
    setUserAssumptions({ ...scenario.assumptions });
    setLastResult(null);
  };

  const handleCheckExercise = () => {
    const result = gradeExercise(
      scenario.entry,
      userAssumptions,
      scenario.exerciseTarget.moic
    );
    setLastResult(result);
    markExerciseAttempted(scenarioId, result.passed);
  };

  const noteId = `bridge-${scenarioId}`;
  const noteText = getNoteText(noteId);

  return (
    <div>
      {/* Back link */}
      <button
        onClick={() => navigate("/learn/bridge")}
        className="text-sm text-on-surface-variant hover:text-on-surface mb-4 inline-flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        All Scenarios
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">
          Value Creation Bridge
        </span>
        <span className="text-xs text-outline-variant">
          {currentIndex + 1} / {BRIDGE_SCENARIOS.length}
        </span>
      </div>
      <h2 className="text-xl font-bold text-on-surface mb-1">{scenario.label}</h2>
      <p className="text-sm text-on-surface-variant mb-2">{scenario.thesis}</p>
      {company && (
        <button
          onClick={() => navigate(`/practice/${company.id}`)}
          className="text-xs text-primary hover:opacity-80 mb-6 inline-flex items-center gap-1"
        >
          {company.name}
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      )}

      {/* Description */}
      <section className="mb-6">
        <p className="text-sm text-on-surface leading-relaxed">{scenario.description}</p>
      </section>

      {/* Entry metrics */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">
          Entry (Year 0)
        </h3>
        <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          <Metric label="Revenue" value={`$${scenario.entry.revenue.toFixed(1)}M`} />
          <Metric label="EBITDA" value={`$${scenario.entry.ebitda.toFixed(1)}M`} />
          <Metric label="EBITDA Margin" value={`${scenario.entry.ebitdaMargin.toFixed(1)}%`} />
          <Metric label="Multiple" value={`${scenario.entry.multiple.toFixed(1)}x`} />
          <Metric label="Enterprise Value" value={`$${scenario.entry.enterpriseValue.toFixed(1)}M`} />
          <Metric label="Net Debt" value={`$${scenario.entry.netDebt.toFixed(1)}M`} />
        </div>
      </section>

      {/* Sliders */}
      <section className="mb-6">
        <BridgeSliders
          assumptions={userAssumptions}
          ranges={scenario.sliderRanges}
          onChange={handleSliderChange}
          onReset={handleReset}
          canReset={isDirty}
        />
      </section>

      {/* Key metrics bar */}
      <section className="mb-6">
        <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-4 flex items-center justify-around">
          <BigMetric label="MOIC" value={`${bridge.moic.toFixed(2)}x`} />
          <BigMetric
            label="IRR"
            value={bridge.irr != null ? `${(bridge.irr * 100).toFixed(1)}%` : "—"}
          />
          <BigMetric
            label="Equity Gain"
            value={`$${(bridge.exitEquity - bridge.entryEquity).toFixed(1)}M`}
          />
        </div>
      </section>

      {/* Waterfall chart */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">
          Return Decomposition
        </h3>
        <BridgeWaterfall bridge={bridge} />
      </section>

      {/* Attribution table */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">
          Return Attribution
        </h3>
        <BridgeAttribution bridge={bridge} />
      </section>

      {/* Exercise */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-3">
          Practice
        </h3>
        <BridgeExercise
          exerciseTarget={scenario.exerciseTarget}
          userMoic={bridge.moic}
          onCheck={handleCheckExercise}
          lastResult={lastResult}
        />
      </section>

      {/* Key lesson */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">
          Key Lesson
        </h3>
        <div className="bg-tertiary-container/50 border border-on-tertiary-container/30 rounded-lg p-4">
          <p className="text-sm text-on-surface leading-relaxed">{scenario.keyLesson}</p>
        </div>
      </section>

      {/* Notes */}
      <section className="mb-8">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">
          My Notes
        </h3>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(noteId, e.target.value)}
          placeholder="Capture your key takeaways..."
          className="w-full min-h-[80px] text-sm text-on-surface bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-3 resize-y focus:outline-none focus:border-primary/50 placeholder:text-outline-variant"
        />
      </section>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-outline-variant/30">
        <button
          onClick={() => prevScenario && navigate(`/learn/bridge/${prevScenario.id}`)}
          disabled={!prevScenario}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${!prevScenario ? "text-outline-variant cursor-not-allowed" : "text-on-surface-variant hover:bg-surface-container-low"}`}
        >
          Previous
        </button>
        <button
          onClick={() => nextScenario && navigate(`/learn/bridge/${nextScenario.id}`)}
          disabled={!nextScenario}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${!nextScenario ? "text-outline-variant cursor-not-allowed" : "bg-primary text-on-primary hover:opacity-90"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</div>
      <div className="text-sm font-mono font-semibold text-on-surface">{value}</div>
    </div>
  );
}

function BigMetric({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
        {label}
      </div>
      <div className="text-2xl font-bold font-mono text-on-surface">{value}</div>
    </div>
  );
}
