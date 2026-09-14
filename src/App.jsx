import { ThemeProvider } from "./hooks/useTheme";
import { WorkspaceProvider } from "./workspace/WorkspaceContext";
import Layout from "./components/layout/Layout";

/**
 * App — Root component.
 * ThemeProvider applies the persisted theme; WorkspaceProvider owns the
 * VS Code workspace state (tabs, panels, palette, hash routing); Layout
 * renders the shell (activity bar, explorer, editor tabs, terminal, status).
 */
export default function App() {
  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <Layout />
      </WorkspaceProvider>
    </ThemeProvider>
  );
}
