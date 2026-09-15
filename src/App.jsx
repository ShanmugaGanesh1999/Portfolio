import { lazy, Suspense } from "react";
import { ThemeProvider } from "./hooks/useTheme";
import { WorkspaceProvider, useWorkspace } from "./workspace/WorkspaceContext";
import Layout from "./components/layout/Layout";
import { readSettings } from "./components/layout/Settings";

// Apply preferences before either shell renders, including direct Claude reloads.
const editorSettings = readSettings();
document.documentElement.dataset.motion = editorSettings.motion;
document.documentElement.style.setProperty("--editor-font-size", `${editorSettings.fontSize}px`);

// The Claude Code terminal loads on demand — first paint stays light,
// and each shell mounts fresh on every switch (nothing stacks).
const ClaudeShell = lazy(() => import("./shell/claude/ClaudeShell"));

function ShellLoading() {
  return (
    <div className="h-dvh flex items-center justify-center bg-bg">
      <div className="text-xs font-mono text-comment">loading shell…</div>
    </div>
  );
}

/** ShellRoot — renders the active interface shell over shared workspace state. */
function ShellRoot() {
  const ws = useWorkspace();
  return ws.state.shellMode === "claude" ? (
    <Suspense key="claude" fallback={<ShellLoading />}>
      <ClaudeShell />
    </Suspense>
  ) : (
    <Layout key="vscode" />
  );
}

/**
 * App — Root component.
 * ThemeProvider applies the persisted theme; WorkspaceProvider owns the
 * workspace state (tabs, panels, shell mode, hash routing); the active
 * shell (VS Code workspace or the Claude Code terminal) renders on top.
 */
export default function App() {
  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <ShellRoot />
      </WorkspaceProvider>
    </ThemeProvider>
  );
}
