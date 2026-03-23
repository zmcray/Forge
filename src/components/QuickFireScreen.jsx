import { useState, useEffect, useRef } from "react";
import { COMPANIES } from "../data/companies";
import { formatCurrency, shuffleArray } from "../utils/format";

const QUICK_FIRE_SECONDS = 60;

export default function QuickFireScreen() {
  const [queue, setQueue] = useState(() => shuffleArray([...COMPANIES]));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("screen"); // screen, reveal, done
  const [decision, setDecision] = useState(""); // "go" or "no-go"
  const [reasoning, setReasoning] = useState("");
  const [timer, setTimer] = useState(QUICK_FIRE_SECONDS);
  const [isExpired, setIsExpired] = useState(false);
  const [results, setResults] = useState([]);
  const intervalRef = useRef(null);

  const company = queue[currentIndex];

  useEffect(() => {
    if (phase === "screen") {
      setTimer(QUICK_FIRE_SECONDS);
      setIsExpired(false);
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsExpired(true);
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [phase, currentIndex]);

  const handleSubmit = () => {
    clearInterval(intervalRef.current);
    setPhase("reveal");
  };

  const handleNext = () => {
    setResults(prev => [...prev, { company: company.name, decision, reasoning }]);
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setDecision("");
      setReasoning("");
      setPhase("screen");
    } else {
      setPhase("done");
    }
  };

  if (phase === "done") {
    return (
      <div className="max-w-2xl">
        <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight mb-2">Quick Screen Complete</h2>
        <p className="text-sm text-on-surface-variant mb-6">You screened {results.length} companies. Here's how you did:</p>
        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className="bg-surface-container-lowest ghost-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-on-surface">{r.company}</span>
                <span className={`text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full ${r.decision === "go" ? "bg-tertiary-container/50 text-on-tertiary-container" : "bg-error/10 text-error"}`}>
                  {r.decision === "go" ? "GO" : "NO-GO"}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant">{r.reasoning}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const km = company.keyMetrics;

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">Quick Screen</h2>
          <p className="text-sm text-on-surface-variant mt-1">Company {currentIndex + 1} of {queue.length}</p>
        </div>
        <span className={`text-lg font-mono font-bold ${isExpired ? "text-error" : timer <= 15 ? "text-on-tertiary-container" : "text-on-surface"}`}>
          0:{String(timer).padStart(2, "0")}
        </span>
      </div>

      {isExpired && phase === "screen" && (
        <div className="bg-error/10 rounded-lg p-3 mb-4 text-sm text-error font-semibold">
          Time's up! Submit your decision.
        </div>
      )}

      {/* Metrics table */}
      {phase === "screen" && (
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-on-surface">{company.name}</h3>
            <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container">{company.industry}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {[
              ["Revenue", formatCurrency(company.revenue)],
              ["Revenue Growth", `${km.revenueGrowth > 0 ? "+" : ""}${km.revenueGrowth.toFixed(1)}%`],
              ["Adj. EBITDA", formatCurrency(km.adjustedEbitda)],
              ["Adj. EBITDA Margin", `${km.adjustedEbitdaMargin.toFixed(1)}%`],
              ["Customer Concentration", `${km.customerConcentration}%`],
              ["Recurring Revenue", `${km.recurringRevenuePct}%`],
              ["Gross Margin", `${km.grossMargin.toFixed(1)}%`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-1 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">{label}</span>
                <span className="font-mono font-semibold text-on-surface">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Decision input */}
      {phase === "screen" && (
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-5">
          <p className="text-sm font-medium text-on-surface mb-3">Would you take a deeper look at this company?</p>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setDecision("go")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg border-2 transition-colors ${decision === "go" ? "border-on-tertiary-container bg-tertiary-container/30 text-on-tertiary-container" : "border-outline-variant/30 text-on-surface-variant hover:border-outline-variant"}`}
            >
              GO - Worth a deeper look
            </button>
            <button
              onClick={() => setDecision("no-go")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg border-2 transition-colors ${decision === "no-go" ? "border-error bg-error/10 text-error" : "border-outline-variant/30 text-on-surface-variant hover:border-outline-variant"}`}
            >
              NO-GO - Pass
            </button>
          </div>
          <textarea
            className="w-full border border-outline-variant/30 bg-surface-container-low rounded-lg p-3 text-sm text-on-surface min-h-[60px] focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-outline-variant"
            placeholder="Why? One sentence..."
            value={reasoning}
            onChange={e => setReasoning(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={!decision || reasoning.length < 10}
            className={`mt-3 w-full py-2 text-sm font-semibold rounded-lg transition-colors ${decision && reasoning.length >= 10 ? "bg-primary text-on-primary hover:opacity-90" : "bg-surface-container-low text-outline-variant cursor-not-allowed"}`}
          >
            Submit Decision
          </button>
        </div>
      )}

      {/* Reveal */}
      {phase === "reveal" && (
        <div className="space-y-4">
          <div className="bg-surface-container-lowest ghost-border rounded-xl p-5">
            <h3 className="text-lg font-semibold text-on-surface mb-3">{company.name}</h3>
            <p className="text-sm text-on-surface-variant mb-4">{company.description}</p>
            <p className="text-sm text-on-surface-variant mb-4">{company.context}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest ghost-border rounded-lg p-3">
                <h3 className="text-[10px] uppercase tracking-widest text-error font-semibold mb-1.5">Red Flags</h3>
                <ul className="space-y-1">
                  {company.redFlags.map((f, i) => (
                    <li key={i} className="text-xs text-on-surface-variant flex gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-error shrink-0 mt-0.5">warning</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface-container-lowest ghost-border rounded-lg p-3">
                <h3 className="text-[10px] uppercase tracking-widest text-on-tertiary-container font-semibold mb-1.5">Green Flags</h3>
                <ul className="space-y-1">
                  {company.greenFlags.map((f, i) => (
                    <li key={i} className="text-xs text-on-surface-variant flex gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-on-tertiary-container shrink-0 mt-0.5">check_circle</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-lg p-3 text-sm">
            <span className="font-semibold text-on-surface-variant text-[10px] uppercase tracking-widest">Your Call</span>
            <p className="mt-1">
              <span className={`font-semibold ${decision === "go" ? "text-on-tertiary-container" : "text-error"}`}>
                {decision === "go" ? "GO" : "NO-GO"}
              </span>
              {" ... "}{reasoning}
            </p>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-2 text-sm font-semibold bg-primary text-on-primary rounded-lg hover:opacity-90 transition-colors"
          >
            {currentIndex < queue.length - 1 ? "Next Company" : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}
