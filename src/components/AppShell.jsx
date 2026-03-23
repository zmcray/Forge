const NAV_ITEMS = [
  { id: "home", label: "Dashboard", icon: "dashboard" },
  { id: "learn", label: "Fundamentals", icon: "menu_book" },
  { id: "practice", label: "Practice", icon: "analytics" },
  { id: "progress", label: "Progress", icon: "trending_up" },
];

export default function AppShell({ activeView, onNavigate, streak, children }) {
  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-surface-container-lowest z-40 hidden md:flex flex-col">
        {/* Branding */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-on-surface font-headline">Forge</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-body mt-1">PE Analyst</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map(item => {
              const isActive = item.id === activeView || (item.id === "home" && activeView === "home");
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id === "practice" ? "home" : item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-surface-container-high text-on-surface font-semibold"
                        : "text-on-surface-variant hover:translate-x-1 hover:text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span className="uppercase tracking-widest text-[11px]">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="px-6 pb-6 space-y-4">
          {/* Streak */}
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">bolt</span>
            <span className="text-sm font-semibold text-on-surface">{streak?.current || 0}</span>
            <span className="text-[10px] uppercase tracking-widest">day streak</span>
          </div>

          {/* Help */}
          <button className="flex items-center gap-2 text-on-surface-variant text-[11px] uppercase tracking-widest hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[18px]">help</span>
            Help
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="md:ml-64 min-h-screen flex flex-col">
        {/* Top header (glassmorphism) */}
        <header className="glass-panel sticky top-0 z-30 ghost-border px-6 py-3 flex items-center justify-between">
          {/* Left: search (decorative) */}
          <div className="relative">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2">search</span>
            <input
              type="text"
              placeholder="Search companies, metrics..."
              readOnly
              className="pl-10 pr-4 py-2 text-sm bg-surface-container-low rounded-lg w-72 text-on-surface-variant placeholder:text-outline-variant cursor-default focus:outline-none"
            />
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="p-2 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-on-primary text-xs font-semibold">ZM</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
