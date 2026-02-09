import { Prompt, TerminalWindow, Badge } from "../ui";
import { EXPERIENCE } from "../../data/portfolioData";

/**
 * ExperienceCard — Single career entry (reusable)
 * description items can be strings or { text, projectId } objects
 */
function ExperienceCard({ period, title, company, description, tags, tagColor, onOpenProject }) {
  return (
    <TerminalWindow className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
      <div className="text-comment font-bold text-xs shrink-0 sm:w-32">
        [ {period} ]
      </div>
      <div className="space-y-2 flex-1">
        <div className="text-accent font-bold">
          {title} @ {company}
        </div>
        <ul className="text-xs text-comment leading-relaxed list-none space-y-1">
          {description.map((point, i) => {
            const isObj = typeof point === "object" && point !== null;
            const text = isObj ? point.text : point;
            const projectId = isObj ? point.projectId : null;
            const linkText = isObj ? point.linkText : null;

            // Split text around the linkText to render project name as inline link
            const renderText = () => {
              if (!projectId || !linkText) return text;
              const idx = text.indexOf(linkText);
              if (idx === -1) return text;
              const before = text.slice(0, idx);
              const after = text.slice(idx + linkText.length);
              return (
                <>
                  {before}
                  <button
                    onClick={() => onOpenProject(projectId)}
                    className="text-func underline decoration-func/40 underline-offset-2 hover:text-white hover:decoration-white/60 transition-colors cursor-pointer"
                  >
                    {linkText}
                  </button>
                  {after}
                </>
              );
            };

            return (
              <li key={i} className="flex gap-2">
                <span className="text-accent shrink-0">▸</span>
                <span className="flex-1">{renderText()}</span>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} label={tag} color={tagColor} />
          ))}
        </div>
      </div>
    </TerminalWindow>
  );
}

/**
 * Experience — Career timeline section
 */
export default function Experience({ onOpenProject }) {
  return (
    <section className="space-y-4" id="experience">
      <Prompt command="tail -f career.log" />

      <div className="space-y-3">
        {EXPERIENCE.map((exp) => (
          <ExperienceCard key={exp.period} {...exp} onOpenProject={onOpenProject} />
        ))}
      </div>
    </section>
  );
}
