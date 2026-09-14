// ============================================================
// MODE SWITCHER — VS Code ⇄ Claude Code segmented control.
// Shared by both shells' headers so the toggle is always
// in the same place.
// ============================================================

import { useWorkspace } from "../../workspace/WorkspaceContext";

export default function ModeSwitcher({ compact = false }) {
  const ws = useWorkspace();
  const { shellMode } = ws.state;
  const isClaude = shellMode === "claude";

  return (
    <div
      role="radiogroup"
      aria-label="Interface mode"
      className="flex items-center rounded-md border border-border bg-bg/60 p-0.5 text-[10px] font-ui font-semibold select-none"
    >
      <button
        role="radio"
        aria-checked={!isClaude}
        aria-label="Switch to VS Code shell"
        onClick={() => ws.setShellMode("vscode")}
        title="Switch to the VS Code workspace"
        className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded transition-colors cursor-pointer ${
          !isClaude ? "bg-accent text-bg" : "text-comment hover:text-text"
        }`}
      >
        <span className="font-mono font-bold text-[11px] leading-none">{"{ }"}</span>
        {!compact && <span>VS Code</span>}
      </button>
      <button
        role="radio"
        aria-checked={isClaude}
        aria-label="Switch to Claude Code shell"
        onClick={() => ws.setShellMode("claude")}
        title="Switch to the Claude Code CLI"
        className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded transition-colors cursor-pointer ${
          isClaude ? "bg-accent text-bg" : "text-comment hover:text-text"
        }`}
      >
        <span className="text-[11px] leading-none">✳</span>
        {!compact && <span>Claude Code</span>}
      </button>
    </div>
  );
}
