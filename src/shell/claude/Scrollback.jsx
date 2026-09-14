// ============================================================
// SCROLLBACK — the Claude Code conversation transcript.
// Renders the session blocks using the CLI's visual grammar:
//   ❯ user echo · ⏺ tool calls · ⎿ results · ● assistant
//   text · ※ recaps · bordered file panels · welcome banner.
// ============================================================

import { useEffect, useRef, forwardRef } from "react";
import ClaudeMarkdown from "../shared/Markdown";
import CliWelcome from "./CliWelcome";
import CliFileView from "./CliFileView";
import { SpinnerDone } from "./Spinner";
import { agentColor } from "./AgentPanel";

// ─── Welcome banner (╭─ Claude Code ─╮ box) ───────────────────
export function WelcomeBanner() {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-sidebar/40 text-sm select-none">
      {/* Title row — version chip breaks the top border, CLI-style */}
      <div className="relative border-b border-border px-3 py-2 bg-sidebar/70">
        <span className="absolute -top-2 left-3 bg-sidebar px-1.5 text-[10px] font-mono text-comment/70 border border-border rounded">
          v3.0
        </span>
        <div className="flex items-center gap-2">
          <span className="text-accent text-base">✳</span>
          <span className="font-display font-semibold text-base text-text">
            Claude Code
          </span>
          <span className="text-[10px] font-mono text-comment/60">
            portfolio edition
          </span>
        </div>
      </div>

      <div className="px-3 py-3 grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-text font-ui">Welcome!</p>
          <p className="text-xs text-comment mt-1 leading-relaxed">
            This portfolio ships as both a VS Code workspace and this CLI.
            Everything works here — projects, prep, search, and an assistant
            that knows Shanmuga's background.
          </p>
          <p className="text-[10px] font-mono text-comment/60 mt-2">
            ● assistant ready · /model to switch
          </p>
        </div>
        <div>
          <div className="text-xs font-ui font-semibold text-text mb-1.5">
            Tips for getting started
          </div>
          <ul className="text-xs text-comment space-y-1 leading-relaxed">
            <li>
              <span className="text-accent font-mono">/open</span> — open a project
              deep-dive (try <span className="text-accent font-mono">/open market_data</span>)
            </li>
            <li>
              <span className="text-accent font-mono">!ls</span> — shell passthrough
              (cat, cd, theme, neofetch…)
            </li>
            <li>
              <span className="text-accent font-mono">/research</span> — spawn a
              research agent
            </li>
            <li>
              Ask anything —{" "}
              <span className="font-mono text-text/80">"what did he build at Zoho?"</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="px-3 py-1.5 border-t border-border text-[10px] font-mono text-comment/60">
        ? for shortcuts · esc to interrupt
      </div>
    </div>
  );
}

// ─── Shortcuts help block (? key) ─────────────────────────────
const SHORTCUTS = [
  ["Enter", "send message / run command"],
  ["↑ / ↓", "command history"],
  ["/", "slash commands menu"],
  ["!", "shell passthrough (!ls, !open …)"],
  ["esc", "interrupt a running response"],
  ["?", "toggle this shortcut list"],
  ["1 / 2 / 3", "choose permission option"],
];

function ShortcutsBlock() {
  return (
    <div className="border border-border rounded-lg px-3 py-2 bg-sidebar/40 text-xs space-y-1 select-none">
      {SHORTCUTS.map(([key, desc]) => (
        <div key={key} className="flex items-baseline gap-3">
          <kbd className="text-[10px] font-mono font-bold text-accent border border-border rounded px-1.5 py-0.5 shrink-0">
            {key}
          </kbd>
          <span className="text-comment">{desc}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Individual block renderers ───────────────────────────────
function Block({ block }) {
  switch (block.kind) {
    case "banner":
      return <WelcomeBanner />;

    case "welcome":
      return (
        <div className="msg-in">
          <CliWelcome />
        </div>
      );

    case "user":
      return (
        <div className="flex gap-2 text-sm font-mono select-none">
          <span className="text-accent font-bold shrink-0">❯</span>
          <span className="text-text whitespace-pre-wrap break-words">{block.text}</span>
        </div>
      );

    case "assistant":
      return (
        <div className="pl-0">
          <div className="flex items-baseline gap-2 text-xs font-mono mb-1 select-none">
            <span
              className="shrink-0"
              style={{ color: block.agent ? agentColor(block.agentIndex ?? 0) : "var(--color-accent)" }}
            >
              ●
            </span>
            {block.agent ? (
              <span
                className="font-semibold"
                style={{ color: agentColor(block.agentIndex ?? 0) }}
              >
                {block.agent}
              </span>
            ) : null}
            {block.model && !block.isStreaming && (
              <span className="text-comment/50 text-[10px]">{block.model}</span>
            )}
          </div>
          <div className={block.error ? "text-keyword text-sm leading-relaxed whitespace-pre-wrap break-words" : ""}>
            {block.error ? (
              block.content
            ) : (
              <ClaudeMarkdown content={block.content || "…"} />
            )}
          </div>
          {!block.isStreaming && block.endedAt && !block.error && (
            <div className="mt-1.5">
              <SpinnerDone verb={block.verb} ms={block.endedAt - block.startedAt} tokens={block.tokens} />
            </div>
          )}
        </div>
      );

    case "tool":
      return (
        <div className="text-sm font-mono select-none">
          <span className="text-text">⏺ </span>
          <span className="text-text font-semibold">{block.name}</span>
          <span className="text-comment/70">({block.args})</span>
        </div>
      );

    case "result":
      return (
        <div
          className={`text-xs font-mono whitespace-pre-wrap break-words pl-5 select-none ${
            block.tone === "err"
              ? "text-keyword"
              : block.tone === "ok"
              ? "text-success"
              : "text-comment"
          }`}
        >
          <span className="text-comment/60 mr-1.5">⎿</span>
          {block.text}
        </div>
      );

    case "file":
      return (
        <div className="pl-0">
          <CliFileView tabId={block.tabId} />
        </div>
      );

    case "recap":
      return (
        <div className="text-xs text-comment/70 font-mono select-none">
          <span className="text-accent/70 mr-1.5">※</span>
          {block.text}
        </div>
      );

    case "shortcuts":
      return <ShortcutsBlock />;

    default:
      return null;
  }
}

// ─── Scrollback container ─────────────────────────────────────
const Scrollback = forwardRef(function Scrollback({ blocks, children }, ref) {
  const innerRef = useRef(null);

  // Auto-scroll while the user is pinned near the bottom.
  useEffect(() => {
    const el = innerRef.current;
    if (el && el.dataset.pinned !== "false") {
      el.scrollTop = el.scrollHeight;
    }
  }, [blocks]);

  const onScroll = () => {
    const el = innerRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    el.dataset.pinned = String(nearBottom);
  };

  return (
    <div
      ref={(node) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto scrollbar-thin min-h-0"
      role="log"
      aria-label="Claude Code session"
    >
      <div className="max-w-3xl mx-auto px-3 sm:px-5 py-4 space-y-4 pb-8">
        {blocks.map((block) => (
          <Block key={block.id} block={block} />
        ))}
        {children}
      </div>
    </div>
  );
});

export default Scrollback;
