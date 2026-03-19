export default function LearnNav({ sections, currentSection, currentSubsection, onNavigate, getSubsectionProgress }) {
  return (
    <nav className="space-y-4">
      {sections.map((section, si) => (
        <div key={section.id}>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{section.title}</h3>
          <ul className="space-y-0.5">
            {section.subsections.map((sub, ssi) => {
              const isActive = currentSection === si && currentSubsection === ssi;
              const progress = getSubsectionProgress(sub);
              const allDone = progress && progress.completed === progress.total;

              return (
                <li key={sub.id}>
                  <button
                    onClick={() => onNavigate(si, ssi)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      isActive
                        ? "bg-blue-100 text-blue-800 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {allDone && <span className="text-green-500 text-xs">&#10003;</span>}
                    <span className="flex-1">{sub.title}</span>
                    {progress && !allDone && (
                      <span className="text-xs text-gray-400">{progress.completed}/{progress.total}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
