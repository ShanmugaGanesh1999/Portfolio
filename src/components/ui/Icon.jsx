/**
 * Icon — Wraps Google Material Symbols for consistent usage
 * @param {string} name - Material icon name
 * @param {string} className - Additional CSS classes
 * @param {string} size - Tailwind text size class (default: text-[18px])
 */
export default function Icon({ name, className = "", size = "text-[18px]" }) {
  return (
    <span
      className={`material-symbols-outlined ${size} align-middle ${className}`}
    >
      {name}
    </span>
  );
}
