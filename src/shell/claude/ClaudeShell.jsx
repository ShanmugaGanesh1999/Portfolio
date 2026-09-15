// ============================================================
// CLAUDE SHELL — the Claude Code terminal, rebuilt from the
// reference design (claude-code-terminal.html): a floating
// terminal window on a desktop backdrop, macOS titlebar with
// traffic lights, border-broken welcome panel with pixel
// mascot, hairline composer with block cursor, statusline
// with permission modes, slash menu, and modal panels.
// Portfolio functionality (RAG answers, agents, project
// deep-dives, shell passthrough) runs on top.
// ============================================================

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useWorkspace } from "../../workspace/WorkspaceContext";
import { useTheme } from "../../hooks/useTheme";
import {
  chatQuery,
  getAvailableModels,
  getDefaultModelId,
} from "../../services/chatService";
import { createShellExecutor, resolveProject, resolvePrep } from "../commands";
import { PERSONAL } from "../../data/portfolioData";
import { PROJECT_TABS } from "../../workspace/registry";
import ModeSwitcher from "../../components/ui/ModeSwitcher";
import CliWelcome from "./CliWelcome";
import CliFileView from "./CliFileView";
import TerminalMarkdown from "../shared/Markdown";
import { randomVerb } from "./verbs";

const CONFIG_KEY = "sg-claude-terminal:config:v1";
const MODE_LABELS = ["default mode", "⏵⏵ accept edits on", "⏸ plan mode on"];
const MASCOT = " ▐▛███▜▌\n▝▜█████▛▘\n  ▘▘ ▝▝";
const SPINNER_FRAMES = ["·", "✢", "✳", "✶", "✻", "✽"];
const FRAME_MS = 140;

const SLASH_COMMANDS = [
  { name: "/help", description: "Show commands and keyboard shortcuts" },
  { name: "/open", description: "Open a project deep-dive (e.g. /open market_data)" },
  { name: "/projects", description: "Jump to the projects section" },
  { name: "/about", description: "Jump to the about section" },
  { name: "/skills", description: "Jump to the tech stack" },
  { name: "/experience", description: "Jump to the experience section" },
  { name: "/contact", description: "Jump to the contact section" },
  { name: "/research", description: "Spawn a research agent" },
  { name: "/tour", description: "Watch the agents work (multi-agent demo)" },
  { name: "/model", description: "Change the assistant model" },
  { name: "/theme", description: "Switch between dark and light themes" },
  { name: "/config", description: "Edit the terminal display settings" },
  { name: "/status", description: "Show this session's configuration" },
  { name: "/clear", description: "Clear the conversation and start fresh" },
  { name: "/exit", description: "Back to the VS Code workspace" },
];

const HELP_KEYS = [
  ["Enter", "Send a message or run a command"],
  ["Shift + Enter", "Insert a new line"],
  ["↑ / ↓", "Browse prompt history or command suggestions"],
  ["Tab", "Complete the selected slash command"],
  ["Shift + Tab", "Cycle permission modes"],
  ["Esc", "Stop a response or dismiss a menu"],
  ["Ctrl + C", "Stop a response or clear the current input"],
  ["Ctrl + L", "Jump to the end of the transcript"],
  ["?", "Show this help when the prompt is empty"],
];

let uidCounter = 0;
const uid = () => `t${Date.now().toString(36)}-${uidCounter++}`;

// ─── Small pieces ─────────────────────────────────────────────
function SpinnerGlyph({ active }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setFrame((f) => f + 1), FRAME_MS);
    return () => clearInterval(id);
  }, [active]);
  return (
    <span className="ct-spinner" aria-hidden="true">
      {SPINNER_FRAMES[frame % SPINNER_FRAMES.length]}
    </span>
  );
}

function ToolEntry({ name, path, output, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details className="ct-tool-entry" open={open}>
      <summary onClick={(e) => { e.preventDefault(); setOpen(!open); }}>
        <span className="ct-tool-dot" aria-hidden="true">●</span>
        <span className="ct-tool-title">
          {name}
          <span className="ct-tool-path">({path})</span>
        </span>
        <span className="ct-tool-detail-hint">
          {open ? "click to collapse" : "click to expand"}
        </span>
      </summary>
      <div className="ct-tool-output">
        <span className="stem" aria-hidden="true">⎿</span>
        <pre>{output}</pre>
      </div>
    </details>
  );
}

function Entry({ kind, children }) {
  const marker = kind === "user" ? "❯" : kind === "system" ? "✻" : "●";
  const cls =
    kind === "user" ? "ct-entry ct-user-entry" : kind === "system" ? "ct-entry ct-system-entry" : "ct-entry";
  return (
    <div className={cls}>
      <span className="ct-entry-marker" aria-hidden="true">{marker}</span>
      <div className="ct-entry-body">{children}</div>
    </div>
  );
}

// ─── Main shell ───────────────────────────────────────────────
export default function ClaudeShell() {
  const ws = useWorkspace();
  const { theme, setTheme } = useTheme();

  // ── Terminal config (name / font size) ──
  const [config, setConfig] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CONFIG_KEY) || "null");
      if (saved && typeof saved === "object") {
        return {
          userName: typeof saved.userName === "string" ? saved.userName.slice(0, 50) : "visitor",
          fontSize: Number.isFinite(saved.fontSize) ? Math.min(20, Math.max(12, saved.fontSize)) : 15,
        };
      }
    } catch { /* ignore */ }
    return { userName: "visitor", fontSize: 15 };
  });
  const persistConfig = useCallback((next) => {
    setConfig(next);
    try { localStorage.setItem(CONFIG_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  // ── Session state ──
  const [blocks, setBlocks] = useState(() => {
    const initial = [];
    const activeId = ws.state.activeTabId;
    if (activeId && activeId !== "welcome") {
      initial.push({ id: uid(), kind: "tool", name: "Read", path: activeId, output: "project deep-dive" });
      initial.push({ id: uid(), kind: "file", tabId: activeId });
    }
    return initial;
  });
  const [busy, setBusy] = useState(null); // { label, verb, startedAt }
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(0);
  const [savedDraft, setSavedDraft] = useState("");
  const [menuIdx, setMenuIdx] = useState(0);
  const [mode, setMode] = useState(0);
  const [model, setModel] = useState(getDefaultModelId());
  const [panel, setPanel] = useState(null); // {type, ...}
  const [toastMsg, setToastMsg] = useState(null);
  const [recent, setRecent] = useState({ text: "No recent activity", time: "" });
  const [agents, setAgents] = useState([]);
  const [permission, setPermission] = useState(null);

  const viewportRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const autoScrollRef = useRef(true);
  const toastTimerRef = useRef(null);

  const models = getAvailableModels();
  const currentModel = models.find((m) => m.id === model) || models[0];

  // ── Helpers ──
  const pushBlock = useCallback((block) => {
    setBlocks((prev) => [...prev, { id: uid(), ...block }]);
  }, []);

  const patchBlock = useCallback((id, patch) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...(typeof patch === "function" ? patch(b) : patch) } : b))
    );
  }, []);

  const toast = useCallback((text) => {
    setToastMsg(text);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMsg(null), 3000);
  }, []);

  const scrollToEnd = useCallback((force = false) => {
    const el = viewportRef.current;
    if (el && (force || autoScrollRef.current)) el.scrollTop = el.scrollHeight;
  }, []);

  const focusPrompt = useCallback(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (window.matchMedia("(min-width: 641px)").matches) focusPrompt();
  }, [focusPrompt]);

  // Auto-scroll on new blocks while pinned near the bottom. The mount run
  // is special: a fresh session opens the welcome document at the top (the
  // scrollback is a document, not a live log); a deep link with initial
  // blocks still lands on its content.
  const mountedRef = useRef(false);
  useEffect(() => {
    const el = viewportRef.current;
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (blocks.length === 0) {
        autoScrollRef.current = false;
        el?.scrollTo({ top: 0 });
      } else if (el) {
        el.scrollTop = el.scrollHeight;
      }
      return;
    }
    if (el && autoScrollRef.current) el.scrollTop = el.scrollHeight;
  }, [blocks, busy]);

  const setBusyState = (label, verb) => {
    setBusy(label ? { label, verb: verb || "Thinking", startedAt: Date.now() } : null);
  };

  const cancelRun = useCallback((showMessage = true) => {
    abortRef.current?.abort();
    setBusy(null);
    if (showMessage) pushBlock({ kind: "system", text: "Interrupted · the response was stopped." });
  }, [pushBlock]);

  // ── Slash menu ──
  const menuOpen = /^\/[^\s]*$/.test(input) && !busy;
  const menuMatches = useMemo(() => {
    if (!menuOpen) return [];
    return SLASH_COMMANDS.filter((c) => c.name.startsWith(input.toLowerCase()));
  }, [menuOpen, input]);
  const clampedMenuIdx = Math.min(menuIdx, Math.max(0, menuMatches.length - 1));

  useEffect(() => setMenuIdx(0), [input]);

  // ── Permission gate (panel-styled) ──
  const confirmPermission = useCallback(
    (request) =>
      new Promise((resolve) => {
        setPermission({ ...request, resolve });
      }),
    []
  );
  const answerPermission = (ok) => {
    permission?.resolve(ok);
    setPermission(null);
    pushBlock({ kind: "system", text: ok ? "Approved." : "Declined (esc)." });
  };
  useEffect(() => {
    if (!permission) return;
    const onKey = (e) => {
      if (e.key === "Escape") answerPermission(false);
      else if (e.key === "1" || e.key.toLowerCase() === "y") answerPermission(true);
      else if (e.key === "2" || e.key.toLowerCase() === "n") answerPermission(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission]);

  // ── Shell passthrough ("!" prefix) ──
  const shellRun = useMemo(
    () =>
      createShellExecutor({
        ws,
        theme,
        setTheme,
        print: (type, text) =>
          pushBlock({ kind: "tool-plain", text, tone: type }),
        confirm: confirmPermission,
        exit: () => ws.setShellMode("vscode"),
      }),
    [ws, theme, setTheme, pushBlock, confirmPermission]
  );

  // ── Natural language → portfolio assistant ──
  const ask = useCallback(
    async (question) => {
      const verb = randomVerb();
      setBusyState(`${verb}…`, verb);
      const id = uid();
      pushBlock({ id, kind: "assistant", content: "", streaming: true });
      const controller = new AbortController();
      abortRef.current = controller;
      let acc = "";
      try {
        await chatQuery(
          question,
          blocks
            .filter((b) => (b.kind === "assistant" && !b.streaming) || b.kind === "user")
            .slice(-10)
            .map((b) => (b.kind === "user" ? { role: "user", content: b.text } : { role: "assistant", content: b.content })),
          (chunk) => {
            acc += chunk;
            patchBlock(id, { content: acc });
          },
          controller.signal,
          model
        );
        patchBlock(id, { streaming: false });
      } catch (err) {
        if (err.name === "AbortError") {
          patchBlock(id, (b) => ({ streaming: false, content: b.content + "\n\n(interrupted)" }));
        } else {
          patchBlock(id, { streaming: false, error: true, content: `⚠ ${err.message}` });
        }
      } finally {
        setBusy(null);
        abortRef.current = null;
      }
    },
    [blocks, model, pushBlock, patchBlock]
  );

  // ── Agents ──
  const spawnAgent = useCallback(
    (name, task, fn) => {
      const id = uid();
      setAgents((a) => [...a, { id, name, task, status: "running" }]);
      ws.log("agent", `${name}: ${task}`);
      (async () => {
        try {
          await fn({
            tool: (toolName, path, output) =>
              pushBlock({ kind: "tool", name: toolName, path, output }),
            system: (text) => pushBlock({ kind: "system", text }),
            pushBlock,
            patchBlock,
          });
        } finally {
          setAgents((a) => a.map((x) => (x.id === id ? { ...x, status: "done" } : x)));
          window.setTimeout(() => setAgents((a) => a.filter((x) => x.id !== id)), 30000);
        }
      })();
    },
    [pushBlock, patchBlock, ws]
  );

  const spawnResearcher = useCallback(
    (question) => {
      spawnAgent("researcher", question, async (ctx) => {
        ctx.tool("Agent", `researcher(${question})`, "running…");
        const id = uid();
        ctx.pushBlock({ id, kind: "assistant", content: "", streaming: true, agent: true });
        try {
          await chatQuery(
            question,
            [],
            (chunk) => {
              ctx.patchBlock(id, (b) => ({ content: b.content + chunk }));
            },
            null,
            model
          );
        } catch (err) {
          ctx.patchBlock(id, { streaming: false, error: true, content: `⚠ ${err.message}` });
        }
        ctx.patchBlock(id, { streaming: false });
      });
    },
    [spawnAgent, model]
  );

  const spawnExplorer = useCallback(
    (projectId) => {
      const meta = PROJECT_TABS[projectId];
      if (!meta) return;
      spawnAgent("explorer", `open ${meta.title}`, async (ctx) => {
        ctx.tool("Read", meta.title, `${meta.language} system-design deep dive`);
        ws.openTab(projectId);
        ctx.pushBlock({ kind: "file", tabId: projectId });
      });
    },
    [spawnAgent, ws]
  );

  // ── Slash command execution ──
  const scrollToAnchor = useCallback(
    (id) => {
      const el = document.getElementById(id);
      if (el) {
        autoScrollRef.current = false;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => (autoScrollRef.current = true), 800);
      }
    },
    []
  );

  const runSlash = useCallback(
    (raw) => {
      const [command, ...args] = raw.trim().split(/\s+/);
      const argument = args.join(" ");
      switch (command.toLowerCase()) {
        case "/help":
          pushBlock({ kind: "help" });
          break;

        case "/open": {
          if (!argument) {
            pushBlock({
              kind: "tool-plain",
              tone: "out",
              text:
                "projects: " +
                Object.values(PROJECT_TABS)
                  .map((m) => m.title.replace(/\.\w+$/, ""))
                  .join("  "),
            });
            break;
          }
          const projectId = resolveProject(argument);
          if (projectId) {
            spawnExplorer(projectId);
          } else {
            const course = resolvePrep(argument);
            if (course) {
              ws.openPrepPanel(course.id);
              pushBlock({ kind: "tool", name: "Read", path: `prep/${course.id}`, output: "prep reader" });
              pushBlock({ kind: "file", tabId: `prep:${course.id}` });
            } else {
              pushBlock({ kind: "system", text: `No project named '${argument}'. Try /open market_data.` });
            }
          }
          break;
        }

        case "/projects": scrollToAnchor("cli-projects"); break;
        case "/about": scrollToAnchor("cli-about"); break;
        case "/skills": scrollToAnchor("cli-skills"); break;
        case "/experience": scrollToAnchor("cli-experience"); break;
        case "/contact": scrollToAnchor("cli-contact"); break;

        case "/research":
          if (!argument) {
            pushBlock({ kind: "system", text: "Usage: /research <question>" });
          } else {
            spawnResearcher(argument);
          }
          break;

        case "/tour":
          pushBlock({ kind: "system", text: "Starting tour — 2 agents in parallel…" });
          spawnExplorer("market-data");
          spawnResearcher("What is Shanmuga currently working on at Sherwin Williams?");
          break;

        case "/model": {
          const match = models.find((m) => m.name.toLowerCase() === argument.toLowerCase() || m.id === argument.toLowerCase());
          if (match) {
            setModel(match.id);
            toast(`Model set to ${match.name}.`);
          } else if (!argument) {
            setPanel({ type: "model" });
          } else {
            pushBlock({ kind: "system", text: "Pick a model with /model — no argument opens the picker." });
          }
          break;
        }

        case "/theme": {
          if (theme === "dark" || theme === "light") {
            if (argument === "dark" || argument === "light") setTheme(argument);
            else setTheme(theme === "dark" ? "light" : "dark");
          }
          break;
        }

        case "/config":
          setPanel({ type: "config" });
          break;

        case "/status":
          pushBlock({
            kind: "tool-plain",
            tone: "out",
            text: [
              "Session status", "",
              `  Interface   Claude Code terminal — portfolio edition`,
              `  Visitor     ${config.userName}`,
              `  Directory   ~/portfolio`,
              `  Model       ${currentModel.name}`,
              `  Theme       ${theme}`,
              `  Permission  ${MODE_LABELS[mode]} (visual)`,
              `  Agents      ${agents.filter((a) => a.status === "running").length} running`,
              `  Backend     Portfolio RAG assistant (docs/*.md)`,
            ].join("\n"),
          });
          break;

        case "/clear":
          cancelRun(false);
          setBlocks([]);
          setRecent({ text: "No recent activity", time: "" });
          viewportRef.current?.scrollTo({ top: 0 });
          break;

        case "/exit":
          pushBlock({ kind: "system", text: "switching to Cursor workspace …" });
          window.setTimeout(() => ws.setShellMode("vscode"), 350);
          break;

        default:
          pushBlock({ kind: "system", text: `Unknown command: ${command}. Type /help to see supported commands.` });
      }
    },
    [pushBlock, spawnExplorer, spawnResearcher, models, config, currentModel, theme, setTheme, agents, mode, cancelRun, ws, scrollToAnchor, toast]
  );

  // ── Submit ──
  const submitInput = useCallback(() => {
    if (busy) { cancelRun(); return; }
    let message = input.trim();
    if (!message) return;
    if (menuOpen && menuMatches.length) message = menuMatches[clampedMenuIdx].name;
    setHistory((h) => [...h, message].slice(-100));
    setHistIdx(history.length + 1);
    setSavedDraft("");
    setInput("");
    autoScrollRef.current = true;
    setRecent({ text: message.replace(/\s+/g, " "), time: "just now" });

    const silent = /^\/(clear|config|model|theme|exit)(\s|$)/i.test(message);
    if (!silent && !message.startsWith("!")) pushBlock({ kind: "user", text: message });

    if (message.startsWith("/")) runSlash(message);
    else if (message.startsWith("!")) {
      const result = shellRun(message.slice(1));
      if (result?.clear) setBlocks([]);
    } else ask(message);
    focusPrompt();
    scrollToEnd(message.toLowerCase() !== "/clear");
  }, [busy, input, menuOpen, menuMatches, clampedMenuIdx, history.length, runSlash, shellRun, ask, cancelRun, pushBlock, focusPrompt, scrollToEnd]);

  // ── Keyboard ──
  const onKeyDown = (e) => {
    if (e.isComposing) return;
    const key = e.key;
    if (key === "Enter" && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault(); submitInput(); return;
    }
    if (key === "Tab" && e.shiftKey) { e.preventDefault(); cycleMode(); return; }
    if (key === "Tab" && menuOpen && menuMatches.length) {
      e.preventDefault(); setInput(menuMatches[clampedMenuIdx].name); return;
    }
    if ((key === "ArrowUp" || key === "ArrowDown") && menuOpen && menuMatches.length) {
      e.preventDefault();
      setMenuIdx((i) => (i + (key === "ArrowUp" ? -1 : 1) + menuMatches.length) % menuMatches.length);
      return;
    }
    const caret = e.target.selectionStart;
    const atFirstLine = !input.slice(0, caret).includes("\n");
    const atLastLine = !input.slice(caret).includes("\n");
    if (key === "ArrowUp" && atFirstLine && history.length) {
      e.preventDefault();
      if (histIdx === history.length) setSavedDraft(input);
      const next = Math.max(0, histIdx - 1);
      setHistIdx(next);
      setInput(history[next]);
      return;
    }
    if (key === "ArrowDown" && atLastLine && history.length) {
      e.preventDefault();
      const next = Math.min(history.length, histIdx + 1);
      setHistIdx(next);
      setInput(next === history.length ? savedDraft : history[next]);
      return;
    }
    if (key === "?" && !input) { e.preventDefault(); pushBlock({ kind: "help" }); scrollToEnd(true); return; }
    if (e.ctrlKey && key.toLowerCase() === "c") {
      e.preventDefault();
      if (busy) cancelRun();
      else { setInput(""); }
      return;
    }
    if (e.ctrlKey && key.toLowerCase() === "l") {
      e.preventDefault(); scrollToEnd(true); return;
    }
  };

  // Global keys: Esc handling (interrupt / dismiss menu / close panel).
  useEffect(() => {
    const onKey = (e) => {
      if (e.isComposing) return;
      if (!panel && e.key === "Escape") {
        if (busy) { e.preventDefault(); cancelRun(); }
        focusPrompt();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel, busy, cancelRun, focusPrompt]);

  const cycleMode = () => {
    setMode((m) => (m + 1) % MODE_LABELS.length);
    focusPrompt();
  };

  // Sync textarea height.
  const syncHeight = (el) => {
    el.style.height = "26px";
    el.style.height = `${Math.min(160, el.scrollHeight)}px`;
  };

  const runningAgents = agents.filter((a) => a.status === "running").length;

  return (
    <div
      className={`ct-app shell-in ${busy ? "ct-is-busy" : ""}`}
      style={{ "--ct-font-size": `${config.fontSize}px` }}
      aria-label="Claude Code terminal"
    >
      {/* ── Top bar — mirrors the VS Code header so the mode switcher
             stays in exactly the same place in both shells ── */}
      <header className="h-10 border-b border-border flex items-center px-2 sm:px-4 justify-between gap-2 shrink-0 bg-sidebar">
        <div className="flex items-center gap-2 min-w-0 text-xs text-comment">
          <span className="text-accent text-sm shrink-0 select-none" aria-hidden="true">✳</span>
          <span
            className="truncate whitespace-nowrap"
            title="portfolio git:(main) — claude Code v3"
          >
            <span className="text-text">portfolio</span>{" "}
            <span>git:(</span>
            <span style={{ color: "var(--color-success)" }}>main</span>
            <span>)</span>
            <span> — claude Code v3</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            className="w-8 h-8 flex items-center justify-center rounded-md text-comment hover:text-text hover:bg-border/30 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>
          <ModeSwitcher compact />
        </div>
      </header>

        {/* ── Viewport (scrollback) ── */}
        <div
          className="ct-viewport"
          ref={viewportRef}
          tabIndex={-1}
          aria-label="Terminal output"
          onScroll={(e) => {
            const el = e.currentTarget;
            autoScrollRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
          }}
          onClick={(e) => {
            if (e.target.closest("button, a, summary, details, input, textarea, select")) return;
            if (!window.getSelection()?.toString()) focusPrompt();
          }}
        >
          {/* Shell context */}
          <div className="ct-shell-context" aria-hidden="true">
            <div>
              <span className="path">~/portfolio</span>
              <span className="branch">git:(<span className="ct-branch-name" style={{ color: "var(--color-success)" }}>main</span>)</span>
            </div>
            <div className="ct-shell-command"><span className="chevron">❯</span><span>claude</span></div>
          </div>

          {/* Welcome panel */}
          <section className="ct-welcome" aria-labelledby="ct-welcome-heading">
            <h1 className="ct-welcome-heading" id="ct-welcome-heading">
              Claude Code <span className="ct-version">v3.0</span>
            </h1>
            <div className="ct-welcome-identity">
              <h2 className="ct-greeting">Welcome back, {config.userName}!</h2>
              <pre className="ct-mascot" aria-label="Claude's pixel mascot" role="img">{MASCOT}</pre>
              <div className="ct-identity-model">
                <button type="button" className="ct-inline-command" onClick={() => setPanel({ type: "model" })} title="Change the model">
                  {currentModel.name}
                </button>
                <span> · portfolio assistant</span>
              </div>
              <button type="button" className="ct-inline-command ct-identity-path" onClick={() => setPanel({ type: "config" })} title="Terminal settings">
                ~/portfolio
              </button>
            </div>
            <div className="ct-welcome-info">
              <div>
                <h3>Tips for getting started</h3>
                <p>
                  Run <button type="button" className="ct-inline-command" onClick={() => { pushBlock({ kind: "user", text: "/open market_data" }); runSlash("/open market_data"); }}>/open market_data</button> to read a system-design deep-dive.
                </p>
                <p>
                  Ask <button type="button" className="ct-inline-command" onClick={() => { const q = "What did he build at Zoho?"; pushBlock({ kind: "user", text: q }); ask(q); }}>"what did he build at Zoho?"</button> — the assistant knows the resume.
                </p>
                <p style={{ color: "var(--color-comment)" }}>
                  Type <button type="button" className="ct-inline-command" onClick={() => { pushBlock({ kind: "user", text: "/help" }); runSlash("/help"); }}>/help</button> for commands, or <span style={{ color: "var(--color-text)" }}>!ls</span> for the shell.
                </p>
              </div>
              <div className="ct-recent-activity">
                <h3>Recent activity</h3>
                <div className="ct-recent-line">
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{recent.text}</span>
                  <span style={{ flexShrink: 0, color: "var(--ct-faint)", fontSize: "0.93em" }}>{recent.time}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Tip */}
          <div className="ct-tip">
            <span className="ct-tip-icon" aria-hidden="true">✻</span>
            <span>
              <strong>Tip:</strong> Type{" "}
              <button type="button" className="ct-inline-command" onClick={() => { pushBlock({ kind: "user", text: "/tour" }); runSlash("/tour"); }}>/tour</button>{" "}
              to watch the agents work.
            </span>
          </div>

          {/* Portfolio document */}
          <CliWelcome />

          {/* Conversation */}
          <div className="ct-conversation" role="log" aria-label="Conversation" aria-live="polite">
            {blocks.map((block) => {
              switch (block.kind) {
                case "user":
                  return <Entry key={block.id} kind="user">{block.text}</Entry>;
                case "system":
                  return <Entry key={block.id} kind="system">{block.text}</Entry>;
                case "assistant":
                  return (
                    <Entry key={block.id} kind="assistant">
                      {block.error ? (
                        <span style={{ color: "var(--color-keyword)" }}>{block.content}</span>
                      ) : (
                        <div className="ct-markdown-body">
                          <TerminalMarkdown content={block.content || "…"} />
                        </div>
                      )}
                    </Entry>
                  );
                case "tool":
                  return (
                    <ToolEntry key={block.id} name={block.name} path={block.path} output={block.output} defaultOpen={false} />
                  );
                case "tool-plain":
                  return (
                    <div key={block.id} className="ct-tool-output" style={{ marginTop: 4 }}>
                      <span className="stem" aria-hidden="true">⎿</span>
                      <pre>{block.text}</pre>
                    </div>
                  );
                case "file":
                  return (
                    <div key={block.id} className="ct-tool-output" style={{ display: "block" }}>
                      <span className="stem" aria-hidden="true">⎿</span>
                      <CliFileView tabId={block.tabId} />
                    </div>
                  );
                case "help":
                  return (
                    <Entry key={block.id} kind="assistant">
                      <div>
                        <h3 className="ct-help-heading">Available commands</h3>
                        <div className="ct-help-grid">
                          {SLASH_COMMANDS.map((c) => (
                            <span key={c.name} className="ct-help-row" style={{ display: "contents" }}>
                              <button type="button" className="ct-inline-command key" onClick={() => { pushBlock({ kind: "user", text: c.name }); runSlash(c.name); }}>{c.name}</button>
                              <span style={{ color: "var(--color-comment)" }}>{c.description}</span>
                            </span>
                          ))}
                        </div>
                        <h3 className="ct-help-heading">Keyboard shortcuts</h3>
                        <div className="ct-help-grid">
                          {HELP_KEYS.map(([k, d]) => (
                            <span key={k} style={{ display: "contents" }}>
                              <span className="key">{k}</span>
                              <span style={{ color: "var(--color-comment)" }}>{d}</span>
                            </span>
                          ))}
                        </div>
                        <p style={{ marginTop: 18, color: "var(--ct-faint)", fontSize: "0.85em" }}>
                          This terminal is the portfolio of Shanmuga Ganesh — answers come from the
                          portfolio docs, tools read real project write-ups. /tour and the window
                          controls are extras for this edition.
                        </p>
                      </div>
                    </Entry>
                  );
                default:
                  return null;
              }
            })}
          </div>

          {/* Thinking row */}
          {busy && (
            <div className="ct-thinking" role="status">
              <SpinnerGlyph active />
              <span>{busy.label}</span>
              <small>esc to interrupt</small>
            </div>
          )}
        </div>

        {/* ── Composer ── */}
        <footer className="ct-composer">
          {/* Slash menu */}
          {menuOpen && menuMatches.length > 0 && (
            <div className="ct-command-menu" role="listbox" aria-label="Slash commands">
              {menuMatches.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  role="option"
                  aria-selected={i === clampedMenuIdx}
                  className="ct-command-option"
                  onMouseEnter={() => setMenuIdx(i)}
                  onClick={() => { setInput(c.name); }}
                >
                  <span className="command-name">{c.name}</span>
                  <span className="command-description">{c.description}</span>
                </button>
              ))}
              <div className="ct-menu-footer" role="presentation">
                ↑ ↓ navigate · enter select · tab complete · esc dismiss
              </div>
            </div>
          )}

          {/* Prompt form */}
          <form
            className="ct-prompt-form"
            autoComplete="off"
            onSubmit={(e) => { e.preventDefault(); submitInput(); }}
          >
            <span className="ct-prompt-symbol" aria-hidden="true">❯</span>
            <div className={`ct-input-wrap ${input.length === 0 ? "is-empty" : ""}`}>
              <label htmlFor="ct-prompt" className="sr-only">Message or slash command</label>
              <textarea
                id="ct-prompt"
                ref={inputRef}
                className="ct-prompt-input"
                rows={1}
                maxLength={20000}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                placeholder='Try "what did he build at Zoho?"'
                value={input}
                onChange={(e) => { setInput(e.target.value); setMenuIdx(0); syncHeight(e.target); }}
                onKeyDown={onKeyDown}
                aria-controls="ct-command-menu"
                aria-expanded={menuOpen}
              />
              <span className="ct-block-cursor" aria-hidden="true" />
            </div>
            <button
              className="ct-send-button"
              type="submit"
              title={busy ? "Stop response (Escape)" : "Send message (Enter)"}
              aria-label={busy ? "Stop response" : "Send message"}
            >
              {busy ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 5v8a3 3 0 0 1-3 3H5m5-5-5 5 5 5" />
                </svg>
              )}
            </button>
          </form>

          {/* Statusline */}
          <div className="ct-statusline">
            <div className="ct-status-left">
              <button type="button" className="ct-text-button" onClick={() => { pushBlock({ kind: "help" }); scrollToEnd(true); }}>
                ? for shortcuts
              </button>
              <button
                type="button"
                className="ct-text-button ct-mode-button"
                data-mode={mode}
                onClick={cycleMode}
                title="Cycle visual permission mode (Shift+Tab)"
              >
                <span>{MODE_LABELS[mode]}</span>
                <span className="ct-mode-hint"> · shift+tab to cycle</span>
              </button>
            </div>
            <div className="ct-status-right">
              <span title="Running agents">
                {runningAgents > 0 ? `${runningAgents} agent${runningAgents > 1 ? "s" : ""} · ` : ""}
              </span>
              <span className="ct-status-dot" aria-hidden="true" />
              <span>{currentModel.name}</span>
            </div>
          </div>
        </footer>

        {/* ── Modal panels ── */}
        {panel && (
          <div className="ct-panel-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setPanel(null); }}>
            <section className="ct-panel" role="dialog" aria-modal="true">
              {panel.type === "model" && (
                <>
                  <div className="ct-panel-header">
                    <h2 className="ct-panel-title">Select model</h2>
                    <button type="button" className="ct-text-button ct-panel-close" onClick={() => setPanel(null)}>esc to close</button>
                  </div>
                  <p className="ct-panel-description">Pick the assistant that answers questions about Shanmuga's background.</p>
                  <div className="ct-option-list">
                    {models.map((m, i) => (
                      <button
                        key={m.id}
                        type="button"
                        className={`ct-option-button${m.id === model ? " is-selected" : ""}`}
                        onClick={() => { setModel(m.id); setPanel(null); toast(`Model set to ${m.name}.`); }}
                      >
                        <span>{i + 1}. {m.name}</span>
                        <span style={{ color: "var(--color-comment)" }}>{m.id === model ? "✓ selected" : m.description}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {panel.type === "config" && (
                <>
                  <div className="ct-panel-header">
                    <h2 className="ct-panel-title">Terminal settings</h2>
                    <button type="button" className="ct-text-button ct-panel-close" onClick={() => setPanel(null)}>esc to close</button>
                  </div>
                  <p className="ct-panel-description">Make this terminal your own. Everything stays in this browser.</p>
                  <form
                    className="ct-settings-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const name = e.target.elements["ct-setting-name"].value.trim() || "visitor";
                      const size = Number(e.target.elements["ct-setting-font"].value);
                      persistConfig({ userName: name.slice(0, 50), fontSize: Math.min(20, Math.max(12, size)) });
                      setPanel(null);
                      toast("Settings saved locally.");
                    }}
                  >
                    <label className="ct-setting">
                      <span>Your name (for the greeting)</span>
                      <input id="ct-setting-name" type="text" defaultValue={config.userName} maxLength={50} required />
                    </label>
                    <div className="ct-settings-row">
                      <label className="ct-setting">
                        <span>Text size</span>
                        <select id="ct-setting-font" defaultValue={config.fontSize}>
                          {Array.from({ length: 9 }, (_, i) => (
                            <option key={i + 12} value={i + 12}>{i + 12}px</option>
                          ))}
                        </select>
                      </label>
                      <label className="ct-setting">
                        <span>Theme</span>
                        <select id="ct-setting-theme" defaultValue={theme} onChange={(e) => setTheme(e.target.value)}>
                          <option value="dark">Dark</option>
                          <option value="light">Light</option>
                        </select>
                      </label>
                    </div>
                    <div className="ct-form-actions">
                      <button
                        type="button"
                        className="ct-text-button"
                        style={{ fontSize: "0.79em" }}
                        onClick={() => { persistConfig({ userName: "visitor", fontSize: 15 }); setPanel(null); toast("Default settings restored."); }}
                      >
                        Reset defaults
                      </button>
                      <button type="submit" className="ct-terminal-button">Save settings</button>
                    </div>
                  </form>
                  <p style={{ marginTop: 17, fontSize: "0.77em", color: "var(--ct-faint)" }}>
                    The directory label stays ~/portfolio — this terminal is Shanmuga's portfolio.
                  </p>
                </>
              )}
            </section>
          </div>
        )}

        {/* ── Permission dialog (panel-styled) ── */}
        {permission && (
          <div className="ct-panel-backdrop">
            <section className="ct-panel" role="dialog" aria-modal="true">
              <div className="ct-panel-header">
                <h2 className="ct-panel-title">{permission.title}</h2>
                <button type="button" className="ct-text-button ct-panel-close" onClick={() => answerPermission(false)}>esc to cancel</button>
              </div>
              {permission.detail && <p className="ct-panel-description">{permission.detail}</p>}
              <div className="ct-option-list">
                <button type="button" className="ct-option-button" onClick={() => answerPermission(true)}>
                  <span>1. Yes, proceed</span>
                  <span style={{ color: "var(--color-comment)" }}>(y)</span>
                </button>
                <button type="button" className="ct-option-button" onClick={() => answerPermission(false)}>
                  <span>2. No, and tell Claude what to do differently</span>
                  <span style={{ color: "var(--color-comment)" }}>(esc)</span>
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ── Toast ── */}
        {toastMsg && <div className="ct-toast" role="status">{toastMsg}</div>}
    </div>
  );
}
