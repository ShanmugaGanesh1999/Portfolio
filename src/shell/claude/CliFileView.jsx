// ============================================================
// CLI FILE VIEW — a "⎿ Read(...)" result embedding the real
// project/prep viewer inside the terminal scrollback. Reuses
// EditorContent (lazy project views + prep reader); everything
// restyles automatically via the claude terminal tokens.
// ============================================================

import EditorContent from "../../workspace/EditorContent";
import { makeTab, defaultPrepFile, PROJECT_TABS } from "../../workspace/registry";
import { useWorkspace } from "../../workspace/WorkspaceContext";

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
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: 4,
        overflow: "hidden",
        background: "var(--color-bg)",
        margin: "4px 0 8px",
        maxWidth: 900,
      }}
    >
      {/* File header */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 10px", background: "var(--color-sidebar)",
          borderBottom: "1px solid var(--color-border)",
          fontSize: "0.82em", color: "var(--color-comment)",
        }}
      >
        <span style={{ color: "var(--color-success)" }}>●</span>
        <span style={{ color: "var(--color-text)", fontWeight: 600 }}>{tab.title}</span>
        {meta && <span style={{ color: "var(--ct-faint)" }}>· {meta.language}</span>}
        <span style={{ marginLeft: "auto", color: "var(--ct-faint)", fontSize: "0.85em" }}>
          {tab.kind === "prep" ? "prep reader" : "system design deep dive"}
        </span>
      </div>

      {/* Embedded viewer */}
      <div style={{ padding: 10, maxHeight: "60vh", overflowY: "auto" }} className="ct-viewport">
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
