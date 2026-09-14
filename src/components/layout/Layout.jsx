// ============================================================
// LAYOUT — the VS Code application shell.
//   Header → ActivityBar | Explorer | PrepPanel | Editor(tabs,
//   breadcrumbs, main) | Copilot → Panel(terminal/output) →
//   StatusBar. Mobile swaps Explorer for a drawer + MobileNav.
// ============================================================

import {
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import PrepTabBar from "./PrepTabBar";
import MobilePrepBar from "./MobilePrepBar";
import MobileNav from "./MobileNav";
import ActivityBar from "./ActivityBar";
import TabStrip from "./TabStrip";
import Breadcrumbs from "./Breadcrumbs";
import StatusBar from "./StatusBar";
import Panel from "./Panel";
import CommandPalette from "./CommandPalette";
import CopilotChat from "../chat/CopilotChat";
import { ResizeHandle } from "../ui";
import usePanelResize from "../../hooks/usePanelResize";
import useMediaQuery from "../../hooks/useMediaQuery";
import useScrollSpy from "../../hooks/useScrollSpy";
import { useWorkspace } from "../../workspace/WorkspaceContext";
import { useGlobalShortcuts } from "../../workspace/useGlobalShortcuts";
import { SECTION_IDS } from "../../workspace/registry";
import EditorContent from "../../workspace/EditorContent";
import { PREP_COURSES } from "../../prep/prepData";

export default function Layout() {
  const ws = useWorkspace();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  useGlobalShortcuts();
  const { state } = ws;

  const activeTab = state.tabs.find((t) => t.id === state.activeTabId);
  const activePrepCourseId = activeTab?.kind === "prep" ? activeTab.id.slice(5) : null;
  const prepFile = activePrepCourseId
    ? state.prepFiles[activePrepCourseId] ?? null
    : null;
  const activePrepCourse = activePrepCourseId
    ? PREP_COURSES.find((c) => c.id === activePrepCourseId)
    : null;

  // Scroll-spy drives the active section marker on the Welcome tab.
  const activeSection = useScrollSpy(SECTION_IDS);

  // Copilot panel resize (desktop only).
  const chat = usePanelResize({
    axis: "x",
    invert: true,
    defaultSize: 420,
    minSize: 320,
    maxSize: 800,
    collapseBelow: 220,
    onCollapse: () => ws.setChat(false),
  });

  // ── Editor content ──────────────────────────────────────────
  // Memoized on the tab + prep file so unrelated workspace changes
  // (panel toggles, log entries) never re-render the document tree.
  const content = useMemo(
    () => (
      <EditorContent
        tab={activeTab}
        prepFile={prepFile}
        onNavigatePrep={ws.openPrepFile}
        onBack={ws.closeActiveTab}
      />
    ),
    // Deliberately key on the tab *id*, not the tab object, so workspace
    // state changes (panels, log) never re-render the document tree.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeTab?.id, prepFile, ws.openPrepFile, ws.closeActiveTab]
  );

  const mainRef = ws.editorScrollRef;

  // ── Editor scroll events → StatusBar (rAF throttled) ────────
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        ws.notifyEditorScroll({ scrollTop: el.scrollTop });
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Per-tab scroll persistence ──────────────────────────────
  const prevTabIdRef = useRef(state.activeTabId);
  useLayoutEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const prev = prevTabIdRef.current;
    if (prev !== state.activeTabId) {
      ws.updateTabState(prev, { scrollY: el.scrollTop });
      const saved = ws.getTabState(state.activeTabId);
      prevTabIdRef.current = state.activeTabId;
      el.scrollTop = saved.scrollY ?? 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeTabId]);

  // ── Section scrolling (Welcome tab) ─────────────────────────
  const pendingSectionRef = useRef(null);

  const doScroll = useCallback((sectionId) => {
    const el = mainRef.current;
    const target = document.getElementById(sectionId);
    if (!el || !target) return;
    const top =
      target.getBoundingClientRect().top -
      el.getBoundingClientRect().top +
      el.scrollTop -
      8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After switching back to the Welcome tab, scroll to the requested section.
  useLayoutEffect(() => {
    if (pendingSectionRef.current && state.activeTabId === "welcome") {
      const id = pendingSectionRef.current;
      pendingSectionRef.current = null;
      requestAnimationFrame(() => doScroll(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeTabId]);

  // Register the implementation once; consumers call ws.scrollToSection(id).
  useEffect(() => {
    ws.registerScrollToSection((sectionId) => {
      if (ws.stateRef.current.activeTabId !== "welcome") {
        pendingSectionRef.current = sectionId;
        ws.setActiveTab("welcome");
      } else {
        doScroll(sectionId);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-dvh flex flex-col">
      <Header />

      {/* Mobile navigation bar */}
      {!isDesktop && (
        <MobileNav
          activeSection={activeTab?.kind === "welcome" ? activeSection : null}
        />
      )}

      {/* Mobile prep bar — shown while a prep tab is active */}
      {!isDesktop && activePrepCourse && (
        <MobilePrepBar course={activePrepCourse} activePath={prepFile} />
      )}

      <div className="flex flex-1 overflow-hidden min-h-0">
        <ActivityBar />

        {/* Mobile drawer backdrop */}
        {!isDesktop && state.mobileDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => ws.setMobileDrawer(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar — single instance: static column on desktop, drawer on mobile */}
        {(!isDesktop || state.explorerOpen) && (
          <div
            className={
              isDesktop
                ? "relative shrink-0"
                : `fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-out ${
                    state.mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
                  }`
            }
          >
            <Sidebar variant={isDesktop ? "desktop" : "mobile"} />
          </div>
        )}

        {/* Prep side panel (desktop) */}
        {isDesktop && state.prepPanel.courseId && state.prepPanel.visible && (
          <PrepTabBar
            courseId={state.prepPanel.courseId}
            activePath={state.prepFiles[state.prepPanel.courseId]}
          />
        )}

        {/* Editor column */}
        <div
          id="editor-pane"
          role="tabpanel"
          aria-labelledby={`tab-${state.activeTabId}`}
          className="flex-1 flex flex-col min-w-0"
        >
          <TabStrip />
          <Breadcrumbs />
          <main
            ref={mainRef}
            tabIndex={-1}
            className={`flex-1 overflow-y-auto scroll-smooth min-h-0 ${
              activePrepCourse
                ? "px-3 pb-4 sm:px-6 sm:pb-6"
                : "p-3 space-y-8 sm:p-6 sm:space-y-12"
            }`}
          >
            {content}
          </main>
        </div>

        {/* Copilot panel — inline pane on desktop, overlay on mobile */}
        {state.chatOpen && (
          <div
            className={
              isDesktop
                ? "relative shrink-0 overflow-hidden border-l border-border shadow-lg"
                : "fixed inset-0 z-50 shadow-2xl"
            }
            style={{ width: isDesktop ? `${chat.size}px` : "100%" }}
          >
            {isDesktop && (
              <ResizeHandle
                side="left"
                startResize={chat.startResize}
                handlers={chat.handlers}
                nudge={chat.nudge}
                label="Resize Copilot panel"
              />
            )}
            <CopilotChat isOpen onClose={() => ws.setChat(false)} />
          </div>
        )}
      </div>

      <Panel />
      <StatusBar />
      {state.paletteOpen && <CommandPalette />}
    </div>
  );
}
