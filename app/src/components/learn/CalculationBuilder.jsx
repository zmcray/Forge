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
    <div className="mt-4 bg-tertiary-container border border-on-tertiary-container/30 rounded-lg p-3 text-sm text-on-tertiary-container">
      <span className="font-semibold text-on-tertiary-container text-xs uppercase">Why this matters</span>
      <p className="mt-1">{explanation}</p>
    </div>
  );

  if (layout === "division") {
    const [numeratorZone, denominatorZone] = zones;

    return (
      <div>
        <p className="text-sm text-on-surface-variant mb-4">{instruction}</p>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-stretch">
            <DropZone
              zone={numeratorZone}
              filledItem={getFilledItem(numeratorZone)}
              isIncorrect={incorrectFlash === numeratorZone.id}
              onDrop={onDrop}
            />
            <div className="border-t-2 border-on-surface my-1" />
            <DropZone
              zone={denominatorZone}
              filledItem={getFilledItem(denominatorZone)}
              isIncorrect={incorrectFlash === denominatorZone.id}
              onDrop={onDrop}
            />
          </div>
          <span className="text-xl text-outline-variant">=</span>
          <div className={`text-2xl font-bold transition-opacity duration-300 ${isRevealed ? "opacity-100 text-on-tertiary-container" : "opacity-30 text-outline-variant"}`}>
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
      <p className="text-sm text-on-surface-variant mb-4">{instruction}</p>
      <div className="flex flex-col gap-1.5 max-w-sm">
        <div className="flex items-center gap-2">
          <span className="w-5 text-center text-outline-variant text-sm font-mono">&nbsp;</span>
          <DropZone
            zone={baseZone}
            filledItem={getFilledItem(baseZone)}
            isIncorrect={incorrectFlash === baseZone.id}
            onDrop={onDrop}
          />
        </div>
        {addZones.map((zone) => (
          <div key={zone.id} className="flex items-center gap-2">
            <span className="w-5 text-center text-outline-variant text-sm font-mono">+</span>
            <DropZone
              zone={zone}
              filledItem={getFilledItem(zone)}
              isIncorrect={incorrectFlash === zone.id}
              onDrop={onDrop}
            />
          </div>
        ))}
        <div className="border-t-2 border-on-surface ml-7 mt-1" />
        <div className="flex items-center gap-2 ml-7">
          <span className="text-outline-variant">=</span>
          <span className={`text-xl font-bold transition-opacity duration-300 ${isRevealed ? "opacity-100 text-on-tertiary-container" : "opacity-30 text-outline-variant"}`}>
            {resultValue}
          </span>
          {isRevealed && <span className="text-sm text-on-tertiary-container ml-1">{resultLabel}</span>}
        </div>
      </div>
      {revealedExplanation}
    </div>
  );
}
