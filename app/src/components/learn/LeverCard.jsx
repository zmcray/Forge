import { useNavigate, useParams } from "react-router-dom";

export default function LeverCard() {
  const { leverId } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => navigate("/learn/levers")}
        className="text-sm text-on-surface-variant hover:text-on-surface mb-4 inline-flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        All Levers
      </button>
      <h2 className="text-xl font-bold text-on-surface mb-1">Lever detail: {leverId}</h2>
      <p className="text-sm text-on-surface-variant">Placeholder -- full detail view in next commit.</p>
    </div>
  );
}
