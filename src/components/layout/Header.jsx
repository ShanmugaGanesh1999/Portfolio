import { Icon } from "../ui";
import Settings from "./Settings";
import ModeSwitcher from "../ui/ModeSwitcher";
import { useWorkspace } from "../../workspace/WorkspaceContext";

/**
 * Header — Cursor-style title bar: traffic lights, a centered
 * Command Center pill (opens the command palette), and the
 * shell switcher on the right.
 */
export default function Header() {
  const ws = useWorkspace();
  const mac = /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <header className="h-10 border-b border-border flex items-center px-2 sm:px-4 justify-between gap-2 bg-sidebar shrink-0">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex-1 flex justify-center min-w-0">
          <button
            onClick={() => ws.openPalette("files")}
            className="flex items-center gap-2 h-7 px-3 rounded-md border border-border bg-bg/60 text-xs text-comment hover:text-text hover:border-comment/40 transition-colors max-w-[420px] w-full justify-center"
            title={`Quick Open (${mac ? "⌘P" : "Ctrl+P"})`}
            aria-label="Command Center — open search"
          >
            <Icon name="search" size="text-[13px]" />
            <span className="truncate">portfolio</span>
            <span className="text-comment/60 hidden sm:inline">— Cursor</span>
            <kbd className="text-[9px] text-comment/50 border border-border rounded px-1 hidden md:inline">
              {mac ? "⌘P" : "Ctrl+P"}
            </kbd>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Settings />
        <ModeSwitcher compact />
      </div>
    </header>
  );
}
