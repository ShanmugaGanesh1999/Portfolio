import { useState, useRef, useCallback, useEffect, useMemo, useId } from "react";
import { parseMermaid } from "./parseMermaid";
import { renderNodeBackground } from "../utils/nodeShapes";

// ──────────────────────────────────────
// Colour map — identical to InteractiveDiagram in projects/
// ──────────────────────────────────────
const C = {
  accent:  "#58a6ff",
  success: "#3fb950",
  keyword: "#ff7b72",
  variable:"#ffa657",
  func:    "#d2a8ff",
  string:  "#a5d6ff",
  comment: "#8b949e",
  bg:      "#0d1117",
  sidebar: "#161b22",
  border:  "#30363d",
  text:    "#c9d1d9",
};

const NODE_W = 155;
const NODE_H = 56;

function centre(n) {
  return { x: n.x + NODE_W / 2, y: n.y + NODE_H / 2 };
}

// ──────────────────────────────────────────────────
// Edge — line + optional label
// ──────────────────────────────────────────────────
function Edge({ edge, from, to, highlighted, dimmed, mid }) {
  if (!from || !to) return null;
  const a = centre(from);
  const b = centre(to);
  const color = C[edge.color] || C.comment;
  const op  = dimmed ? 0.1 : highlighted ? 1 : 0.4;
  const sw  = highlighted ? 2.5 : 1.2;
  const mx  = (a.x + b.x) / 2;
  const my  = (a.y + b.y) / 2;

  return (
    <g style={{ transition: "opacity .3s" }}>
      <line
        x1={a.x} y1={a.y} x2={b.x} y2={b.y}
        stroke={color} strokeWidth={sw}
        strokeDasharray={edge.dashed ? "6 4" : "none"}
        opacity={op}
        markerEnd={`url(#${mid})`}
      />
      {edge.bidirectional && (
        <line
          x1={b.x} y1={b.y} x2={a.x} y2={a.y}
          stroke={color} strokeWidth={sw} opacity={op}
          markerEnd={`url(#${mid})`}
        />
      )}
      {edge.label && (
        <>
          <rect
            x={mx - edge.label.length * 3.2 - 5}
            y={my - 14}
            width={edge.label.length * 6.4 + 10}
            height={16} rx={3}
            fill={C.bg} opacity={dimmed ? 0.05 : 0.85}
          />
          <text
            x={mx} y={my - 3}
            fill={color} fontSize="9" textAnchor="middle"
            fontFamily="'JetBrains Mono','Space Mono',monospace"
            opacity={dimmed ? 0.12 : 0.8}
          >
            {edge.label}
          </text>
        </>
      )}
    </g>
  );
}

// ──────────────────────────────────────────────────
// Node — clickable shape (rect, cylinder, stadium, etc.)
// ──────────────────────────────────────────────────
function Node({ node, selected, highlighted, dimmed, onClick }) {
  const col  = C[node.color] || C.comment;
  const fill = selected ? col : highlighted ? col + "22" : C.sidebar;
  const strk = selected || highlighted ? col : C.border;
  const tFill = selected ? C.bg : C.text;
  const sFill = selected ? C.bg + "cc" : C.comment;
  const op   = dimmed ? 0.18 : 1;
  const lbl  = node.label.length > 18 ? node.label.slice(0, 16) + "…" : node.label;
  const sub  = (node.sublabel || "").length > 22 ? node.sublabel.slice(0, 20) + "…" : node.sublabel;

  return (
    <g
      onClick={e => { e.stopPropagation(); onClick(node); }}
      style={{ cursor: "pointer", transition: "opacity .3s" }}
      opacity={op}
    >
      {renderNodeBackground({
        shape: node.shape || "rect",
        x: node.x, y: node.y,
        w: NODE_W, h: NODE_H,
        fill, stroke: strk,
        sw: selected ? 2 : 1,
      })}
      {selected && (
        <rect
          x={node.x - 3} y={node.y - 3}
          width={NODE_W + 6} height={NODE_H + 6}
          rx={9} fill="none" stroke={col}
          strokeWidth={1} opacity={0.3}
        />
      )}
      <text
        x={node.x + NODE_W / 2}
        y={sub ? node.y + 22 : node.y + NODE_H / 2 + 4}
        textAnchor="middle" fill={tFill} fontSize="11" fontWeight="bold"
        fontFamily="'JetBrains Mono','Space Mono',monospace"
      >
        {lbl}
      </text>
      {sub && (
        <text
          x={node.x + NODE_W / 2} y={node.y + 39}
          textAnchor="middle" fill={sFill} fontSize="9"
          fontFamily="'JetBrains Mono','Space Mono',monospace"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

// ──────────────────────────────────────────────────
// SubgraphRegion — dashed box behind a group of nodes
// ──────────────────────────────────────────────────
function SubgraphRegion({ sg, nodes, dim }) {
  const sgNodes = nodes.filter(n => sg.nodeIds.includes(n.id));
  if (!sgNodes.length) return null;
  const pad = 16;
  const x1 = Math.min(...sgNodes.map(n => n.x)) - pad;
  const y1 = Math.min(...sgNodes.map(n => n.y)) - pad - 16;
  const x2 = Math.max(...sgNodes.map(n => n.x + NODE_W)) + pad;
  const y2 = Math.max(...sgNodes.map(n => n.y + NODE_H)) + pad;
  const col = C[sg.color] || C.comment;

  return (
    <g opacity={dim ? 0.2 : 0.55}>
      <rect
        x={x1} y={y1} width={x2 - x1} height={y2 - y1}
        rx={8} fill={col + "08"} stroke={col + "30"}
        strokeWidth={1} strokeDasharray="4 3"
      />
      <text
        x={x1 + 8} y={y1 + 12}
        fill={col} fontSize="9" fontWeight="bold" opacity={0.7}
        fontFamily="'JetBrains Mono','Space Mono',monospace"
      >
        {sg.name.toUpperCase()}
      </text>
    </g>
  );
}

// ══════════════════════════════════════════════════
// SystemDesignDiagram — pan / zoom / click-inspect
// ══════════════════════════════════════════════════
export default function SystemDesignDiagram({ mermaidCode }) {
  const { nodes, edges, subgraphs } = useMemo(
    () => parseMermaid(mermaidCode),
    [mermaidCode],
  );

  const [sel, setSel] = useState(null);           // selected node
  const [tf, setTf]   = useState({ x: 0, y: 0, s: 1 }); // transform
  const [pan, setPan]  = useState(false);
  const [panO, setPanO] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  // stable marker id
  const mid = useId().replace(/:/g, "");

  // viewBox
  const vb = useMemo(() => {
    if (!nodes.length) return "0 0 800 400";
    const p = 50;
    const x1 = Math.min(...nodes.map(n => n.x)) - p;
    const y1 = Math.min(...nodes.map(n => n.y)) - p - 20;
    const x2 = Math.max(...nodes.map(n => n.x + NODE_W)) + p;
    const y2 = Math.max(...nodes.map(n => n.y + NODE_H)) + p;
    return `${x1} ${y1} ${x2 - x1} ${y2 - y1}`;
  }, [nodes]);

  // wheel zoom
  const onWheel = useCallback(e => {
    e.preventDefault();
    setTf(p => ({
      ...p,
      s: Math.max(0.3, Math.min(3, p.s + (e.deltaY > 0 ? -0.08 : 0.08))),
    }));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  // pointer pan
  const pDown = e => {
    if (e.target.tagName === "rect" || e.target.tagName === "text") return;
    setPan(true);
    setPanO({ x: e.clientX - tf.x, y: e.clientY - tf.y });
  };
  const pMove = e => {
    if (!pan) return;
    setTf(p => ({ ...p, x: e.clientX - panO.x, y: e.clientY - panO.y }));
  };
  const pUp = () => setPan(false);

  // zoom buttons
  const zIn  = () => setTf(p => ({ ...p, s: Math.min(3, p.s + 0.2) }));
  const zOut = () => setTf(p => ({ ...p, s: Math.max(0.3, p.s - 0.2) }));
  const zRst = () => setTf({ x: 0, y: 0, s: 1 });

  // selection helpers
  const connEdges = sel
    ? edges.filter(e => e.from === sel.id || e.to === sel.id)
    : [];
  const connIds = sel
    ? [sel.id, ...connEdges.map(e => (e.from === sel.id ? e.to : e.from))]
    : [];

  const nodeHL = n => sel ? connIds.includes(n.id) : false;
  const nodeDim = n => sel ? !connIds.includes(n.id) : false;
  const edgeHL = e => sel ? (e.from === sel.id || e.to === sel.id) : false;
  const edgeDim = e => sel ? !edgeHL(e) : false;
  const getNode = id => nodes.find(n => n.id === id);

  return (
    <div className="space-y-2 my-5">
      {/* ── Controls ── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center border border-border rounded-md overflow-hidden shrink-0">
          <button onClick={zOut} className="px-2 py-1 text-xs text-comment hover:text-white hover:bg-border/50 transition-colors" title="Zoom out">−</button>
          <span className="text-[10px] text-comment px-2 border-x border-border tabular-nums">{Math.round(tf.s * 100)}%</span>
          <button onClick={zIn} className="px-2 py-1 text-xs text-comment hover:text-white hover:bg-border/50 transition-colors" title="Zoom in">+</button>
          <button onClick={zRst} className="px-2 py-1 text-[10px] text-comment hover:text-white hover:bg-border/50 transition-colors border-l border-border" title="Reset">RESET</button>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {subgraphs.map(sg => (
            <span key={sg.name} className="flex items-center gap-1 text-[10px]" style={{ color: C[sg.color] }}>
              <span className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: C[sg.color] }} />
              {sg.name}
            </span>
          ))}
        </div>
      </div>

      {/* ── Canvas ── */}
      <div
        ref={ref}
        className="border border-border rounded-md bg-sidebar/30 overflow-hidden relative"
        style={{
          height: typeof window !== "undefined" && window.innerWidth < 640 ? "280px" : "420px",
          cursor: pan ? "grabbing" : "grab",
          touchAction: "none",
        }}
        onPointerDown={pDown}
        onPointerMove={pMove}
        onPointerUp={pUp}
        onPointerLeave={pUp}
        onClick={() => setSel(null)}
      >
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#c9d1d9 1px,transparent 1px),linear-gradient(90deg,#c9d1d9 1px,transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <svg
          width="100%" height="100%"
          viewBox={vb}
          style={{
            transform: `translate(${tf.x}px,${tf.y}px) scale(${tf.s})`,
            transformOrigin: "center center",
            transition: pan ? "none" : "transform .15s ease-out",
          }}
        >
          <defs>
            <marker id={mid} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill={C.comment} opacity="0.6" />
            </marker>
          </defs>

          {/* Subgraph regions */}
          {subgraphs.map(sg => (
            <SubgraphRegion key={sg.name} sg={sg} nodes={nodes} dim={!!sel} />
          ))}

          {/* Edges */}
          {edges.map((e, i) => (
            <Edge
              key={i} edge={e}
              from={getNode(e.from)} to={getNode(e.to)}
              highlighted={edgeHL(e)} dimmed={edgeDim(e)}
              mid={mid}
            />
          ))}

          {/* Nodes */}
          {nodes.map(n => (
            <Node
              key={n.id} node={n}
              selected={sel?.id === n.id}
              highlighted={nodeHL(n)}
              dimmed={nodeDim(n)}
              onClick={nd => setSel(sel?.id === nd.id ? null : nd)}
            />
          ))}
        </svg>
      </div>

      {/* ── Detail panel ── */}
      {sel && (
        <div className="border border-border rounded-md bg-sidebar/50 p-3 animate-fade-in-up" style={{ animationDuration: ".25s" }}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: C[sel.color] }} />
              <span className="text-sm font-bold font-mono" style={{ color: C[sel.color] }}>{sel.label}</span>
              {sel.sublabel && <span className="text-[10px] text-comment">({sel.sublabel})</span>}
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="text-[9px] text-comment mr-1">Connections:</span>
              {connEdges.map((e, i) => {
                const tid = e.from === sel.id ? e.to : e.from;
                const tn  = getNode(tid);
                const dir = e.from === sel.id ? "→" : e.bidirectional ? "↔" : "←";
                return (
                  <button
                    key={i}
                    className="text-[9px] px-1.5 py-0.5 border rounded hover:bg-border/30 transition-colors"
                    style={{
                      borderColor: (C[tn?.color] || C.comment) + "40",
                      color: C[tn?.color] || C.comment,
                    }}
                    onClick={ev => { ev.stopPropagation(); setSel(tn); }}
                  >
                    {dir} {tn?.label}{e.label ? ` (${e.label})` : ""}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <p className="text-[10px] text-comment/50 text-center select-none">
        scroll to zoom · drag to pan · click a component to inspect
      </p>
    </div>
  );
}
