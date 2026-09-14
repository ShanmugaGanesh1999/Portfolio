// ============================================================
// VIEWER PARTS — shared building blocks for the seven project
// deep-dive viewers (Section, CodeBlock, DiagramView).
// Extracted verbatim from the per-project files.
// ============================================================

import { useState } from "react";
import { Icon } from "../../components/ui";

// ──────────────────────────────────────
// Section wrapper — collapsible terminal-style
// ──────────────────────────────────────
export function Section({ id, command, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="space-y-3" id={id}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-lg font-bold w-full text-left group"
        aria-expanded={open}
      >
        <span className="text-success">➜</span>
        <span className="text-text group-hover:text-text transition-colors">
          {command}
        </span>
        <Icon
          name={open ? "expand_more" : "chevron_right"}
          size="text-sm"
          className="text-comment"
        />
      </button>
      {open && (
        <div className="animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
          {children}
        </div>
      )}
    </section>
  );
}

// ──────────────────────────────────────
// CodeBlock — syntax-highlighted code panel
// ──────────────────────────────────────
export function CodeBlock({ lang, children, title }) {
  return (
    <div className="border border-border rounded-md overflow-hidden">
      {title && (
        <div className="bg-border/30 px-3 py-1.5 text-xs text-comment border-b border-border flex items-center gap-2">
          <span className="text-variable">{lang}</span>
          <span className="text-comment/50">—</span>
          <span>{title}</span>
        </div>
      )}
      <pre className="p-3 text-xs leading-relaxed overflow-x-auto bg-sidebar/30 scrollbar-thin">
        <code className="text-text">{children}</code>
      </pre>
    </div>
  );
}

// ──────────────────────────────────────
// DiagramView — Interactive / Static toggle
// ──────────────────────────────────────
export function DiagramView({ interactive, staticSrc, staticAlt }) {
  const [mode, setMode] = useState("interactive");
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-comment">View:</span>
        {["interactive", "static"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-xs px-2 py-1 rounded border transition-colors capitalize ${
              mode === m
                ? "border-accent text-accent bg-accent/10 font-bold"
                : "border-border text-comment hover:text-text hover:border-comment"
            }`}
          >
            {m === "interactive" ? "⚡ Interactive" : "🖼️ Static"}
          </button>
        ))}
      </div>
      {mode === "interactive" ? (
        interactive
      ) : (
        <div className="border border-border rounded-md overflow-hidden bg-sidebar/30">
          <div className="bg-border/30 px-3 py-1.5 text-xs text-comment border-b border-border flex items-center gap-2">
            <Icon name="image" size="text-[12px]" className="text-accent" />
            <span className="text-variable">{staticSrc.replace("/", "")}</span>
            <span className="text-comment/50">—</span>
            <span>{staticAlt}</span>
          </div>
          <div className="p-3 bg-bg">
            <img
              src={staticSrc}
              alt={staticAlt}
              className="w-full rounded border border-border/50 bg-sidebar"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
}
