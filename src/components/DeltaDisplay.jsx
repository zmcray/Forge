import { formatDelta, formatUnit, getDeltaBand, BAND_COLORS } from "../utils/format";

export default function DeltaDisplay({ committedNumeric, modelExtracted }) {
  if (committedNumeric == null || !modelExtracted) return null;

  const delta = committedNumeric - modelExtracted.value;
  const band = getDeltaBand(delta, modelExtracted.unit);
  const unit = formatUnit(modelExtracted.unit);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
      <div className="flex items-center gap-4 text-sm font-mono flex-wrap">
        <span className="text-gray-700">Your answer: <span className="font-semibold">{committedNumeric}{unit}</span></span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-700">Model: <span className="font-semibold">{modelExtracted.value}{unit}</span></span>
        <span className="text-gray-400">|</span>
        <span className={`font-semibold ${BAND_COLORS[band]}`}>
          Delta: {formatDelta(committedNumeric, modelExtracted.value, modelExtracted.unit)}
        </span>
      </div>
    </div>
  );
}
