import DropZone from "./DropZone";

export default function CalculationBuilder({
  layout,
  zones,
  filledZones,
  draggables,
  incorrectFlash,
  isRevealed,
  resultLabel,
  resultValue,
  instruction,
  explanation,
  onDrop,
}) {
  const draggableMap = Object.fromEntries(draggables.map(d => [d.id, d]));

  const getFilledItem = (zone) => {
    const itemId = filledZones[zone.id];
    return itemId ? draggableMap[itemId] : null;
  };

  const revealedExplanation = isRevealed && explanation && (
    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-900">
      <span className="font-semibold text-green-700 text-xs uppercase">Why this matters</span>
      <p className="mt-1">{explanation}</p>
    </div>
  );

  if (layout === "division") {
    const [numeratorZone, denominatorZone] = zones;

    return (
      <div>
        <p className="text-sm text-gray-600 mb-4">{instruction}</p>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-stretch">
            <DropZone
              zone={numeratorZone}
              filledItem={getFilledItem(numeratorZone)}
              isIncorrect={incorrectFlash === numeratorZone.id}
              onDrop={onDrop}
            />
            <div className="border-t-2 border-gray-800 my-1" />
            <DropZone
              zone={denominatorZone}
              filledItem={getFilledItem(denominatorZone)}
              isIncorrect={incorrectFlash === denominatorZone.id}
              onDrop={onDrop}
            />
          </div>
          <span className="text-xl text-gray-400">=</span>
          <div className={`text-2xl font-bold transition-opacity duration-300 ${isRevealed ? "opacity-100 text-green-700" : "opacity-30 text-gray-400"}`}>
            {resultValue}
          </div>
        </div>
        {revealedExplanation}
      </div>
    );
  }

  // Addition layout
  const baseZone = zones[0];
  const addZones = zones.slice(1);

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">{instruction}</p>
      <div className="flex flex-col gap-1.5 max-w-sm">
        <div className="flex items-center gap-2">
          <span className="w-5 text-center text-gray-400 text-sm font-mono">&nbsp;</span>
          <DropZone
            zone={baseZone}
            filledItem={getFilledItem(baseZone)}
            isIncorrect={incorrectFlash === baseZone.id}
            onDrop={onDrop}
          />
        </div>
        {addZones.map((zone) => (
          <div key={zone.id} className="flex items-center gap-2">
            <span className="w-5 text-center text-gray-500 text-sm font-mono">+</span>
            <DropZone
              zone={zone}
              filledItem={getFilledItem(zone)}
              isIncorrect={incorrectFlash === zone.id}
              onDrop={onDrop}
            />
          </div>
        ))}
        <div className="border-t-2 border-gray-800 ml-7 mt-1" />
        <div className="flex items-center gap-2 ml-7">
          <span className="text-gray-400">=</span>
          <span className={`text-xl font-bold transition-opacity duration-300 ${isRevealed ? "opacity-100 text-green-700" : "opacity-30 text-gray-400"}`}>
            {resultValue}
          </span>
          {isRevealed && <span className="text-sm text-green-600 ml-1">{resultLabel}</span>}
        </div>
      </div>
      {revealedExplanation}
    </div>
  );
}
