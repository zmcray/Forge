import { useState, useEffect } from "react";
import SimplePnL from "./SimplePnL";
import CalculationBuilder from "./CalculationBuilder";

function autoFillZones(zones) {
  const filled = {};
  const used = new Set();
  for (const zone of zones) {
    const match = zone.correctIds.find(id => !used.has(id));
    if (match) {
      filled[zone.id] = match;
      used.add(match);
    }
  }
  return filled;
}

export default function CalculationExercise({ exercise, isComplete, onComplete }) {
  const [filledZones, setFilledZones] = useState(() =>
    isComplete ? autoFillZones(exercise.zones) : {}
  );
  const [incorrectFlash, setIncorrectFlash] = useState(null);
  const [rejectFeedback, setRejectFeedback] = useState(null);
  const [isRevealed, setIsRevealed] = useState(isComplete);
  const [expanded, setExpanded] = useState(!isComplete);

  const placedItemIds = new Set(Object.values(filledZones));
  const allFilled = Object.keys(filledZones).length === exercise.zones.length;

  useEffect(() => {
    if (allFilled && !isRevealed) {
      setIsRevealed(true);
      onComplete(exercise.id);
    }
  }, [allFilled, isRevealed, onComplete, exercise.id]);

  const draggableMap = Object.fromEntries(exercise.draggables.map(d => [d.id, d]));

  const handleDrop = (zoneId, itemId) => {
    const zone = exercise.zones.find(z => z.id === zoneId);
    if (!zone || filledZones[zoneId] || placedItemIds.has(itemId)) return;

    const dragged = draggableMap[itemId];
    if (dragged?.rejectMessage) {
      setRejectFeedback(dragged.rejectMessage);
      setIncorrectFlash(zoneId);
      setTimeout(() => setIncorrectFlash(null), 600);
      return;
    }

    if (!zone.correctIds.includes(itemId)) {
      setIncorrectFlash(zoneId);
      setTimeout(() => setIncorrectFlash(null), 600);
      return;
    }

    setRejectFeedback(null);
    setFilledZones(prev => ({ ...prev, [zoneId]: itemId }));
  };

  // Collapsed completed state
  if (!expanded && isComplete) {
    return (
      <div
        className="border border-on-tertiary-container/30 bg-tertiary-container rounded-lg p-3 my-3 flex items-center justify-between cursor-pointer hover:opacity-90 transition-colors"
        onClick={() => setExpanded(true)}
      >
        <div className="flex items-center gap-2">
          <span className="text-on-tertiary-container text-lg">&#10003;</span>
          <span className="text-sm font-medium text-on-tertiary-container">{exercise.instruction}</span>
        </div>
        <span className="text-xs text-on-tertiary-container">Click to review</span>
      </div>
    );
  }

  return (
    <div className="border border-outline-variant/30 rounded-lg overflow-hidden my-3">
      <div className="bg-secondary-container px-4 py-2 flex items-center gap-2">
        <span className="text-sm font-semibold text-on-surface">Exercise</span>
        {isRevealed && <span className="text-on-tertiary-container">&#10003;</span>}
      </div>
      <div className="p-4">
        <div className="flex gap-6">
          <div className="w-2/5 flex-shrink-0">
            <SimplePnL
              draggables={exercise.draggables}
              supplementalItems={exercise.supplementalItems || []}
              placedItemIds={placedItemIds}
              sgaBreakdown={exercise.sgaBreakdown || []}
            />
          </div>
          <div className="w-3/5">
            <CalculationBuilder
              layout={exercise.layout}
              zones={exercise.zones}
              filledZones={filledZones}
              draggables={exercise.draggables}
              incorrectFlash={incorrectFlash}
              isRevealed={isRevealed}
              resultLabel={exercise.resultLabel}
              resultValue={exercise.resultValue}
              instruction={exercise.instruction}
              explanation={exercise.explanation}
              onDrop={handleDrop}
            />
            {rejectFeedback && (
              <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg p-3 text-sm text-amber-900 dark:text-amber-200">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0">&#9888;</span>
                  <div>
                    <span className="font-semibold text-xs uppercase tracking-wide text-amber-700 dark:text-amber-400">Not so fast</span>
                    <p className="mt-1 leading-relaxed">{rejectFeedback}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
