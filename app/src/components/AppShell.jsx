import { useState } from "react";
import { useScoringState } from "../contexts/ScoringContext";

const NAV_ITEMS = [
  { id: "home", label: "Dashboard", icon: "dashboard" },
  { id: "learn", label: "Fundamentals", icon: "menu_book" },
  { id: "quickfire", label: "Quick Screen", icon: "bolt" },
  { id: "practice", label: "Practice", icon: "analytics" },
  { id: "progress", label: "Progress", icon: "trending_up" },
];

export default function AppShell({ activeView, onNavigate, theme, onToggleTheme, onSearchOpen, children }) {
  const { streak } = useScoringState();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id) => {
    onNavigate(id === "practice" ? "home" : id);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 bg-surface-container-lowest z-50 flex flex-col transition-all duration-200
        ${collapsed ? "w-16" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Branding + collapse toggle */}
        <div className={`pt-8 pb-6 flex items-center ${collapsed ? "px-3 justify-center" : "px-6 justify-between"}`}>
          {collapsed ? (
            <span className="text-lg font-extrabold tracking-tight text-on-surface font-headline">F</span>
          ) : (
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-on-surface font-headline">Forge</h1>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-body mt-1">PE Analyst</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors hidden md:block"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="material-symbols-outlined text-[18px]">
              {collapsed ? "chevron_right" : "chevron_left"}
            </span>
          </button>
          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface md:hidden"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2">
          <ul className="space-y-1">
            {NAV_ITEMS.map(item => {
              const isActive = item.id === activeView || (item.id === "home" && activeView === "home");
              return (
                <li key={item.id} className="relative group">
                  <button
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${collapsed ? "justify-center px-0" : "px-4"} ${
                      isActive
                        ? "bg-surface-container-high text-on-surface font-semibold"
                        : "text-on-surface-variant hover:translate-x-1 hover:text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    {!collapsed && <span className="uppercase tracking-widest text-[11px]">{item.label}</span>}
                  </button>
                  {collapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-inverse-surface text-inverse-on-surface text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                      {item.label}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className={`pb-6 space-y-4 ${collapsed ? "px-2 items-center flex flex-col" : "px-6"}`}>
          {/* Streak */}
          <div className={`flex items-center text-on-surface-variant ${collapsed ? "justify-center gap-0 flex-col" : "gap-2"}`}>
            <span className="material-symbols-outlined text-[20px]">bolt</span>
            <span className="text-sm font-semibold text-on-surface">{streak?.current || 0}</span>
            {!collapsed && <span className="text-[10px] uppercase tracking-widest">day streak</span>}
          </div>

          {/* Theme toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`flex items-center text-on-surface-variant hover:text-on-surface transition-colors ${collapsed ? "justify-center" : "gap-2 text-[11px] uppercase tracking-widest"}`}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="material-symbols-outlined text-[18px]">
                {theme === "dark" ? "light_mode" : "dark_mode"}
              </span>
              {!collapsed && (theme === "dark" ? "Light Mode" : "Dark Mode")}
            </button>
          )}

          {/* Help */}
          <button className={`flex items-center text-on-surface-variant hover:text-on-surface transition-colors ${collapsed ? "justify-center" : "gap-2 text-[11px] uppercase tracking-widest"}`}>
            <span className="material-symbols-outlined text-[18px]">help</span>
            {!collapsed && "Help"}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className={`min-h-screen flex flex-col transition-all duration-200 ${collapsed ? "md:ml-16" : "md:ml-64"}`}>
        {/* Top header (glassmorphism) */}
        <header className="glass-panel sticky top-0 z-30 ghost-border px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant md:hidden"
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>

          {/* Search */}
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2">search</span>
            <input
              type="text"
              placeholder="Search companies, metrics..."
              readOnly
              onClick={onSearchOpen}
              className="pl-10 pr-4 py-2 text-sm bg-surface-container-low rounded-lg w-72 text-on-surface-variant placeholder:text-outline-variant cursor-pointer focus:outline-none hover:bg-surface-container-high transition-colors"
            />
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            {/* Mobile search */}
            <button
              onClick={onSearchOpen}
              className="p-2 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant md:hidden"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
            <button className="p-2 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant hidden md:block">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-on-primary text-xs font-semibold">ZM</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 md:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
