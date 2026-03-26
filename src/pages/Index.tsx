import { useState, useCallback } from "react";
import { MoreHorizontal } from "lucide-react";
import ForceGraph from "@/components/ForceGraph";
import ChatPanel from "@/components/ChatPanel";
import GraphToolbar from "@/components/GraphToolbar";
import NodeDetailPopover from "@/components/NodeDetailPopover";
import { allNodes, edges, type GraphNode } from "@/data/graphData";

const PROCESS_NAME = "Order to Cash";

export default function Index() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [nodePos, setNodePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showGranular, setShowGranular] = useState(true);

  const handleNodeClick = useCallback((node: GraphNode, screenPos: { x: number; y: number }) => {
    setSelectedNode(prev => {
      if (prev?.id === node.id) return null;
      setNodePos(screenPos);
      return node;
    });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Breadcrumb bar */}
      <header className="flex items-center justify-between px-4 h-11 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span className="text-muted-foreground">Mapping</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-semibold text-foreground">{PROCESS_NAME}</span>
        </div>
        <button className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-secondary transition-colors active:scale-95">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Graph area */}
        <div className="flex-1 relative">
          <GraphToolbar
            showGranular={showGranular}
            onToggleGranular={() => setShowGranular(s => !s)}
            onMinimize={() => setSelectedNode(null)}
          />
          <ForceGraph
            nodes={allNodes}
            edges={edges}
            onNodeClick={handleNodeClick}
            selectedNodeId={selectedNode?.id ?? null}
            showGranular={showGranular}
          />
          {selectedNode && (
            <NodeDetailPopover
              node={selectedNode}
              position={nodePos}
              onClose={() => setSelectedNode(null)}
            />
          )}
        </div>

        {/* Chat panel — narrower to match reference */}
        <div className="w-72 shrink-0 hidden md:flex">
          <ChatPanel processName={PROCESS_NAME} />
        </div>
      </div>
    </div>
  );
}
