import type { GraphNode } from "@/data/graphData";

interface NodeDetailPopoverProps {
  node: GraphNode;
  position: { x: number; y: number };
  onClose: () => void;
}

export default function NodeDetailPopover({ node, position, onClose }: NodeDetailPopoverProps) {
  const entries = Object.entries(node.properties);
  const visibleEntries = entries.slice(0, 12);
  const hiddenCount = entries.length - visibleEntries.length;

  // Position popover to the right of the node, with a connecting line
  const popoverX = position.x + 40;
  const popoverY = Math.max(60, Math.min(position.y - 80, window.innerHeight - 400));

  return (
    <>
      {/* Click-away backdrop */}
      <div className="absolute inset-0 z-15" onClick={onClose} />

      {/* Connecting line from node to popover */}
      <svg
        className="absolute inset-0 z-16 pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      >
        <line
          x1={position.x}
          y1={position.y}
          x2={popoverX}
          y2={popoverY + 80}
          stroke="hsl(var(--graph-edge-highlight))"
          strokeWidth="2"
          strokeDasharray="none"
        />
        {/* Node highlight circle */}
        <circle
          cx={position.x}
          cy={position.y}
          r="8"
          fill="none"
          stroke="hsl(var(--graph-edge-highlight))"
          strokeWidth="2"
        />
      </svg>

      {/* Popover card */}
      <div
        className="absolute z-20 w-72 animate-fade-in"
        style={{ left: popoverX, top: popoverY }}
      >
        <div className="bg-card rounded-lg shadow-lg border border-border p-4">
          <h3 className="font-bold text-card-foreground text-sm mb-2">{node.entity}</h3>
          <dl className="space-y-0.5">
            <div className="flex gap-1 text-xs leading-relaxed">
              <dt className="font-medium text-foreground shrink-0">Entity:</dt>
              <dd className="text-muted-foreground">{node.entity}</dd>
            </div>
            {visibleEntries.map(([key, value]) => (
              <div key={key} className="flex gap-1 text-xs leading-relaxed">
                <dt className="font-medium text-foreground shrink-0">{key}:</dt>
                <dd className="text-muted-foreground truncate">{String(value) || "—"}</dd>
              </div>
            ))}
          </dl>
          {hiddenCount > 0 && (
            <p className="text-xs text-muted-foreground/60 italic mt-1.5">
              Additional fields hidden for readability
            </p>
          )}
          <div className="mt-2 pt-1.5 border-t border-border text-xs font-medium text-foreground">
            Connections: {node.connections}
          </div>
        </div>
      </div>
    </>
  );
}
