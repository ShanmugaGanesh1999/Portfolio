// ============================================================
// TERMINAL — interactive fake shell in the bottom panel.
// Commands actually control the site: open tabs, switch themes,
// download the resume, navigate sections. History via ↑/↓,
// Ctrl+L clears, Ctrl+C cancels the current line.
// ============================================================

import { useState, useEffect, useRef } from "react";
import { useWorkspace } from "../../workspace/WorkspaceContext";
import { useTheme } from "../../hooks/useTheme";
import useMediaQuery from "../../hooks/useMediaQuery";
import {
  PERSONAL,
  ABOUT,
  TECH_STACK,
  NAV_ITEMS,
} from "../../data/portfolioData";
import { PROJECT_TABS, SECTION_IDS } from "../../workspace/registry";
import { PREP_COURSES } from "../../prep/prepData";

const PROMPT = "shanmuga@sg-sys:~/portfolio$";
const MAX_LINES = 400;

const NEOFETCH_ART = [
  "    ___    ",
  "   /   \\   ",
  "  | o o |  ",
  "  |  ^  |  ",
  "   \\___/   ",
  "            ",
];

const HELP_LINES = [
  "Available commands:",
  "  help              Show this message",
  "  ls [folder]       List sections, projects, and prep courses",
  "  cd <section>      Jump to a section on the welcome tab",
  "  open <name>       Open a project or prep tab (e.g. open market_data)",
  "  cat <file>        Read a file (resume.pdf, contact.txt, about.txt)",
  "  whoami            Who is Shanmuga?",
  "  skills            Tech stack summary",
  "  theme <mode>      Switch theme (dark | light)",
  "  neofetch          System info",
  "  history           Command history",
  "  echo <text>       Print text",
  "  clear             Clear the terminal",
  "  exit              Close the panel",
];

function resolveProject(arg) {
  if (!arg) return null;
  const q = arg.toLowerCase();
  // Direct id match first
  if (PROJECT_TABS[q]) return q;
  // Title match (rollup_summary.md → rollup-summary)
  const entry = Object.entries(PROJECT_TABS).find(
    ([id, meta]) =>
      meta.title.toLowerCase() === q ||
      meta.title.toLowerCase().replace(/\.(md|py|json|sh|txt)$/, "") === q ||
      id.replace(/-/g, "_") === q ||
      id.replace(/-/g, " ") === q
  );
  return entry ? entry[0] : null;
}

function resolvePrep(arg) {
  if (!arg) return null;
  const q = arg.toLowerCase();
  return PREP_COURSES.find(
    (c) => c.id === q || c.title.toLowerCase().replace(/\s+/g, "_") === q
  );
}

function resolveSection(arg) {
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

export default function Terminal({ active = true }) {
  const ws = useWorkspace();
  const { theme, setTheme } = useTheme();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [lines, setLines] = useState(() => [
    { type: "ok", text: "SG-SYS shell v3.0 — type 'help' for available commands." },
  ]);
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [input, setInput] = useState("");

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Focus the input whenever the terminal becomes the visible panel view.
  useEffect(() => {
    if (active && isDesktop) inputRef.current?.focus();
  }, [active, isDesktop]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const push = (...newLines) =>
    setLines((prev) => [...prev, ...newLines].slice(-MAX_LINES));

  const out = (text, type = "out") => ({ type, text });

  const execute = (name, args) => {
    switch (name) {
      case "help":
        HELP_LINES.forEach((l) => push(out(l)));
        return;

      case "pwd":
        push(out("/home/shanmuga/portfolio"));
        return;

      case "whoami":
        push(
          out(`${PERSONAL.name} — ${PERSONAL.role}`),
          out(PERSONAL.status)
        );
        return;

      case "skills":
        TECH_STACK.forEach((group) =>
          push(out(`${group.title}: ${group.items.join(", ")}`))
        );
        return;

      case "ls": {
        const target = args[0]?.toLowerCase();
        if (!target) {
          push(
            out("Root_Directory/  about_me/  Lib_Modules/  Projects/  prep/"),
            out(`# use 'cd <section>' to jump, 'open <project>' to view a deep-dive`)
          );
          return;
        }
        if (target.startsWith("project")) {
          Object.values(PROJECT_TABS).forEach((m) => push(out(m.title)));
          return;
        }
        if (target.startsWith("prep")) {
          PREP_COURSES.forEach((c) => push(out(`${c.id}/  — ${c.title}`)));
          return;
        }
        const folder = NAV_ITEMS.filter((n) => n.folder?.toLowerCase() === target);
        if (folder.length) {
          folder.forEach((n) => push(out(n.label)));
        } else {
          push(out(`ls: cannot access '${args[0]}': No such directory`, "err"));
        }
        return;
      }

      case "cd": {
        if (!args[0] || args[0] === "~" || args[0] === "/") {
          ws.setActiveTab("welcome");
          ws.editorScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
          push(out("/home/shanmuga/portfolio"));
          return;
        }
        const section = resolveSection(args[0]);
        if (section) {
          ws.scrollToSection(section);
          push(out(`→ ${section}`));
        } else {
          push(out(`cd: no such section: ${args[0]} (try: ${SECTION_IDS.join(", ")})`, "err"));
        }
        return;
      }

      case "open": {
        if (!args[0]) {
          push(out("open: missing operand — try 'open market_data'", "err"));
          return;
        }
        if (args[0] === "welcome" || args[0] === "home") {
          ws.setActiveTab("welcome");
          push(out("→ welcome.md"));
          return;
        }
        const projectId = resolveProject(args[0]);
        if (projectId) {
          ws.openTab(projectId);
          push(out(`→ ${PROJECT_TABS[projectId].title}`));
          return;
        }
        const course = resolvePrep(args[0]);
        if (course) {
          ws.openPrepPanel(course.id);
          push(out(`→ prep/${course.id}`));
          return;
        }
        push(out(`open: ${args[0]}: not found`, "err"));
        return;
      }

      case "cat": {
        const file = args[0]?.toLowerCase();
        if (file === "resume.pdf") {
          window.open(PERSONAL.resumeUrl, "_blank", "noopener");
          push(out("downloading resume.pdf …"));
          return;
        }
        if (file === "contact.txt" || file === "contact") {
          push(
            out(`email:    ${PERSONAL.email}`),
            out(`phone:    ${PERSONAL.phone}`),
            out(`location: ${PERSONAL.location}`),
            out(`github:   ${PERSONAL.socialLinks.github}`),
            out(`linkedin: ${PERSONAL.socialLinks.linkedin}`),
            out(`website:  ${PERSONAL.socialLinks.website}`)
          );
          return;
        }
        if (file === "about.txt" || file === "readme.md") {
          ABOUT.paragraphs.forEach((p) => push(out(p)));
          return;
        }
        push(out(`cat: ${args[0] ?? ""}: No such file`, "err"));
        return;
      }

      case "theme": {
        const mode = args[0]?.toLowerCase();
        if (mode === "dark" || mode === "light") {
          setTheme(mode);
          push(out(`theme → ${mode}`));
        } else {
          push(out(`theme: current='${theme}' — usage: theme dark|light`));
        }
        return;
      }

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
        const rows = Math.max(NEOFETCH_ART.length, info.length);
        for (let i = 0; i < rows; i++) {
          push(out(`${(NEOFETCH_ART[i] ?? "            ").padEnd(14)}${info[i] ?? ""}`, i < 2 ? "ok" : "out"));
        }
        return;
      }

      case "history":
        if (!history.length) push(out("(empty)"));
        history
          .slice()
          .reverse()
          .forEach((cmd, i) => push(out(`${String(history.length - i).padStart(3)}  ${cmd}`)));
        return;

      case "echo":
        push(out(args.join(" ")));
        return;

      case "clear":
        setLines([]);
        return;

      case "exit":
        ws.setPanel(false);
        return;

      case "sudo":
        if (args.join(" ").toLowerCase() === "hire-me" || args[0]?.toLowerCase() === "hire") {
          push(out("Permission granted. Opening mail client…", "ok"));
          window.setTimeout(() => {
            window.location.href = `mailto:${PERSONAL.email}?subject=Let's talk`;
          }, 400);
        } else {
          push(out("sudo: permission denied (nice try)", "err"));
        }
        return;

      default:
        push(out(`${name}: command not found (try 'help')`, "err"));
    }
  };

  const run = () => {
    const raw = input;
    const cmd = raw.trim();
    push({ type: "in", text: `${PROMPT} ${cmd}` });
    setInput("");
    setHistIdx(-1);
    if (!cmd) return;
    setHistory((h) => [...h, cmd].slice(-100));
    ws.log("terminal", cmd);
    const [name, ...args] = cmd.split(/\s+/);
    execute(name, args);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length) {
        const next = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const next = histIdx + 1;
      if (next >= history.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(next);
        setInput(history[next]);
      }
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLines([]);
    } else if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      push({ type: "in", text: `${PROMPT} ${input}^C` });
      setInput("");
    }
  };

  const lineClass = {
    in: "text-text",
    out: "text-comment",
    err: "text-keyword",
    ok: "text-success",
  };

  return (
    <div className="h-full flex flex-col" onClick={() => inputRef.current?.focus()}>
      <div
        ref={scrollRef}
        role="log"
        aria-label="Terminal output"
        className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2 text-xs leading-relaxed font-mono"
      >
        {lines.map((line, i) => (
          <div key={i} className={`${lineClass[line.type] ?? "text-comment"} whitespace-pre-wrap break-words`}>
            {line.text}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 border-t border-border/50 shrink-0">
        <span className="text-accent font-bold shrink-0 text-xs">{PROMPT}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent outline-none text-text text-xs min-w-0"
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          aria-label="Terminal command input"
          placeholder="type 'help'…"
        />
      </div>
    </div>
  );
}
