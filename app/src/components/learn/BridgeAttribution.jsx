import { computeAttribution } from "../../utils/bridgeMath";

const ROW_STYLES = {
  entryEquity: { label: "Entry Equity", color: "bg-outline-variant" },
  ebitdaGrowth: { label: "EBITDA Growth", color: "bg-primary" },
  multipleExpansion: { label: "Multiple Expansion", color: "bg-tertiary" },
  debtPaydown: { label: "Debt Paydown", color: "bg-secondary" },
};

const ROW_ORDER = ["entryEquity", "ebitdaGrowth", "multipleExpansion", "debtPaydown"];

export default function BridgeAttribution({ bridge }) {
  const attr = computeAttribution(bridge);
  const values = {
    entryEquity: bridge.entryEquity,
    ebitdaGrowth: bridge.ebitdaGrowth,
    multipleExpansion: bridge.multipleExpansion,
    debtPaydown: bridge.debtPaydown,
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-4">
      <div className="space-y-2">
        {ROW_ORDER.map((key) => {
          const style = ROW_STYLES[key];
          const pct = attr[key];
          const value = values[key];
          const barWidthPct = Math.max(0, Math.min(100, Math.abs(pct)));

          return (
            <div key={key} className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-40 shrink-0">
                <span className={`w-2 h-2 rounded-full ${style.color}`} />
                <span className="text-xs text-on-surface">{style.label}</span>
              </div>
              <div className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded h-5 relative overflow-hidden">
                <div
                  className={`h-full ${style.color} opacity-60 rounded-l transition-all duration-200`}
                  style={{ width: `${barWidthPct}%` }}
                />
              </div>
              <div className="flex items-baseline gap-2 w-32 shrink-0 justify-end">
                <span className="text-xs text-on-surface-variant font-mono">
                  {`${value >= 0 ? "" : "-"}$${Math.abs(value).toFixed(1)}M`}
                </span>
                <span className="text-xs font-semibold text-on-surface font-mono">
                  {pct.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
