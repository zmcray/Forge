import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { COMPANIES } from "../data/companies";
import { OPERATIONS_PROFILES } from "../data/companyOperations";
import { formatCurrency } from "../utils/format";
import DecompositionStage from "../components/consult/DecompositionStage";
import RankingStage from "../components/consult/RankingStage";

/**
 * The two-stage consulting exercise for one company: Stage 2A decomposition
 * (MCR-96) flows into Stage 2B opportunity ranking (MCR-97). Stage state
 * lives here; each stage owns its own commit/reveal lifecycle.
 */
export default function ConsultSession() {
  const { companyId } = useParams();
  const [stage, setStage] = useState("decompose"); // decompose | rank

  const company = COMPANIES.find((c) => c.id === companyId);
  const profile = OPERATIONS_PROFILES[companyId];
  if (!company || !profile) return <Navigate to="/consult" replace />;

  const is = company.incomeStatement;
  const latest = is.years.length - 1;
  const contextItems = [
    { label: "Revenue", value: formatCurrency(is.revenue[latest]) },
    { label: "COGS", value: formatCurrency(is.cogs[latest]) },
    { label: "SG&A", value: formatCurrency(is.sgaExpense[latest]) },
    { label: "Adj. EBITDA", value: formatCurrency(company.keyMetrics.adjustedEbitda) },
    { label: "Employees", value: company.keyMetrics.employeeCount },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        to="/consult"
        className="text-xs text-on-surface-variant hover:text-on-surface uppercase tracking-widest"
      >
        &larr; All companies
      </Link>
      <h1 className="text-2xl font-extrabold font-headline text-on-surface mt-2 mb-1">
        {company.name}
      </h1>
      <p className="text-sm text-on-surface-variant mb-4">{company.description}</p>

      {/* Income-statement context strip: the cost lines the decomposition should map to */}
      <div className="flex flex-wrap gap-3 mb-6">
        {contextItems.map((item) => (
          <div key={item.label} className="bg-surface-container-lowest ghost-border rounded-lg px-4 py-2">
            <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant">
              {item.label}
            </span>
            <span className="font-bold font-headline text-on-surface">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Stage indicator */}
      <div className="flex items-center gap-2 mb-4 text-[10px] uppercase tracking-widest">
        <span className={`px-2.5 py-1 rounded-full ${stage === "decompose" ? "bg-primary text-on-primary" : "bg-secondary-container text-on-secondary-container"}`}>
          Stage 2A: Decompose
        </span>
        <span className="text-on-surface-variant">&rarr;</span>
        <span className={`px-2.5 py-1 rounded-full ${stage === "rank" ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"}`}>
          Stage 2B: Rank Opportunities
        </span>
      </div>

      {stage === "decompose" && (
        <DecompositionStage
          company={company}
          operations={profile.operations}
          onComplete={() => setStage("rank")}
        />
      )}
      {stage === "rank" && (
        <RankingStage
          company={company}
          operations={profile.operations}
          aiOpportunities={profile.aiOpportunities}
          implementationContext={profile.implementationContext}
        />
      )}
    </div>
  );
}
