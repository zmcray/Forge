export function buildCompanyContext(company) {
  if (!company) return "";
  return `${company.name} (${company.industry}, $${company.revenue}M revenue)`;
}
