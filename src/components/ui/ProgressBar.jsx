/**
 * ProgressBar — Horizontal progress bar with label
 * @param {number} value - Progress percentage (0-100)
 * @param {string} label - Description label
 * @param {string} color - Theme color name
 */
const COLOR_MAP = {
  accent: "bg-accent",
  success: "bg-success",
  keyword: "bg-keyword",
  variable: "bg-variable",
  func: "bg-func",
};

const TEXT_COLOR_MAP = {
  accent: "text-accent",
  success: "text-success",
  keyword: "text-keyword",
  variable: "text-variable",
  func: "text-func",
};

export default function ProgressBar({ value, label, color = "accent" }) {
  return (
    <div>
      <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
        <div
          className={`${COLOR_MAP[color] || COLOR_MAP.accent} h-full transition-all duration-1000`}
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[8px] text-comment">{label}</span>
        <span className={`text-[8px] ${TEXT_COLOR_MAP[color] || "text-accent"}`}>
          {value}%
        </span>
      </div>
    </div>
  );
}
