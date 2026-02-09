import { Prompt, TerminalWindow, ProgressBar, Icon } from "../ui";
import { PROJECTS } from "../../data/portfolioData";

/**
 * AsciiArtPreview — Decorative ASCII art for project cards
 */
function AsciiArtPreview() {
  return (
    <div className="h-24 sm:h-32 bg-sidebar border-b border-border flex items-center justify-center overflow-hidden relative">
      <pre className="text-[4px] sm:text-[6px] text-success/50 leading-[4px] sm:leading-[5px] select-none">
        {`  /|   /|   /|   /|   /|   /|   /|   /|   /|
 / |  / |  / |  / |  / |  / |  / |  / |  / |
|  |_|  |_|  |_|  |_|  |_|  |_|  |_|  |_|  |
|                                          |
|   __/\\__      __/\\__      __/\\__        |
|  /      \\    /      \\    /      \\       |
|_/        \\__/        \\__/        \\______/`}
      </pre>
      <div className="absolute top-2 right-2 text-[8px] font-bold text-success animate-pulse">
        LIVE_FEED
      </div>
    </div>
  );
}

/**
 * ProjectCard — Individual project display
 */
function ProjectCard({ project }) {
  const {
    title,
    subtitle,
    description,
    status,
    statusColor,
    hasAsciiArt,
    progress,
    progressLabel,
    progressColor,
    highlight,
    highlightLabel,
    tags,
    link,
  } = project;

  const textColors = {
    accent: "text-accent",
    success: "text-success",
    variable: "text-variable",
    keyword: "text-keyword",
    func: "text-func",
  };

  // Large card with ASCII art
  if (hasAsciiArt) {
    return (
      <TerminalWindow className="flex flex-col group">
        <AsciiArtPreview />
        <div className="p-3 sm:p-4 space-y-2">
          <h3 className="text-variable font-bold">{title}</h3>
          <p className="text-xs text-comment">{description}</p>
          <div className="flex justify-between items-center border-t border-border pt-3 mt-3">
            <span className={`text-[10px] ${textColors[statusColor]} font-mono`}>
              STATUS: {status}
            </span>
            <a
              href={link}
              className="hover:text-white transition-colors"
              aria-label={`View ${title}`}
            >
              <Icon name="open_in_new" size="text-sm" className="text-comment hover:text-white" />
            </a>
          </div>
        </div>
      </TerminalWindow>
    );
  }

  // Card with progress bar (security subsystem)
  if (progress !== undefined) {
    return (
      <TerminalWindow className="p-3 sm:p-4 flex flex-col justify-between bg-sidebar/40">
        <div>
          {subtitle && (
            <div className={`text-[10px] ${textColors[progressColor]} font-bold mb-2`}>
              {subtitle}
            </div>
          )}
          <h3 className="text-variable font-bold text-lg">{title}</h3>
          <p className="text-xs text-comment mt-2 italic">{description}</p>
        </div>
        <div className="mt-6">
          <ProgressBar
            value={progress}
            label={progressLabel}
            color={progressColor}
          />
        </div>
      </TerminalWindow>
    );
  }

  // Card with highlight metric
  if (highlight) {
    return (
      <TerminalWindow className="p-3 sm:p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-variable font-bold">{title}</h3>
          <p className="text-xs text-comment mt-2">{description}</p>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 border-t border-border pt-3">
          <div className="border-l-2 border-accent pl-3">
            <div className="text-func font-bold text-xl">{highlight}</div>
            <div className="text-[8px] text-comment">{highlightLabel}</div>
          </div>
          <span className={`text-[10px] ${textColors[statusColor]} font-mono ml-auto`}>
            STATUS: {status}
          </span>
        </div>
      </TerminalWindow>
    );
  }

  // Default compact card
  return (
    <TerminalWindow className="p-4">
      <h3 className="text-variable font-bold">{title}</h3>
      <p className="text-xs text-comment mt-2">{description}</p>
      {tags && (
        <div className="flex gap-2 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[8px] font-bold bg-border/50 px-1.5 py-0.5 border border-border text-comment"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {status && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className={`text-[10px] ${textColors[statusColor]} font-mono`}>
            STATUS: {status}
          </span>
        </div>
      )}
    </TerminalWindow>
  );
}

/**
 * Projects — Grid of project showcase cards
 */
export default function Projects() {
  return (
    <section className="space-y-4" id="work">
      <Prompt command="./list_deployments.sh --verbose" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}
