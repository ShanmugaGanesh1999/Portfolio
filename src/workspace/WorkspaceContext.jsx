// ============================================================
// WORKSPACE CONTEXT — the VS Code workspace shell state.
// Owns tabs/panels/palette, hash routing (back button + deep
// links), per-tab UI state persistence, and the output log.
// ============================================================

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { workspaceReducer, initialState } from "./workspaceReducer";
import { WELCOME_TAB, hashForTab, parseHash, defaultPrepFile } from "./registry";

const WorkspaceContext = createContext(null);

/** Build the initial state from the current URL hash (deep-link support). */
function initFromHash() {
  const parsed = parseHash(window.location.hash);
  if (!parsed || parsed.id === "welcome") return initialState;
  const prepFiles =
    parsed.filePath && parsed.id.startsWith("prep:")
      ? { [parsed.id.slice(5)]: parsed.filePath }
      : {};
  // Re-run OPEN_TAB through the reducer to build the tab list properly.
  const base = {
    ...initialState,
    prepFiles,
    prepPanel: parsed.id.startsWith("prep:")
      ? { courseId: parsed.id.slice(5), visible: true }
      : initialState.prepPanel,
  };
  return workspaceReducer(base, { type: "OPEN_TAB", id: parsed.id });
}

export function WorkspaceProvider({ children }) {
  const [state, dispatch] = useReducer(workspaceReducer, undefined, initFromHash);

  // Always-fresh state for stable callbacks + external readers.
  // Updated in a passive effect (never during render).
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  // ── Output logging ──────────────────────────────────────────
  const log = useCallback((source, message) => {
    dispatch({
      type: "LOG",
      entry: {
        t: Date.now(),
        source,
        message: typeof message === "string" ? message : JSON.stringify(message),
      },
    });
  }, []);

  // ── Tab actions ─────────────────────────────────────────────
  const openTab = useCallback(
    (id) => {
      const cur = stateRef.current;
      const tab = cur.tabs.find((t) => t.id === id);
      if (tab && cur.activeTabId === id) return; // already active — no-op
      dispatch({ type: "OPEN_TAB", id });
      log("tabs", `opened ${id}`);
    },
    [log]
  );

  const closeTab = useCallback(
    (id) => {
      if (id === WELCOME_TAB.id) return;
      dispatch({ type: "CLOSE_TAB", id });
      log("tabs", `closed ${id}`);
    },
    [log]
  );

  const closeActiveTab = useCallback(() => {
    closeTab(stateRef.current.activeTabId);
  }, [closeTab]);

  const setActiveTab = useCallback((id) => {
    dispatch({ type: "SET_ACTIVE_TAB", id });
  }, []);

  const cycleTab = useCallback((delta) => {
    dispatch({ type: "CYCLE_TAB", delta });
  }, []);

  const closeAllTabs = useCallback(() => {
    dispatch({ type: "CLOSE_ALL_TABS" });
    log("tabs", "closed all editor tabs");
  }, [log]);

  const openPrepFile = useCallback(
    (courseId, filePath) => {
      dispatch({ type: "OPEN_PREP_FILE", courseId, filePath });
      log("prep", `opened ${courseId}:/${filePath}`);
    },
    [log]
  );

  const updateTabState = useCallback((id, patch) => {
    dispatch({ type: "UPDATE_TAB_STATE", id, patch });
  }, []);

  const getTabState = useCallback(
    (id) => stateRef.current.tabState[id] ?? {},
    []
  );

  // ── Panel actions ───────────────────────────────────────────
  const setExplorer = useCallback((open) => {
    dispatch({ type: "SET_EXPLORER", open });
  }, []);
  const toggleExplorer = useCallback(() => dispatch({ type: "SET_EXPLORER" }), []);

  const setMobileDrawer = useCallback((open) => {
    dispatch({ type: "SET_DRAWER", open });
  }, []);
  const toggleMobileDrawer = useCallback(() => dispatch({ type: "SET_DRAWER" }), []);

  const setChat = useCallback(
    (open) => {
      dispatch({ type: "SET_CHAT", open });
      log("copilot", `${open ?? !stateRef.current.chatOpen ? "opened" : "closed"} chat panel`);
    },
    [log]
  );
  const toggleChat = useCallback(() => dispatch({ type: "SET_CHAT" }), []);

  const setPanel = useCallback((open, view) => {
    dispatch({ type: "SET_PANEL", open, view });
  }, []);
  const togglePanel = useCallback(
    (view) => {
      dispatch({ type: "SET_PANEL", view });
      log("panel", `toggled ${view ?? stateRef.current.panelView} panel`);
    },
    [log]
  );

  const openPalette = useCallback((mode = "files", query = "") => {
    dispatch({ type: "SET_PALETTE", open: true, mode, query });
  }, []);
  const closePalette = useCallback(() => {
    dispatch({ type: "SET_PALETTE", open: false });
  }, []);

  // ── Shell mode (VS Code ⇄ Claude Code) ──────────────────────
  const setShellMode = useCallback(
    (mode) => {
      const next = mode === "claude" ? "claude" : "vscode";
      if (stateRef.current.shellMode === next) return;
      // Crossfade the palette swap like the theme transition.
      const root = document.documentElement;
      root.classList.add("theme-transition");
      window.setTimeout(() => root.classList.remove("theme-transition"), 250);
      try {
        localStorage.setItem("sg-shell", next);
      } catch {
        /* private mode */
      }
      dispatch({ type: "SET_SHELL", mode: next });
      log("shell", `switched to ${next === "claude" ? "Claude Code" : "VS Code"} shell`);
    },
    [log]
  );

  // Reflect the shell on <html> for CSS token scoping.
  useEffect(() => {
    document.documentElement.setAttribute("data-shell", state.shellMode);
  }, [state.shellMode]);

  const openPrepPanel = useCallback(
    (courseId) => {
      const file = stateRef.current.prepFiles[courseId] ?? defaultPrepFile(courseId);
      dispatch({ type: "OPEN_PREP_FILE", courseId, filePath: file });
      log("prep", `opened course panel ${courseId}`);
    },
    [log]
  );
  const closePrepPanel = useCallback(() => {
    dispatch({ type: "SET_PREP_PANEL", courseId: null, visible: false });
  }, []);

  const togglePrepPanel = useCallback(() => {
    const cur = stateRef.current;
    if (cur.prepPanel.courseId) {
      dispatch({
        type: "SET_PREP_PANEL",
        visible: !cur.prepPanel.visible,
      });
    } else {
      // No course open yet — help the user pick one via the palette.
      dispatch({ type: "SET_PALETTE", open: true, mode: "files", query: "prep" });
    }
  }, []);

  // ── Section scrolling (Welcome tab) ─────────────────────────
  // Layout registers the implementation; consumers call scrollToSection.
  const scrollToSectionRef = useRef(null);
  const registerScrollToSection = useCallback((fn) => {
    scrollToSectionRef.current = fn;
  }, []);
  const scrollToSection = useCallback((sectionId) => {
    scrollToSectionRef.current?.(sectionId);
  }, []);

  // ── Editor scroll events (StatusBar Ln/Col) ─────────────────
  const scrollListenersRef = useRef(new Set());
  const subscribeEditorScroll = useCallback((fn) => {
    scrollListenersRef.current.add(fn);
    return () => scrollListenersRef.current.delete(fn);
  }, []);
  const notifyEditorScroll = useCallback((info) => {
    scrollListenersRef.current.forEach((fn) => fn(info));
  }, []);

  const editorScrollRef = useRef(null);

  // ── Hash routing ────────────────────────────────────────────
  // Push a history entry whenever the active tab (or prep file) changes.
  useEffect(() => {
    const desired = hashForTab(state.activeTabId, state.prepFiles);
    if (window.location.hash !== desired) {
      window.history.pushState(null, "", desired);
    }
  }, [state.activeTabId, state.prepFiles]);

  // Back/forward: re-activate whatever tab the hash points at.
  useEffect(() => {
    const onPopState = () => {
      const parsed = parseHash(window.location.hash);
      if (!parsed) return;
      if (parsed.filePath) {
        dispatch({
          type: "OPEN_PREP_FILE",
          courseId: parsed.id.slice(5),
          filePath: parsed.filePath,
        });
      } else {
        dispatch({ type: "OPEN_TAB", id: parsed.id });
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const value = useMemo(
    () => ({
      state,
      stateRef,
      // tabs
      openTab,
      closeTab,
      closeActiveTab,
      setActiveTab,
      cycleTab,
      closeAllTabs,
      openPrepFile,
      updateTabState,
      getTabState,
      // panels
      setExplorer,
      toggleExplorer,
      setMobileDrawer,
      toggleMobileDrawer,
      setChat,
      toggleChat,
      setPanel,
      togglePanel,
      openPalette,
      closePalette,
      setShellMode,
      openPrepPanel,
      closePrepPanel,
      togglePrepPanel,
      // scrolling
      scrollToSection,
      registerScrollToSection,
      subscribeEditorScroll,
      notifyEditorScroll,
      editorScrollRef,
      // log
      log,
    }),
    [
      state,
      openTab, closeTab, closeActiveTab, setActiveTab, cycleTab, closeAllTabs,
      openPrepFile, updateTabState, getTabState,
      setExplorer, toggleExplorer, setMobileDrawer, toggleMobileDrawer,
      setChat, toggleChat, setPanel, togglePanel,
      openPalette, closePalette, setShellMode, openPrepPanel, closePrepPanel, togglePrepPanel,
      scrollToSection, registerScrollToSection, subscribeEditorScroll,
      notifyEditorScroll, log,
    ]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- context + hook co-located by design
export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  return ctx;
}
