// ============================================================
// GLOBAL KEYBOARD SHORTCUTS — VS Code style
//   Cmd/Ctrl+K        → Command palette (files mode)
//   Cmd/Ctrl+Shift+P  → Command palette (commands mode)
//   Cmd/Ctrl+B        → Toggle explorer (desktop) / drawer (mobile)
//   Cmd/Ctrl+J        → Toggle bottom panel
//   Ctrl+`            → Toggle terminal
//   Alt+Left/Right    → Cycle editor tabs
//   Escape            → Close topmost overlay (palette → drawer → chat)
// ============================================================

import { useEffect, useRef } from "react";
import { useWorkspace } from "./WorkspaceContext";

function isTypingTarget(target) {
  if (!target || !(target instanceof Element)) return false;
  return Boolean(
    target.closest('input, textarea, select, [contenteditable="true"]')
  );
}

export function useGlobalShortcuts() {
  const ws = useWorkspace();

  // Keep the latest workspace object without re-binding the listener.
  const wsRef = useRef(ws);
  useEffect(() => {
    wsRef.current = ws;
  });

  useEffect(() => {
    const onKeyDown = (e) => {
      const workspace = wsRef.current;
      const mod = e.metaKey || e.ctrlKey;

      // The Claude Code shell owns its keyboard surface (its prompt handles
      // Esc/slash/history). VS Code shortcuts don't apply there.
      if (workspace.state.shellMode === "claude") return;

      // Escape closes the topmost overlay (works even while typing).
      if (e.key === "Escape") {
        const s = workspace.state;
        if (s.paletteOpen) {
          workspace.closePalette();
          e.preventDefault();
        } else if (s.mobileDrawerOpen) {
          workspace.setMobileDrawer(false);
          e.preventDefault();
        } else if (s.chatOpen) {
          workspace.setChat(false);
          e.preventDefault();
        }
        return;
      }

      if (isTypingTarget(e.target)) return;

      if (mod && e.key.toLowerCase() === "k" && !e.shiftKey) {
        e.preventDefault();
        workspace.openPalette("files");
      } else if (mod && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        workspace.openPalette("commands");
      } else if (mod && e.key.toLowerCase() === "b") {
        e.preventDefault();
        if (window.matchMedia("(min-width: 768px)").matches) {
          workspace.toggleExplorer();
        } else {
          workspace.toggleMobileDrawer();
        }
      } else if (mod && e.key.toLowerCase() === "j") {
        e.preventDefault();
        workspace.togglePanel();
      } else if (e.ctrlKey && !e.metaKey && e.key === "`") {
        e.preventDefault();
        workspace.togglePanel("terminal");
      } else if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        workspace.cycleTab(-1);
      } else if (e.altKey && e.key === "ArrowRight") {
        e.preventDefault();
        workspace.cycleTab(1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
