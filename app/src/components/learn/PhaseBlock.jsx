import InitiativeCard from "./InitiativeCard";

const PHASE_META = {
  "months-1-6": {
    label: "Months 1-6",
    tag: "Foundation & Quick Wins",
    color: "bg-primary-container text-on-primary-container",
  },
  "months-7-18": {
    label: "Months 7-18",
    tag: "Optimize & Scale",
    color: "bg-tertiary-container text-on-tertiary-container",
  },
  "months-19-36": {
    label: "Months 19-36",
    tag: "Scale & Exit Prep",
    color: "bg-secondary-container text-on-secondary-container",
  },
};

export default function PhaseBlock({ phaseKey, phase }) {
  const meta = PHASE_META[phaseKey] || {
    label: phaseKey,
    tag: "",
    color: "bg-surface-container-high text-on-surface",
  };

  const ev = phase.expectedValueCreation;

  return (
    <section className="mb-8">
      {/* Phase header */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-semibold ${meta.color}`}
        >
          {meta.label}
        </span>
        <h3 className="text-base font-bold text-on-surface">{phase.name}</h3>
      </div>

      {/* Objective */}
      <div className="bg-surface-container-lowest ghost-border rounded-lg p-3 mb-4">
        <p className="text-[10px] uppercase tracking-widest text-outline-variant mb-1">
          Objective
        </p>
        <p className="text-sm text-on-surface leading-snug">
          {phase.objectiveStatement}
        </p>
      </div>

      {/* Initiatives */}
      <div className="space-y-3 mb-4">
        {phase.initiatives.map((init) => (
          <InitiativeCard key={init.id} initiative={init} />
        ))}
      </div>

      {/* Expected Value Creation */}
      <div className="bg-surface-container-high/50 rounded-lg p-3">
        <p className="text-[10px] uppercase tracking-widest text-outline-variant mb-2">
          Expected Value Creation
        </p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-outline-variant">Revenue</p>
            <p className="text-sm font-semibold text-on-surface">{ev.revenue}</p>
          </div>
          <div>
            <p className="text-xs text-outline-variant">EBITDA Margin</p>
            <p className="text-sm font-semibold text-on-surface">
              {ev.ebitdaMargin}
            </p>
          </div>
          <div>
            <p className="text-xs text-outline-variant">EBITDA $</p>
            <p className="text-sm font-semibold text-primary">{ev.ebitdaDollars}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
