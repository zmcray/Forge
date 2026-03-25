export default function LearnNav({ sections, currentSection, currentSubsection, onNavigate, getSubsectionProgress, onResetSubsection }) {
  return (
    <nav className="space-y-4">
      {sections.map((section, si) => (
        <div key={section.id}>
          <h3 className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1.5">{section.title}</h3>
          <ul className="space-y-0.5">
            {section.subsections.map((sub, ssi) => {
              const isActive = currentSection === si && currentSubsection === ssi;
              const progress = getSubsectionProgress(sub);
              const allDone = progress && progress.completed === progress.total;

              return (
                <li key={sub.id}>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onNavigate(si, ssi)}
                      className={`flex-1 text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        isActive
                          ? "bg-surface-container-high text-on-surface font-medium"
                          : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                      }`}
                    >
                      {allDone && <span className="text-on-tertiary-container text-xs">&#10003;</span>}
                      <span className="flex-1">{sub.title}</span>
                      {progress && !allDone && (
                        <span className="text-xs text-outline-variant">{progress.completed}/{progress.total}</span>
                      )}
                    </button>
                    {allDone && onResetSubsection && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onResetSubsection(sub);
                          onNavigate(si, ssi);
                        }}
                        title="Redo this section"
                        className="p-1 rounded text-outline-variant hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                          <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.598a.75.75 0 00-.75.75v3.634a.75.75 0 001.5 0v-2.033l.312.311a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm-10.624-2.85a5.5 5.5 0 019.201-2.465l.312.31H11.77a.75.75 0 000 1.5h3.634a.75.75 0 00.75-.75V3.535a.75.75 0 00-1.5 0v2.033l-.312-.311A7 7 0 002.63 8.395a.75.75 0 101.449.39z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
