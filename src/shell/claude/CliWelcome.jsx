// ============================================================
// CLI WELCOME — the portfolio document inside the Claude Code
// terminal scrollback. Same data as the VS Code Welcome tab
// (portfolioData.js), styled to the reference terminal.
// Each section can be printed again as a fresh transcript entry.
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

import ProgressiveOutput from "./ProgressiveOutput";

export default function CliWelcome({ section, ...reveal }) {
  return (
    <ProgressiveOutput {...reveal}><div className="ct-portfolio" style={{ margin: "10px 0 20px" }}>
      {/* ── Identity ── */}
      {section === "info" && <section>
        <h2 style={{ margin: "2px 0 4px" }}>{PERSONAL.name}</h2>
        <p style={{ margin: 0, color: "var(--color-accent)" }}>{PERSONAL.role}</p>
        <p style={{ margin: "8px 0", color: "var(--color-comment)", lineHeight: 1.7 }}>
          {PERSONAL.focus}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 18px", fontSize: "0.85em", color: "var(--color-comment)" }}>
          <span>✉ {PERSONAL.email}</span>
          <span>☎ {PERSONAL.phone}</span>
          <span>⌖ {PERSONAL.location}</span>
          <a href={PERSONAL.socialLinks.github} target="_blank" rel="noopener noreferrer" className="ct-inline-command">github</a>
          <a href={PERSONAL.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="ct-inline-command">linkedin</a>
          <a href={PERSONAL.socialLinks.website} target="_blank" rel="noopener noreferrer" className="ct-inline-command">website</a>
        </div>
      </section>}

      {/* ── Stats ── */}
      {section === "stats" && <section>
        <h2>Portfolio highlights</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8, marginTop: 8 }}>
          {STATS.map((stat) => (
            <div
              key={stat.label}
              style={{
                border: "1px solid var(--color-border)", borderRadius: 4,
                padding: "8px 10px", background: "var(--color-sidebar)",
              }}
            >
              <div style={{ color: "var(--color-accent)", fontWeight: 700 }}>
                {stat.value}<span style={{ color: "var(--ct-faint)", fontSize: "0.8em" }}> {stat.unit}</span>
              </div>
              <div style={{ color: "var(--ct-faint)", fontSize: "0.72em", letterSpacing: "0.08em" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>}

      {/* ── About ── */}
      {section === "about" && <section><h2>About</h2>
        <div style={{ color: "var(--color-comment)", lineHeight: 1.7 }}>
          {ABOUT.paragraphs.map((p, i) => (
            <p key={i} style={{ margin: i ? "10px 0 0" : 0 }}>{p}</p>
          ))}
        </div>
      </section>}

      {/* ── Tech stack ── */}
      {section === "skills" && <section><h2>Tech Stack</h2>
        <div style={{ fontSize: "0.93em" }}>
          {TECH_STACK.map((group) => (
            <div data-reveal-item="true" key={group.title} style={{ display: "flex", gap: 14, margin: "5px 0", flexWrap: "wrap" }}>
              <span style={{ color: "var(--color-string)", minWidth: 150 }}>
                <span style={{ color: "var(--ct-faint)" }}>├─ </span>
                {group.title}
              </span>
              <span style={{ color: "var(--color-comment)", flex: 1, minWidth: 200 }}>{group.items.join(" · ")}</span>
            </div>
          ))}
        </div>
      </section>}

      {/* ── Experience ── */}
      {section === "experience" && <section><h2>Experience</h2>
        <div>
          {EXPERIENCE.map((exp) => (
            <div
              data-reveal-item="true" key={exp.period}
              style={{
                borderLeft: "2px solid var(--color-border)", paddingLeft: 14,
                margin: "14px 0", position: "relative",
              }}
            >
              <span style={{ position: "absolute", left: -5, top: 6, width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent)" }} />
              <div style={{ fontSize: "0.78em", color: "var(--ct-faint)" }}>{exp.period}</div>
              <div style={{ fontWeight: 600, marginTop: 2 }}>
                {exp.title} <span style={{ color: "var(--ct-faint)" }}>· {exp.company}</span>
              </div>
              <ul style={{ margin: "6px 0 0", padding: 0, listStyle: "none" }}>
                {exp.description.map((point, i) => {
                  const text = typeof point === "string" ? point : point.text;
                  return (
                    <li key={i} style={{ fontSize: "0.83em", color: "var(--color-comment)", lineHeight: 1.6, margin: "3px 0" }}>
                      <span style={{ color: "var(--color-accent)" }}>▸ </span>{text}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>}

      {/* ── Projects ── */}
      {section === "projects" && <section><h2>Projects</h2>
        <div>
          {PROJECTS.map((project) => (
            <div
              data-reveal-item="true" key={project.title}
              style={{
                border: "1px solid var(--color-border)", borderRadius: 4,
                padding: "8px 10px", background: "var(--color-sidebar)", margin: "6px 0",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontWeight: 600 }}>{project.title}</span>
                {project.subtitle && (
                  <span style={{ fontSize: "0.72em", color: "var(--ct-faint)" }}>{project.subtitle}</span>
                )}
                <span
                  style={{
                    marginLeft: "auto", fontSize: "0.7em", fontWeight: 700,
                    color: project.status === "RESTRICTED" ? "var(--color-keyword)" : "var(--color-success)",
                  }}
                >
                  [{project.status}]
                </span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "0.8em", color: "var(--color-comment)", lineHeight: 1.6 }}>
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </section>}

      {/* ── Credentials ── */}
      {section === "credentials" && <section><h2>Credentials</h2>
        <div style={{ fontSize: "0.9em" }}>
          {EDUCATION.map((edu) => (
            <div key={edu.institution} style={{ margin: "4px 0" }}>
              <span style={{ fontWeight: 600 }}>{edu.degree}</span>
              <span style={{ color: "var(--ct-faint)" }}> — {edu.institution}</span>
              <div style={{ fontSize: "0.8em", color: "var(--color-comment)", marginTop: 2 }}>
                {edu.detail} · {edu.coursework}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {CERTIFICATIONS.map((cert) => (
              <span
                key={cert.name}
                style={{
                  fontSize: "0.72em", border: "1px solid var(--color-border)", borderRadius: 3,
                  padding: "3px 8px", color: "var(--color-comment)", background: "var(--color-sidebar)",
                }}
              >
                ✳ {cert.name}
              </span>
            ))}
          </div>
        </div>
      </section>}

      {/* ── Contact ── */}
      {section === "contact" && <section><h2>Contact</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <a href={`mailto:${PERSONAL.email}`} className="ct-terminal-button" style={{ textDecoration: "none", display: "inline-block" }}>
            ✉ Email Shanmuga
          </a>
          <a
            href={PERSONAL.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ct-terminal-button"
            style={{ textDecoration: "none", display: "inline-block", color: "var(--color-text)" }}
          >
            ↓ Resume
          </a>
          <a
            href={PERSONAL.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ct-terminal-button"
            style={{ textDecoration: "none", display: "inline-block", color: "var(--color-text)" }}
          >
            ⏱ Schedule a sync
          </a>
        </div>
      </section>}
    </div></ProgressiveOutput>
  );
}
