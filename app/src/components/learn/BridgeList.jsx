import { useNavigate } from "react-router-dom";
import { BRIDGE_SCENARIOS } from "../../data/valueBridge";
import { COMPANIES } from "../../data/companies";
import { calculateBridge } from "../../utils/bridgeMath";
import useBridgeProgress from "../../hooks/useBridgeProgress";

// Plan-case MOICs are static data. Compute once at module load, not per render.
const SCENARIO_TILES = BRIDGE_SCENARIOS.map((scenario) => ({
  ...scenario,
  planMoic: calculateBridge(scenario.entry, scenario.exit, scenario.assumptions.holdPeriod).moic,
  company: COMPANIES.find((c) => c.id === scenario.companyId),
}));

export default function BridgeList() {
  const navigate = useNavigate();
  const { getScenario, getStudiedCount, getPassedCount } = useBridgeProgress();
  const studied = getStudiedCount();
  const passed = getPassedCount();

  return (
    <div>
      <h2 className="text-xl font-bold text-on-surface mb-1">Value Creation Bridge</h2>
      <p className="text-sm text-on-surface-variant mb-2">
        Seven PE investment scenarios. Adjust the levers, see how MOIC changes in real time.
      </p>
      {(studied > 0 || passed > 0) && (
        <p className="text-xs text-on-surface-variant mb-6">
          {studied}/{BRIDGE_SCENARIOS.length} studied · {passed}/{BRIDGE_SCENARIOS.length} exercises passed
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {SCENARIO_TILES.map((scenario) => {
          const { company, planMoic } = scenario;
          const progress = getScenario(scenario.id);
          const hasStudied = !!progress.lastStudied;
          const hasPassed = progress.exerciseAttempted && progress.exerciseScore === 5;

          return (
            <button
              key={scenario.id}
              onClick={() => navigate(`/learn/bridge/${scenario.id}`)}
              className="text-left bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-surface-container-high transition-all duration-150"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold text-on-surface leading-tight">
                  {scenario.label}
                </h3>
                <div className="flex gap-1 shrink-0">
                  {hasStudied && (
                    <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container">
                      Studied
                    </span>
                  )}
                  {hasPassed && (
                    <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                      Solved
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-on-surface-variant mb-3 leading-snug line-clamp-2">
                {scenario.thesis}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30">
                <div className="text-[10px] text-on-surface-variant">
                  {company?.name ?? scenario.companyId}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold font-mono text-on-surface">
                    {planMoic.toFixed(1)}x
                  </span>
                  <span className="text-[10px] text-on-surface-variant">MOIC</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
