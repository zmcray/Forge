import { formatCurrency } from "../utils/format";

export default function FinancialTable({ company, view }) {
  const income = company.incomeStatement;
  const bs = company.balanceSheet;
  const cf = company.cashFlow;

  if (view === "income") {
    const rows = [
      { label: "Revenue", values: income.revenue, bold: true },
      { label: "Cost of Goods Sold", values: income.cogs, indent: true, negative: true },
      { label: "Gross Profit", values: income.grossProfit, bold: true, line: true },
      { label: "SG&A Expense", values: income.sgaExpense, indent: true, negative: true },
      { label: "Owner Compensation", values: income.ownerComp, indent: true, negative: true },
      { label: "Depreciation", values: income.depreciation, indent: true, negative: true },
      { label: "Amortization", values: income.amortization, indent: true, negative: true },
      { label: "Interest Expense", values: income.interestExpense, indent: true, negative: true },
      { label: "Other Income", values: income.otherIncome, indent: true },
      { label: "Net Income", values: income.netIncome, bold: true, line: true, highlight: true },
    ];
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="text-left py-2 pr-4 font-semibold text-gray-700">($M)</th>
              {income.years.map(y => <th key={y} className="text-right py-2 px-3 font-semibold text-gray-700">{y}</th>)}
              <th className="text-right py-2 px-3 font-semibold text-gray-500">{"\u0394"}%</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const change = r.values[1] && r.values[0] ? ((r.values[1] - r.values[0]) / Math.abs(r.values[0]) * 100) : 0;
              return (
                <tr key={i} className={`${r.line ? "border-t border-gray-300" : ""} ${r.highlight ? "bg-amber-50" : ""}`}>
                  <td className={`py-1.5 pr-4 ${r.indent ? "pl-4" : ""} ${r.bold ? "font-semibold" : "text-gray-600"}`}>{r.label}</td>
                  {r.values.map((v, j) => (
                    <td key={j} className={`text-right py-1.5 px-3 font-mono ${r.bold ? "font-semibold" : ""} ${r.negative ? "text-gray-600" : ""}`}>
                      {r.negative ? `(${formatCurrency(v)})` : formatCurrency(v)}
                    </td>
                  ))}
                  <td className={`text-right py-1.5 px-3 font-mono text-sm ${change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-400"}`}>
                    {change !== 0 ? `${change > 0 ? "+" : ""}${change.toFixed(1)}%` : "\u2014"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Reported Add-Backs</p>
          <div className="flex gap-4 text-xs text-gray-600">
            {Object.entries(income.addBacks).map(([k, v]) => (
              <span key={k}>{k.replace(/([A-Z])/g, " $1").trim()}: {formatCurrency(v)}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === "balance") {
    const totalCurrentAssets = bs.cash + bs.ar + bs.inventory + bs.otherCurrentAssets;
    const totalAssets = totalCurrentAssets + bs.ppe + bs.goodwill + bs.otherLtAssets;
    const totalCurrentLiab = bs.ap + bs.currentDebt + bs.accruedExpenses;
    const totalLiab = totalCurrentLiab + bs.ltDebt + bs.otherLtLiabilities;
    return (
      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <h4 className="font-semibold text-gray-700 border-b-2 border-gray-800 pb-1 mb-2">Assets</h4>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Current Assets</p>
          {[["Cash", bs.cash], ["Accounts Receivable", bs.ar], ["Inventory", bs.inventory], ["Other Current", bs.otherCurrentAssets]].map(([l, v]) => (
            <div key={l} className="flex justify-between py-0.5 pl-2"><span className="text-gray-600">{l}</span><span className="font-mono">{formatCurrency(v)}</span></div>
          ))}
          <div className="flex justify-between py-1 font-semibold border-t border-gray-200 mt-1"><span>Total Current Assets</span><span className="font-mono">{formatCurrency(totalCurrentAssets)}</span></div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 mt-3">Long-Term Assets</p>
          {[["PP&E (net)", bs.ppe], ["Goodwill", bs.goodwill], ["Other LT Assets", bs.otherLtAssets]].map(([l, v]) => (
            <div key={l} className="flex justify-between py-0.5 pl-2"><span className="text-gray-600">{l}</span><span className="font-mono">{formatCurrency(v)}</span></div>
          ))}
          <div className="flex justify-between py-1 font-bold border-t-2 border-gray-800 mt-2 bg-amber-50 px-1"><span>Total Assets</span><span className="font-mono">{formatCurrency(totalAssets)}</span></div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 border-b-2 border-gray-800 pb-1 mb-2">Liabilities & Equity</h4>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Current Liabilities</p>
          {[["Accounts Payable", bs.ap], ["Current Debt", bs.currentDebt], ["Accrued Expenses", bs.accruedExpenses]].map(([l, v]) => (
            <div key={l} className="flex justify-between py-0.5 pl-2"><span className="text-gray-600">{l}</span><span className="font-mono">{formatCurrency(v)}</span></div>
          ))}
          <div className="flex justify-between py-1 font-semibold border-t border-gray-200 mt-1"><span>Total Current Liabilities</span><span className="font-mono">{formatCurrency(totalCurrentLiab)}</span></div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 mt-3">Long-Term</p>
          {[["Long-Term Debt", bs.ltDebt], ["Other LT Liabilities", bs.otherLtLiabilities]].map(([l, v]) => (
            <div key={l} className="flex justify-between py-0.5 pl-2"><span className="text-gray-600">{l}</span><span className="font-mono">{formatCurrency(v)}</span></div>
          ))}
          <div className="flex justify-between py-1 font-semibold border-t border-gray-200 mt-1"><span>Total Liabilities</span><span className="font-mono">{formatCurrency(totalLiab)}</span></div>
          <div className="flex justify-between py-1 pl-2 mt-2"><span className="text-gray-600">Shareholders' Equity</span><span className="font-mono">{formatCurrency(bs.equity)}</span></div>
          <div className="flex justify-between py-1 font-bold border-t-2 border-gray-800 mt-1 bg-amber-50 px-1"><span>Total L + E</span><span className="font-mono">{formatCurrency(totalLiab + bs.equity)}</span></div>
        </div>
      </div>
    );
  }

  if (view === "cashflow") {
    return (
      <div className="text-sm">
        <table className="w-full">
          <tbody>
            <tr className="border-b border-gray-200"><td className="py-1.5 font-semibold">Net Income</td><td className="text-right font-mono">{formatCurrency(cf.netIncome)}</td></tr>
            <tr><td className="py-1.5 pl-4 text-gray-600">+ Depreciation & Amortization</td><td className="text-right font-mono">{formatCurrency(cf.da)}</td></tr>
            <tr><td className="py-1.5 pl-4 text-gray-600">+/- Change in Working Capital</td><td className={`text-right font-mono ${cf.changeWc < 0 ? "text-red-600" : "text-green-600"}`}>{formatCurrency(cf.changeWc)}</td></tr>
            <tr className="border-t border-gray-200 bg-blue-50"><td className="py-1.5 font-semibold">Cash from Operations</td><td className="text-right font-mono font-semibold">{formatCurrency(cf.netIncome + cf.da + cf.changeWc)}</td></tr>
            <tr className="border-t border-gray-200"><td className="py-1.5 pl-4 text-gray-600">Capital Expenditures</td><td className="text-right font-mono text-red-600">{formatCurrency(cf.capex)}</td></tr>
            <tr className="border-t border-gray-200 bg-green-50"><td className="py-1.5 font-semibold">Free Cash Flow</td><td className="text-right font-mono font-semibold">{formatCurrency(cf.netIncome + cf.da + cf.changeWc + cf.capex)}</td></tr>
            <tr className="border-t border-gray-200"><td className="py-1.5 pl-4 text-gray-600">Debt Payments</td><td className="text-right font-mono text-red-600">{formatCurrency(cf.debtPayments)}</td></tr>
            <tr><td className="py-1.5 pl-4 text-gray-600">Distributions</td><td className="text-right font-mono text-red-600">{formatCurrency(cf.distributions)}</td></tr>
            <tr className="border-t-2 border-gray-800 bg-amber-50"><td className="py-1.5 font-bold">Net Cash Flow</td><td className="text-right font-mono font-bold">{formatCurrency(cf.netIncome + cf.da + cf.changeWc + cf.capex + cf.debtPayments + cf.distributions)}</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (view === "metrics") {
    const km = company.keyMetrics;
    const sections = [
      { title: "Profitability", items: [
        ["EBITDA", formatCurrency(km.ebitda)],
        ["Adjusted EBITDA", formatCurrency(km.adjustedEbitda)],
        ["Gross Margin", `${km.grossMargin.toFixed(1)}%`],
        ["EBITDA Margin", `${km.ebitdaMargin.toFixed(1)}%`],
        ["Adj. EBITDA Margin", `${km.adjustedEbitdaMargin.toFixed(1)}%`],
      ]},
      { title: "Growth & Scale", items: [
        ["Revenue Growth", `${km.revenueGrowth > 0 ? "+" : ""}${km.revenueGrowth.toFixed(1)}%`],
        ["Revenue", formatCurrency(company.revenue)],
        ["Employees", km.employeeCount.toString()],
        ["Rev / Employee", formatCurrency(km.avgRevenuePerEmployee, 0)],
      ]},
      { title: "Quality Indicators", items: [
        ["Recurring Revenue", `${km.recurringRevenuePct}%`],
        ["Customer Concentration", `${km.customerConcentration}%`],
        ["Net Debt", formatCurrency((company.balanceSheet.currentDebt + company.balanceSheet.ltDebt) - company.balanceSheet.cash)],
        ["Leverage (Debt/EBITDA)", `${(((company.balanceSheet.currentDebt + company.balanceSheet.ltDebt) ) / km.adjustedEbitda).toFixed(1)}x`],
      ]},
    ];
    return (
      <div className="grid grid-cols-3 gap-4">
        {sections.map(s => (
          <div key={s.title}>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{s.title}</h4>
            {s.items.map(([l, v]) => (
              <div key={l} className="flex justify-between py-1 text-sm border-b border-gray-100">
                <span className="text-gray-600">{l}</span>
                <span className="font-mono font-semibold">{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  return null;
}
