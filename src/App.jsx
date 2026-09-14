import { lazy, Suspense } from "react";
import { ThemeProvider } from "./hooks/useTheme";
import { WorkspaceProvider, useWorkspace } from "./workspace/WorkspaceContext";
import Layout from "./components/layout/Layout";

// The CLI shells load on demand — first paint stays light, and each
// shell mounts fresh on every switch (keyed remount, nothing stacks).
const ClaudeShell = lazy(() => import("./shell/claude/ClaudeShell"));
const CodexShell = lazy(() => import("./shell/codex/CodexShell"));

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
  const { shellMode } = ws.state;

  // key={shellMode} guarantees a fresh mount (fresh scrollback, fresh
  // timers) whenever the visitor switches interfaces — the previous
  // shell is fully unmounted, so nothing accumulates in the DOM.
  if (shellMode === "claude") {
    return (
      <Suspense key="claude" fallback={<ShellLoading />}>
        <ClaudeShell />
      </Suspense>
    );
  }
  if (shellMode === "codex") {
    return (
      <Suspense key="codex" fallback={<ShellLoading />}>
        <CodexShell />
      </Suspense>
    );
  }
  return <Layout key="vscode" />;
}

/**
 * App — Root component.
 * ThemeProvider applies the persisted theme; WorkspaceProvider owns the
 * workspace state (tabs, panels, shell mode, hash routing); the active
 * shell (VS Code workspace, Claude Code CLI, or Codex CLI) renders on top.
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
