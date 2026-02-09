// ============================================================
// nodeShapes.jsx — SVG shape renderers for HLD diagram nodes.
//
// Shapes:
//   rect     — standard rectangle (services, APIs)
//   cyl      — vertical cylinder (databases, caches)
//   das      — horizontal cylinder (Kafka, message queues)
//   lin-cyl  — lined/disk cylinder (S3, object storage)
//   stadium  — stadium / pill (clients, mobile apps)
//   fr-rect  — framed rectangle / subroutine (workers, async jobs)
//   circle   — circle (misc)
//
// Mermaid bracket syntax mapping:
//   [label]    → rect
//   [(label)]  → cyl
//   ([label])  → stadium
//   [[label]]  → fr-rect
//   {{label}}  → das
//   >label]    → lin-cyl
//   ((label))  → circle
// ============================================================

/**
 * Render the SVG background shape for a diagram node.
 * Replaces the simple <rect> used for all nodes previously.
 *
 * @param {object} opts
 * @param {string} opts.shape  — one of: rect, cyl, das, lin-cyl, stadium, fr-rect, circle
 * @param {number} opts.x      — left edge
 * @param {number} opts.y      — top edge
 * @param {number} opts.w      — width
 * @param {number} opts.h      — height
 * @param {string} opts.fill   — fill colour
 * @param {string} opts.stroke — stroke colour
 * @param {number} opts.sw     — stroke width (default 1)
 * @returns {JSX.Element}
 */
export function renderNodeBackground({ shape, x, y, w, h, fill, stroke, sw = 1 }) {
  switch (shape) {
    case "cyl":
      return renderCylinder(x, y, w, h, fill, stroke, sw);
    case "das":
      return renderHorizontalCylinder(x, y, w, h, fill, stroke, sw);
    case "lin-cyl":
      return renderLinedCylinder(x, y, w, h, fill, stroke, sw);
    case "stadium":
      return renderStadium(x, y, w, h, fill, stroke, sw);
    case "fr-rect":
      return renderFramedRect(x, y, w, h, fill, stroke, sw);
    case "circle":
      return renderCircle(x, y, w, h, fill, stroke, sw);
    default:
      return renderRect(x, y, w, h, fill, stroke, sw);
  }
}

// ── rect (default) ──────────────────────────────
function renderRect(x, y, w, h, fill, stroke, sw) {
  return (
    <rect
      x={x} y={y} width={w} height={h}
      rx={6} ry={6}
      fill={fill} stroke={stroke} strokeWidth={sw}
    />
  );
}

// ── cyl — vertical cylinder (databases / caches) ──
function renderCylinder(x, y, w, h, fill, stroke, sw) {
  const er = 7; // ellipse ry for top/bottom caps
  return (
    <g>
      {/* Body outline */}
      <path
        d={`
          M${x},${y + er}
          A${w / 2},${er} 0 0,1 ${x + w},${y + er}
          V${y + h - er}
          A${w / 2},${er} 0 0,1 ${x},${y + h - er}
          Z
        `}
        fill={fill} stroke={stroke} strokeWidth={sw}
      />
      {/* Top front ellipse arc (lid) */}
      <path
        d={`M${x},${y + er} A${w / 2},${er} 0 0,0 ${x + w},${y + er}`}
        fill="none" stroke={stroke} strokeWidth={sw} opacity={0.45}
      />
    </g>
  );
}

// ── das — horizontal cylinder (Kafka / message queues) ──
function renderHorizontalCylinder(x, y, w, h, fill, stroke, sw) {
  const er = 9; // ellipse rx for left/right caps
  return (
    <g>
      {/* Body outline */}
      <path
        d={`
          M${x + er},${y}
          L${x + w - er},${y}
          A${er},${h / 2} 0 0,1 ${x + w - er},${y + h}
          L${x + er},${y + h}
          A${er},${h / 2} 0 0,1 ${x + er},${y}
          Z
        `}
        fill={fill} stroke={stroke} strokeWidth={sw}
      />
      {/* Right-face front arc (lid showing depth) */}
      <path
        d={`M${x + w - er},${y} A${er},${h / 2} 0 0,0 ${x + w - er},${y + h}`}
        fill="none" stroke={stroke} strokeWidth={sw} opacity={0.4}
      />
    </g>
  );
}

// ── lin-cyl — lined / disk cylinder (S3 / object storage) ──
function renderLinedCylinder(x, y, w, h, fill, stroke, sw) {
  const er = 7;
  return (
    <g>
      {/* Body outline — same as cylinder */}
      <path
        d={`
          M${x},${y + er}
          A${w / 2},${er} 0 0,1 ${x + w},${y + er}
          V${y + h - er}
          A${w / 2},${er} 0 0,1 ${x},${y + h - er}
          Z
        `}
        fill={fill} stroke={stroke} strokeWidth={sw}
      />
      {/* Top front ellipse arc (lid) */}
      <path
        d={`M${x},${y + er} A${w / 2},${er} 0 0,0 ${x + w},${y + er}`}
        fill="none" stroke={stroke} strokeWidth={sw} opacity={0.45}
      />
      {/* Extra inner line below top for "disk" / "lined" effect */}
      <path
        d={`M${x + 2},${y + er + 5} A${w / 2 - 2},${er - 1} 0 0,0 ${x + w - 2},${y + er + 5}`}
        fill="none" stroke={stroke} strokeWidth={sw} opacity={0.25}
      />
    </g>
  );
}

// ── stadium — pill / stadium (clients, mobile apps) ──
function renderStadium(x, y, w, h, fill, stroke, sw) {
  return (
    <rect
      x={x} y={y} width={w} height={h}
      rx={h / 2} ry={h / 2}
      fill={fill} stroke={stroke} strokeWidth={sw}
    />
  );
}

// ── fr-rect — framed rectangle / subroutine (workers, async) ──
function renderFramedRect(x, y, w, h, fill, stroke, sw) {
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h}
        rx={4} ry={4}
        fill={fill} stroke={stroke} strokeWidth={sw}
      />
      {/* Inner vertical lines for "subroutine" look */}
      <line
        x1={x + 8} y1={y} x2={x + 8} y2={y + h}
        stroke={stroke} strokeWidth={sw} opacity={0.35}
      />
      <line
        x1={x + w - 8} y1={y} x2={x + w - 8} y2={y + h}
        stroke={stroke} strokeWidth={sw} opacity={0.35}
      />
    </g>
  );
}

// ── circle ──────────────────────────────────────
function renderCircle(x, y, w, h, fill, stroke, sw) {
  const r = Math.min(w, h) / 2;
  return (
    <circle
      cx={x + w / 2} cy={y + h / 2} r={r}
      fill={fill} stroke={stroke} strokeWidth={sw}
    />
  );
}
