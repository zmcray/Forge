import { useState } from "react";

export default function DropZone({ zone, filledItem, isIncorrect, onDrop }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    if (filledItem) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (filledItem) return;
    const itemId = e.dataTransfer.getData("text/plain");
    onDrop(zone.id, itemId);
  };

  if (filledItem) {
    return (
      <div className="border-2 border-on-tertiary-container bg-tertiary-container rounded-lg px-4 py-2 flex items-center gap-2 min-w-[140px]">
        <span className="text-on-tertiary-container font-bold">&#10003;</span>
        <span className="text-sm font-medium text-on-tertiary-container">{filledItem.label}</span>
        <span className="text-xs text-on-tertiary-container ml-auto">{filledItem.value}</span>
      </div>
    );
  }

  const baseClasses = "border-2 border-dashed rounded-lg px-4 py-2 min-w-[140px] min-h-[40px] flex items-center justify-center transition-all duration-150";

  let stateClasses;
  if (isIncorrect) {
    stateClasses = "border-error bg-error-container animate-[shake_0.6s_ease-in-out]";
  } else if (isDragOver) {
    stateClasses = "border-primary bg-secondary-container";
  } else {
    stateClasses = "border-outline-variant bg-surface-container-low";
  }

  return (
    <div
      className={`${baseClasses} ${stateClasses}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <span className="text-xs text-outline-variant select-none">{zone.hint}</span>
    </div>
  );
}
