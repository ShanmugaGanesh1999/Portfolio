// ============================================================
// WORKSPACE REDUCER — VS Code workspace state
// Tabs, panels, palette, per-tab state cache, output log.
// Pure reducer: timestamps are added by action creators, not here.
// ============================================================

import { WELCOME_TAB, makeTab, defaultPrepFile } from "./registry";

const MAX_LOG_ENTRIES = 200;

function readInitialShell() {
  try {
    return localStorage.getItem("sg-shell") === "claude" ? "claude" : "vscode";
  } catch {
    return "vscode";
  }
}

export const initialState = {
  shellMode: readInitialShell(), // 'vscode' | 'claude'
  tabs: [WELCOME_TAB],
  activeTabId: WELCOME_TAB.id,
  prepFiles: {}, // courseId → filePath
  tabState: {},  // tabId → { scrollY, ... } persisted per-tab UI state
  explorerOpen: true,
  mobileDrawerOpen: false,
  chatOpen: false,
  panelOpen: false,
  panelView: "terminal", // 'terminal' | 'output'
  paletteOpen: false,
  paletteMode: "files", // 'files' | 'commands'
  paletteQuery: "",
  inlineBarOpen: false, // Cursor Ctrl+K inline AI bar (vscode shell only)
  prepPanel: { courseId: null, visible: true },
  outputLog: [],
};

function upsertTab(tabs, tab) {
  return tabs.some((t) => t.id === tab.id) ? tabs : [...tabs, tab];
}

function closeTab(tabs, id) {
  const idx = tabs.findIndex((t) => t.id === id);
  if (idx === -1 || tabs[idx].closable === false) return { tabs, activeTabId: null };
  const next = tabs.filter((t) => t.id !== id);
  // VS Code behavior: activate the left neighbor, else the right neighbor.
  const neighbor = next[Math.max(0, idx - 1)] ?? next[0] ?? WELCOME_TAB;
  return { tabs: next, activeTabId: neighbor.id };
}

export function workspaceReducer(state, action) {
  switch (action.type) {
    case "OPEN_TAB": {
      const tab = makeTab(action.id);
      if (!tab) return state;
      let prepFiles = state.prepFiles;
      if (tab.kind === "prep") {
        const courseId = tab.id.slice(5);
        if (!prepFiles[courseId]) {
          prepFiles = { ...prepFiles, [courseId]: defaultPrepFile(courseId) };
        }
      }
      return {
        ...state,
        tabs: upsertTab(state.tabs, tab),
        activeTabId: tab.id,
        prepFiles,
        mobileDrawerOpen: false,
      };
    }

    case "CLOSE_TAB": {
      const result = closeTab(state.tabs, action.id);
      if (!result.activeTabId) return state;
      const tabState = { ...state.tabState };
      delete tabState[action.id];
      return { ...state, ...result, tabState };
    }

    case "CLOSE_ALL_TABS":
      return {
        ...state,
        tabs: [WELCOME_TAB],
        activeTabId: WELCOME_TAB.id,
        tabState: { welcome: state.tabState[WELCOME_TAB.id] },
      };

    case "SET_ACTIVE_TAB": {
      if (!state.tabs.some((t) => t.id === action.id)) return state;
      return { ...state, activeTabId: action.id };
    }

    case "CYCLE_TAB": {
      const idx = state.tabs.findIndex((t) => t.id === state.activeTabId);
      if (idx === -1 || state.tabs.length < 2) return state;
      const next =
        (idx + action.delta + state.tabs.length) % state.tabs.length;
      return { ...state, activeTabId: state.tabs[next].id };
    }

    case "OPEN_PREP_FILE": {
      const { courseId, filePath } = action;
      const tab = makeTab(`prep:${courseId}`);
      if (!tab) return state;
      return {
        ...state,
        tabs: upsertTab(state.tabs, tab),
        activeTabId: tab.id,
        prepFiles: { ...state.prepFiles, [courseId]: filePath },
        prepPanel: { courseId, visible: true },
        mobileDrawerOpen: false,
      };
    }

    case "UPDATE_TAB_STATE":
      return {
        ...state,
        tabState: {
          ...state.tabState,
          [action.id]: { ...state.tabState[action.id], ...action.patch },
        },
      };

    case "SET_EXPLORER":
      return { ...state, explorerOpen: action.open ?? !state.explorerOpen };

    case "SET_DRAWER":
      return { ...state, mobileDrawerOpen: action.open ?? !state.mobileDrawerOpen };

    case "SET_CHAT":
      return { ...state, chatOpen: action.open ?? !state.chatOpen };

    case "SET_PANEL": {
      const open = action.open ?? !state.panelOpen;
      return {
        ...state,
        panelOpen: open,
        panelView: action.view ?? state.panelView,
      };
    }

    case "SET_SHELL":
      return { ...state, shellMode: action.mode === "claude" ? "claude" : "vscode" };

    case "SET_PALETTE": {
      const open = action.open ?? !state.paletteOpen;
      return {
        ...state,
        paletteOpen: open,
        paletteMode: action.mode ?? state.paletteMode,
        paletteQuery: action.query ?? "",
      };
    }

    case "SET_INLINE_BAR":
      return { ...state, inlineBarOpen: action.open ?? !state.inlineBarOpen };

    case "SET_PREP_PANEL": {
      const courseId =
        action.courseId !== undefined ? action.courseId : state.prepPanel.courseId;
      const visible = action.visible ?? state.prepPanel.visible;
      return { ...state, prepPanel: { courseId, visible } };
    }

    case "LOG": {
      const outputLog = [...state.outputLog, action.entry];
      if (outputLog.length > MAX_LOG_ENTRIES) {
        outputLog.splice(0, outputLog.length - MAX_LOG_ENTRIES);
      }
      return { ...state, outputLog };
    }

    default:
      return state;
  }
}
