import { useState, useRef, useCallback, useEffect } from "react";
import { DIAGRAM_NODES, DIAGRAM_EDGES, DATA_FLOWS } from "./validationData";
import { renderNodeBackground } from "../utils/nodeShapes";
import { useThemeColors } from "../hooks/useTheme";

function getNodeCenter(node) {
  return { x: node.x + 70, y: node.y + 28 };
}

function getNodeById(id) {
  return DIAGRAM_NODES.find((n) => n.id === id);
}

function EdgeLine({ edge, highlighted, dimmed }) {
  const COLOR_HEX = useThemeColors();
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
        markerEnd="url(#arrowhead-val)"
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

function DiagramNode({ node, isSelected, isHighlighted, isDimmed, onClick }) {
  const COLOR_HEX = useThemeColors();
  const fill = isSelected
    ? COLOR_HEX[node.color]
    : isHighlighted
    ? `${COLOR_HEX[node.color]}22`
    : COLOR_HEX.sidebar;

  const stroke =
    isSelected || isHighlighted ? COLOR_HEX[node.color] : COLOR_HEX.border;
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
      {renderNodeBackground({
        shape: node.shape || "rect",
        x: node.x, y: node.y,
        w: 140, h: 56,
        fill, stroke,
        sw: isSelected ? 2 : 1,
      })}
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
        fontSize="12"
        fontWeight="bold"
        fontFamily="'Space Mono', monospace"
      >
        {node.label}
      </text>
      <text
        x={node.x + 70}
        y={node.y + 42}
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
// ValidationDiagram — Interactive SVG
// ──────────────────────────────────────
export default function ValidationDiagram() {
  const COLOR_HEX = useThemeColors();
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeFlow, setActiveFlow] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const handleNodeClick = useCallback(
    (node) => {
      setSelectedNode(selectedNode?.id === node.id ? null : node);
      setActiveFlow(null);
    },
    [selectedNode]
  );

  const handleBgClick = useCallback(() => {
    setSelectedNode(null);
    setActiveFlow(null);
  }, []);

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) => Math.min(Math.max(prev + delta, 0.4), 2.5));
    },
    []
  );

  const handleMouseDown = useCallback(
    (e) => {
      if (e.target === svgRef.current || e.target.tagName === "rect") return;
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    },
    [pan]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isPanning) return;
      setPan({
        x: panStart.current.panX + (e.clientX - panStart.current.x),
        y: panStart.current.panY + (e.clientY - panStart.current.y),
      });
    },
    [isPanning]
  );

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const flowNodes = activeFlow ? DATA_FLOWS[activeFlow]?.path || [] : [];

  function isNodeInFlow(nodeId) {
    return flowNodes.includes(nodeId);
  }

  function isEdgeInFlow(edge) {
    if (!flowNodes.length) return false;
    for (let i = 0; i < flowNodes.length - 1; i++) {
      if (edge.from === flowNodes[i] && edge.to === flowNodes[i + 1]) return true;
    }
    return false;
  }

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-comment">Data Flows:</span>
        {Object.entries(DATA_FLOWS).map(([key, flow]) => (
          <button
            key={key}
            onClick={() => {
              setActiveFlow(activeFlow === key ? null : key);
              setSelectedNode(null);
            }}
            className={`text-[10px] px-2 py-1 rounded border transition-all ${
              activeFlow === key
                ? "border-current bg-current/10 font-bold"
                : "border-border text-comment hover:text-white"
            }`}
            style={
              activeFlow === key ? { color: COLOR_HEX[flow.color] } : {}
            }
          >
            {flow.label}
          </button>
        ))}
        <div className="flex items-center gap-1 flex-wrap sm:flex-nowrap sm:ml-auto">
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.4))}
            className="text-comment hover:text-white text-xs border border-border px-1.5 py-0.5 rounded"
          >
            −
          </button>
          <span className="text-[10px] text-comment w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))}
            className="text-comment hover:text-white text-xs border border-border px-1.5 py-0.5 rounded"
          >
            +
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="text-comment hover:text-white text-[10px] border border-border px-1.5 py-0.5 rounded ml-1"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Flow description */}
      {activeFlow && DATA_FLOWS[activeFlow] && (
        <div
          className="text-[10px] px-3 py-1.5 rounded border bg-sidebar/50"
          style={{
            borderColor: `${COLOR_HEX[DATA_FLOWS[activeFlow].color]}40`,
            color: COLOR_HEX[DATA_FLOWS[activeFlow].color],
          }}
        >
          {DATA_FLOWS[activeFlow].description}
        </div>
      )}

      {/* SVG Diagram */}
      <div
        ref={containerRef}
        className="border border-border rounded-md bg-sidebar/30 overflow-hidden relative"
        style={{ height: typeof window !== 'undefined' && window.innerWidth < 640 ? 300 : 480, cursor: isPanning ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 1000 740"
          width="100%"
          height="100%"
          onClick={handleBgClick}
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "center center",
            transition: isPanning ? "none" : "transform 0.2s",
          }}
        >
          <defs>
            <marker
              id="arrowhead-val"
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
              highlighted={
                activeFlow
                  ? isEdgeInFlow(edge)
                  : selectedNode
                  ? edge.from === selectedNode.id || edge.to === selectedNode.id
                  : false
              }
              dimmed={
                activeFlow
                  ? !isEdgeInFlow(edge)
                  : selectedNode
                  ? edge.from !== selectedNode.id && edge.to !== selectedNode.id
                  : false
              }
            />
          ))}

          {/* Nodes */}
          {DIAGRAM_NODES.map((node) => (
            <DiagramNode
              key={node.id}
              node={node}
              isSelected={selectedNode?.id === node.id}
              isHighlighted={activeFlow ? isNodeInFlow(node.id) : false}
              isDimmed={
                activeFlow
                  ? !isNodeInFlow(node.id)
                  : selectedNode
                  ? selectedNode.id !== node.id
                  : false
              }
              onClick={handleNodeClick}
            />
          ))}
        </svg>
      </div>

      {/* Node description */}
      {selectedNode && (
        <div
          className="border rounded-md p-3 bg-sidebar/50 animate-fade-in-up"
          style={{
            borderColor: `${COLOR_HEX[selectedNode.color]}40`,
            animationDuration: "0.2s",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLOR_HEX[selectedNode.color] }}
            />
            <span className="text-xs font-bold text-white">
              {selectedNode.label}
            </span>
            <span className="text-[10px] text-comment">
              {selectedNode.sublabel}
            </span>
          </div>
          <p className="text-[11px] text-comment leading-relaxed">
            {selectedNode.description}
          </p>
        </div>
      )}
    </div>
  );
}
