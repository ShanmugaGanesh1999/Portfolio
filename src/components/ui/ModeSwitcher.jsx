// ============================================================
// MODE SWITCHER — VS Code ⇄ Claude Code ⇄ Codex segmented
// control. Shared by all three shells' headers so the toggle
// is always in the same place.
// ============================================================

import { useWorkspace } from "../../workspace/WorkspaceContext";

const SHELLS = [
  {
    id: "vscode",
    label: "VS Code",
    glyph: "{ }",
    mono: true,
    ariaLabel: "Switch to VS Code shell",
    title: "Switch to the VS Code workspace",
  },
  {
    id: "claude",
    label: "Claude Code",
    glyph: "✳",
    mono: false,
    ariaLabel: "Switch to Claude Code shell",
    title: "Switch to the Claude Code CLI",
  },
  {
    id: "codex",
    label: "Codex",
    glyph: ">_",
    mono: true,
    ariaLabel: "Switch to Codex shell",
    title: "Switch to the OpenAI Codex CLI",
  },
];

export default function ModeSwitcher({ compact = false }) {
  const ws = useWorkspace();
  const { shellMode } = ws.state;

  return (
    <div
      role="radiogroup"
      aria-label="Interface mode"
      className="flex items-center rounded-md border border-border bg-bg/60 p-0.5 text-[10px] font-ui font-semibold select-none"
    >
      {SHELLS.map((shell) => {
        const active = shellMode === shell.id;
        return (
          <button
            key={shell.id}
            role="radio"
            aria-checked={active}
            aria-label={shell.ariaLabel}
            onClick={() => ws.setShellMode(shell.id)}
            title={shell.title}
            className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded transition-colors cursor-pointer ${
              active ? "bg-accent text-bg" : "text-comment hover:text-text"
            }`}
          >
            <span
              className={`leading-none ${shell.mono ? "font-mono font-bold" : ""} text-[11px]`}
            >
              {shell.glyph}
            </span>
            {!compact && <span>{shell.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
