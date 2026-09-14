// ============================================================
// SLASH MENU — Claude Code's filterable command popup.
// Renders above the prompt while the input starts with "/".
// Filtering happens in the prompt (shared with keyboard nav).
// ============================================================

import { useEffect, useRef } from "react";

export default function SlashMenu({ commands, activeIdx, onHover, onRun }) {
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  if (!commands.length) return null;

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-label="Slash commands"
      className="absolute bottom-full left-0 right-0 mb-1 max-h-[40vh] overflow-y-auto scrollbar-thin border border-border rounded-lg bg-sidebar shadow-xl shadow-black/30 z-30"
    >
      {commands.map((cmd, i) => {
        const active = i === activeIdx;
        return (
          <button
            key={cmd.name}
            role="option"
            aria-selected={active}
            data-active={active}
            onMouseEnter={() => onHover(i)}
            onClick={() => onRun(cmd)}
            className={`w-full flex items-baseline gap-3 px-3 py-2 text-left transition-colors ${
              active ? "bg-accent/10" : "hover:bg-border/30"
            }`}
          >
            <span
              className={`text-xs font-mono font-bold shrink-0 ${
                active ? "text-accent" : "text-text"
              }`}
            >
              /{cmd.name}
            </span>
            <span className="text-[11px] text-comment truncate">{cmd.description}</span>
          </button>
        );
      })}
    </div>
  );
}
