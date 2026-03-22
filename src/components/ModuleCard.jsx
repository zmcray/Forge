export default function ModuleCard({ icon, title, description, badges, ctaLabel, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-surface-container-lowest rounded-xl p-6 text-left ghost-border flex flex-col h-[320px] group hover:shadow-md transition-all duration-200 relative overflow-hidden border-b-2 border-transparent hover:border-primary"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center mb-5">
        <span className="material-symbols-outlined text-[24px] text-on-secondary-container">{icon}</span>
      </div>

      {/* Title + description */}
      <h3 className="text-xl font-bold font-headline text-on-surface mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant font-body leading-relaxed flex-1">{description}</p>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-4 pt-4">
        {badges && (
          <div className="flex gap-2">
            {badges.map((badge, i) => (
              <span key={i} className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-medium">
                {badge}
              </span>
            ))}
          </div>
        )}
        <span className="flex items-center gap-1 text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant group-hover:text-primary transition-colors ml-auto">
          {ctaLabel || "Start"}
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </span>
      </div>
    </button>
  );
}
