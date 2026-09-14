// ============================================================
// CLI WELCOME — the portfolio rendered as a printed document
// in the Claude Code scrollback. Same data as the VS Code
// Welcome tab (portfolioData.js), restyled for the CLI.
// ============================================================

import {
  PERSONAL,
  STATS,
  ABOUT,
  TECH_STACK,
  EXPERIENCE,
  PROJECTS,
  CERTIFICATIONS,
  EDUCATION,
} from "../../data/portfolioData";

function SectionTitle({ command, title }) {
  return (
    <div className="mt-8 mb-3 first:mt-0">
      <div className="text-xs text-comment/70 font-mono mb-1">❯ {command}</div>
      <h2 className="font-display font-semibold text-2xl text-text">{title}</h2>
    </div>
  );
}

export default function CliWelcome() {
  return (
    <div className="max-w-3xl">
      {/* ── Greeting ── */}
      <div id="cli-hero" className="scroll-mt-4">
        <div className="text-xs text-comment/70 font-mono mb-1">❯ whoami</div>
        <h1 className="font-display font-semibold text-4xl sm:text-5xl text-text leading-tight">
          {PERSONAL.name}
        </h1>
        <p className="font-ui text-sm text-accent mt-1">{PERSONAL.role}</p>
        <p className="text-sm text-comment leading-relaxed mt-3 max-w-2xl">
          {PERSONAL.focus}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs font-mono text-comment mt-4">
          <span>✉ {PERSONAL.email}</span>
          <span>☎ {PERSONAL.phone}</span>
          <span>⌖ {PERSONAL.location}</span>
          <a
            href={PERSONAL.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            ⇱ github
          </a>
          <a
            href={PERSONAL.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            ⇱ linkedin
          </a>
          <a
            href={PERSONAL.socialLinks.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            ⇱ website
          </a>
        </div>
      </div>

      {/* ── Stats ── */}
      <div id="cli-stats" className="mt-8 scroll-mt-4">
        <div className="text-xs text-comment/70 font-mono mb-2">❯ ./stats --summary</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="border border-border rounded-md px-3 py-2 bg-sidebar/50"
            >
              <div className="text-lg font-mono font-bold text-accent">
                {stat.value}
                <span className="text-xs text-comment/60 ml-0.5">{stat.unit}</span>
              </div>
              <div className="text-[10px] font-ui uppercase tracking-wide text-comment">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── About ── */}
      <SectionTitle command="cat about.txt" title="About" />
      <div id="cli-about" className="space-y-3 scroll-mt-4">
        {ABOUT.paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-comment leading-[1.75]">
            {p}
          </p>
        ))}
      </div>

      {/* ── Tech stack ── */}
      <SectionTitle command="cat tech_stack.json | jq ." title="Tech Stack" />
      <div id="cli-skills" className="scroll-mt-4 space-y-2">
        {TECH_STACK.map((group) => (
          <div key={group.title} className="text-sm font-mono flex flex-col sm:flex-row gap-1 sm:gap-3">
            <span className="text-variable shrink-0 sm:w-44">
              <span className="text-comment/60">├─ </span>
              {group.title}
            </span>
            <span className="text-comment">{group.items.join(" · ")}</span>
          </div>
        ))}
      </div>

      {/* ── Experience ── */}
      <SectionTitle command="git log --career" title="Experience" />
      <div id="cli-experience" className="space-y-4 scroll-mt-4">
        {EXPERIENCE.map((exp) => (
          <div key={exp.period} className="border-l-2 border-border pl-4 relative">
            <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-accent" />
            <div className="text-[10px] font-mono text-comment/70">{exp.period}</div>
            <div className="font-ui font-semibold text-sm text-text mt-0.5">
              {exp.title} <span className="text-comment/60">· {exp.company}</span>
            </div>
            <div className="text-[10px] font-mono text-comment/70 mb-1.5">{exp.location}</div>
            <ul className="space-y-1">
              {exp.description.map((point, i) => {
                const text = typeof point === "string" ? point : point.text;
                return (
                  <li key={i} className="text-xs text-comment leading-relaxed flex gap-2">
                    <span className="text-accent shrink-0">▸</span>
                    <span>{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Projects ── */}
      <SectionTitle command="ls ~/Projects/" title="Projects" />
      <div id="cli-projects" className="scroll-mt-4 space-y-2">
        {PROJECTS.map((project) => (
          <div
            key={project.title}
            className="border border-border rounded-md p-3 bg-sidebar/40"
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-ui font-semibold text-sm text-text">{project.title}</span>
              {project.subtitle && (
                <span className="text-[10px] font-mono text-comment/60">{project.subtitle}</span>
              )}
              <span
                className={`ml-auto text-[10px] font-mono font-bold ${
                  project.status === "RESTRICTED" ? "text-keyword" : "text-success"
                }`}
              >
                [{project.status}]
              </span>
            </div>
            <p className="text-xs text-comment leading-relaxed mt-1">{project.description}</p>
            {project.tags && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-mono font-bold bg-border/40 border border-border px-1.5 py-0.5 rounded text-comment"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Education + certifications ── */}
      <SectionTitle command="cat credentials.md" title="Credentials" />
      <div id="cli-credentials" className="space-y-3 scroll-mt-4">
        {EDUCATION.map((edu) => (
          <div key={edu.institution} className="text-sm">
            <span className="font-ui font-semibold text-text">{edu.degree}</span>
            <span className="text-comment/60"> — {edu.institution}</span>
            <div className="text-xs text-comment font-mono mt-0.5">
              {edu.detail} · {edu.coursework}
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-1.5">
          {CERTIFICATIONS.map((cert) => (
            <span
              key={cert.name}
              className="text-[10px] font-mono font-bold border border-border rounded px-2 py-1 text-comment bg-sidebar/40"
            >
              ✳ {cert.name}
            </span>
          ))}
        </div>
      </div>

      {/* ── Contact ── */}
      <SectionTitle command="./contact.sh --reach-out" title="Contact" />
      <div id="cli-contact" className="scroll-mt-4 flex flex-wrap gap-2">
        <a
          href={`mailto:${PERSONAL.email}`}
          className="px-4 py-2 rounded-md bg-accent text-bg text-xs font-ui font-semibold hover:opacity-90 transition-opacity"
        >
          ✉ Email Shanmuga
        </a>
        <a
          href={PERSONAL.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-md border border-border bg-bg text-xs font-ui font-semibold text-text hover:border-accent/50 transition-colors"
        >
          ↓ Resume
        </a>
        <a
          href={PERSONAL.calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-md border border-border bg-bg text-xs font-ui font-semibold text-text hover:border-accent/50 transition-colors"
        >
          ⏱ Schedule a sync
        </a>
      </div>

      <p className="text-[10px] text-comment/50 font-mono mt-10">
        ※ end of welcome.md — type <span className="text-accent">/help</span> for commands,{" "}
        <span className="text-accent">!ls</span> for the shell, or ask anything about Shanmuga
      </p>
    </div>
  );
}
