export default function StatCard({ label, value, suffix, icon, progress }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 ghost-border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-body font-medium">{label}</span>
        {icon && (
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">{icon}</span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-black font-headline text-on-surface leading-none">{value}</span>
        {suffix && <span className="text-sm text-on-surface-variant font-body">{suffix}</span>}
      </div>
      {progress != null && (
        <div className="mt-4 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
          <div
            className="h-full bg-tertiary-fixed-dim rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      )}
    </div>
  );
}
