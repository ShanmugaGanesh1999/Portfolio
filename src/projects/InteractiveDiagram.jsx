import { useState, useRef, useCallback, useEffect } from "react";
import { DIAGRAM_NODES, DIAGRAM_EDGES, DATA_FLOWS } from "./rollupSummaryData";

// ──────────────────────────────────────
// Color map → Tailwind CSS variable hex
// ──────────────────────────────────────
const COLOR_HEX = {
  accent: "#58a6ff",
  success: "#3fb950",
  keyword: "#ff7b72",
  variable: "#ffa657",
  func: "#d2a8ff",
  string: "#a5d6ff",
  comment: "#8b949e",
  bg: "#0d1117",
  sidebar: "#161b22",
  border: "#30363d",
  text: "#c9d1d9",
};

function getNodeCenter(node) {
  return { x: node.x + 70, y: node.y + 28 };
}

function getNodeById(id) {
  return DIAGRAM_NODES.find((n) => n.id === id);
}

// ──────────────────────────────────────
// EdgeLine — SVG path between two nodes
// ──────────────────────────────────────
function EdgeLine({ edge, highlighted, dimmed }) {
  const from = getNodeById(edge.from);
  const to = getNodeById(edge.to);
  if (!from || !to) return null;

  const fc = getNodeCenter(from);
  const tc = getNodeCenter(to);
  const offset = edge.offset || 0;

  const opacity = dimmed ? 0.12 : highlighted ? 1 : 0.45;
  const strokeWidth = highlighted ? 2.5 : 1.2;

  return (
    <g style={{ transition: "opacity 0.3s" }}>
      <line
        x1={fc.x + offset}
        y1={fc.y}
        x2={tc.x + offset}
        y2={tc.y}
        stroke={COLOR_HEX[edge.color] || COLOR_HEX.comment}
        strokeWidth={strokeWidth}
        strokeDasharray={edge.dashed ? "6 4" : "none"}
        opacity={opacity}
        markerEnd="url(#arrowhead)"
      />
      {edge.label && (
        <text
          x={(fc.x + tc.x) / 2 + offset + 6}
          y={(fc.y + tc.y) / 2 - 6}
          fill={COLOR_HEX[edge.color] || COLOR_HEX.comment}
          fontSize="9"
          fontFamily="'Space Mono', monospace"
          opacity={dimmed ? 0.15 : 0.75}
        >
          {edge.label}
        </text>
      )}
    </g>
  );
}

// ──────────────────────────────────────
// DiagramNode — Clickable box in the SVG
// ──────────────────────────────────────
function DiagramNode({ node, isSelected, isHighlighted, isDimmed, onClick }) {
  const fill = isSelected
    ? COLOR_HEX[node.color]
    : isHighlighted
    ? `${COLOR_HEX[node.color]}22`
    : COLOR_HEX.sidebar;

  const stroke = isSelected || isHighlighted
    ? COLOR_HEX[node.color]
    : COLOR_HEX.border;

  const textFill = isSelected ? COLOR_HEX.bg : COLOR_HEX.text;
  const subFill = isSelected ? COLOR_HEX.bg : COLOR_HEX.comment;
  const opacity = isDimmed ? 0.2 : 1;

  return (
    <g
      onClick={(e) => {
        e.stopPropagation();
        onClick(node);
      }}
      style={{ cursor: "pointer", transition: "opacity 0.3s" }}
      opacity={opacity}
    >
      <rect
        x={node.x}
        y={node.y}
        width={140}
        height={56}
        rx={6}
        ry={6}
        fill={fill}
        stroke={stroke}
        strokeWidth={isSelected ? 2 : 1}
      />
      {/* Glow effect when selected */}
      {isSelected && (
        <rect
          x={node.x - 3}
          y={node.y - 3}
          width={146}
          height={62}
          rx={9}
          ry={9}
          fill="none"
          stroke={COLOR_HEX[node.color]}
          strokeWidth={1}
          opacity={0.3}
        />
      )}
      <text
        x={node.x + 70}
        y={node.y + 24}
        textAnchor="middle"
        fill={textFill}
        fontSize="11"
        fontWeight="bold"
        fontFamily="'Space Mono', monospace"
      >
        {node.label}
      </text>
      <text
        x={node.x + 70}
        y={node.y + 40}
        textAnchor="middle"
        fill={subFill}
        fontSize="9"
        fontFamily="'Space Mono', monospace"
      >
        {node.sublabel}
      </text>
    </g>
  );
}

// ──────────────────────────────────────
// InteractiveDiagram — Main component
// ──────────────────────────────────────
export default function InteractiveDiagram() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeFlow, setActiveFlow] = useState(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // ── Zoom ──
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.4, Math.min(3, prev.scale + delta)),
    }));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
      return () => el.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  // ── Pan ──
  const handlePointerDown = (e) => {
    if (e.target.tagName === "rect" || e.target.tagName === "text") return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };
  const handlePointerMove = (e) => {
    if (!isPanning) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    }));
  };
  const handlePointerUp = () => setIsPanning(false);

  // ── Zoom buttons ──
  const zoomIn = () =>
    setTransform((p) => ({ ...p, scale: Math.min(3, p.scale + 0.2) }));
  const zoomOut = () =>
    setTransform((p) => ({ ...p, scale: Math.max(0.4, p.scale - 0.2) }));
  const resetView = () => setTransform({ x: 0, y: 0, scale: 1 });

  // ── Determine highlighted nodes ──
  const flowNodes = activeFlow ? DATA_FLOWS[activeFlow]?.path || [] : [];
  const selectedConnectedEdges = selectedNode
    ? DIAGRAM_EDGES.filter(
        (e) => e.from === selectedNode.id || e.to === selectedNode.id
      )
    : [];
  const selectedConnectedIds = selectedNode
    ? [
        selectedNode.id,
        ...selectedConnectedEdges.map((e) =>
          e.from === selectedNode.id ? e.to : e.from
        ),
      ]
    : [];

  const isNodeHighlighted = (node) => {
    if (activeFlow) return flowNodes.includes(node.id);
    if (selectedNode) return selectedConnectedIds.includes(node.id);
    return false;
  };

  const isNodeDimmed = (node) => {
    if (activeFlow) return !flowNodes.includes(node.id);
    if (selectedNode) return !selectedConnectedIds.includes(node.id);
    return false;
  };

  const isEdgeHighlighted = (edge) => {
    if (activeFlow) {
      const path = DATA_FLOWS[activeFlow]?.path || [];
      return path.includes(edge.from) && path.includes(edge.to);
    }
    if (selectedNode)
      return edge.from === selectedNode.id || edge.to === selectedNode.id;
    return false;
  };

  const isEdgeDimmed = (edge) => {
    if (activeFlow) return !isEdgeHighlighted(edge);
    if (selectedNode) return !isEdgeHighlighted(edge);
    return false;
  };

  return (
    <div className="space-y-3">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 border border-border rounded-md overflow-hidden shrink-0">
          <button
            onClick={zoomOut}
            className="px-2 py-1 text-xs text-comment hover:text-white hover:bg-border/50 transition-colors"
            title="Zoom out"
          >
            −
          </button>
          <span className="text-[10px] text-comment px-2 border-x border-border">
            {Math.round(transform.scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="px-2 py-1 text-xs text-comment hover:text-white hover:bg-border/50 transition-colors"
            title="Zoom in"
          >
            +
          </button>
          <button
            onClick={resetView}
            className="px-2 py-1 text-[10px] text-comment hover:text-white hover:bg-border/50 transition-colors border-l border-border"
            title="Reset view"
          >
            RESET
          </button>
        </div>

        <div className="flex items-center gap-1 flex-wrap sm:flex-nowrap sm:ml-auto">
          {Object.entries(DATA_FLOWS).map(([key, flow]) => (
            <button
              key={key}
              onClick={() => {
                setActiveFlow(activeFlow === key ? null : key);
                setSelectedNode(null);
              }}
              className={`px-2 py-1 text-[10px] rounded border transition-all ${
                activeFlow === key
                  ? `border-${flow.color}/50 text-${flow.color} bg-${flow.color}/10`
                  : "border-border text-comment hover:text-white hover:border-comment"
              }`}
              style={
                activeFlow === key
                  ? {
                      borderColor: `${COLOR_HEX[flow.color]}55`,
                      color: COLOR_HEX[flow.color],
                      backgroundColor: `${COLOR_HEX[flow.color]}15`,
                    }
                  : {}
              }
            >
              {flow.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div
        ref={containerRef}
        className="border border-border rounded-md bg-sidebar/30 overflow-hidden relative"
        style={{
          height: typeof window !== 'undefined' && window.innerWidth < 640 ? "280px" : "420px",
          cursor: isPanning ? "grabbing" : "grab",
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={() => {
          setSelectedNode(null);
          setActiveFlow(null);
        }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#c9d1d9 1px, transparent 1px), linear-gradient(90deg, #c9d1d9 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1100 560"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "center center",
            transition: isPanning ? "none" : "transform 0.15s ease-out",
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 8 3, 0 6"
                fill={COLOR_HEX.comment}
                opacity="0.6"
              />
            </marker>
          </defs>

          {/* Edges */}
          {DIAGRAM_EDGES.map((edge, i) => (
            <EdgeLine
              key={i}
              edge={edge}
              highlighted={isEdgeHighlighted(edge)}
              dimmed={isEdgeDimmed(edge)}
            />
          ))}

          {/* Nodes */}
          {DIAGRAM_NODES.map((node) => (
            <DiagramNode
              key={node.id}
              node={node}
              isSelected={selectedNode?.id === node.id}
              isHighlighted={isNodeHighlighted(node)}
              isDimmed={isNodeDimmed(node)}
              onClick={(n) => {
                setSelectedNode(selectedNode?.id === n.id ? null : n);
                setActiveFlow(null);
              }}
            />
          ))}
        </svg>
      </div>

      {/* Detail panel */}
      {(selectedNode || activeFlow) && (
        <div className="border border-border rounded-md bg-sidebar/50 p-3 animate-fade-in-up" style={{ animationDuration: "0.25s" }}>
          {selectedNode && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLOR_HEX[selectedNode.color] }}
                />
                <span className="text-sm font-bold" style={{ color: COLOR_HEX[selectedNode.color] }}>
                  {selectedNode.label}
                </span>
                <span className="text-[10px] text-comment">({selectedNode.sublabel})</span>
              </div>
              <p className="text-xs text-comment leading-relaxed">
                {selectedNode.description}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                <span className="text-[9px] text-comment">Connections:</span>
                {selectedConnectedEdges.map((e, i) => {
                  const target = e.from === selectedNode.id ? e.to : e.from;
                  const targetNode = getNodeById(target);
                  const direction = e.from === selectedNode.id ? "→" : "←";
                  return (
                    <span
                      key={i}
                      className="text-[9px] px-1.5 py-0.5 border rounded"
                      style={{
                        borderColor: `${COLOR_HEX[e.color]}40`,
                        color: COLOR_HEX[e.color],
                      }}
                    >
                      {direction} {targetNode?.label}{e.label ? ` (${e.label})` : ""}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          {activeFlow && !selectedNode && (
            <div className="space-y-1">
              <span
                className="text-sm font-bold"
                style={{ color: COLOR_HEX[DATA_FLOWS[activeFlow].color] }}
              >
                {DATA_FLOWS[activeFlow].label}
              </span>
              <p className="text-xs text-comment">
                {DATA_FLOWS[activeFlow].description}
              </p>
            </div>
          )}
        </div>
      )}

      <p className="text-[10px] text-comment/50 text-center">
        scroll to zoom · drag to pan · click a component to inspect · use flow buttons to trace data paths
      </p>
    </div>
  );
}
