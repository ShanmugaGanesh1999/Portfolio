// ============================================================
// STATUS BAR — VS Code-style bottom bar (dark and light themes).
// Left: remote badge, branch, errors/warnings, session timer.
// Right: Ln (from editor scroll), Spaces, encoding, language mode,
// terminal + copilot toggles. Visible on mobile with compact items.
// ============================================================

import { useState, useEffect } from "react";
import { Icon } from "../ui";
import { useWorkspace } from "../../workspace/WorkspaceContext";

function formatSession(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function StatusButton({ icon, label, active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`flex items-center gap-1 px-1.5 py-0.5 -my-0.5 rounded transition-colors ${
        active ? "bg-white/25" : "hover:bg-white/20"
      }`}
    >
      {icon && <Icon name={icon} size="text-[13px]" />}
      {children}
    </button>
  );
}

export default function StatusBar() {
  const ws = useWorkspace();
  const { tabs, activeTabId, panelOpen, panelView, chatOpen } = ws.state;
  const activeTab = tabs.find((t) => t.id === activeTabId);

  // Session timer — local state so only this small component re-renders.
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - start) / 1000)),
      1000
    );
    return () => clearInterval(id);
  }, []);

  // Line number tracks the editor's scroll position.
  const [ln, setLn] = useState(1);
  useEffect(
    () => ws.subscribeEditorScroll(({ scrollTop }) => setLn(1 + Math.round(scrollTop / 24))),
    [ws]
  );

  return (
    <footer className="h-6 bg-accent text-bg flex items-center justify-between text-[10px] font-bold shrink-0 px-1 sm:px-2 select-none gap-1">
      {/* Left cluster */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <StatusButton
          icon="terminal"
          label="Command Palette (Ctrl+Shift+P)"
          onClick={() => ws.openPalette("commands")}
        >
          <span className="hidden sm:inline">SG-SYS</span>
        </StatusButton>
        <span className="flex items-center gap-1" title="Source control: master">
          <Icon name="account_tree" size="text-[12px]" />
          master
        </span>
        <span className="hidden md:flex items-center gap-2" title="No problems detected">
          <span className="flex items-center gap-0.5">
            <Icon name="error" size="text-[12px]" /> 0
          </span>
          <span className="flex items-center gap-0.5">
            <Icon name="warning" size="text-[12px]" /> 0
          </span>
        </span>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden sm:inline" title="Editor position">
          Ln {ln}, Col 1
        </span>
        <span className="hidden lg:inline">Spaces: 2</span>
        <span className="hidden lg:inline">UTF-8</span>
        <span className="hidden xl:inline">LF</span>
        <span title="Language mode">{activeTab?.language ?? "Markdown"}</span>
        <span className="hidden sm:inline" title="Session uptime">
          {formatSession(elapsed)}
        </span>
        <StatusButton
          icon="bolt"
          label="Cursor Tab — AI completions active"
          onClick={() => ws.log("ai", "Cursor Tab snoozed for this session")}
        >
          <span className="hidden sm:inline">Cursor Tab</span>
        </StatusButton>
        <StatusButton
          icon="terminal"
          label="Toggle Terminal (Ctrl+`)"
          active={panelOpen && panelView === "terminal"}
          onClick={() => ws.setPanel(!(panelOpen && panelView === "terminal"), "terminal")}
        />
        <StatusButton
          icon="chat_bubble"
          label={chatOpen ? "Close Chat (Ctrl+L)" : "Open Chat (Ctrl+L)"}
          active={chatOpen}
          onClick={ws.toggleChat}
        />
      </div>
    </footer>
  );
}
