import { useRef, useEffect, useCallback, useState } from "react";
import * as d3 from "d3";
import type { GraphNode, GraphEdge } from "@/data/graphData";

interface ForceGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeClick: (node: GraphNode, screenPos: { x: number; y: number }) => void;
  selectedNodeId: string | null;
  showGranular: boolean;
}

export default function ForceGraph({ nodes, edges, onNodeClick, selectedNodeId, showGranular }: ForceGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphEdge> | null>(null);
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setDimensions({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const draw = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        transformRef.current = event.transform;
      });
    svg.call(zoom);

    const simNodes = nodes.map(n => ({ ...n }));
    const simEdges = edges.map(e => ({ ...e }));

    // Check which nodes are "primary" (have properties)
    const isPrimary = (n: GraphNode) => Object.keys(n.properties).length > 0;

    const simulation = d3.forceSimulation<GraphNode>(simNodes)
      .force("link", d3.forceLink<GraphNode, GraphEdge>(simEdges).id(d => d.id).distance(60).strength(0.3))
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(12));

    simulationRef.current = simulation;

    // Edges
    const link = g.append("g")
      .selectAll("line")
      .data(simEdges)
      .join("line")
      .style("stroke", "hsl(var(--graph-edge))")
      .style("stroke-width", 0.6)
      .style("stroke-opacity", 0.35);

    // Node groups
    const node = g.append("g")
      .selectAll<SVGGElement, GraphNode>("g")
      .data(simNodes)
      .join("g")
      .style("cursor", d => isPrimary(d) ? "pointer" : "default")
      .on("click", (event, d) => {
        if (!isPrimary(d)) return;
        const svgEl = svgRef.current!;
        const rect = svgEl.getBoundingClientRect();
        const t = transformRef.current;
        const screenX = t.applyX(d.x!) + rect.left;
        const screenY = t.applyY(d.y!) + rect.top;
        // Convert to position relative to container
        const containerRect = containerRef.current!.getBoundingClientRect();
        onNodeClick(d, {
          x: screenX - containerRect.left,
          y: screenY - containerRect.top,
        });
      })
      .call(
        d3.drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
          })
      );

    // Circles
    node.append("circle")
      .attr("r", d => {
        if (!isPrimary(d)) return 2.5;
        return d.connections > 4 ? 7 : d.connections > 2 ? 5 : 3.5;
      })
      .style("fill", d => {
        if (!isPrimary(d)) {
          return Math.random() > 0.7 ? "hsl(var(--graph-node-secondary))" : "hsl(var(--graph-node))";
        }
        const isSecondary = ["Journal Entry", "Incoming Payment", "Goods Issue", "Goods Receipt", "Vendor Invoice"].includes(d.entity);
        return isSecondary ? "hsl(var(--graph-node-secondary))" : "hsl(var(--graph-node))";
      })
      .style("stroke", d => isPrimary(d) ? "hsl(var(--card))" : "none")
      .style("stroke-width", d => isPrimary(d) ? 1.5 : 0)
      .style("opacity", d => isPrimary(d) ? 1 : 0.7);

    // Labels only for primary nodes when granular is on
    if (showGranular) {
      node.filter(d => isPrimary(d)).append("text")
        .text(d => d.label)
        .attr("dy", -12)
        .attr("text-anchor", "middle")
        .style("font-size", "8px")
        .style("fill", "hsl(var(--muted-foreground))")
        .style("pointer-events", "none")
        .style("font-family", "var(--font-sans, system-ui)");
    }

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as GraphNode).x!)
        .attr("y1", d => (d.source as GraphNode).y!)
        .attr("x2", d => (d.target as GraphNode).x!)
        .attr("y2", d => (d.target as GraphNode).y!);
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Highlight selected
    if (selectedNodeId) {
      node.select("circle")
        .style("stroke", d => d.id === selectedNodeId ? "hsl(var(--graph-edge-highlight))" : (isPrimary(d) ? "hsl(var(--card))" : "none"))
        .style("stroke-width", d => d.id === selectedNodeId ? 3 : (isPrimary(d) ? 1.5 : 0));
      link
        .style("stroke", d => {
          const src = (d.source as GraphNode).id;
          const tgt = (d.target as GraphNode).id;
          return src === selectedNodeId || tgt === selectedNodeId ? "hsl(var(--graph-edge-highlight))" : "hsl(var(--graph-edge))";
        })
        .style("stroke-opacity", d => {
          const src = (d.source as GraphNode).id;
          const tgt = (d.target as GraphNode).id;
          return src === selectedNodeId || tgt === selectedNodeId ? 0.9 : 0.15;
        })
        .style("stroke-width", d => {
          const src = (d.source as GraphNode).id;
          const tgt = (d.target as GraphNode).id;
          return src === selectedNodeId || tgt === selectedNodeId ? 1.5 : 0.6;
        });
    }

    // Initial zoom
    setTimeout(() => {
      svg.call(zoom.transform, d3.zoomIdentity.translate(width * 0.1, height * 0.1).scale(0.8));
    }, 800);
  }, [nodes, edges, dimensions, onNodeClick, selectedNodeId, showGranular]);

  useEffect(() => { draw(); return () => { simulationRef.current?.stop(); }; }, [draw]);

  return (
    <div ref={containerRef} className="w-full h-full bg-graph-bg overflow-hidden">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
    </div>
  );
}
