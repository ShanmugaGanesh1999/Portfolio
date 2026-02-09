import { Prompt, Icon } from "../ui";
import { CERTIFICATIONS } from "../../data/portfolioData";

/**
 * CertBadge — Individual certification badge (reusable)
 */
function CertBadge({ name, color }) {
  const borderColors = {
    accent: "border-accent/20",
    success: "border-success/20",
    keyword: "border-keyword/20",
    variable: "border-variable/20",
    func: "border-func/20",
    comment: "border-comment/20",
  };

  const iconColors = {
    accent: "text-accent",
    success: "text-success",
    keyword: "text-keyword",
    variable: "text-variable",
    func: "text-func",
    comment: "text-comment",
  };

  return (
    <div
      className={`flex items-center gap-2 text-xs bg-border px-3 py-1.5 rounded-md border ${
        borderColors[color] || "border-accent/20"
      }`}
    >
      <Icon
        name="verified"
        size="text-sm"
        className={iconColors[color] || "text-accent"}
      />
      <span>{name}</span>
    </div>
  );
}

/**
 * Certifications — Row of certification badges
 */
export default function Certifications() {
  return (
    <section className="space-y-4">
      <Prompt command="cat credentials.log" />

      <div className="border border-border rounded-md bg-sidebar/20 p-4">
        <div className="flex flex-wrap gap-4">
          {CERTIFICATIONS.map((cert) => (
            <CertBadge key={cert.name} {...cert} />
          ))}
        </div>
      </div>
    </section>
  );
}
