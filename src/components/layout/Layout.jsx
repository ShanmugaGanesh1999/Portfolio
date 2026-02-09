import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import PrepTabBar from "./PrepTabBar";
import StatusBar from "./StatusBar";
import CopilotChat from "../chat/CopilotChat";
import { Icon, ResizeHandle } from "../ui";
import useResizableRight from "../../hooks/useResizableRight";

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
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar toggle */}
        <button
          className="md:hidden fixed bottom-8 left-4 z-50 bg-accent text-bg w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle navigation"
        >
          <Icon name={sidebarOpen ? "close" : "menu"} size="text-xl" />
        </button>

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

        {/* Mobile Copilot FAB */}
        {!chatOpen && (
          <button
            className="md:hidden fixed bottom-8 right-4 z-50 bg-success text-bg w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-success/30 animate-fade-in-up"
            onClick={() => setChatOpen(true)}
            aria-label="Open Copilot Chat"
          >
            <Icon name="smart_toy" size="text-xl" />
          </button>
        )}

        {/* Mobile chat backdrop */}
        {chatOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setChatOpen(false)}
          />
        )}

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — always rendered, shown/hidden via CSS on mobile */}
        {desktopSidebarVisible && (
          <div
            className={`${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 fixed md:relative z-50 md:z-auto transition-transform duration-200`}
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
              onRequestClose={() => setDesktopSidebarVisible(false)}
            />
          </div>
        )}

        {/* Reopen Sidebar Button */}
        {!desktopSidebarVisible && (
          <button
            onClick={() => setDesktopSidebarVisible(true)}
            className="hidden md:flex items-center justify-center w-8 h-full border-r border-border bg-sidebar hover:bg-border/30 transition-colors group shrink-0"
            title="Open Explorer"
          >
            <Icon name="folder_open" size="text-[18px]" className="text-comment group-hover:text-accent transition-colors" />
          </button>
        )}

        {/* Prep Tab Bar — shows folder contents when a prep course is selected */}
        {prepTabCourse && prepTabVisible && (
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
        )}

        {/* Reopen Prep Tab Button */}
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
          activePrep ? 'px-6 pb-6' : 'p-6 space-y-12'
        }`}>
          {children}
        </main>

        {/* Copilot Panel - part of layout structure on desktop, overlay on mobile */}
        {chatOpen && (
          <div
            className="transition-all duration-300 ease-out overflow-hidden border-l-2 border-accent/30 md:relative fixed top-0 right-0 bottom-0 z-50 shadow-2xl shadow-black/50"
            style={{ width: window.innerWidth >= 768 ? `${chatWidth}px` : '100%' }}
          >
            <ResizeHandle onMouseDown={startResize} side="left" />
            <CopilotChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
          </div>
        )}
      </div>
      <StatusBar onToggleChat={() => setChatOpen(!chatOpen)} chatOpen={chatOpen} />
    </div>
  );
}
