import { COMPANIES } from "../../data/companies";
import FinancialTable from "../FinancialTable";

export default function CompanyDataPanel({ companyId, view }) {
  const company = COMPANIES.find(c => c.id === companyId);
  if (!company) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden my-3">
      <div className="bg-gray-50 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-800">{company.name}</span>
        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{company.industry}</span>
      </div>
      <div className="p-4">
        <FinancialTable company={company} view={view} />
      </div>
    </div>
  );
}
