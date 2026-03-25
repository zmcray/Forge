import { COMPANIES } from "../../data/companies";
import FinancialTable from "../FinancialTable";

export default function CompanyDataPanel({ companyId, view }) {
  const company = COMPANIES.find(c => c.id === companyId);
  if (!company) return null;

  return (
    <div className="border border-outline-variant/30 rounded-lg overflow-hidden my-3">
      <div className="bg-surface-container-low px-4 py-2 flex items-center gap-2 border-b border-outline-variant/30">
        <span className="text-sm font-semibold text-on-surface">{company.name}</span>
        <span className="text-xs text-primary bg-secondary-container px-2 py-0.5 rounded">{company.industry}</span>
      </div>
      <div className="p-4">
        <FinancialTable company={company} view={view} />
      </div>
    </div>
  );
}
