const EDITOR_ICONS = {
  files: "M6 5V2h10l4 4v13h-3 M3 6h10l4 4v12H3Z M13 6v4h4 M16 2v4h4",
  search: "M16 16l5 5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  close: "M6 6l12 12 M18 6 6 18",
  terminal: "M3 4h18v16H3Z M6 8l4 4-4 4 M12 16h5",
  chat_bubble: "M3 3h18v14H8l-5 4Z M7 7h10 M7 11h7",
  auto_awesome: "m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6Z",
  menu_book: "M12 5v16 M12 5C9 2 5 2 2 3v16c3-1 7-1 10 2 3-3 7-3 10-2V3c-3-1-7-1-10 2Z",
  settings: "m9 3 1-2h4l1 2 3 2 2-.2 2 3.4-1.2 1.8v4l1.2 1.8-2 3.4-2-.2-3 2-1 2h-4l-1-2-3-2-2 .2L2 15.8l1.2-1.8v-4L2 8.2l2-3.4 2 .2Z M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  chevron_right: "m9 5 7 7-7 7",
  expand_more: "m5 9 7 7 7-7",
  add: "M12 4v16 M4 12h16",
  more_horiz: "M4 12h1 M11.5 12h1 M19 12h1",
  history: "M3 3v6h6 M3 9a9 9 0 1 1 0 6 M12 7v5l3 2",
  content_copy: "M8 8h13v13H8Z M16 5V2H2v14h3",
  description: "M4 2h11l5 5v15H4Z M15 2v5h5 M8 12h8 M8 16h8",
  folder: "M2 4h7l2 3h11v14H2Z",
  folder_open: "M2 12V4h7l2 3h10v4 M2 12h21l-4 9H2Z",
};

/**
 * Icon — Wraps Google Material Symbols for consistent usage.
 * Text ligatures are hidden from screen readers by default; pass
 * ariaLabel for icons that convey meaningful information.
 * @param {string} name - Material icon name
 * @param {string} className - Additional CSS classes
 * @param {string} size - Tailwind text size class (default: text-[18px])
 */
export default function Icon({ name, className = "", size = "text-[18px]", ariaLabel }) {
  if (EDITOR_ICONS[name]) return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`${size} inline-block shrink-0 align-middle ${className}`} aria-hidden={ariaLabel ? undefined : true} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}><path d={EDITOR_ICONS[name]} /></svg>
  );
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
