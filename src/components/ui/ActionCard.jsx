import Icon from "./Icon";

/**
 * ActionCard — Clickable card for resume download, calendly, etc.
 * @param {string} title - Primary label
 * @param {string} subtitle - Secondary description
 * @param {string} icon - Material icon name
 * @param {string} href - Link target
 * @param {string} color - Theme color (accent, success, keyword, etc.)
 * @param {function} onClick - Click handler (overrides href)
 * @param {boolean} download - If true, triggers file download
 */
export default function ActionCard({
  title,
  subtitle,
  icon,
  href = "#",
  color = "accent",
  onClick,
  download = false,
}) {
  const colorClasses = {
    accent: "text-accent group-hover:text-accent",
    success: "text-success group-hover:text-success",
    keyword: "text-keyword group-hover:text-keyword",
    variable: "text-variable group-hover:text-variable",
  };

  const titleColors = {
    accent: "text-accent",
    success: "text-success",
    keyword: "text-keyword",
    variable: "text-variable",
  };

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      download={download}
      target={!download && href !== "#" ? "_blank" : undefined}
      rel={!download && href !== "#" ? "noopener noreferrer" : undefined}
      className="border border-border rounded-md p-4 hover:bg-border/50 transition-colors flex items-center justify-between group bg-bg cursor-pointer"
    >
      <div>
        <div className={`text-xs font-bold ${titleColors[color] || "text-accent"}`}>
          {title}
        </div>
        <div className="text-[10px] text-comment">{subtitle}</div>
      </div>
      <Icon
        name={icon}
        className={`text-comment ${colorClasses[color] || "group-hover:text-accent"}`}
      />
    </a>
  );
}
