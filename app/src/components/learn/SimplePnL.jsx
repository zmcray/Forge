const PNL_LINES = [
  { id: "revenue", label: "Revenue", value: "$32.5M" },
  { id: "cogs", label: "COGS", value: "($20.8M)" },
  { id: "gross-profit", label: "Gross Profit", value: "$11.7M", isSummary: true },
  { id: "sga", label: "SG&A", value: "($6.1M)" },
  { id: "owner-comp", label: "Owner Compensation", value: "($2.0M)" },
  { id: "depreciation", label: "Depreciation", value: "($1.1M)" },
  { id: "amortization", label: "Amortization", value: "($0.1M)" },
  { id: "interest", label: "Interest Expense", value: "($0.3M)" },
  { id: "other-income", label: "Other Income", value: "$0.2M" },
  { id: "net-income", label: "Net Income", value: "$2.3M", isSummary: true },
];

function DraggableItem({ item, isPlaced }) {
  const handleDragStart = (e) => {
    if (isPlaced) return;
    e.dataTransfer.setData("text/plain", item.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <span
      draggable={!isPlaced}
      onDragStart={handleDragStart}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-sm font-medium transition-opacity ${
        isPlaced
          ? "bg-surface-container-high text-outline-variant opacity-40 cursor-default"
          : "bg-secondary-container text-on-surface border border-primary/30 cursor-grab active:cursor-grabbing hover:opacity-80"
      }`}
    >
      {item.label}
      <span className="text-xs font-normal">{item.value}</span>
    </span>
  );
}

export default function SimplePnL({ draggables, supplementalItems = [], placedItemIds }) {
  const draggableIds = new Set(draggables.map(d => d.id));
  const draggableMap = Object.fromEntries(draggables.map(d => [d.id, d]));

  return (
    <div className="sticky top-4">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg overflow-hidden">
        <div className="bg-inverse-surface text-inverse-on-surface px-4 py-2 text-sm font-semibold">
          Summit Mechanical Services (2025)
        </div>
        <div className="divide-y divide-outline-variant/20">
          {PNL_LINES.map(line => {
            const isDraggable = draggableIds.has(line.id);
            const isPlaced = placedItemIds.has(line.id);

            return (
              <div
                key={line.id}
                className={`flex items-center justify-between px-4 py-1.5 ${
                  line.isSummary ? "bg-surface-container-low border-t border-outline-variant/30" : ""
                }`}
              >
                <span className={`text-sm ${line.isSummary ? "font-semibold text-on-surface" : "text-on-surface-variant"}`}>
                  {line.label}
                </span>
                {isDraggable ? (
                  <DraggableItem item={draggableMap[line.id]} isPlaced={isPlaced} />
                ) : (
                  <span className={`text-sm tabular-nums ${line.isSummary ? "font-semibold" : ""}`}>
                    {line.value}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {supplementalItems.length > 0 && (
          <div className="border-t-2 border-outline-variant">
            <div className="bg-secondary-container px-4 py-1.5 text-xs font-semibold text-on-secondary-container uppercase tracking-wide">
              Additional Items
            </div>
            <div className="divide-y divide-outline-variant/20">
              {supplementalItems.map(item => {
                const isDraggable = draggableIds.has(item.id);
                const isPlaced = placedItemIds.has(item.id);

                return (
                  <div key={item.id} className="px-4 py-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface-variant">{item.label}</span>
                      {isDraggable ? (
                        <DraggableItem item={draggableMap[item.id] || item} isPlaced={isPlaced} />
                      ) : (
                        <span className="text-sm tabular-nums">{item.value}</span>
                      )}
                    </div>
                    {item.note && (
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{item.note}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
