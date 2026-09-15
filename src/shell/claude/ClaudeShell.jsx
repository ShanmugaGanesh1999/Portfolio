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
import { PERSONAL, STATS } from "../../data/portfolioData";
import { DOCUMENTS, getDocument } from "../../workspace/documents";
import { PROJECT_TABS, defaultPrepFile } from "../../workspace/registry";
import ModeSwitcher from "../../components/ui/ModeSwitcher";
import CliWelcome from "./CliWelcome";
import { createSession, getActiveSession, listSessions, saveSession, setActiveSession, exportSession } from "../../services/sessionStore";
import AgentPane from "./AgentPane";
import OpenPicker from "./OpenPicker";
import TerminalMarkdown from "../shared/Markdown";
import { randomVerb, SPINNER_FRAMES } from "./verbs";
import { streamOutput } from "./streamOutput";
import { playSections, PORTFOLIO_SECTIONS, loadingDelay } from "./portfolioSequence";

const CONFIG_KEY = "sg-claude-terminal:config:v1";
const MODE_LABELS = ["Manual", "⏵⏵ Accept edits", "⏸ Plan", "⏵⏵ Bypass permissions"];
const FRAME_MS = 110;
const restoreBlocks = (messages) => messages.filter((block) => {
  if (block.kind === "section") return PORTFOLIO_SECTIONS.includes(block.section);
  if (["user", "system", "tool-plain"].includes(block.kind)) return typeof block.text === "string";
  if (block.kind === "assistant") return typeof block.content === "string";
  if (block.kind === "tool") return typeof block.output === "string" && typeof block.path === "string";
  return block.kind === "help";
}).map((block) => ({ ...block,
  streaming: false, interrupted: block.interrupted || !!block.streaming,
  visibleWords: block.kind === "section" && !block.streaming && !block.interrupted ? Infinity : block.visibleWords ?? 0,
}));

const SLASH_COMMANDS = [
  { name: "/resume", description: "Restore a saved conversation" },
  { name: "/rename", description: "Rename this conversation: /rename <name>" },
  { name: "/export", description: "Download this conversation as Markdown" },
  { name: "/new", description: "Start a new conversation and introduction" },
  { name: "/mode", description: "Choose a permission mode" },
  { name: "/history", description: "Search this session’s commands" },
  { name: "/tasks", description: "Toggle the session checklist" },
  { name: "/help", description: "Show commands and keyboard shortcuts" },
  { name: "/open", description: "Open a project as a full-screen pane — no argument shows the picker" },
  { name: "/info", description: "Display basic information" },
  { name: "/stats", description: "Display portfolio highlights" },
  { name: "/credentials", description: "Display education and certifications" },
  { name: "/stacks", description: "Display the tech stack (alias for /skills)" },
  { name: "/projects", description: "Display projects again" },
  { name: "/about", description: "Display the about section" },
  { name: "/skills", description: "Display the tech stack" },
  { name: "/experience", description: "Display the experience section" },
  { name: "/contact", description: "Display the contact section" },
  { name: "/research", description: "Spawn a research agent" },
  { name: "/tour", description: "Watch the agents work (multi-agent demo)" },
  { name: "/model", description: "Change the assistant model" },
  { name: "/theme", description: "Switch between dark and light themes" },
  { name: "/config", description: "Edit the terminal display settings" },
  { name: "/status", description: "Show this session's configuration" },
  { name: "/clear", description: "Clear the current conversation" },
  { name: "/exit", description: "Back to the Cursor workspace" },
];

const FILE_COMMANDS = [
  ...DOCUMENTS.map((document) => ({ name: `@${document.title}`, description: `Read ${document.title}` })),
  ...PORTFOLIO_SECTIONS.map((section) => ({ name: `@${section}`, description: `Read ${section}` })),
  ...Object.entries(PROJECT_TABS).map(([id, meta]) => ({ name: `@${id}`, description: `Read ${meta.title}` })),
];

const HELP_KEYS = [
  ["Enter", "Send a message or run a command"],
  ["Shift + Enter", "Insert a new line"],
  ["↑ / ↓", "Browse prompt history or command suggestions"],
  ["Tab", "Complete the selected command or @file"],
  ["Shift + Tab", "Cycle permission modes"],
  ["Esc", "Stop a response or dismiss a menu"],
  ["Ctrl + C", "Stop a response or clear the current input"],
  ["Ctrl + L", "Jump to the end of the transcript"],
  ["Ctrl + R", "Search command history"],
  ["Ctrl + O", "Toggle detailed transcript"],
  ["Ctrl + T", "Toggle task checklist"],
  ["Option/Alt + P", "Select model"],
  ["Alt + M", "Cycle permission modes"],
  ["Esc, Esc", "Rewind conversation when the input is empty"],
  ["?", "Show this help when the prompt is empty"],
];

let uidCounter = 0;
const uid = () => `t${Date.now().toString(36)}-${uidCounter++}`;

// ─── Small pieces ─────────────────────────────────────────────
function SpinnerGlyph({ active }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!active) return;
    if ((document.documentElement.dataset.motion === "reduce" || window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    const id = setInterval(() => setFrame((f) => f + 1), FRAME_MS);
    return () => clearInterval(id);
  }, [active]);
  return (
    <span className="ct-spinner" aria-hidden="true">
      {SPINNER_FRAMES[frame % SPINNER_FRAMES.length]}
    </span>
  );
}

function ThinkingRow({ busy }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(timer);
  }, []);
  return <div className="ct-thinking" role="status" aria-live="polite">
    <SpinnerGlyph active />
    <span>{busy.label}</span>
    <span className="ct-elapsed" aria-hidden="true">{Math.max(0, (now - busy.startedAt) / 1000).toFixed(1)}s</span>
    <small>esc to interrupt</small>
  </div>;
}

function ToolEntry({ name, path, output, defaultOpen = false }) {
  const [open, setOpen] = useState(false);
  return (
    <details className="ct-tool-entry" open={open || defaultOpen}>
      <summary onClick={(e) => { e.preventDefault(); setOpen(!open); }}>
        <span className="ct-tool-dot" aria-hidden="true">●</span>
        <span className="ct-tool-title">
          {name}
          <span className="ct-tool-path">({path})</span>
        </span>
        <span className="ct-tool-detail-hint">
          {defaultOpen ? "detailed view" : open ? "click to collapse" : "click to expand"}
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
  const [initialSession] = useState(() => getActiveSession("claude"));
  const sessionRef = useRef(initialSession);
  const [blocks, setBlocks] = useState(() => restoreBlocks(initialSession?.messages || []));
  const [busy, setBusy] = useState(null); // { label, verb, startedAt }
  const [input, setInput] = useState("");
  const [history, setHistory] = useState(() => initialSession?.history || []);
  const [histIdx, setHistIdx] = useState(() => initialSession?.history?.length || 0);
  const [savedDraft, setSavedDraft] = useState("");
  const [menuIdx, setMenuIdx] = useState(0);
  const [mode, setMode] = useState(3);
  const [verbose, setVerbose] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [historyQuery, setHistoryQuery] = useState("");
  const [menuDismissed, setMenuDismissed] = useState(false);
  const escapeTimeRef = useRef(0);
  const [model, setModel] = useState(getDefaultModelId());
  const [panel, setPanel] = useState(null); // {type, ...}
  const [toastMsg, setToastMsg] = useState(null);
  const [agents, setAgents] = useState([]);
  const [permission, setPermission] = useState(null);
  const [agentPane, setAgentPane] = useState(null); // { tabId, agent } — full-screen pane

  const viewportRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const agentControllersRef = useRef(new Map());
  const portfolioCancelRef = useRef(null);
  const autoScrollRef = useRef(true);
  const toastTimerRef = useRef(null);
  const menuRef = useRef(null);

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

  // Follow new output only while the visitor is reading at the bottom.
  useEffect(() => {
    scrollToEnd();
  }, [blocks, busy, scrollToEnd]);

  const runPortfolio = useCallback((sections, intro = false) => {
    portfolioCancelRef.current?.();
    let sectionStartedAt = Date.now();
    portfolioCancelRef.current = playSections(sections, {
      intro,
      onCommand: (text) => {
        if (intro) pushBlock({ kind: "user", text });
      },
      onStatus: (label) => {
        if (!label.startsWith("Loading")) sectionStartedAt = Date.now();
        setBusy({ label, startedAt: sectionStartedAt });
      },
      onSection: (section, next) => {
        const id = uid();
        const startedAt = sectionStartedAt;
        setBusy((previous) => ({ ...previous, label: `Writing ${section}…` }));
        pushBlock({ id, kind: "section", section, streaming: true, onReveal: (visibleWords) => patchBlock(id, { visibleWords }), onComplete: () => {
          patchBlock(id, { streaming: false });
          pushBlock({ kind: "system", text: `Completed ${section} · ${((Date.now() - startedAt) / 1000).toFixed(1)}s` });
          next();
        } });
      },
      onDone: () => {
        portfolioCancelRef.current = null;
        setBusy(null);
      },
    });
  }, [pushBlock, patchBlock]);

  useEffect(() => {
    if (!initialSession) runPortfolio(PORTFOLIO_SECTIONS, true);
    const controllers = agentControllersRef.current;
    return () => {
      portfolioCancelRef.current?.();
      abortRef.current?.abort();
      for (const controller of controllers.values()) controller.abort();
      clearTimeout(toastTimerRef.current);
    };
  }, [runPortfolio, initialSession]);

  const sessionSnapshot = useRef(null);
  useEffect(() => {
    const persist = () => { sessionRef.current = saveSession("claude", {
      ...sessionRef.current, name: sessionRef.current?.name || "Portfolio conversation", messages: blocks, history: history.slice(-100),
    }); };
    sessionSnapshot.current = persist;
    const timer = setTimeout(persist, 200);
    return () => clearTimeout(timer);
  }, [blocks, history]);
  useEffect(() => {
    const flush = () => sessionSnapshot.current?.();
    window.addEventListener("pagehide", flush);
    return () => { window.removeEventListener("pagehide", flush); flush(); };
  }, []);

  const setBusyState = (label, verb) => {
    setBusy(label ? { label, verb: verb || "Thinking", startedAt: Date.now() } : null);
  };

  const cancelRun = useCallback((showMessage = true) => {
    abortRef.current?.abort();
    abortRef.current = null;
    for (const controller of agentControllersRef.current.values()) controller.abort();
    portfolioCancelRef.current?.();
    portfolioCancelRef.current = null;
    setBusy(null);
    setBlocks((previous) => previous.map((block) => block.streaming ? { ...block, streaming: false, interrupted: true } : block));
    if (showMessage) pushBlock({ kind: "system", text: "Interrupted · the response was stopped." });
  }, [pushBlock]);

  // ── Slash menu ──
  const mentionToken = input.match(/(?:^|\s)(@[\w.-]*)$/)?.[1];
  const menuOpen = (!!mentionToken || /^\/[^\s]*$/.test(input)) && !busy && !menuDismissed;
  const menuMatches = useMemo(() => {
    if (!menuOpen) return [];
    const q = (mentionToken || input).toLowerCase();
    return (mentionToken ? FILE_COMMANDS : SLASH_COMMANDS).filter(
      (c) => c.name.startsWith(q) || q.startsWith(c.name)
    );
  }, [menuOpen, input, mentionToken]);
  const clampedMenuIdx = Math.min(menuIdx, Math.max(0, menuMatches.length - 1));

  useEffect(() => setMenuIdx(0), [input]);

  // Keep the keyboard-selected slash option scrolled into view.
  useEffect(() => {
    menuRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [clampedMenuIdx, menuMatches]);

  // ── Permission gate (panel-styled) ──
  const confirmPermission = useCallback(
    (request) => mode === 3 ? Promise.resolve(true) :
      new Promise((resolve) => {
        setPermission({ ...request, resolve });
      }),
    [mode]
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
  const shellRun = useCallback(async (raw) => {
    const controller = new AbortController();
    abortRef.current = controller;
    const id = uid();
    setBusyState(`Running ${raw.split(/\s+/)[0]}…`);
    pushBlock({ id, kind: "tool-plain", text: "", streaming: true });
    let result;
    try {
      await streamOutput(async (emit) => {
        const execute = createShellExecutor({ ws, theme, setTheme,
          print: (_type, text) => emit(`${text}\n`), confirm: confirmPermission,
          exit: () => ws.setShellMode("vscode"),
        });
        result = await execute(raw);
      }, (text) => patchBlock(id, { text }), {
        signal: controller.signal, delay: loadingDelay(),
        animate: !(document.documentElement.dataset.motion === "reduce" || window.matchMedia("(prefers-reduced-motion: reduce)").matches),
      });
      patchBlock(id, { streaming: false });
      if (result?.clear) setBlocks([]);
    } catch (error) {
      if (error.name !== "AbortError") patchBlock(id, { text: error.message, streaming: false });
    } finally {
      if (abortRef.current === controller) { abortRef.current = null; setBusy(null); }
    }
  }, [ws, theme, setTheme, pushBlock, patchBlock, confirmPermission]);

  // ── Natural language → portfolio assistant ──
  const ask = useCallback(
    async (question) => {
      const verb = randomVerb();
      setBusyState(`${verb}…`, verb);
      const id = uid();
      pushBlock({ id, kind: "assistant", content: "", streaming: true });
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        await streamOutput((emit) => chatQuery(
          question,
          blocks
            .filter((b) => (b.kind === "assistant" && !b.streaming) || b.kind === "user")
            .slice(-10)
            .map((b) => (b.kind === "user" ? { role: "user", content: b.text } : { role: "assistant", content: b.content })),
          emit,
          controller.signal,
          model, { mode: mode === 2 ? "plan" : "ask", documents: [...question.matchAll(/(?:^|\s)@([\w.-]+)/g)].map((match) => match[1]) }
        ), (content) => patchBlock(id, { content }), {
          signal: controller.signal, delay: loadingDelay(),
          animate: !(document.documentElement.dataset.motion === "reduce" || window.matchMedia("(prefers-reduced-motion: reduce)").matches),
        });
        patchBlock(id, { streaming: false });
      } catch (err) {
        if (err.name === "AbortError") {
          patchBlock(id, (b) => ({ streaming: false, content: b.content + "\n\n(interrupted)" }));
        } else {
          patchBlock(id, { streaming: false, error: true, content: `⚠ ${err.message}` });
        }
      } finally {
        if (abortRef.current === controller) {
          setBusy(null);
          abortRef.current = null;
        }
      }
    },
    [blocks, model, mode, pushBlock, patchBlock]
  );

  // ── Agents ──
  const spawnAgent = useCallback(
    (name, task, fn) => {
      const id = uid();
      const controller = new AbortController();
      agentControllersRef.current.set(id, controller);
      setAgents((a) => [...a, { id, name, task, status: "running", startedAt: Date.now() }]);
      ws.log("agent", `${name}: ${task}`);
      (async () => {
        let status = "done";
        try {
          await fn({
            signal: controller.signal,
            tool: (toolName, path, output) =>
              pushBlock({ kind: "tool", name: toolName, path, output }),
            system: (text) => pushBlock({ kind: "system", text }),
            pushBlock,
            patchBlock,
          });
        } catch (error) {
          status = error.name === "AbortError" ? "interrupted" : "failed";
        } finally {
          agentControllersRef.current.delete(id);
          if (controller.signal.aborted) status = "interrupted";
          setAgents((a) => a.map((x) => (x.id === id ? { ...x, status } : x)));
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
          await streamOutput((emit) => chatQuery(question, [], emit, ctx.signal, model),
            (content) => ctx.patchBlock(id, { content }), {
              signal: ctx.signal, delay: loadingDelay(),
              animate: !(document.documentElement.dataset.motion === "reduce" || window.matchMedia("(prefers-reduced-motion: reduce)").matches),
            });
        } catch (err) {
          if (err.name === "AbortError") ctx.patchBlock(id, { streaming: false, interrupted: true });
          else ctx.patchBlock(id, { streaming: false, error: true, content: `⚠ ${err.message}` });
          throw err;
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
      const controller = new AbortController();
      abortRef.current = controller;
      setBusyState(`Reading ${meta.title}…`);
      spawnAgent("explorer", `open ${meta.title}`, async (ctx) => {
        try {
          await streamOutput(async (emit) => emit(meta.title), () => {}, { signal: controller.signal, delay: loadingDelay(), animate: false });
          if (controller.signal.aborted) return;
        ctx.tool("Read", meta.title, `${meta.language} system-design deep dive — esc to return`);
        ws.openTab(projectId);
        setAgentPane({ tabId: projectId, agent: "explorer" });
        } catch (error) {
          if (error.name !== "AbortError") ctx.system(`Unable to open project: ${error.message}`);
        } finally {
          if (abortRef.current === controller) { abortRef.current = null; setBusy(null); }
        }
      });
    },
    [spawnAgent, ws]
  );

  // ── Slash command execution ──
  const runSlash = useCallback(
    (raw) => {
      let [command, ...args] = raw.trim().split(/\s+/);
      const argument = args.join(" ");

      if (!SLASH_COMMANDS.some((item) => item.name === command.toLowerCase())) {
        const matches = SLASH_COMMANDS.filter((item) => item.name.startsWith(command.toLowerCase()));
        if (matches.length === 1) command = matches[0].name;
      }

      switch (command.toLowerCase()) {
        case "/resume": setPanel({ type: "resume" }); break;
        case "/rename":
          if (!argument) { pushBlock({ kind: "system", text: "Usage: /rename <conversation name>" }); break; }
          sessionRef.current = saveSession("claude", { ...sessionRef.current, name: argument, messages: blocks, history });
          toast(`Conversation renamed to ${argument.slice(0, 80)}.`);
          break;
        case "/export": {
          const blob = new Blob([exportSession({ ...sessionRef.current, messages: blocks.map((block) => block.kind === "section" ? { ...block, content: getDocument(block.section)?.content || (block.section === "info" ? [PERSONAL.name, PERSONAL.role, PERSONAL.focus, PERSONAL.email, PERSONAL.phone, PERSONAL.location].join("\n\n") : STATS.map((stat) => `${stat.label}: ${stat.value} ${stat.unit}`).join("\n")) } : block) })], { type: "text/markdown;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a"); link.href = url; link.download = "portfolio-conversation.md"; link.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          break;
        }
        case "/new":
          cancelRun(false); setBlocks([]); setHistory([]); setHistIdx(0);
          sessionRef.current = createSession("claude", "Portfolio conversation");
          runPortfolio(PORTFOLIO_SECTIONS, true);
          break;
        case "/mode": setPanel({ type: "mode" }); break;
        case "/history": setHistoryQuery(""); setPanel({ type: "history" }); break;
        case "/tasks": setShowTasks((value) => !value); break;
        case "/help":
          pushBlock({ kind: "help" });
          break;

        case "/open": {
          if (!argument) {
            setPanel({ type: "open-picker" });
            break;
          }
          const projectId = resolveProject(argument);
          if (projectId) {
            spawnExplorer(projectId);
          } else {
            const course = resolvePrep(argument);
            if (course) {
              ws.openPrepFile(course.id, defaultPrepFile(course.id));
              pushBlock({ kind: "tool", name: "Read", path: `prep/${course.id}`, output: "prep reader — esc to return" });
              setAgentPane({ tabId: `prep:${course.id}`, agent: "explorer" });
            } else {
              pushBlock({ kind: "system", text: `No project named '${argument}'. Run /open with no argument to pick from the list.` });
            }
          }
          break;
        }

        case "/info":
        case "/stats":
        case "/about":
        case "/skills":
        case "/stacks":
        case "/experience":
        case "/projects":
        case "/credentials":
        case "/contact":
          runPortfolio([command.toLowerCase() === "/stacks" ? "skills" : command.toLowerCase().slice(1)]);
          break;

        case "/research":
          if (mode === 2 && argument) {
            setPanel({ type: "plan", text: `1. Read portfolio documents related to: ${argument}\n2. Ask the selected model to synthesize the evidence.\n3. Print the answer in this transcript.`, run: () => spawnResearcher(argument) });
            break;
          }
          if (!argument) {
            pushBlock({ kind: "system", text: "Usage: /research <question>" });
          } else {
            spawnResearcher(argument);
          }
          break;

        case "/tour":
          if (mode === 2) {
            setPanel({ type: "plan", text: "1. Open the market-data project write-up.\n2. Research Shanmuga’s current work from portfolio documents.\n3. Show both results.", run: () => { spawnExplorer("market-data"); spawnResearcher("What is Shanmuga currently working on at Sherwin Williams?"); } });
            break;
          }
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
              `  Permission  ${MODE_LABELS[mode]}`,
              `  Agents      ${agents.filter((a) => a.status === "running").length} running`,
              `  Backend     Portfolio RAG assistant (docs/*.md)`,
            ].join("\n"),
          });
          break;

        case "/clear":
          cancelRun(false);
          setBlocks([]);
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
    [blocks, history, pushBlock, spawnExplorer, spawnResearcher, models, config, currentModel, theme, setTheme, agents, mode, cancelRun, ws, runPortfolio, toast]
  );

  // ── Submit ──
  const submitInput = useCallback((raw) => {
    let message = (typeof raw === "string" ? raw : input).trim();
    if (!message) {
      if (busy) cancelRun();
      return;
    }
    if (busy || portfolioCancelRef.current) cancelRun(false);
    if (typeof raw !== "string" && menuOpen && menuMatches.length) message = mentionToken ? input.slice(0, -mentionToken.length) + menuMatches[clampedMenuIdx].name : menuMatches[clampedMenuIdx].name;
    setHistory((h) => [...h, message].slice(-100));
    setHistIdx(history.length + 1);
    setSavedDraft("");
    setInput("");
    autoScrollRef.current = true;

    const silent = /^\/(clear|config|model|theme|exit)(\s|$)/i.test(message);
    if (!silent && message !== "!clear") pushBlock({ kind: "user", text: message });

    if (/^@[\w.-]+$/.test(message)) {
      const name = message.slice(1).toLowerCase();
      const document = getDocument(name);
      if (document) {
        pushBlock({ kind: "tool", name: "Read", path: document.title, output: document.content });
        runSlash(`/${document.id.slice(4)}`);
      } else if (FILE_COMMANDS.some((item) => item.name === message)) runSlash(PORTFOLIO_SECTIONS.includes(name) ? `/${name}` : `/open ${name}`);
      else pushBlock({ kind: "system", text: `Unknown reference: ${message}. Type @ to choose a portfolio document.` });
    } else if (message.startsWith("/")) runSlash(message);
    else if (message.startsWith("!")) {
      if (message.trim() === "!clear") setBlocks([]);
      else shellRun(message.slice(1));
    } else {
      const references = [...new Set([...message.matchAll(/(?:^|\s)@([\w.-]+)/g)].map((match) => match[1]))];
      const missing = references.filter((name) => !FILE_COMMANDS.some((item) => item.name === `@${name}`));
      if (missing.length) pushBlock({ kind: "system", text: `Unknown references: ${missing.map((name) => `@${name}`).join(", ")}. Type @ to choose a portfolio document.` });
      else {
        references.forEach((name) => pushBlock({ kind: "tool", name: "Read", path: getDocument(name)?.title || name, output: getDocument(name)?.content || PROJECT_TABS[name]?.title || `Portfolio section: ${name}` }));
        ask(message);
      }
    }
    focusPrompt();
    scrollToEnd(message.toLowerCase() !== "/clear");
  }, [busy, input, mentionToken, menuOpen, menuMatches, clampedMenuIdx, history.length, runSlash, shellRun, ask, cancelRun, pushBlock, focusPrompt, scrollToEnd]);

  // ── Keyboard ──
  const onKeyDown = (e) => {
    if (e.isComposing) return;
    const key = e.key;
    if (key === "Enter" && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault(); submitInput(); return;
    }
    if ((e.ctrlKey || e.altKey) && !e.metaKey) {
      const lower = e.altKey && e.code.startsWith("Key") ? e.code.slice(3).toLowerCase() : key.toLowerCase();
      if (e.altKey && lower === "p") { e.preventDefault(); setPanel({ type: "model" }); return; }
      if (e.altKey && lower === "m") { e.preventDefault(); cycleMode(); return; }
      if (e.ctrlKey && lower === "r") { e.preventDefault(); setHistoryQuery(""); setPanel({ type: "history" }); return; }
      if (e.ctrlKey && lower === "o") { e.preventDefault(); setVerbose((v) => !v); return; }
      if (e.ctrlKey && lower === "t") { e.preventDefault(); setShowTasks((v) => !v); return; }
    }
    if (key === "Tab" && e.shiftKey) { e.preventDefault(); cycleMode(); return; }
    if (key === "Tab" && menuOpen && menuMatches.length) {
      e.preventDefault(); setInput(mentionToken ? input.slice(0, -mentionToken.length) + menuMatches[clampedMenuIdx].name + " " : menuMatches[clampedMenuIdx].name); return;
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
    if (key === "?" && !input) { e.preventDefault(); submitInput("/help"); return; }
    if (e.ctrlKey && key.toLowerCase() === "c") {
      if (window.getSelection()?.toString() || e.target.selectionStart !== e.target.selectionEnd) return;
      e.preventDefault();
      if (busy || agentControllersRef.current.size) cancelRun();
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
      if (e.isComposing || e.defaultPrevented || panel || permission || agentPane) return;
      if (e.key === "Escape") {
        e.preventDefault();
        if (menuOpen) { setMenuDismissed(true); return; }
        if (busy || agentControllersRef.current.size) { cancelRun(); escapeTimeRef.current = 0; }
        else if (!input && Date.now() - escapeTimeRef.current < 400) setPanel({ type: "rewind" });
        else escapeTimeRef.current = Date.now();
        focusPrompt();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel, permission, agentPane, menuOpen, input, busy, cancelRun, focusPrompt]);

  useEffect(() => {
    if (!panel && !permission) return;
    const dialog = [...document.querySelectorAll('.ct-panel')].at(-1);
    if (!dialog) return;
    const focusable = () => [...dialog.querySelectorAll('button, input, select, textarea, a[href]')].filter((element) => !element.disabled);
    const frame = requestAnimationFrame(() => (dialog.querySelector('input') || focusable()[0])?.focus());
    const onKey = (event) => {
      if (event.isComposing) return;
      if (event.key === 'Escape') {
        event.preventDefault(); event.stopImmediatePropagation();
        if (permission) { permission.resolve(false); setPermission(null); }
        else setPanel(null);
      } else if (event.key === 'Tab') {
        event.preventDefault(); event.stopImmediatePropagation();
        const items = focusable();
        const index = items.indexOf(document.activeElement);
        items[(index + (event.shiftKey ? -1 : 1) + items.length) % items.length]?.focus();
      } else if (['ArrowUp', 'ArrowDown'].includes(event.key) && document.activeElement?.tagName === 'BUTTON') {
        const items = focusable().filter((element) => element.tagName === 'BUTTON');
        const index = items.indexOf(document.activeElement);
        event.preventDefault();
        items[(index + (event.key === 'ArrowUp' ? -1 : 1) + items.length) % items.length]?.focus();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('keydown', onKey, true); focusPrompt(); };
  }, [panel, permission, focusPrompt]);

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
            title="portfolio — Claude Code"
          >
            <span className="text-text">portfolio</span>{" "}
            <span>git:(</span>
            <span style={{ color: "var(--color-success)" }}>main</span>
            <span>)</span>
            <span> — Claude Code</span>
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

        {/* ── Agent pane (full-screen project view) ── */}
        {agentPane ? (
          <AgentPane pane={agentPane} onClose={() => setAgentPane(null)} />
        ) : (
        <>

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
          {/* Conversation */}
          <div className="ct-conversation" role="log" aria-label="Conversation" aria-live="polite">
            {blocks.map((block) => {
              switch (block.kind) {
                case "user":
                  return <Entry key={block.id} kind="user">{block.text.startsWith("/") ? (
                    <button type="button" className="ct-inline-command" onClick={() => submitInput(block.text)}>{block.text}</button>
                  ) : block.text}</Entry>;
                case "section":
                  return <Entry key={block.id} kind="assistant"><CliWelcome section={block.section} active={block.streaming} initialWords={block.visibleWords} onReveal={block.onReveal} onComplete={block.onComplete} onProgress={scrollToEnd} /></Entry>;
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
                    <ToolEntry key={block.id} name={block.name} path={block.path} output={block.output} defaultOpen={verbose} />
                  );
                case "tool-plain":
                  return (
                    <div key={block.id} className="ct-tool-output" style={{ marginTop: 4 }}>
                      <span className="stem" aria-hidden="true">⎿</span>
                      <pre>{block.text}</pre>
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
                              <button type="button" className="ct-inline-command key" onClick={() => submitInput(c.name)}>{c.name}</button>
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
          {(busy || agents.some((agent) => agent.status === "running")) && <ThinkingRow busy={busy || { label: "Researching…", startedAt: agents.find((agent) => agent.status === "running").startedAt }} />}
        </div>

        </>

        )}

        {/* ── Composer ── */}
        <footer className="ct-composer" style={agentPane ? { display: "none" } : undefined}>
          {showTasks && <div className="ct-task-list" aria-label="Task checklist">
            <strong>Session tasks</strong>
            {PORTFOLIO_SECTIONS.map((section) => {
              const entries = blocks.filter((block) => block.kind === "section" && block.section === section);
              const last = entries.at(-1);
              return <div key={section}>{last ? last.streaming ? "◌" : last.interrupted ? "■" : "✓" : "○"} /{section}{last?.streaming ? " · writing" : last?.interrupted ? " · interrupted" : ""}</div>;
            })}
            {busy && <div>{busy.label}</div>}
            {agents.map((agent) => <div key={agent.id}>{agent.name}: {agent.task} · {agent.status}</div>)}
          </div>}
          {[...new Set([...input.matchAll(/(?:^|\s)@([\w.-]+)/g)].map((match) => match[1]))].filter((name) => FILE_COMMANDS.some((item) => item.name === `@${name}`)).length > 0 && <div className="ct-reference-chips" aria-label="Selected document context">
            {[...new Set([...input.matchAll(/(?:^|\s)@([\w.-]+)/g)].map((match) => match[1]))].filter((name) => FILE_COMMANDS.some((item) => item.name === `@${name}`)).map((name) => <button key={name} className="ct-text-button" type="button" aria-label={`Remove ${name} context`} onClick={() => setInput((value) => value.replace(`@${name}`, ""))}>@{name} ×</button>)}
          </div>}
          {/* Slash menu */}
          {menuOpen && menuMatches.length > 0 && (
            <div className="ct-command-menu" role="listbox" aria-label="Commands and files" id="ct-command-menu" ref={menuRef}>
              {menuMatches.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  role="option"
                  aria-selected={i === clampedMenuIdx}
                  className="ct-command-option"
                  onMouseEnter={() => setMenuIdx(i)}
                  onClick={() => { if (mentionToken) { setInput(input.slice(0, -mentionToken.length) + c.name + " "); focusPrompt(); } else submitInput(c.name); }}
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
                onChange={(e) => { setMenuDismissed(false); setInput(e.target.value); setMenuIdx(0); syncHeight(e.target); }}
                onKeyDown={onKeyDown}
                aria-controls="ct-command-menu"
                aria-expanded={menuOpen}
              />
              <span className="ct-block-cursor" aria-hidden="true" />
            </div>
            <button
              className="ct-send-button"
              type="submit"
              title={busy && !input.trim() ? "Stop response (Escape)" : "Send message (Enter)"}
              aria-label={busy && !input.trim() ? "Stop response" : "Send message"}
            >
              {busy && !input.trim() ? (
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
              <button type="button" className="ct-text-button" onClick={() => submitInput("/help")}>
                ? for shortcuts
              </button>
              <button
                type="button"
                className="ct-text-button ct-mode-button"
                data-mode={mode}
                onClick={cycleMode}
                title="Cycle permission mode (Shift+Tab)"
              >
                <span>{MODE_LABELS[mode]}</span>
                <span className="ct-mode-hint"> · shift+tab to cycle</span>
              </button>
            </div>
            <div className="ct-status-right">
              <button type="button" className="ct-text-button" onClick={() => setVerbose((value) => !value)} aria-pressed={verbose}>details</button>
              <button type="button" className="ct-text-button" onClick={() => { setHistoryQuery(""); setPanel({ type: "history" }); }}>history</button>
              <button type="button" className="ct-text-button" onClick={() => setShowTasks((value) => !value)} aria-pressed={showTasks}>tasks</button>
              <span title="Running agents">
                {runningAgents > 0 ? `${runningAgents} agent${runningAgents > 1 ? "s" : ""} · ` : ""}
              </span>
              <span className="ct-status-dot" aria-hidden="true" />
              <span>{currentModel.name}</span>
            </div>
          </div>
        </footer>

        {/* ── Open picker (/open with no argument) ── */}
        {panel?.type === "open-picker" && (
          <OpenPicker
            onPick={(tabId) => {
              setPanel(null);
              pushBlock({ kind: "system", text: `→ opening ${tabId.startsWith("prep:") ? "prep reader" : "project"} …` });
              if (tabId.startsWith("prep:")) {
                ws.openPrepFile(tabId.slice(5), defaultPrepFile(tabId.slice(5)));
                pushBlock({ kind: "tool", name: "Read", path: tabId, output: "prep reader — esc to return" });
                setAgentPane({ tabId, agent: "explorer" });
              } else {
                spawnExplorer(tabId);
              }
            }}
            onClose={() => setPanel(null)}
          />
        )}

        {/* ── Modal panels ── */}
        {panel && panel.type !== "open-picker" && (
          <div className="ct-panel-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setPanel(null); }}>
            <section className="ct-panel" role="dialog" aria-modal="true" aria-label={permission?.title || panel?.type || "Terminal dialog"}>
              {panel.type === "resume" && <>
                <div className="ct-panel-header"><h2 className="ct-panel-title">Resume conversation</h2><button type="button" className="ct-text-button" onClick={() => setPanel(null)}>esc to close</button></div>
                <div className="ct-option-list">{listSessions("claude").map((session) => <button key={session.id} type="button" className="ct-option-button" onClick={() => {
                  cancelRun(false); setActiveSession("claude", session.id); sessionRef.current = session;
                  setBlocks(restoreBlocks(session.messages));
                  setHistory(session.history || []); setHistIdx(session.history?.length || 0); setPanel(null);
                }}><span>{session.name}</span><span>{new Date(session.updatedAt).toLocaleDateString()} · {session.messages.length} entries</span></button>)}</div>
              </>}
              {["history", "rewind"].includes(panel.type) && <>
                <div className="ct-panel-header"><h2 className="ct-panel-title">{panel.type === "history" ? "Command history" : "Rewind conversation"}</h2><button type="button" className="ct-text-button" onClick={() => setPanel(null)}>esc to close</button></div>
                {panel.type === "history" && <input className="ct-history-search" aria-label="Search command history" placeholder="Search history…" value={historyQuery} onChange={(e) => setHistoryQuery(e.target.value)} />}
                <div className="ct-option-list">
                  {panel.type === "history" ? history.filter((text) => text.toLowerCase().includes(historyQuery.toLowerCase())).slice().reverse().map((text, index) => <button key={index} type="button" className="ct-option-button" onClick={() => { setInput(text); setPanel(null); }}>{text}</button>) : blocks.filter((block) => block.kind === "user").map((block) => <button key={block.id} type="button" className="ct-option-button" onClick={() => { cancelRun(false); setBlocks((previous) => previous.slice(0, previous.findIndex((entry) => entry.id === block.id))); setInput(block.text); setPanel(null); }}>{block.text}</button>)}
                  {panel.type === "history" && !history.some((text) => text.toLowerCase().includes(historyQuery.toLowerCase())) && <p>No matching commands.</p>}
                </div>
              </>}
              {panel.type === "mode" && <>
                <div className="ct-panel-header"><h2 className="ct-panel-title">Permission mode</h2><button type="button" className="ct-text-button" onClick={() => setPanel(null)}>esc to close</button></div>
                <div className="ct-option-list">{MODE_LABELS.map((label, index) => <button key={label} type="button" className="ct-option-button" onClick={() => { setMode(index); setPanel(null); }}><span>{label}{mode === index ? " ✓" : ""}</span><span>{["Review local settings and external actions", "Apply local settings; confirm external actions", "Review multi-step work before running", "Run supported portfolio actions without prompts"][index]}</span></button>)}</div>
              </>}
              {panel.type === "plan" && <>
                <div className="ct-panel-header"><h2 className="ct-panel-title">Plan</h2><button type="button" className="ct-text-button" onClick={() => setPanel(null)}>esc to cancel</button></div>
                <pre className="ct-plan-text">{panel.text}</pre>
                <button type="button" className="ct-terminal-button" onClick={() => { setPanel(null); panel.run(); }}>Run plan</button>
              </>}
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
                      const next = { userName: name.slice(0, 50), fontSize: Math.min(20, Math.max(12, size)) };
                      const save = () => { persistConfig(next); toast("Settings saved locally."); };
                      if (mode === 0 || mode === 2) setPanel({ type: "plan", text: `Apply local settings:\nName: ${next.userName}\nText size: ${next.fontSize}px`, run: save });
                      else { setPanel(null); save(); }
                    }}
                  >
                    <label className="ct-setting">
                      <span>Your session name</span>
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
                    Manual and Plan review local settings before applying them. Accept edits applies local settings automatically; Bypass also skips portfolio action prompts.
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
            <section className="ct-panel" role="dialog" aria-modal="true" aria-label={permission?.title || panel?.type || "Terminal dialog"}>
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
