import { Icon } from "../ui";

/**
 * StatusBar — Bottom VS Code-style status bar with Copilot toggle
 */
export default function StatusBar({ onToggleChat, chatOpen }) {
  return (
    <footer className="h-6 bg-accent text-bg px-3 flex items-center justify-between text-[10px] font-bold shrink-0">
      <div className="flex gap-4">
        <span>MASTER</span>
        <span className="hidden sm:inline">+ 14,302 lines</span>
        <span>UTF-8</span>
      </div>
      <div className="flex gap-4 items-center">
        <span>LF</span>
        <span className="hidden sm:inline">Python/Shell</span>
        <span>0:0:1</span>
        <button
          onClick={onToggleChat}
          className="flex items-center gap-1 hover:bg-white/20 px-1.5 py-0.5 -my-0.5 rounded transition-colors cursor-pointer"
          title={chatOpen ? "Close Copilot Chat" : "Open Copilot Chat"}
        >
          <Icon name="smart_toy" size="text-[13px]" />
          <span>Copilot</span>
        </button>
      </div>
    </footer>
  );
}
