import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import PrepTabBar from "./PrepTabBar";
import MobilePrepBar from "./MobilePrepBar";
import StatusBar from "./StatusBar";
import MobileNav from "./MobileNav";
import CopilotChat from "../chat/CopilotChat";
import { Icon, ResizeHandle } from "../ui";
import useResizableRight from "../../hooks/useResizableRight";
import useScrollSpy from "../../hooks/useScrollSpy";

/**
 * Layout — Main application shell (header + sidebar + content + statusbar)
 * Mirrors a VS Code / Terminal IDE layout. Sidebar always visible, content area changes.
 */
export default function Layout({ children, activeProject, onOpenProject }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarVisible, setDesktopSidebarVisible] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [prepTabCourse, setPrepTabCourse] = useState(null);
  const [prepTabVisible, setPrepTabVisible] = useState(true);
  const { width: chatWidth, isResizing, startResize } = useResizableRight(420, 320, 800, () => setChatOpen(false), 150);

  // Scroll spy for mobile nav active state
  const sectionIds = ["hero", "about", "expertise", "experience", "work", "contact"];
  const activeSection = useScrollSpy(sectionIds);

  // Parse prep routes to extract course ID
  const parsePrepRoute = (id) => {
    if (!id?.startsWith("prep:")) return null;
    const [, courseId, ...rest] = id.split(":");
    return { courseId, filePath: rest.join(":") };
  };

  const activePrep = parsePrepRoute(activeProject);

  return (
    <div className="h-screen flex flex-col">
      <Header />

      {/* Mobile Navigation Bar — replaces floating FABs */}
      <MobileNav
        activeSection={activeSection}
        activeProject={activeProject}
        onOpenProject={onOpenProject}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        chatOpen={chatOpen}
        onToggleChat={() => setChatOpen(!chatOpen)}
        onOpenPrepTab={(courseId) => {
          setPrepTabCourse(courseId);
          setPrepTabVisible(true);
        }}
      />

      {/* Mobile Prep Bar — top nav for prep content on mobile */}
      {prepTabCourse && prepTabVisible && (
        <MobilePrepBar
          courseId={prepTabCourse}
          activePath={activePrep?.filePath}
          onNavigate={(courseId, filePath) => {
            onOpenProject?.(`prep:${courseId}:${filePath}`);
          }}
          onClose={() => {
            setPrepTabCourse(null);
            setPrepTabVisible(false);
          }}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar toggle - show when sidebar is collapsed */}
        {!desktopSidebarVisible && (
          <button
            className="hidden md:flex fixed bottom-8 left-4 z-50 bg-accent text-bg w-10 h-10 rounded-full items-center justify-center shadow-lg hover:bg-accent/90 transition-colors"
            onClick={() => setDesktopSidebarVisible(true)}
            aria-label="Open Explorer"
            title="Open Explorer"
          >
            <Icon name="folder_open" size="text-[18px]" />
          </button>
        )}

        {/* Mobile sidebar overlay backdrop */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar — slide-in from left */}
        <div
          className={`md:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed z-50 transition-transform duration-200 h-full`}
        >
          <Sidebar 
            activeProject={activeProject} 
            onOpenProject={(id) => {
              onOpenProject?.(id);
              setSidebarOpen(false);
            }}
            onOpenPrepTab={(courseId) => {
              setPrepTabCourse(courseId);
              setPrepTabVisible(true);
              setSidebarOpen(false);
            }}
            onRequestClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Desktop sidebar — controlled by desktopSidebarVisible */}
        {desktopSidebarVisible && (
          <div className="hidden md:block relative z-auto">
            <Sidebar 
              activeProject={activeProject} 
              onOpenProject={(id) => {
                onOpenProject?.(id);
                setSidebarOpen(false);
              }}
              onOpenPrepTab={(courseId) => {
                setPrepTabCourse(courseId);
                setPrepTabVisible(true);
                setSidebarOpen(false);
              }}
              onRequestClose={() => setDesktopSidebarVisible(false)}
            />
          </div>
        )}

        {/* Reopen Sidebar Button (desktop only) */}
        {!desktopSidebarVisible && (
          <button
            onClick={() => setDesktopSidebarVisible(true)}
            className="hidden md:flex items-center justify-center w-8 h-full border-r border-border bg-sidebar hover:bg-border/30 transition-colors group shrink-0"
            title="Open Explorer"
          >
            <Icon name="folder_open" size="text-[18px]" className="text-comment group-hover:text-accent transition-colors" />
          </button>
        )}

        {/* Prep Tab Bar — desktop only side panel */}
        {prepTabCourse && prepTabVisible && (
          <div className="hidden md:block">
            <PrepTabBar
              courseId={prepTabCourse}
              activePath={activePrep?.filePath}
              onNavigate={(courseId, filePath) => {
                onOpenProject?.(`prep:${courseId}:${filePath}`);
              }}
              onClose={() => {
                setPrepTabCourse(null);
                setPrepTabVisible(false);
              }}
              onRequestClose={() => setPrepTabVisible(false)}
            />
          </div>
        )}

        {/* Reopen Prep Tab Button (desktop only) */}
        {prepTabCourse && !prepTabVisible && (
          <button
            onClick={() => setPrepTabVisible(true)}
            className="hidden md:flex items-center justify-center w-8 h-full border-r border-border bg-sidebar hover:bg-border/30 transition-colors group shrink-0"
            title={`Open ${prepTabCourse === 'dsa' ? 'DSA' : 'System Design'} Files`}
          >
            <Icon name="description" size="text-[18px]" className="text-comment group-hover:text-accent transition-colors" />
          </button>
        )}

        <main className={`flex-1 overflow-y-auto scroll-smooth ${
          activePrep ? 'px-3 pb-4 sm:px-6 sm:pb-6' : 'p-3 space-y-8 sm:p-6 sm:space-y-12'
        }`}>
          {children}
        </main>

        {/* Copilot Panel - part of layout on desktop, overlay on mobile */}
        {chatOpen && (
          <div
            className="transition-all duration-300 ease-out overflow-hidden border-l-2 border-accent/30 md:relative fixed top-0 right-0 bottom-0 z-50 shadow-2xl shadow-black/50"
            style={{ width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${chatWidth}px` : '100%' }}
          >
            <ResizeHandle onMouseDown={startResize} side="left" />
            <CopilotChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
          </div>
        )}
      </div>

      {/* StatusBar — hidden on mobile (MobileNav replaces it) */}
      <div className="hidden md:block">
        <StatusBar onToggleChat={() => setChatOpen(!chatOpen)} chatOpen={chatOpen} />
      </div>
    </div>
  );
}
