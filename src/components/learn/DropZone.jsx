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
      <div className="border-2 border-green-400 bg-green-50 rounded-lg px-4 py-2 flex items-center gap-2 min-w-[140px]">
        <span className="text-green-600 font-bold">&#10003;</span>
        <span className="text-sm font-medium text-green-800">{filledItem.label}</span>
        <span className="text-xs text-green-600 ml-auto">{filledItem.value}</span>
      </div>
    );
  }

  const baseClasses = "border-2 border-dashed rounded-lg px-4 py-2 min-w-[140px] min-h-[40px] flex items-center justify-center transition-all duration-150";

  let stateClasses;
  if (isIncorrect) {
    stateClasses = "border-red-400 bg-red-50 animate-[shake_0.6s_ease-in-out]";
  } else if (isDragOver) {
    stateClasses = "border-blue-400 bg-blue-50";
  } else {
    stateClasses = "border-gray-300 bg-gray-50";
  }

  return (
    <div
      className={`${baseClasses} ${stateClasses}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <span className="text-xs text-gray-400 select-none">{zone.hint}</span>
    </div>
  );
}
