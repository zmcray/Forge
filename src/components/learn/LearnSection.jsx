import CompanyDataPanel from "./CompanyDataPanel";
import LearnExercise from "./LearnExercise";
import CalculationExercise from "./CalculationExercise";

function LineItemTable({ rows, headers }) {
  return (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((h, i) => (
              <th key={i} className="text-left py-2 px-3 font-semibold text-gray-700 border-b border-gray-200">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {row.map((cell, j) => (
                <td key={j} className="py-1.5 px-3 text-gray-700 border-b border-gray-100">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MetricTable({ rows, headers }) {
  return (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-50">
            {headers.map((h, i) => (
              <th key={i} className="text-left py-2 px-3 font-semibold text-blue-900 border-b border-blue-200">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {row.map((cell, j) => (
                <td key={j} className={`py-1.5 px-3 border-b border-gray-100 ${j === 0 ? "font-medium text-gray-900" : "text-gray-700"}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LearnSection({ subsection, isComplete, onExerciseComplete }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{subsection.title}</h2>
      {subsection.blocks.map((block, i) => {
        if (block.type === "text") {
          return <p key={i} className="text-gray-700 text-sm leading-relaxed mb-3">{block.content}</p>;
        }
        if (block.type === "lineItemTable") {
          return <LineItemTable key={i} rows={block.rows} headers={block.headers} />;
        }
        if (block.type === "metricTable") {
          return <MetricTable key={i} rows={block.rows} headers={block.headers} />;
        }
        if (block.type === "companyData") {
          return <CompanyDataPanel key={i} companyId={block.companyId} view={block.view} />;
        }
        if (block.type === "exercise") {
          return (
            <LearnExercise
              key={block.id}
              exercise={block}
              isComplete={isComplete(block.id)}
              onComplete={onExerciseComplete}
            />
          );
        }
        if (block.type === "calculationExercise") {
          return (
            <CalculationExercise
              key={block.id}
              exercise={block}
              isComplete={isComplete(block.id)}
              onComplete={onExerciseComplete}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
