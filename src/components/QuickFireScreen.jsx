import { useState, useEffect, useRef } from "react";
import { COMPANIES } from "../data/companies";
import { formatCurrency, shuffleArray } from "../utils/format";

const QUICK_FIRE_SECONDS = 60;

export default function QuickFireScreen({ onBack, onScore }) {
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Quick Screen Complete</h1>
          <p className="text-gray-600 mb-6">You screened {results.length} companies. Here's how you did:</p>
          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900">{r.company}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.decision === "go" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {r.decision === "go" ? "GO" : "NO-GO"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{r.reasoning}</p>
              </div>
            ))}
          </div>
          <button onClick={onBack} className="mt-6 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            {"\u2190"} Back to Home
          </button>
        </div>
      </div>
    );
  }

  const km = company.keyMetrics;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Quick Screen</h1>
            <p className="text-sm text-gray-500">Company {currentIndex + 1} of {queue.length}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-lg font-mono font-bold ${isExpired ? "text-red-600" : timer <= 15 ? "text-amber-600" : "text-gray-700"}`}>
              0:{String(timer).padStart(2, "0")}
            </span>
            <button onClick={onBack} className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Exit
            </button>
          </div>
        </div>

        {isExpired && phase === "screen" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-800 font-semibold">
            Time's up! Submit your decision.
          </div>
        )}

        {/* Metrics table */}
        {phase === "screen" && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{company.name}</h2>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{company.industry}</span>
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
                <div key={label} className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-mono font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decision input */}
        {phase === "screen" && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-700 mb-3">Would you take a deeper look at this company?</p>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setDecision("go")}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg border-2 transition-colors ${decision === "go" ? "border-green-500 bg-green-50 text-green-800" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
              >
                GO - Worth a deeper look
              </button>
              <button
                onClick={() => setDecision("no-go")}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg border-2 transition-colors ${decision === "no-go" ? "border-red-500 bg-red-50 text-red-800" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
              >
                NO-GO - Pass
              </button>
            </div>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[60px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Why? One sentence..."
              value={reasoning}
              onChange={e => setReasoning(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              disabled={!decision || reasoning.length < 10}
              className={`mt-3 w-full py-2 text-sm font-semibold rounded-lg transition-colors ${decision && reasoning.length >= 10 ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
            >
              Submit Decision
            </button>
          </div>
        )}

        {/* Reveal */}
        {phase === "reveal" && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{company.name}</h2>
              <p className="text-sm text-gray-600 mb-4">{company.description}</p>
              <p className="text-sm text-gray-600 mb-4">{company.context}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-red-200 rounded-lg p-3">
                  <h3 className="text-xs font-semibold text-red-800 mb-1.5">Red Flags</h3>
                  <ul className="space-y-1">
                    {company.redFlags.map((f, i) => (
                      <li key={i} className="text-xs text-red-700 flex gap-1.5">
                        <span className="shrink-0">{"\u26A0"}</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-green-200 rounded-lg p-3">
                  <h3 className="text-xs font-semibold text-green-800 mb-1.5">Green Flags</h3>
                  <ul className="space-y-1">
                    {company.greenFlags.map((f, i) => (
                      <li key={i} className="text-xs text-green-700 flex gap-1.5">
                        <span className="shrink-0">{"\u2713"}</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
              <span className="font-semibold text-gray-500 text-xs uppercase">Your Call</span>
              <p className="mt-1">
                <span className={`font-semibold ${decision === "go" ? "text-green-700" : "text-red-700"}`}>
                  {decision === "go" ? "GO" : "NO-GO"}
                </span>
                {" -- "}{reasoning}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentIndex < queue.length - 1 ? "Next Company" : "See Results"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
