// ============================================================
// CLAUDE SHELL — the full-screen Claude Code CLI experience.
// Owns the session scrollback, the prompt dispatch (slash
// commands / "!shell" passthrough / natural language → the
// portfolio assistant), the agent engine, and permission
// dialogs. Shares workspace state with the VS Code shell.
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
import Scrollback from "./Scrollback";
import ClaudePrompt from "./ClaudePrompt";
import AgentPanel from "./AgentPanel";
import { randomVerb, formatTokens } from "./verbs";

const MAX_BLOCKS = 150;
let uidCounter = 0;
const uid = () => `b${Date.now().toString(36)}-${uidCounter++}`;

const ICON = "✳";

export default function ClaudeShell() {
  const ws = useWorkspace();
  const { theme, setTheme, toggle: toggleTheme } = useTheme();

  // ── Session state ──────────────────────────────────────────
  const [blocks, setBlocks] = useState(() => {
    const initial = [
      { id: uid(), kind: "banner" },
      { id: uid(), kind: "welcome" },
    ];
    // Deep link / mode switch with a file already open → print it.
    const activeId = ws.state.activeTabId;
    if (activeId && activeId !== "welcome") {
      initial.push({ id: uid(), kind: "tool", name: "Read", args: activeId });
      initial.push({ id: uid(), kind: "file", tabId: activeId });
    }
    return initial;
  });
  const [busy, setBusy] = useState(null); // main-thread spinner {verb, startedAt, tokens}
  const [agents, setAgents] = useState([]);
  const [model, setModel] = useState(getDefaultModelId());
  const [history, setHistory] = useState([]);
  const [permission, setPermission] = useState(null);
  const abortRef = useRef(null);
  const convoRef = useRef([]); // chat history for context

  const models = getAvailableModels();
  const modelName = models.find((m) => m.id === model)?.name ?? model;

  // ── Block helpers ──────────────────────────────────────────
  const pushBlock = useCallback((block) => {
    setBlocks((prev) => [...prev, { id: uid(), ...block }].slice(-MAX_BLOCKS));
  }, []);

  const patchBlock = useCallback((id, patch) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...(typeof patch === "function" ? patch(b) : patch) } : b))
    );
  }, []);

  const addHistory = (text) => setHistory((h) => [...h, text].slice(-100));

  // ── Natural language → portfolio assistant ─────────────────
  const ask = useCallback(
    async (question) => {
      pushBlock({ kind: "user", text: question });
      const verb = randomVerb();
      const asstId = uid();
      const startedAt = Date.now();
      pushBlock({
        id: asstId,
        kind: "assistant",
        content: "",
        isStreaming: true,
        verb,
        startedAt,
        tokens: 0,
        model: modelName,
      });
      setBusy({ verb, startedAt, tokens: 0 });

      const controller = new AbortController();
      abortRef.current = controller;
      let acc = "";

      try {
        await chatQuery(
          question,
          convoRef.current.slice(-10),
          (chunk) => {
            acc += chunk;
            const tokens = Math.round(acc.length / 4);
            patchBlock(asstId, { content: acc, tokens });
            setBusy((b) => (b ? { ...b, tokens } : b));
          },
          controller.signal,
          model
        );
        patchBlock(asstId, {
          isStreaming: false,
          endedAt: Date.now(),
          tokens: Math.round(acc.length / 4),
        });
      } catch (err) {
        if (err.name === "AbortError") {
          patchBlock(asstId, (b) => ({
            isStreaming: false,
            endedAt: Date.now(),
            content: b.content + "\n\n*(interrupted)*",
          }));
        } else {
          patchBlock(asstId, {
            isStreaming: false,
            error: true,
            content: `⚠ ${err.message || "Something went wrong."}`,
          });
        }
      } finally {
        setBusy(null);
        abortRef.current = null;
      }
    },
    [pushBlock, patchBlock, model, modelName]
  );

  // Keep conversational history in sync from finished blocks.
  useEffect(() => {
    convoRef.current = blocks
      .filter(
        (b) =>
          (b.kind === "assistant" && !b.isStreaming && !b.error && !b.agent) ||
          (b.kind === "user" &&
            !b.text.startsWith("/") &&
            !b.text.startsWith("!") &&
            b.text !== "?")
      )
      .map((b) =>
        b.kind === "user"
          ? { role: "user", content: b.text }
          : { role: "assistant", content: b.content }
      )
      .slice(-10);
  }, [blocks]);

  // ── Permission gate (Claude-style dialogs) ─────────────────
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
    pushBlock({
      kind: "result",
      tone: ok ? "ok" : "err",
      text: ok ? "approved" : "denied (esc)",
    });
  };

  useEffect(() => {
    if (!permission) return;
    const onKey = (e) => {
      if (e.key === "Escape") answerPermission(false);
      else if (e.key === "1") answerPermission(true);
      else if (e.key === "2") answerPermission(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission]);

  // ── Shell passthrough ("!" prefix) ─────────────────────────
  const shellRun = useMemo(
    () =>
      createShellExecutor({
        ws,
        theme,
        setTheme,
        print: (type, text) =>
          pushBlock({
            kind: "result",
            tone: type === "err" ? "err" : type === "ok" ? "ok" : "muted",
            text,
          }),
        confirm: confirmPermission,
        exit: () => ws.setShellMode("vscode"),
      }),
    [ws, theme, setTheme, pushBlock, confirmPermission]
  );

  // ── Agent engine ───────────────────────────────────────────
  // Color index comes from a ref so same-tick spawns stay distinct.
  const agentColorIdxRef = useRef(0);
  const spawnAgent = useCallback(
    (name, task, fn) => {
      const id = uid();
      const verb = randomVerb();
      const agentIndex = agentColorIdxRef.current++;
      setAgents((a) => [...a, { id, name, task, status: "running", verb, tokens: 0 }]);
      ws.log("agent", `${name}: ${task}`);
      (async () => {
        try {
          await fn({
            tool: (n, args) => pushBlock({ kind: "tool", name: n, args }),
            print: (text, tone) => pushBlock({ kind: "result", text, tone }),
            addTokens: (n) =>
              setAgents((a) =>
                a.map((x) => (x.id === id ? { ...x, tokens: x.tokens + n } : x))
              ),
            pushBlock,
            patchBlock,
            agentIndex,
            agentId: id,
          });
        } finally {
          setAgents((a) => a.map((x) => (x.id === id ? { ...x, status: "done" } : x)));
          window.setTimeout(
            () => setAgents((a) => a.filter((x) => x.id !== id)),
            30000
          );
        }
      })();
    },
    [pushBlock, patchBlock, ws]
  );

  // researcher — streams a genuine RAG answer as an agent block.
  const spawnResearcher = useCallback(
    (question) => {
      spawnAgent("researcher", question, async (ctx) => {
        ctx.tool("Agent", `researcher(${question})`);
        const blockId = uid();
        ctx.pushBlock({
          id: blockId,
          kind: "assistant",
          content: "",
          isStreaming: true,
          verb: "Researching",
          startedAt: Date.now(),
          tokens: 0,
          agent: "researcher",
          agentIndex: ctx.agentIndex,
        });
        let chars = 0;
        await chatQuery(question, [], (chunk) => {
          chars += chunk.length;
          ctx.patchBlock(blockId, (b) => ({
            content: b.content + chunk,
            tokens: Math.round(chars / 4),
          }));
          ctx.addTokens(0); // token counter lives on the block; agent row stays light
        }, null, model).catch((err) => {
          ctx.patchBlock(blockId, { error: true, content: `⚠ ${err.message}` });
        });
        ctx.patchBlock(blockId, { isStreaming: false, endedAt: Date.now() });
        ctx.addTokens(Math.round(chars / 4));
      });
    },
    [spawnAgent, model]
  );

  // explorer — opens a project deep-dive.
  const spawnExplorer = useCallback(
    (projectId) => {
      const meta = PROJECT_TABS[projectId];
      if (!meta) return;
      spawnAgent("explorer", `open ${meta.title}`, async (ctx) => {
        ctx.tool("Read", meta.title);
        ws.openTab(projectId);
        ctx.addTokens(320);
        ctx.pushBlock({ kind: "file", tabId: projectId });
        ctx.print(`Read ${meta.title} — ${meta.language} deep dive`, "ok");
      });
    },
    [spawnAgent, ws]
  );

  // curator — reprints the welcome document / scrolls to a section.
  const spawnCurator = useCallback(
    (sectionNote) => {
      spawnAgent("curator", sectionNote, async (ctx) => {
        ctx.tool("Read", "welcome.md");
        ctx.addTokens(180);
        document
          .getElementById(sectionNote.includes("project") ? "cli-projects" : "cli-hero")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [spawnAgent]
  );

  // ── Slash commands ─────────────────────────────────────────
  const scrollToAnchor = useCallback(
    (id) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        pushBlock({ kind: "recap", text: `scrolled to ${id.replace("cli-", "")}` });
      } else {
        pushBlock({ kind: "welcome" });
        window.setTimeout(
          () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
          150
        );
      }
    },
    [pushBlock]
  );

  const runSlash = useCallback(
    (raw) => {
      const body = raw.slice(1).trim();
      const [name, ...rest] = body.split(/\s+/);
      const arg = rest.join(" ");
      pushBlock({ kind: "user", text: raw });

      switch (name) {
        case "help":
          pushBlock({
            kind: "result",
            text: [
              "Commands:",
              "  /open <project>    Open a project deep-dive (or list projects)",
              "  /projects          Jump to the projects section",
              "  /about /skills /experience /contact   Jump to sections",
              "  /research <query>  Spawn a research agent",
              "  /tour              Run a 3-agent demo tour",
              "  /agents            List agents",
              "  /model [name]      Show or switch the assistant model",
              "  /resume            Download resume.pdf (asks permission)",
              "  /theme             Toggle dark/light",
              "  /status            Session status",
              "  /clear             Clear the session",
              "  /mode              Back to the VS Code shell",
              "  /exit              Same as /mode",
            ].join("\n"),
          });
          break;

        case "open": {
          if (!arg) {
            pushBlock({
              kind: "result",
              text:
                "projects: " +
                Object.entries(PROJECT_TABS)
                  .map(([, m]) => m.title.replace(/\.\w+$/, ""))
                  .join("  "),
            });
            pushBlock({ kind: "recap", text: "usage: /open <project> — e.g. /open market_data" });
            break;
          }
          const projectId = resolveProject(arg);
          if (projectId) {
            spawnExplorer(projectId);
          } else {
            const course = resolvePrep(arg);
            if (course) {
              ws.openPrepPanel(course.id);
              pushBlock({ kind: "tool", name: "Read", args: `prep/${course.id}` });
              pushBlock({ kind: "file", tabId: `prep:${course.id}` });
            } else {
              pushBlock({ kind: "result", tone: "err", text: `open: ${arg}: not found` });
            }
          }
          break;
        }

        case "projects": scrollToAnchor("cli-projects"); break;
        case "about": scrollToAnchor("cli-about"); break;
        case "skills": scrollToAnchor("cli-skills"); break;
        case "experience": scrollToAnchor("cli-experience"); break;
        case "contact": scrollToAnchor("cli-contact"); break;

        case "research": {
          if (!arg) {
            pushBlock({ kind: "result", tone: "err", text: "usage: /research <question>" });
            break;
          }
          spawnResearcher(arg);
          break;
        }

        case "tour":
          pushBlock({ kind: "recap", text: "starting tour — 3 agents in parallel" });
          spawnCurator("scroll to hero");
          spawnExplorer("market-data");
          spawnResearcher("What is Shanmuga currently working on at Sherwin Williams?");
          break;

        case "agents":
        case "tasks":
          if (!agents.length) {
            pushBlock({ kind: "result", text: "no agents running — try /research or /tour" });
          } else {
            pushBlock({
              kind: "result",
              text: agents
                .map(
                  (a) =>
                    `◯ ${a.name} — ${a.task} [${a.status} · ↓ ${formatTokens(a.tokens)}]`
                )
                .join("\n"),
            });
          }
          break;

        case "model": {
          if (!arg) {
            pushBlock({
              kind: "result",
              text:
                "models: " +
                models.map((m) => `${m.id === model ? "❯ " : "  "}${m.name}`).join("\n"),
            });
            pushBlock({ kind: "recap", text: "usage: /model <part-of-name>" });
            break;
          }
          const q = arg.toLowerCase();
          const found = models.find((m) => m.name.toLowerCase().includes(q) || m.id.includes(q));
          if (found) {
            setModel(found.id);
            pushBlock({ kind: "result", tone: "ok", text: `model → ${found.name}` });
          } else {
            pushBlock({ kind: "result", tone: "err", text: `model: ${arg} not found` });
          }
          break;
        }

        case "resume":
          confirmPermission({
            title: "Do you want to download resume.pdf?",
            detail: "Opens the resume PDF from Google Drive in a new tab.",
          }).then((ok) => {
            if (ok) window.open(PERSONAL.resumeUrl, "_blank", "noopener");
          });
          break;

        case "theme":
          toggleTheme();
          pushBlock({ kind: "recap", text: `theme → ${theme === "dark" ? "light" : "dark"}` });
          break;

        case "status":
          pushBlock({
            kind: "result",
            text: [
              `shell:   claude code v3.0`,
              `model:  ${modelName}`,
              `theme:  ${theme}`,
              `tabs:   ${ws.state.tabs.length} open`,
              `agents: ${agents.filter((a) => a.status === "running").length} running`,
            ].join("\n"),
          });
          break;

        case "clear":
          setBlocks([
            { id: uid(), kind: "banner" },
            { id: uid(), kind: "welcome" },
          ]);
          convoRef.current = [];
          break;

        case "mode":
        case "exit":
          pushBlock({ kind: "recap", text: "switching to VS Code shell …" });
          window.setTimeout(() => ws.setShellMode("vscode"), 350);
          break;

        default:
          pushBlock({
            kind: "result",
            tone: "err",
            text: `unknown command: /${name} — try /help`,
          });
      }
    },
    [
      pushBlock, spawnExplorer, spawnResearcher, spawnCurator, agents, models,
      model, modelName, theme, toggleTheme, ws, confirmPermission, scrollToAnchor,
    ]
  );

  // ── Prompt dispatch ────────────────────────────────────────
  const onSubmit = useCallback(
    (raw) => {
      const text = raw.trim();
      if (!text) return;
      addHistory(text);

      if (text === "?") {
        pushBlock({ kind: "user", text: "?" });
        pushBlock({ kind: "shortcuts" });
        return;
      }
      if (text.startsWith("/")) {
        runSlash(text);
        return;
      }
      if (text.startsWith("!")) {
        pushBlock({ kind: "user", text });
        const result = shellRun(text.slice(1));
        if (result?.clear) {
          setBlocks([{ id: uid(), kind: "banner" }]);
        }
        return;
      }
      ask(text);
    },
    [ask, pushBlock, runSlash, shellRun]
  );

  const onInterrupt = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const slashCommands = useMemo(
    () => [
      { name: "help", description: "Show available commands" },
      { name: "open", description: "Open a project deep-dive" },
      { name: "projects", description: "Jump to projects" },
      { name: "about", description: "Jump to about" },
      { name: "skills", description: "Jump to tech stack" },
      { name: "experience", description: "Jump to experience" },
      { name: "contact", description: "Jump to contact" },
      { name: "research", description: "Spawn a research agent" },
      { name: "tour", description: "3-agent guided tour" },
      { name: "agents", description: "List running agents" },
      { name: "model", description: "Show / switch model" },
      { name: "resume", description: "Download resume.pdf" },
      { name: "theme", description: "Toggle dark / light" },
      { name: "status", description: "Session status" },
      { name: "clear", description: "Clear the session" },
      { name: "mode", description: "Back to VS Code shell" },
      { name: "exit", description: "Back to VS Code shell" },
    ],
    []
  );

  const runningAgents = agents.filter((a) => a.status === "running").length;

  return (
    <div className="h-dvh flex flex-col bg-bg text-text font-mono">
      {/* ── Header ── */}
      <header className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 h-12 border-b border-border shrink-0">
        <span className="text-accent text-lg select-none" aria-hidden="true">
          {ICON}
        </span>
        <span className="font-display font-semibold text-base text-text">
          Claude Code
        </span>
        <span className="text-[10px] text-comment/60 border border-border rounded px-1.5 py-0.5 select-none">
          v3.0
        </span>
        <span className="hidden sm:inline text-[10px] text-comment/50 font-mono truncate">
          ~/portfolio
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            className="w-8 h-8 flex items-center justify-center rounded-md text-comment hover:text-text hover:bg-border/30 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>
          <ModeSwitcher />
        </div>
      </header>

      {/* ── Scrollback ── */}
      <Scrollback blocks={blocks} />

      {/* ── Agents strip ── */}
      <AgentPanel agents={agents} />

      {/* ── Permission dialog (Claude-style) ── */}
      {permission && (
        <div className="border-t border-border bg-sidebar/60 px-3 sm:px-5 py-3 select-none">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-text">{permission.title}</p>
            {permission.detail && (
              <p className="text-xs text-comment mt-0.5 italic">{permission.detail}</p>
            )}
            <div className="mt-2 space-y-1">
              <button
                onClick={() => answerPermission(true)}
                className="block w-full text-left text-xs text-text hover:text-accent transition-colors"
              >
                <span className="text-accent mr-2">❯</span>1. Yes
              </button>
              <button
                onClick={() => answerPermission(false)}
                className="block w-full text-left text-xs text-comment hover:text-keyword transition-colors"
              >
                <span className="mr-4"> </span>2. No, and tell Claude what to do
                differently (esc)
              </button>
            </div>
            <p className="text-[10px] text-comment/50 mt-2">
              1 / 2 to choose · esc to cancel
            </p>
          </div>
        </div>
      )}

      {/* ── Prompt ── */}
      <ClaudePrompt
        commands={slashCommands}
        busy={busy}
        history={history}
        onSubmit={onSubmit}
        onInterrupt={onInterrupt}
      />

      {/* ── Footer ── */}
      <footer className="h-6 shrink-0 border-t border-border flex items-center justify-between px-3 sm:px-5 text-[10px] text-comment/60 select-none">
        <span>
          {ICON} claude code · ~/portfolio
        </span>
        <span className="flex items-center gap-2 sm:gap-3">
          <span>{modelName}</span>
          {runningAgents > 0 && (
            <span className="text-accent">
              {runningAgents} agent{runningAgents > 1 ? "s" : ""}
            </span>
          )}
          <button
            onClick={toggleTheme}
            className="hover:text-text transition-colors cursor-pointer"
          >
            {theme}
          </button>
        </span>
      </footer>
    </div>
  );
}
