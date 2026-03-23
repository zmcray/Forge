import { useState, useEffect, useRef, useMemo } from "react";
import { COMPANIES } from "../data/companies";
import { LEARN_CONTENT } from "../data/learnContent";

function buildIndex() {
  const items = [];

  // Companies
  for (const co of COMPANIES) {
    items.push({
      type: "company",
      id: co.id,
      title: co.name,
      subtitle: `${co.industry} · $${(co.revenue / 1e6).toFixed(1)}M revenue`,
      icon: "domain",
      keywords: [co.name, co.industry, co.id, co.description, co.context].join(" ").toLowerCase(),
    });
  }

  // Learn sections
  for (const section of LEARN_CONTENT) {
    for (const sub of section.subsections) {
      items.push({
        type: "learn",
        id: sub.id,
        sectionIndex: LEARN_CONTENT.indexOf(section),
        subIndex: section.subsections.indexOf(sub),
        title: sub.title,
        subtitle: section.title,
        icon: "menu_book",
        keywords: [sub.title, section.title, ...(sub.blocks || []).filter(b => b.type === "text").map(b => b.content)].join(" ").toLowerCase(),
      });
    }
  }

  // Metric terms
  const metrics = [
    { title: "Gross Margin", subtitle: "Gross Profit / Revenue", keywords: "gross margin profit cogs" },
    { title: "EBITDA", subtitle: "Earnings Before Interest, Taxes, Depreciation, Amortization", keywords: "ebitda earnings operating" },
    { title: "Adjusted EBITDA", subtitle: "EBITDA + legitimate add-backs", keywords: "adjusted ebitda add-backs addbacks owner" },
    { title: "Net Margin", subtitle: "Net Income / Revenue", keywords: "net margin income bottom line" },
    { title: "DSO", subtitle: "Days Sales Outstanding (AR / Revenue x 365)", keywords: "dso days sales outstanding receivables" },
    { title: "Customer Concentration", subtitle: "Top customer % of revenue", keywords: "customer concentration risk" },
    { title: "Recurring Revenue", subtitle: "Contracted/repeat revenue as % of total", keywords: "recurring revenue contracts repeat" },
    { title: "Leverage", subtitle: "Total Debt / Adjusted EBITDA", keywords: "leverage debt ratio capital structure" },
  ];
  for (const m of metrics) {
    items.push({
      type: "metric",
      title: m.title,
      subtitle: m.subtitle,
      icon: "functions",
      keywords: m.keywords,
    });
  }

  return items;
}

export default function SearchModal({ open, onClose, onNavigateCompany, onNavigateLearn, onNavigateView }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const index = useMemo(buildIndex, []);

  const results = useMemo(() => {
    if (!query.trim()) return index.slice(0, 8);
    const q = query.toLowerCase();
    return index
      .filter(item => item.keywords.includes(q))
      .slice(0, 8);
  }, [query, index]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, results.length - 1)); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); return; }
      if (e.key === "Enter" && results[selectedIndex]) { e.preventDefault(); selectResult(results[selectedIndex]); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, results, selectedIndex]);

  // Global Cmd+K / Ctrl+K
  useEffect(() => {
    const handleGlobal = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
        else onClose.__open?.();
      }
    };
    window.addEventListener("keydown", handleGlobal);
    return () => window.removeEventListener("keydown", handleGlobal);
  }, [open, onClose]);

  const selectResult = (item) => {
    onClose();
    if (item.type === "company") {
      onNavigateCompany(item.id);
    } else if (item.type === "learn") {
      onNavigateLearn(item.sectionIndex, item.subIndex);
    } else if (item.type === "metric") {
      onNavigateView("learn");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/40" />
      <div
        className="relative bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-lg ghost-border overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/20">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search companies, metrics, topics..."
            className="flex-1 text-sm bg-transparent text-on-surface placeholder:text-outline-variant focus:outline-none"
          />
          <kbd className="text-[10px] text-outline-variant bg-surface-container-low px-1.5 py-0.5 rounded">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-on-surface-variant">No results found</div>
          ) : (
            results.map((item, i) => (
              <button
                key={`${item.type}-${item.id || item.title}-${i}`}
                onClick={() => selectResult(item)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === selectedIndex ? "bg-surface-container-high" : "hover:bg-surface-container-low"
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-on-surface truncate">{item.title}</div>
                  <div className="text-xs text-on-surface-variant truncate">{item.subtitle}</div>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-outline-variant">{item.type}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
