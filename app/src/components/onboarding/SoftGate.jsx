import { useOnboarding } from "../../contexts/OnboardingContext";

export default function SoftGate({
  gateId,
  message,
  recommendedAction,
  recommendedLabel,
}) {
  const { hasBypassedGate, bypassGate } = useOnboarding();

  if (hasBypassedGate(gateId)) return null;

  return (
    <div className="bg-surface-container-low border-l-4 border-primary rounded-lg px-4 py-3 mb-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className="material-symbols-outlined text-[20px] text-primary shrink-0">
          info
        </span>
        <p className="text-sm text-on-surface-variant">{message}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {recommendedAction && (
          <button
            onClick={recommendedAction}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-on-primary bg-primary hover:opacity-90 transition-opacity"
          >
            {recommendedLabel}
          </button>
        )}
        <button
          onClick={() => bypassGate(gateId)}
          className="text-xs text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-widest font-medium"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
