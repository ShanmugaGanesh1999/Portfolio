/**
 * ResizeHandle — Visual drag handle for resizable panels
 * Shows on hover at panel edges with resize cursor
 */
export default function ResizeHandle({ onMouseDown, side = "right" }) {
  return (
    <div
      onMouseDown={onMouseDown}
      className={`absolute top-0 bottom-0 w-1 cursor-ew-resize z-20 group hover:bg-accent/30 transition-colors ${
        side === "right" ? "right-0" : "left-0"
      }`}
      title="Drag to resize"
    >
      {/* Wider hit area for easier grabbing */}
      <div className="absolute inset-y-0 -left-1 -right-1" />
      
      {/* Visual indicator on hover */}
      <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-50 transition-opacity" />
    </div>
  );
}
