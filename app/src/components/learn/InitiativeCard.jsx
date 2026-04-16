import { useNavigate } from "react-router-dom";
import { VALUE_LEVERS } from "../../data/valueLevers";

export default function InitiativeCard({ initiative }) {
  const navigate = useNavigate();
  const lever = VALUE_LEVERS.find((l) => l.id === initiative.leverId);

  return (
    <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h5 className="text-sm font-bold text-on-surface leading-tight">
          {initiative.name}
        </h5>
        {lever && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/learn/levers/${initiative.leverId}`);
            }}
            className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container hover:opacity-80 transition-opacity shrink-0"
          >
            {lever.title} &rarr;
          </button>
        )}
      </div>

      <p className="text-xs text-on-surface-variant leading-snug mb-3">
        {initiative.description}
      </p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs mb-3">
        <div>
          <span className="text-outline-variant">Owner:</span>{" "}
          <span className="text-on-surface-variant">{initiative.owner}</span>
        </div>
        <div>
          <span className="text-outline-variant">Timeline:</span>{" "}
          <span className="text-on-surface-variant">{initiative.timeline}</span>
        </div>
        <div>
          <span className="text-outline-variant">Start:</span>{" "}
          <span className="text-on-surface-variant">{initiative.startCondition}</span>
        </div>
        <div>
          <span className="text-outline-variant">Resources:</span>{" "}
          <span className="text-on-surface-variant">{initiative.resources}</span>
        </div>
      </div>

      {/* Success Metrics */}
      <div className="mb-2">
        <p className="text-[10px] uppercase tracking-widest text-outline-variant mb-1">
          Success Metrics
        </p>
        <ul className="space-y-0.5">
          {initiative.successMetrics.map((metric, i) => (
            <li
              key={i}
              className="text-xs text-on-surface-variant flex items-start gap-1.5"
            >
              <span className="text-primary mt-0.5">&#8226;</span>
              {metric}
            </li>
          ))}
        </ul>
      </div>

      {/* Dependencies */}
      {initiative.dependencies.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-outline-variant mb-1">
            Dependencies
          </p>
          <div className="flex flex-wrap gap-1">
            {initiative.dependencies.map((dep) => (
              <span
                key={dep}
                className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant"
              >
                {dep}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
