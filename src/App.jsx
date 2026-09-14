import { lazy, Suspense } from "react";
import { ThemeProvider } from "./hooks/useTheme";
import { WorkspaceProvider, useWorkspace } from "./workspace/WorkspaceContext";
import Layout from "./components/layout/Layout";

// The Claude Code CLI shell loads on demand — first paint stays light.
const ClaudeShell = lazy(() => import("./shell/claude/ClaudeShell"));

function ShellLoading() {
  return (
    <div className="h-dvh flex items-center justify-center bg-bg">
      <div className="text-xs font-mono text-comment">
        <span className="text-accent">✳</span> booting shell…
      </div>
    </div>
  );
}

/** ShellRoot — renders the active interface shell over shared workspace state. */
function ShellRoot() {
  const ws = useWorkspace();
  return ws.state.shellMode === "claude" ? (
    <Suspense fallback={<ShellLoading />}>
      <ClaudeShell />
    </Suspense>
  ) : (
    <Layout />
  );
}

/**
 * App — Root component.
 * ThemeProvider applies the persisted theme; WorkspaceProvider owns the
 * workspace state (tabs, panels, shell mode, hash routing); the active
 * shell (VS Code workspace or Claude Code CLI) renders on top.
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
