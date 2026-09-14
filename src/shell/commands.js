// ============================================================
// SHARED SHELL COMMANDS — one executor, two skins.
// Used by the VS Code terminal panel AND the Claude Code
// prompt ("!" passthrough). All site-control commands live
// here; each shell supplies its own print/confirm behavior.
// ============================================================

import { PERSONAL, ABOUT, TECH_STACK, NAV_ITEMS } from "../data/portfolioData";
import { PROJECT_TABS, SECTION_IDS } from "../workspace/registry";
import { PREP_COURSES } from "../prep/prepData";

export const HELP_LINES = [
  "Available commands:",
  "  help              Show this message",
  "  ls [folder]       List sections, projects, and prep courses",
  "  cd <section>      Jump to a section on the welcome tab",
  "  open <name>       Open a project or prep tab (e.g. open market_data)",
  "  cat <file>        Read a file (resume.pdf, contact.txt, about.txt)",
  "  whoami            Who is Shanmuga?",
  "  skills            Tech stack summary",
  "  theme <mode>      Switch theme (dark | light)",
  "  claude            Switch to the Claude Code shell",
  "  codex             Switch to the OpenAI Codex shell",
  "  neofetch          System info",
  "  history           Command history",
  "  echo <text>       Print text",
  "  clear             Clear the terminal",
  "  exit              Close the panel",
];

// ─── Resolver helpers (shared with the Claude slash commands) ───

export function resolveProject(arg) {
  if (!arg) return null;
  const q = arg.toLowerCase();
  if (PROJECT_TABS[q]) return q;
  const entry = Object.entries(PROJECT_TABS).find(
    ([id, meta]) =>
      meta.title.toLowerCase() === q ||
      meta.title.toLowerCase().replace(/\.(md|py|json|sh|txt)$/, "") === q ||
      id.replace(/-/g, "_") === q ||
      id.replace(/-/g, " ") === q
  );
  return entry ? entry[0] : null;
}

export function resolvePrep(arg) {
  if (!arg) return null;
  const q = arg.toLowerCase();
  return PREP_COURSES.find(
    (c) => c.id === q || c.title.toLowerCase().replace(/\s+/g, "_") === q
  );
}

export function resolveSection(arg) {
  if (!arg) return null;
  const q = arg.toLowerCase().replace(/^[#/]+/, "");
  const byId = SECTION_IDS.find((s) => s === q);
  if (byId) return byId;
  const nav = NAV_ITEMS.find(
    (n) =>
      n.sectionId &&
      (n.label.toLowerCase() === q ||
        n.sectionId === q.replace(/\s/g, "") ||
        n.label.toLowerCase().replace(/\.[a-z]+$/, "") === q)
  );
  return nav?.sectionId ?? null;
}

// ─── Executor factory ──────────────────────────────────────────
/**
 * createShellExecutor({ ws, theme, setTheme, print, confirm, exit })
 *   print(type, text)  — append one line ('in'|'out'|'err'|'ok')
 *   confirm(request)   — optional async gate → Promise<boolean>; renders a
 *                        Claude-style permission prompt when provided.
 *   exit()             — what the `exit` command does in this skin.
 */
export function createShellExecutor({ ws, theme, setTheme, print, confirm, exit }) {
  const ask = confirm || (() => Promise.resolve(true));
  const out = (text, type = "out") => print(type, text);

  async function execute(name, args) {
    switch (name) {
      case "help":
        HELP_LINES.forEach((l) => out(l));
        return;

      case "pwd":
        out("/home/shanmuga/portfolio");
        return;

      case "whoami":
        out(`${PERSONAL.name} — ${PERSONAL.role}`);
        out(PERSONAL.status);
        return;

      case "skills":
        TECH_STACK.forEach((group) =>
          out(`${group.title}: ${group.items.join(", ")}`)
        );
        return;

      case "ls": {
        const target = args[0]?.toLowerCase();
        if (!target) {
          out("Root_Directory/  about_me/  Lib_Modules/  Projects/  prep/");
          out("# use 'cd <section>' to jump, 'open <project>' to view a deep-dive");
          return;
        }
        if (target.startsWith("project")) {
          Object.values(PROJECT_TABS).forEach((m) => out(m.title));
          return;
        }
        if (target.startsWith("prep")) {
          PREP_COURSES.forEach((c) => out(`${c.id}/  — ${c.title}`));
          return;
        }
        const folder = NAV_ITEMS.filter((n) => n.folder?.toLowerCase() === target);
        if (folder.length) {
          folder.forEach((n) => out(n.label));
        } else {
          out(`ls: cannot access '${args[0]}': No such directory`, "err");
        }
        return;
      }

      case "cd": {
        if (!args[0] || args[0] === "~" || args[0] === "/") {
          ws.setActiveTab("welcome");
          ws.editorScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
          out("/home/shanmuga/portfolio");
          return;
        }
        const section = resolveSection(args[0]);
        if (section) {
          ws.scrollToSection(section);
          out(`→ ${section}`);
        } else {
          out(`cd: no such section: ${args[0]} (try: ${SECTION_IDS.join(", ")})`, "err");
        }
        return;
      }

      case "open": {
        if (!args[0]) {
          out("open: missing operand — try 'open market_data'", "err");
          return;
        }
        if (args[0] === "welcome" || args[0] === "home") {
          ws.setActiveTab("welcome");
          out("→ welcome.md");
          return;
        }
        const projectId = resolveProject(args[0]);
        if (projectId) {
          ws.openTab(projectId);
          out(`→ ${PROJECT_TABS[projectId].title}`);
          return;
        }
        const course = resolvePrep(args[0]);
        if (course) {
          ws.openPrepPanel(course.id);
          out(`→ prep/${course.id}`);
          return;
        }
        out(`open: ${args[0]}: not found`, "err");
        return;
      }

      case "cat": {
        const file = args[0]?.toLowerCase();
        if (file === "resume.pdf") {
          if (await ask({
            title: "Do you want to download resume.pdf?",
            detail: "Opens the resume PDF from Google Drive in a new tab.",
          })) {
            window.open(PERSONAL.resumeUrl, "_blank", "noopener");
            out("downloading resume.pdf …", "ok");
          } else {
            out("cancelled", "err");
          }
          return;
        }
        if (file === "contact.txt" || file === "contact") {
          out(`email:    ${PERSONAL.email}`);
          out(`phone:    ${PERSONAL.phone}`);
          out(`location: ${PERSONAL.location}`);
          out(`github:   ${PERSONAL.socialLinks.github}`);
          out(`linkedin: ${PERSONAL.socialLinks.linkedin}`);
          out(`website:  ${PERSONAL.socialLinks.website}`);
          return;
        }
        if (file === "about.txt" || file === "readme.md") {
          ABOUT.paragraphs.forEach((p) => out(p));
          return;
        }
        out(`cat: ${args[0] ?? ""}: No such file`, "err");
        return;
      }

      case "theme": {
        const mode = args[0]?.toLowerCase();
        if (mode === "dark" || mode === "light") {
          setTheme(mode);
          out(`theme → ${mode}`);
        } else {
          out(`theme: current='${theme}' — usage: theme dark|light`);
        }
        return;
      }

      case "claude":
        ws.setShellMode("claude");
        out("switching to Claude Code shell …", "ok");
        return;

      case "codex":
        ws.setShellMode("codex");
        out("switching to Codex shell …", "ok");
        return;

      case "vscode":
        ws.setShellMode("vscode");
        out("switching to VS Code shell …", "ok");
        return;

      case "neofetch": {
        const info = [
          `shanmuga@sg-sys`,
          `─────────────────`,
          `role:    ${PERSONAL.role}`,
          `stack:   Java · Python · React · Next.js · Databricks · AWS/Azure`,
          `tabs:    ${ws.state.tabs.length} open`,
          `theme:   ${theme}`,
          `shell:   sg-sys v3.0`,
        ];
        info.forEach((l) => out(l));
        return;
      }

      case "echo":
        out(args.join(" "));
        return;

      case "clear":
        return { clear: true };

      case "exit":
        exit?.();
        return;

      case "sudo": {
        if (args.join(" ").toLowerCase().startsWith("hire")) {
          if (await ask({
            title: "Do you want to open your mail client?",
            detail: `Prepares an email to ${PERSONAL.email}.`,
          })) {
            out("Permission granted. Opening mail client…", "ok");
            window.setTimeout(() => {
              window.location.href = `mailto:${PERSONAL.email}?subject=Let's talk`;
            }, 400);
          } else {
            out("sudo: permission denied", "err");
          }
        } else {
          out("sudo: permission denied (nice try)", "err");
        }
        return;
      }

      default:
        out(`${name}: command not found (try 'help')`, "err");
    }
  }

  return async function run(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    ws.log("shell", cmd);
    const [name, ...args] = cmd.split(/\s+/);
    return execute(name, args);
  };
}
