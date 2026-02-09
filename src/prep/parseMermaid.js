// ============================================================
// parseMermaid.js — Convert Mermaid "graph TD" syntax into
// { nodes, edges, subgraphs } for interactive SVG rendering.
//
// Handles all syntax found across 23+ system-design case studies:
//   A --> B           standard directed edge
//   A -->|label| B    labelled edge
//   A <-->|label| B   bidirectional edge
//   A[Label]          square node
//   A[(Label)]        cylinder / DB node
//   A[Label<br/>Sub]  multi-line label
//   subgraph Name … end
//   Nested subgraph … end (flattened)
// ============================================================

const SUBGRAPH_COLORS = [
  "accent",   // #58a6ff  blue
  "keyword",  // #ff7b72  coral
  "success",  // #3fb950  green
  "variable", // #ffa657  orange
  "func",     // #d2a8ff  purple
  "string",   // #a5d6ff  light blue
];

const DEFAULT_COLOR = "comment";

/**
 * Main entry point.
 * @param {string} raw — raw mermaid source (content between ```mermaid fences)
 * @returns {{ nodes: Array, edges: Array, subgraphs: Array }}
 */
export function parseMermaid(raw) {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

  const nodesMap = new Map();   // id → { id, label, sublabel, color }
  const edges = [];
  const subgraphs = [];         // { name, nodeIds[], color }
  const subgraphStack = [];     // for nested subgraphs
  let colorIdx = 0;

  for (const line of lines) {
    // ── Skip graph declaration ──
    if (/^graph\s+(TD|TB|LR|RL|BT)/i.test(line)) continue;

    // ── Subgraph end ──
    if (/^end$/i.test(line)) {
      if (subgraphStack.length > 0) {
        subgraphs.push(subgraphStack.pop());
      }
      continue;
    }

    // ── Subgraph start ──
    const sgMatch = line.match(/^subgraph\s+(.+)/i);
    if (sgMatch) {
      subgraphStack.push({
        name: sgMatch[1].trim(),
        nodeIds: [],
        color: SUBGRAPH_COLORS[colorIdx++ % SUBGRAPH_COLORS.length],
      });
      continue;
    }

    // ── Try edge line first (may contain inline node defs) ──
    const edgeResult = tryParseEdges(line);
    if (edgeResult) {
      // Register any inline node definitions
      for (const nd of edgeResult.inlineNodes) {
        if (!nodesMap.has(nd.id)) nodesMap.set(nd.id, nd);
        addToCurrentSubgraph(subgraphStack, nd.id);
      }
      for (const e of edgeResult.edges) {
        edges.push(e);
        ensureNode(nodesMap, e.from);
        ensureNode(nodesMap, e.to);
        addToCurrentSubgraph(subgraphStack, e.from);
        addToCurrentSubgraph(subgraphStack, e.to);
      }
      continue;
    }

    // ── Standalone node definition ──
    const nd = tryParseNode(line);
    if (nd) {
      nodesMap.set(nd.id, nd);
      addToCurrentSubgraph(subgraphStack, nd.id);
    }
  }

  // Flush any unclosed subgraphs
  while (subgraphStack.length > 0) {
    subgraphs.push(subgraphStack.pop());
  }

  // Assign colors to nodes from their subgraph
  for (const sg of subgraphs) {
    for (const nid of sg.nodeIds) {
      const node = nodesMap.get(nid);
      if (node) node.color = sg.color;
    }
  }

  // Colour edges by source-node's subgraph colour
  for (const e of edges) {
    const src = nodesMap.get(e.from);
    if (src && src.color !== DEFAULT_COLOR) e.color = src.color;
  }

  const nodes = layoutNodes(Array.from(nodesMap.values()), edges, subgraphs);
  return { nodes, edges, subgraphs };
}

// ──────────────────────────────────────
// Helper — add node id to current (top) subgraph
// ──────────────────────────────────────
function addToCurrentSubgraph(stack, id) {
  if (stack.length === 0) return;
  const sg = stack[stack.length - 1];
  if (!sg.nodeIds.includes(id)) sg.nodeIds.push(id);
}

// ──────────────────────────────────────
// Ensure a bare-reference node exists
// ──────────────────────────────────────
function ensureNode(map, id) {
  if (!map.has(id)) {
    map.set(id, { id, label: id, sublabel: "", color: DEFAULT_COLOR });
  }
}

// ──────────────────────────────────────
// Parse a standalone node definition:
//   API[API Gateway]
//   PG[(PostgreSQL<br/>Users)]
//   INF1[Inference Node 1<br/>8x A100]
// ──────────────────────────────────────
function tryParseNode(line) {
  // Match ID followed by bracket group — greedy to the end of line
  const m = line.match(/^([A-Za-z_]\w*)\s*([\[\(\{][\[\(\{]?.+[\]\)\}][\]\)\}]?)\s*$/);
  if (!m) return null;
  return extractNodeLabel(m[1], m[2]);
}

/**
 * Given an id and a bracket expression like "[API Gateway]" or "[(DB<br/>Users)]",
 * return { id, label, sublabel, color }.
 */
function extractNodeLabel(id, bracketExpr) {
  // Strip outermost brackets
  let inner = bracketExpr
    .replace(/^[\[\(\{]+/, "")
    .replace(/[\]\)\}]+$/, "")
    .trim();

  const parts = inner.split(/<br\s*\/?>/i);
  return {
    id,
    label: parts[0].trim(),
    sublabel: parts.length > 1 ? parts.slice(1).join(" ").trim() : "",
    color: DEFAULT_COLOR,
  };
}

// ──────────────────────────────────────
// Parse an edge line — one or more edges on a single line.
// Returns { edges: [], inlineNodes: [] } or null.
//
// Supported arrow types:
//   -->       directed
//   <-->      bidirectional
//   -.->      dashed
//   -->|lbl|  labelled
// ──────────────────────────────────────
function tryParseEdges(line) {
  // Quick reject — must contain an arrow
  if (!line.includes("-->") && !line.includes("-.->")) return null;

  const tokens = [];       // { type:'node'|'arrow', ... }
  const inlineNodes = [];
  let pos = 0;

  while (pos < line.length) {
    // Skip whitespace
    while (pos < line.length && /\s/.test(line[pos])) pos++;
    if (pos >= line.length) break;

    // ── Try arrow ──
    // Order matters: try <--> first, then -.-> , then -->
    const arrowMatch = line.slice(pos).match(
      /^(<--+>|--+>|-\.+->)(\|([^|]*)\|)?/
    );
    if (arrowMatch) {
      const raw = arrowMatch[1];
      tokens.push({
        type: "arrow",
        bidirectional: raw.startsWith("<"),
        dashed: raw.includes("."),
        label: arrowMatch[3] || "",
      });
      pos += arrowMatch[0].length;
      continue;
    }

    // ── Try node (with optional inline def) ──
    // Must match ID, then optionally bracket-content
    const nodeMatch = line.slice(pos).match(
      /^([A-Za-z_]\w*)([\[\(\{][\[\(\{]?(?:[^\]\)\}]|<br\s*\/?>)*[\]\)\}][\]\)\}]?)?/
    );
    if (nodeMatch && nodeMatch[0].length > 0) {
      tokens.push({ type: "node", id: nodeMatch[1] });
      if (nodeMatch[2]) {
        const nd = extractNodeLabel(nodeMatch[1], nodeMatch[2]);
        inlineNodes.push(nd);
      }
      pos += nodeMatch[0].length;
      continue;
    }

    pos++; // skip unrecognised char
  }

  // Build edges from the token stream: node → arrow → node
  const edges = [];
  for (let i = 0; i <= tokens.length - 3; i++) {
    if (
      tokens[i].type === "node" &&
      tokens[i + 1].type === "arrow" &&
      tokens[i + 2].type === "node"
    ) {
      edges.push({
        from: tokens[i].id,
        to: tokens[i + 2].id,
        label: tokens[i + 1].label,
        color: DEFAULT_COLOR,
        dashed: tokens[i + 1].dashed,
        bidirectional: tokens[i + 1].bidirectional,
      });
      // allow chaining: A --> B --> C (skip by 2 so B is reused as from)
      i += 1;
    }
  }

  return edges.length > 0 ? { edges, inlineNodes } : null;
}

// ══════════════════════════════════════
// Layout — topological-level assignment + centred rows
// ══════════════════════════════════════
function layoutNodes(nodes, edges, subgraphs) {
  if (nodes.length === 0) return nodes;

  const W = 155;   // node width
  const H = 56;    // node height
  const GX = 35;   // horizontal gap
  const GY = 50;   // vertical gap

  // ── Build adjacency ──
  const children = new Map();
  const inDeg = new Map();
  for (const n of nodes) {
    children.set(n.id, []);
    inDeg.set(n.id, 0);
  }
  for (const e of edges) {
    if (!children.has(e.from) || !children.has(e.to)) continue;
    children.get(e.from).push(e.to);
    inDeg.set(e.to, inDeg.get(e.to) + 1);
  }

  // ── Kahn's algorithm for topological levels ──
  const level = new Map();
  const queue = [];
  for (const n of nodes) {
    if (inDeg.get(n.id) === 0) {
      queue.push(n.id);
      level.set(n.id, 0);
    }
  }
  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    for (const child of children.get(cur) || []) {
      const nl = Math.max(level.get(child) ?? 0, level.get(cur) + 1);
      level.set(child, nl);
      inDeg.set(child, inDeg.get(child) - 1);
      if (inDeg.get(child) === 0) queue.push(child);
    }
  }

  // Any remaining nodes (cycles / disconnected) — assign level 0
  for (const n of nodes) {
    if (!level.has(n.id)) level.set(n.id, 0);
  }

  // ── Group by level ──
  const byLevel = new Map();
  for (const n of nodes) {
    const lv = level.get(n.id);
    if (!byLevel.has(lv)) byLevel.set(lv, []);
    byLevel.get(lv).push(n);
  }

  // ── Order nodes within each level for fewer edge crossings ──
  // Simple heuristic: sort by average x-position of parents from previous level
  const sortedLvls = [...byLevel.keys()].sort((a, b) => a - b);
  const posMap = new Map(); // id → column index

  for (const lv of sortedLvls) {
    const row = byLevel.get(lv);
    if (lv === 0) {
      // Root level — keep original order
      row.forEach((n, i) => posMap.set(n.id, i));
    } else {
      // Sort by average parent position
      row.sort((a, b) => {
        const aParents = edges
          .filter((e) => e.to === a.id && posMap.has(e.from))
          .map((e) => posMap.get(e.from));
        const bParents = edges
          .filter((e) => e.to === b.id && posMap.has(e.from))
          .map((e) => posMap.get(e.from));
        const aAvg = aParents.length ? aParents.reduce((s, v) => s + v, 0) / aParents.length : 0;
        const bAvg = bParents.length ? bParents.reduce((s, v) => s + v, 0) / bParents.length : 0;
        return aAvg - bAvg;
      });
      row.forEach((n, i) => posMap.set(n.id, i));
    }
  }

  // ── Compute max row width for centering ──
  let maxRowW = 0;
  for (const lv of sortedLvls) {
    const count = byLevel.get(lv).length;
    maxRowW = Math.max(maxRowW, count * (W + GX) - GX);
  }

  // ── Assign x, y ──
  let y = 30;
  for (const lv of sortedLvls) {
    const row = byLevel.get(lv);
    const rowW = row.length * (W + GX) - GX;
    let x = Math.round((maxRowW - rowW) / 2) + 30;
    for (const n of row) {
      n.x = x;
      n.y = y;
      x += W + GX;
    }
    y += H + GY;
  }

  return nodes;
}
