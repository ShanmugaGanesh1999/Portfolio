// ============================================================
// AGENT PANE — Claude Code's parallel-agent full-screen view.
// When /open launches a project deep-dive, it takes over the
// terminal as a dedicated pane: agent-style header (back
// button, agent name — file, status dot) and the full project
// viewer at real size. Esc returns to the scrollback; the
// pane remembers its scroll position per tab.
// ============================================================

import { useEffect, useRef } from "react";
import EditorContent from "../../workspace/EditorContent";
import { makeTab, defaultPrepFile, PROJECT_TABS } from "../../workspace/registry";
import { useWorkspace } from "../../workspace/WorkspaceContext";

const paneScrollMemory = new Map(); // tabId → scrollTop

export default function AgentPane({ pane, onClose }) {
  const ws = useWorkspace();
  const tab = makeTab(pane.tabId);
  const bodyRef = useRef(null);

  const prepFile =
    tab?.kind === "prep"
      ? ws.state.prepFiles[tab.id.slice(5)] ?? defaultPrepFile(tab.id.slice(5))
      : null;
  const meta = tab?.kind === "project" ? PROJECT_TABS[tab.id] : null;

  // Restore remembered scroll; capture it on unmount.
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = paneScrollMemory.get(pane.tabId) ?? 0;
    return () => {
      if (el) paneScrollMemory.set(pane.tabId, el.scrollTop);
    };
  }, [pane.tabId]);

  // Esc closes the pane (highest priority in the terminal).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  if (!tab || tab.kind === "welcome") return null;

  return (
    <div className="flex-1 flex flex-col min-h-0" role="region" aria-label={`Agent pane — ${tab.title}`}>
      {/* Agent header */}
      <div className="h-10 shrink-0 flex items-center gap-2 px-2 sm:px-4 border-b border-border bg-sidebar">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs text-comment hover:text-accent transition-colors cursor-pointer shrink-0"
          aria-label="Back to terminal (Esc)"
          title="Back to terminal (Esc)"
        >
          <span aria-hidden="true">←</span>
          <span className="hidden sm:inline">esc</span>
        </button>
        <span className="w-px h-4 bg-border shrink-0" />
        <span className="text-accent text-sm shrink-0 select-none" aria-hidden="true">✳</span>
        <span className="text-xs truncate min-w-0">
          <span className="text-comment">{pane.agent}</span>
          <span className="text-comment/50"> — </span>
          <span className="text-text">{tab.title}</span>
        </span>
        <span className="ml-auto flex items-center gap-2 shrink-0 text-[10px] text-comment/70">
          {meta && <span className="hidden sm:inline">{meta.language}</span>}
          <span className="text-success" title="Agent finished">●</span>
          <span className="hidden xs:inline sm:inline">done</span>
        </span>
      </div>

      {/* Full-size viewer */}
      <div ref={bodyRef} className="flex-1 overflow-y-auto scrollbar-thin min-h-0">
        <div className="p-2 sm:p-6">
          <EditorContent
            tab={tab}
            prepFile={prepFile}
            onNavigatePrep={ws.openPrepFile}
            onBack={onClose}
          />
        </div>
      </div>
    </div>
  );
}
