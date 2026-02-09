/**
 * TerminalWindow — Reusable card wrapper styled as a terminal pane
 * @param {ReactNode} children
 * @param {string} className - Extra classes
 * @param {string} borderTopColor - Top accent border color class (e.g. "border-t-accent")
 */
export default function TerminalWindow({
  children,
  className = "",
  borderTopColor = "",
  onClick,
}) {
  return (
    <div
      className={`border border-border rounded-md overflow-hidden bg-bg ${borderTopColor} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
