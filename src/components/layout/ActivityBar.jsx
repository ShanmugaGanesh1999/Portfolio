// ============================================================
// ACTIVITY BAR — the VS Code leftmost icon rail.
// Explorer / Search / Prep / Copilot / Terminal + settings & theme.
// Desktop only (≥ md); mobile keeps the compact MobileNav bar.
// ============================================================

import { Icon } from "../ui";
import { useWorkspace } from "../../workspace/WorkspaceContext";
import { useTheme } from "../../hooks/useTheme";

function ActivityButton({ icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`relative w-12 h-12 flex items-center justify-center transition-colors ${
        active ? "text-accent" : "text-comment hover:text-text"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-accent rounded-r" />
      )}
      <Icon name={icon} size="text-[20px]" />
    </button>
  );
}

export default function ActivityBar() {
  const ws = useWorkspace();
  const { theme, toggle } = useTheme();
  const { explorerOpen, chatOpen, panelOpen, prepPanel } = ws.state;

  return (
    <div
      role="navigation"
      aria-label="Activity bar"
      className="hidden md:flex flex-col items-center w-12 bg-sidebar border-r border-border shrink-0"
    >
      <ActivityButton
        icon="files"
        label="Toggle Explorer (Ctrl+B)"
        active={explorerOpen}
        onClick={ws.toggleExplorer}
      />
      <ActivityButton
        icon="search"
        label="Search Files (Ctrl+K)"
        onClick={() => ws.openPalette("files")}
      />
      <ActivityButton
        icon="menu_book"
        label="Prep Courses"
        active={Boolean(prepPanel.courseId && prepPanel.visible)}
        onClick={ws.togglePrepPanel}
      />
      <ActivityButton
        icon="smart_toy"
        label="Copilot Chat"
        active={chatOpen}
        onClick={ws.toggleChat}
      />
      <ActivityButton
        icon="terminal"
        label="Toggle Terminal (Ctrl+`)"
        active={panelOpen}
        onClick={() => ws.togglePanel("terminal")}
      />

      <div className="mt-auto flex flex-col items-center">
        <ActivityButton
          icon="settings"
          label="Command Palette (Ctrl+Shift+P)"
          onClick={() => ws.openPalette("commands")}
        />
        <ActivityButton
          icon={theme === "dark" ? "light_mode" : "dark_mode"}
          label={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
          onClick={toggle}
        />
      </div>
    </div>
  );
}
