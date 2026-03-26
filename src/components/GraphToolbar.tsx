import { Minimize2, Eye, EyeOff } from "lucide-react";

interface GraphToolbarProps {
  showGranular: boolean;
  onToggleGranular: () => void;
  onMinimize: () => void;
}

export default function GraphToolbar({ showGranular, onToggleGranular, onMinimize }: GraphToolbarProps) {
  return (
    <div className="absolute top-3 left-3 z-10 flex gap-2">
      <button
        onClick={onMinimize}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-card border border-border text-xs font-medium text-foreground hover:bg-secondary transition-colors active:scale-95 shadow-sm"
      >
        <Minimize2 className="w-3.5 h-3.5" />
        Minimize
      </button>
      <button
        onClick={onToggleGranular}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-foreground text-card text-xs font-medium hover:bg-foreground/90 transition-colors active:scale-95 shadow-sm"
      >
        {showGranular ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        {showGranular ? "Hide Granular Overlay" : "Show Granular Overlay"}
      </button>
    </div>
  );
}
