export default function MasteryCard({ level, description, onViewRanking }) {
  return (
    <div className="bg-primary-container rounded-xl p-6 col-span-2 relative overflow-hidden">
      {/* Decorative background icon */}
      <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-on-primary-container/10 select-none">
        workspace_premium
      </span>

      <div className="relative z-10">
        <span className="text-[10px] uppercase tracking-widest text-on-primary-container font-body font-medium">
          Analyst Mastery
        </span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-4xl font-black font-headline text-on-primary leading-none">
            {level || "Beginner"}
          </span>
        </div>
        <p className="text-sm text-on-primary-container mt-2 max-w-md">
          {description || "Complete more practice sessions to advance your analyst ranking."}
        </p>
        {onViewRanking && (
          <button
            onClick={onViewRanking}
            className="mt-4 text-[11px] uppercase tracking-widest text-tertiary-fixed-dim font-semibold hover:text-on-primary transition-colors"
          >
            View Ranking
          </button>
        )}
      </div>
    </div>
  );
}
