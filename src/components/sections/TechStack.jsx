import { Prompt, TerminalWindow } from "../ui";
import { TECH_STACK } from "../../data/portfolioData";

/**
 * TechCategory — Single tech stack category card (reusable)
 */
function TechCategory({ title, status, statusColor, items }) {
  const borderColors = {
    success: "border-l-4 border-l-success",
    accent: "border-l-4 border-l-accent",
    variable: "border-l-4 border-l-variable",
    keyword: "border-l-4 border-l-keyword",
  };

  const textColors = {
    success: "text-success",
    accent: "text-accent",
    variable: "text-variable",
    keyword: "text-keyword",
  };

  const bgColors = {
    success: "bg-success/20",
    accent: "bg-accent/20",
    variable: "bg-variable/20",
    keyword: "bg-keyword/20",
  };

  const dotColors = {
    success: "text-success",
    accent: "text-accent",
    variable: "text-variable",
    keyword: "text-keyword",
  };

  return (
    <TerminalWindow className={`p-4 ${borderColors[statusColor] || ""}`}>
      <h3
        className={`${textColors[statusColor] || "text-accent"} font-bold mb-3 flex items-center justify-between`}
      >
        <span>"{title}"</span>
        <span
          className={`text-[10px] ${bgColors[statusColor] || "bg-accent/20"} px-2 py-0.5 rounded`}
        >
          {status}
        </span>
      </h3>
      <ul className="space-y-1 text-sm text-comment">
        {items.map((item) => (
          <li key={item}>
            <span className={dotColors[statusColor] || "text-accent"}>■</span>{" "}
            {item}
          </li>
        ))}
      </ul>
    </TerminalWindow>
  );
}

/**
 * TechStack — Grid of technology categories
 */
export default function TechStack() {
  return (
    <section className="space-y-4" id="expertise">
      <Prompt command="cat tech_stack.json | jq '.'" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TECH_STACK.map((category) => (
          <TechCategory key={category.title} {...category} />
        ))}
      </div>
    </section>
  );
}
