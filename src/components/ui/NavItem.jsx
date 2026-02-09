import Icon from "./Icon";

/**
 * NavItem — Sidebar navigation link styled as file explorer entry
 * @param {string} label - Display text
 * @param {string} icon - Material icon name
 * @param {string} href - Anchor link
 * @param {boolean} active - Currently selected
 * @param {boolean} indent - Indented (child item)
 * @param {function} onClick - Click handler
 */
export default function NavItem({
  label,
  icon,
  href,
  active = false,
  indent = false,
  onClick,
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 py-1 px-3 cursor-pointer text-sm transition-colors
        ${indent ? "pl-7" : ""}
        ${
          active
            ? "bg-border text-accent"
            : "hover:bg-border/50 text-text"
        }`}
    >
      <Icon name={icon} />
      {label}
    </a>
  );
}
