/**
 * Icon — Wraps Google Material Symbols for consistent usage.
 * Text ligatures are hidden from screen readers by default; pass
 * ariaLabel for icons that convey meaningful information.
 * @param {string} name - Material icon name
 * @param {string} className - Additional CSS classes
 * @param {string} size - Tailwind text size class (default: text-[18px])
 */
export default function Icon({ name, className = "", size = "text-[18px]", ariaLabel }) {
  return (
    <span
      className={`material-symbols-outlined ${size} align-middle ${className}`}
      aria-hidden={ariaLabel ? undefined : "true"}
      aria-label={ariaLabel}
    >
      {name}
    </span>
  );
}
