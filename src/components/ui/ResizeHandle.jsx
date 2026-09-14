/**
 * ResizeHandle — Accessible drag handle for resizable panels.
 * Works with mouse, touch, and pen (pointer events + capture) and supports
 * keyboard resizing (arrows grow/shrink, Home/End min/max).
 *
 * Props:
 *  - side: which edge of the panel this handle sits on ("left"|"right"|"top"|"bottom")
 *  - startResize: from usePanelResize (onPointerDown)
 *  - handlers: from usePanelResize (onPointerMove/Up/Cancel)
 *  - nudge: from usePanelResize — keyboard resize
 *  - axis: override the axis inferred from side ("x"|"y")
 *  - label: accessible name, e.g. "Resize explorer sidebar"
 */
export default function ResizeHandle({
  side = "right",
  startResize,
  handlers = {},
  nudge,
  axis,
  label = "Resize panel",
}) {
  const resolvedAxis = axis || (side === "top" || side === "bottom" ? "y" : "x");

  // Arrow keys map to grow/shrink based on which edge the handle is on:
  // dragging away from the panel body grows it.
  const growKey =
    resolvedAxis === "x"
      ? side === "left"
        ? "ArrowLeft"
        : "ArrowRight"
      : side === "top"
      ? "ArrowUp"
      : "ArrowDown";
  const shrinkKey =
    resolvedAxis === "x"
      ? side === "left"
        ? "ArrowRight"
        : "ArrowLeft"
      : side === "top"
      ? "ArrowDown"
      : "ArrowUp";

  const handleKeyDown = (e) => {
    if (!nudge) return;
    const step = e.shiftKey ? 48 : 16;
    if (e.key === growKey) {
      e.preventDefault();
      nudge("grow", step);
    } else if (e.key === shrinkKey) {
      e.preventDefault();
      nudge("shrink", step);
    } else if (e.key === "Home") {
      e.preventDefault();
      nudge("min");
    } else if (e.key === "End") {
      e.preventDefault();
      nudge("max");
    }
  };

  const positionClass =
    side === "right"
      ? "right-0 top-0 bottom-0 w-1 cursor-ew-resize"
      : side === "left"
      ? "left-0 top-0 bottom-0 w-1 cursor-ew-resize"
      : side === "top"
      ? "top-0 left-0 right-0 h-1 cursor-ns-resize"
      : "bottom-0 left-0 right-0 h-1 cursor-ns-resize";

  return (
    <div
      role="separator"
      aria-orientation={resolvedAxis === "x" ? "vertical" : "horizontal"}
      aria-label={label}
      title="Drag to resize · Focus + arrow keys to adjust"
      tabIndex={0}
      onPointerDown={startResize}
      {...handlers}
      onKeyDown={handleKeyDown}
      className={`absolute z-20 group transition-colors ${positionClass}`}
      style={{ touchAction: "none" }}
    >
      {/* Wider hit area for easier grabbing (touch) */}
      <div
        className={
          resolvedAxis === "x"
            ? "absolute inset-y-0 -left-2 -right-2"
            : "absolute inset-x-0 -top-2 -bottom-2"
        }
      />

      {/* Visual indicator on hover / focus */}
      <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-50 group-focus-visible:opacity-50 transition-opacity" />
    </div>
  );
}
