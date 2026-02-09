import { TerminalWindow } from "../ui";
import { STATS } from "../../data/portfolioData";

/**
 * StatCard — Individual stat display (reusable)
 */
function StatCard({ label, value, unit, color }) {
  const borderColors = {
    accent: "border-t-2 border-t-accent",
    success: "border-t-2 border-t-success",
    variable: "border-t-2 border-t-variable",
    keyword: "border-t-2 border-t-keyword",
  };

  const textColors = {
    accent: "text-accent",
    success: "text-success",
    variable: "text-variable",
    keyword: "text-keyword",
  };

  return (
    <TerminalWindow className={`p-2 sm:p-3 ${borderColors[color] || ""}`}>
      <div className="text-comment text-[10px] mb-1">{label}</div>
      <div className={`text-xl sm:text-2xl font-bold ${textColors[color] || "text-accent"}`}>
        {value} <span className="text-xs">{unit}</span>
      </div>
    </TerminalWindow>
  );
}

/**
 * Stats — Grid of key metrics cards
 */
export default function Stats() {
  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {STATS.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}
