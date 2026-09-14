// ============================================================
// CODEX SHELL — the OpenAI Codex CLI experience.
// Transcript grammar, approval dialogs, agent command center,
// model picker, /status meters. Shares the workspace engine
// with the VS Code and Claude Code shells.
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
import CodexScrollback from "./CodexScrollback";
import CodexPrompt from "./CodexPrompt";
import CodexAgents from "./CodexAgents";

const MAX_BLOCKS = 150;
let uidCounter = 0;
const uid = () => `x${Date.now().toString(36)}-${uidCounter++}`;

export default function CodexShell() {
  const ws = useWorkspace();
  const { theme, setTheme, toggle: toggleTheme } = useTheme();

  // ── Session state ──────────────────────────────────────────
  const [blocks, setBlocks] = useState(() => {
    const initial = [
      { id: uid(), kind: "banner", model: "portfolio-assistant" },
      { id: uid(), kind: "welcome" },
    ];
    const activeId = ws.state.activeTabId;
    if (activeId && activeId !== "welcome") {
      initial.push({ id: uid(), kind: "tool", name: "Read", args: activeId, details: [] });
      initial.push({ id: uid(), kind: "file", tabId: activeId });
    }
    return initial;
  });
  const [busy, setBusy] = useState(null);
  const [agents, setAgents] = useState([]);
  const [model, setModel] = useState(getDefaultModelId());
  const [history, setHistory] = useState([]);
  const [approval, setApproval] = useState(null);
  const abortRef = useRef(null);
  const convoRef = useRef([]);

  const models = getAvailableModels();
  const modelName = models.find((m) => m.id === model)?.name ?? model;

  // "Context left" — playful real number from session traffic.
  const [sessionTokens, setSessionTokens] = useState(120);
  const contextLeft = Math.max(1, 100 - Math.round((sessionTokens / 272000) * 100));

  // ── Block helpers ──────────────────────────────────────────
  const pushBlock = useCallback((block) => {
    setBlocks((prev) => [...prev, { id: uid(), ...block }].slice(-MAX_BLOCKS));
  }, []);

  const patchBlock = useCallback((id, patch) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, ...(typeof patch === "function" ? patch(b) : patch) } : b
      )
    );
  }, []);

  // ── Natural language → portfolio assistant ─────────────────
  const ask = useCallback(
    async (question) => {
      pushBlock({ kind: "user", text: question });
      const id = uid();
      const startedAt = Date.now();
      pushBlock({ id, kind: "codex", content: "", isStreaming: true, startedAt });
      setBusy({ startedAt });
      const controller = new AbortController();
      abortRef.current = controller;
      let acc = "";
      try {
        await chatQuery(
          question,
          convoRef.current.slice(-10),
          (chunk) => {
            acc += chunk;
            patchBlock(id, { content: acc });
            setSessionTokens((t) => t + Math.round(chunk.length / 4));
          },
          controller.signal,
          model
        );
        patchBlock(id, { isStreaming: false, endedAt: Date.now() });
      } catch (err) {
        if (err.name === "AbortError") {
          patchBlock(id, (b) => ({
            isStreaming: false,
            endedAt: Date.now(),
            content: b.content + "\n\n*(interrupted — esc)*",
          }));
        } else {
          patchBlock(id, { isStreaming: false, error: true, content: `⚠ ${err.message}` });
        }
      } finally {
        setBusy(null);
        abortRef.current = null;
      }
    },
    [pushBlock, patchBlock, model]
  );

  useEffect(() => {
    convoRef.current = blocks
      .filter(
        (b) =>
          (b.kind === "codex" && !b.isStreaming && !b.error) ||
          (b.kind === "user" && !b.text.startsWith("/") && !b.text.startsWith("!") && b.text !== "?")
      )
      .map((b) =>
        b.kind === "user"
          ? { role: "user", content: b.text }
          : { role: "assistant", content: b.content }
      )
      .slice(-10);
  }, [blocks]);

  // ── Approval gate (Codex wording: y / p / esc) ─────────────
  const confirmApproval = useCallback(
    (request) =>
      new Promise((resolve) => {
        setApproval({ ...request, resolve });
      }),
    []
  );

  const answerApproval = (ok) => {
    approval?.resolve(ok);
    setApproval(null);
    pushBlock({
      kind: "result",
      tone: ok ? "ok" : "err",
      text: ok ? "approved (y)" : "declined (esc)",
    });
  };

  useEffect(() => {
    if (!approval) return;
    const onKey = (e) => {
      if (e.key === "Escape" || e.key.toLowerCase() === "n") answerApproval(false);
      else if (e.key.toLowerCase() === "y" || e.key === "1") answerApproval(true);
      else if (e.key.toLowerCase() === "p" || e.key === "2") answerApproval(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approval]);

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
        confirm: confirmApproval,
        exit: () => ws.setShellMode("vscode"),
      }),
    [ws, theme, setTheme, pushBlock, confirmApproval]
  );

  // ── Agent engine (command center) ──────────────────────────
  const spawnAgent = useCallback(
    (name, role, task, fn) => {
      const id = uid();
      setAgents((a) => [...a, { id, name, role, task, status: "running", tokens: 0 }]);
      ws.log("agent", `${name} [${role}]: ${task}`);
      (async () => {
        try {
          await fn({
            tool: (verb, args, details) =>
              pushBlock({ kind: "tool", name: verb, args, details: details ?? [] }),
            print: (text, tone) => pushBlock({ kind: "result", text, tone }),
            addTokens: (n) =>
              setAgents((a) => a.map((x) => (x.id === id ? { ...x, tokens: x.tokens + n } : x))),
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
      spawnAgent("Robie", "researcher", question, async (ctx) => {
        ctx.tool("Researching", `"${question}"`);
        const id = uid();
        ctx.pushBlock({ id, kind: "codex", content: "", isStreaming: true, startedAt: Date.now() });
        let chars = 0;
        try {
          await chatQuery(
            question,
            [],
            (chunk) => {
              chars += chunk.length;
              ctx.patchBlock(id, (b) => ({ content: b.content + chunk }));
            },
            null,
            model
          );
        } catch (err) {
          ctx.patchBlock(id, { error: true, content: `⚠ ${err.message}` });
        }
        ctx.patchBlock(id, { isStreaming: false, endedAt: Date.now() });
        ctx.addTokens(Math.round(chars / 4));
      });
    },
    [spawnAgent, model]
  );

  const spawnExplorer = useCallback(
    (projectId) => {
      const meta = PROJECT_TABS[projectId];
      if (!meta) return;
      spawnAgent("Ada", "explorer", `open ${meta.title}`, async (ctx) => {
        ctx.tool("Read", meta.title, [meta.language + " deep dive"]);
        ws.openTab(projectId);
        ctx.addTokens(320);
        ctx.pushBlock({ kind: "file", tabId: projectId });
      });
    },
    [spawnAgent, ws]
  );

  const spawnReviewer = useCallback(
    (target) => {
      spawnAgent("ECHO", "reviewer", `review ${target}`, async (ctx) => {
        ctx.tool("Reviewed", target, ["no issues found — clean architecture"]);
        ctx.addTokens(240);
        ctx.print(`Reviewed ${target} — ✓ no blocking issues`, "ok");
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
        pushBlock({ kind: "result", text: `scrolled to ${id.replace("cli-", "")}` });
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
              "  /open <project>      Open a project deep-dive (or list them)",
              "  /projects            Jump to the projects section",
              "  /about /skills /experience /contact",
              "  /research <query>    Spawn a researcher agent",
              "  /review <target>     Spawn a reviewer agent",
              "  /collab              Multi-agent: 3 agents in parallel",
              "  /agents              Agent command center",
              "  /model               Select model",
              "  /status              Session configuration and token usage",
              "  /resume              Download resume.pdf (asks approval)",
              "  /theme               Toggle dark/light",
              "  /clear               Clear the terminal and start fresh",
              "  /mode · /exit        Back to the VS Code shell",
            ].join("\n"),
          });
          break;

        case "open": {
          if (!arg) {
            pushBlock({
              kind: "result",
              text:
                "projects: " +
                Object.values(PROJECT_TABS)
                  .map((m) => m.title.replace(/\.\w+$/, ""))
                  .join("  "),
            });
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
              pushBlock({ kind: "result", tone: "err", text: `no project named '${arg}'` });
            }
          }
          break;
        }

        case "projects": scrollToAnchor("cli-projects"); break;
        case "about": scrollToAnchor("cli-about"); break;
        case "skills": scrollToAnchor("cli-skills"); break;
        case "experience": scrollToAnchor("cli-experience"); break;
        case "contact": scrollToAnchor("cli-contact"); break;

        case "research":
          if (!arg) {
            pushBlock({ kind: "result", tone: "err", text: "usage: /research <question>" });
          } else {
            spawnResearcher(arg);
          }
          break;

        case "review":
          spawnReviewer(arg || "market_data.md");
          break;

        case "collab":
        case "multi-agents":
        case "tour":
          pushBlock({
            kind: "waiting",
            text: "Waiting for 3 agents",
            agents: ["Robie [researcher]", "Ada [explorer]", "ECHO [reviewer]"],
          });
          spawnExplorer("market-data");
          spawnResearcher("What is Shanmuga currently working on at Sherwin Williams?");
          spawnReviewer("welcome.md");
          break;

        case "agents":
          if (!agents.length) {
            pushBlock({ kind: "result", text: "no agents — try /research, /review, or /collab" });
          } else {
            pushBlock({
              kind: "result",
              text: agents
                .map(
                  (a) =>
                    `${a.status === "running" ? "●" : "✓"} ${a.name} [${a.role}] ${a.task} — ${
                      a.status === "running" ? "Working" : "Finished"
                    }`
                )
                .join("\n"),
            });
          }
          break;

        case "model":
          pushBlock({ kind: "models", models });
          break;

        case "status":
          pushBlock({
            kind: "status",
            used: Math.max(sessionTokens, 120),
            context: contextLeft,
          });
          break;

        case "resume":
          confirmApproval({
            title: "Would you like to run the following command?",
            command: "open resume.pdf",
            detail: "Opens the resume PDF from Google Drive in a new tab.",
          }).then((ok) => {
            if (ok) window.open(PERSONAL.resumeUrl, "_blank", "noopener");
          });
          break;

        case "theme":
          toggleTheme();
          pushBlock({
            kind: "result",
            text: `theme → ${theme === "dark" ? "light" : "dark"}`,
          });
          break;

        case "clear":
          setBlocks([{ id: uid(), kind: "banner", model: modelName }]);
          convoRef.current = [];
          break;

        case "mode":
        case "exit":
        case "quit":
          pushBlock({ kind: "result", text: "switching to VS Code shell …" });
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
      pushBlock, spawnExplorer, spawnResearcher, spawnReviewer, agents, models,
      modelName, sessionTokens, contextLeft, theme, toggleTheme, ws,
      confirmApproval, scrollToAnchor,
    ]
  );

  // ── Prompt dispatch ────────────────────────────────────────
  const onSubmit = useCallback(
    (raw) => {
      const text = raw.trim();
      if (!text) return;
      setHistory((h) => [...h, text].slice(-100));
      setSessionTokens((t) => t + 8);

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
          setBlocks([{ id: uid(), kind: "banner", model: modelName }]);
        }
        return;
      }
      ask(text);
    },
    [ask, pushBlock, runSlash, shellRun, modelName]
  );

  const onInterrupt = useCallback(() => abortRef.current?.abort(), []);

  const slashCommands = useMemo(
    () => [
      { name: "help", description: "Show commands" },
      { name: "open", description: "Open a project deep-dive" },
      { name: "projects", description: "Jump to projects" },
      { name: "about", description: "Jump to about" },
      { name: "skills", description: "Jump to tech stack" },
      { name: "experience", description: "Jump to experience" },
      { name: "contact", description: "Jump to contact" },
      { name: "research", description: "Spawn a researcher agent" },
      { name: "review", description: "Spawn a reviewer agent" },
      { name: "collab", description: "3 agents in parallel" },
      { name: "agents", description: "Agent command center" },
      { name: "model", description: "Select model" },
      { name: "status", description: "Token usage and limits" },
      { name: "resume", description: "Download resume.pdf" },
      { name: "theme", description: "Toggle dark / light" },
      { name: "clear", description: "Clear the terminal" },
      { name: "exit", description: "Back to VS Code" },
    ],
    []
  );

  const onPickModel = (m) => {
    setModel(m.id);
    pushBlock({ kind: "result", tone: "ok", text: `model → ${m.name}` });
  };

  return (
    <div className="h-dvh flex flex-col bg-bg text-text font-mono">
      {/* ── Header ── */}
      <header className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 h-12 border-b border-border shrink-0">
        <span className="text-accent font-mono font-semibold select-none">&gt;_</span>
        <span className="font-mono font-semibold text-base text-text">codex</span>
        <span className="text-[10px] text-comment/60 border border-border rounded px-1.5 py-0.5 select-none">
          v3.0
        </span>
        <span className="hidden sm:inline text-[10px] text-comment/50 truncate">
          ~/portfolio
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
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
      <CodexScrollback
        blocks={blocks}
        onPickModel={onPickModel}
        pickedModel={model}
      />

      {/* ── Agent command center ── */}
      <CodexAgents agents={agents} />

      {/* ── Approval dialog ── */}
      {approval && (
        <div className="border-t border-border bg-sidebar/60 px-3 sm:px-5 py-3 select-none">
          <div className="max-w-3xl mx-auto text-sm">
            <p className="text-text">{approval.title}</p>
            {approval.command && (
              <p className="text-xs text-text font-mono mt-1.5">
                <span className="text-comment/60">$ </span>
                {approval.command}
              </p>
            )}
            {approval.detail && (
              <p className="text-xs text-comment mt-1 italic">{approval.detail}</p>
            )}
            <div className="mt-2 space-y-1 text-xs">
              <button
                onClick={() => answerApproval(true)}
                className="block w-full text-left text-text hover:text-success transition-colors"
              >
                <span className="text-accent mr-2">›</span>1. Yes, proceed{" "}
                <span className="text-comment/60">(y)</span>
              </button>
              <button
                onClick={() => answerApproval(false)}
                className="block w-full text-left text-comment hover:text-keyword transition-colors"
              >
                <span className="mr-4"> </span>2. No, and tell Codex what to do
                differently <span className="text-comment/60">(esc)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Prompt ── */}
      <CodexPrompt
        commands={slashCommands}
        busy={busy}
        contextLeft={contextLeft}
        history={history}
        onSubmit={onSubmit}
        onInterrupt={onInterrupt}
      />
    </div>
  );
}
