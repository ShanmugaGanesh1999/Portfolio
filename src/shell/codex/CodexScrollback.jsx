// ============================================================
// CODEX SCROLLBACK — transcript in the Codex TUI grammar:
//   • codex bullets (magenta) · bold verbs + "  └ " detail
//   trees · ▌ user markers on subtle bg blocks · rounded
//   status boxes with block-bar meters · numbered pickers.
// ============================================================

import { useEffect, useRef, forwardRef } from "react";
import SharedMarkdown from "../shared/Markdown";
import CliWelcome from "../claude/CliWelcome";
import CliFileView from "../claude/CliFileView";
import { formatElapsed } from "../claude/verbs";

// ─── Startup banner: ">_ OpenAI Codex" rounded box ───────────
export function CodexBanner({ model }) {
  return (
    <div className="border border-border rounded-lg bg-sidebar/40 text-sm select-none overflow-hidden">
      <div className="px-4 py-3 space-y-1">
        <div className="text-text font-mono font-semibold">
          <span className="text-accent">&gt;_</span> OpenAI Codex{" "}
          <span className="text-comment/70 font-normal">(v3.0)</span>
        </div>
        <div className="text-xs text-comment font-mono">
          model: <span className="text-text">{model}</span>{" "}
          <span className="text-comment/60">/model to change</span>
        </div>
        <div className="text-xs text-comment font-mono">
          directory: <span className="text-text">~/portfolio</span>
        </div>
      </div>
      <div className="px-4 py-1.5 border-t border-border text-[10px] font-mono text-comment/60">
        tips: /open market_data · /status · !ls · ask anything about Shanmuga
      </div>
    </div>
  );
}

// ─── /status box with block-bar meters ────────────────────────
export function StatusBar({ used, context }) {
  const blocks = 16;
  const filled = (pct) => Math.round((pct / 100) * blocks);
  const bar = (pct) =>
    "█".repeat(filled(pct)) + "░".repeat(blocks - filled(pct));

  return (
    <div className="border border-border rounded-lg bg-sidebar/40 text-xs font-mono select-none overflow-hidden">
      <div className="px-4 py-3 space-y-1">
        <div className="text-text font-semibold">
          <span className="text-accent">&gt;_</span> OpenAI Codex (v3.0)
        </div>
        <div className="text-comment">
          Token usage:{" "}
          <span className="text-text">
            {used} total ({Math.round(used * 0.7)} input + {Math.round(used * 0.3)} output)
          </span>
        </div>
        <div className="text-comment">
          Context window:{" "}
          <span className="text-text">{context}% left</span>
        </div>
        <div className="text-comment">
          Session limit:{" "}
          <span className="text-success">[{bar(45)}] 55% left</span>{" "}
          <span className="text-comment/60">(resets never — it's a portfolio)</span>
        </div>
        <div className="text-comment">
          Permissions:{" "}
          <span className="text-text">read-only browsing · approvals on</span>
        </div>
      </div>
    </div>
  );
}

// ─── Shortcuts block (? key) ──────────────────────────────────
const SHORTCUTS = [
  ["enter", "send message / run command"],
  ["↑ / ↓", "history"],
  ["/", "commands menu"],
  ["!", "shell passthrough"],
  ["esc", "interrupt / cancel"],
  ["y / p / esc", "approval answers"],
  ["?", "this list"],
];

function ShortcutsBlock() {
  return (
    <div className="border border-border rounded-lg px-3 py-2 bg-sidebar/40 text-xs font-mono space-y-1 select-none">
      {SHORTCUTS.map(([key, desc]) => (
        <div key={key} className="flex items-baseline gap-3">
          <kbd className="text-[10px] font-bold text-accent border border-border rounded px-1.5 py-0.5 shrink-0">
            {key}
          </kbd>
          <span className="text-comment">{desc}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Individual block renderers ───────────────────────────────
function Block({ block, onPickModel, pickedModel }) {
  switch (block.kind) {
    case "banner":
      return <CodexBanner model={block.model} />;

    case "welcome":
      return (
        <div className="msg-in">
          <CliWelcome />
        </div>
      );

    case "user":
      return (
        <div className="bg-sidebar/60 border-l-2 border-comment/40 rounded-r-md px-2.5 py-1.5 text-sm font-mono select-none">
          <span className="text-accent mr-1.5">▌</span>
          <span className="text-text whitespace-pre-wrap break-words">{block.text}</span>
        </div>
      );

    case "codex":
      return (
        <div>
          <div className="flex gap-2">
            <span className="text-func shrink-0 select-none">•</span>
            <div className="flex-1 min-w-0">
              <SharedMarkdown content={block.content || "…"} />
              {!block.isStreaming && block.endedAt && !block.error && (
                <div className="text-[10px] text-comment/60 font-mono mt-1">
                  {formatElapsed(block.endedAt - block.startedAt)} · ↓{" "}
                  {Math.max(1, Math.round((block.content?.length || 4) / 4))} tokens
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case "tool":
      return (
        <div className="text-sm font-mono select-none">
          <span className="text-func">• </span>
          <span className="text-text font-semibold">{block.name}</span>
          <span className="text-comment/70">{block.args ? ` ${block.args}` : ""}</span>
          {block.details?.length ? (
            <div className="text-xs">
              {block.details.map((d, i) => (
                <div key={i} className="text-comment/80">
                  {"  └ "}
                  {d}
                </div>
              ))}
            </div>
          ) : null}
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
          <span className="text-comment/50 mr-1.5">└</span>
          {block.text}
        </div>
      );

    case "file":
      return <CliFileView tabId={block.tabId} />;

    case "waiting":
      return (
        <div className="text-sm font-mono text-comment select-none">
          <span className="text-func">• </span>
          {block.text}
          {block.agents?.map((a) => (
            <div key={a} className="text-xs text-comment/80 pl-4">
              └ {a}
            </div>
          ))}
        </div>
      );

    case "status":
      return <StatusBar used={block.used} context={block.context} />;

    case "shortcuts":
      return <ShortcutsBlock />;

    case "models":
      return (
        <div className="border border-border rounded-lg bg-sidebar/40 text-xs font-mono select-none overflow-hidden">
          <div className="px-4 py-2 text-text font-semibold border-b border-border">
            Select Model
          </div>
          {block.models.map((m, i) => {
            const current = m.id === pickedModel;
            return (
              <button
                key={m.id}
                onClick={() => onPickModel(m)}
                className={`w-full text-left px-4 py-2 flex items-baseline gap-3 transition-colors ${
                  current ? "bg-accent/10" : "hover:bg-border/30"
                }`}
              >
                <span className={current ? "text-accent" : "text-comment/50"}>
                  {current ? "›" : " "}
                </span>
                <span className="text-text">
                  {i + 1}. {m.name}
                  {current ? (
                    <span className="text-comment/60"> (current)</span>
                  ) : null}
                </span>
                <span className="text-comment/70 truncate">{m.description}</span>
              </button>
            );
          })}
          <div className="px-4 py-1.5 border-t border-border text-comment/60">
            press enter or click to confirm · esc to go back
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ─── Scrollback container ─────────────────────────────────────
const CodexScrollback = forwardRef(function CodexScrollback(
  { blocks, onPickModel, pickedModel, children },
  ref
) {
  const innerRef = useRef(null);

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
      aria-label="Codex session"
    >
      <div className="max-w-3xl mx-auto px-3 sm:px-5 py-4 space-y-3.5 pb-8">
        {blocks.map((block) => (
          <Block
            key={block.id}
            block={block}
            onPickModel={onPickModel}
            pickedModel={pickedModel}
          />
        ))}
        {children}
      </div>
    </div>
  );
});

export default CodexScrollback;
