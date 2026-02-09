/**
 * Badge — Small labeled tag, used for tech tags on experience cards
 * @param {string} label - Tag text
 * @param {string} color - Theme color name (accent, success, keyword, etc.)
 */
const COLOR_MAP = {
  accent: "border-accent/30 text-accent",
  success: "border-success/30 text-success",
  keyword: "border-keyword/30 text-keyword",
  variable: "border-variable/30 text-variable",
  func: "border-func/30 text-func",
  string: "border-string/30 text-string",
  comment: "border-comment/30 text-comment",
};

export default function Badge({ label, color = "accent" }) {
  return (
    <span
      className={`text-[9px] border px-1.5 py-0.5 font-bold tracking-wide ${
        COLOR_MAP[color] || COLOR_MAP.accent
      }`}
    >
      {label}
    </span>
  );
}
