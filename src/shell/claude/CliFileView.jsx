// ============================================================
// CLI FILE VIEW — a bordered "file opened" panel in the
// scrollback that embeds the real project/prep viewer.
// Reuses EditorContent (lazy project views + prep reader);
// everything restyles automatically via the claude tokens.
// ============================================================

import EditorContent from "../../workspace/EditorContent";
import { makeTab, defaultPrepFile } from "../../workspace/registry";
import { useWorkspace } from "../../workspace/WorkspaceContext";
import { PROJECT_TABS } from "../../workspace/registry";

/**
 * @param {string} tabId  project id or "prep:<courseId>"
 */
export default function CliFileView({ tabId }) {
  const ws = useWorkspace();
  const tab = makeTab(tabId);
  if (!tab || tab.kind === "welcome") return null;

  const prepFile =
    tab.kind === "prep"
      ? ws.state.prepFiles[tab.id.slice(5)] ?? defaultPrepFile(tab.id.slice(5))
      : null;

  const meta = tab.kind === "project" ? PROJECT_TABS[tab.id] : null;

  return (
    <div className="border border-border rounded-md overflow-hidden bg-bg/40 my-1">
      {/* File header */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-sidebar/60 border-b border-border text-xs font-mono">
        <span className="text-comment/60">⏺</span>
        <span className="text-text font-semibold">{tab.title}</span>
        {meta && <span className="text-comment/60">· {meta.language}</span>}
        <span className="ml-auto text-comment/60 text-[10px]">
          {tab.kind === "prep" ? "prep reader" : "system design deep dive"}
        </span>
      </div>

      {/* Embedded viewer */}
      <div className="p-2 sm:p-4 max-h-[70vh] overflow-y-auto scrollbar-thin">
        <EditorContent
          tab={tab}
          prepFile={prepFile}
          onNavigatePrep={ws.openPrepFile}
          onBack={() => {}}
        />
      </div>
    </div>
  );
}
