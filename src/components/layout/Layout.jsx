import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import StatusBar from "./StatusBar";
import { Icon } from "../ui";

/**
 * Layout — Main application shell (header + sidebar + content + statusbar)
 * Mirrors a VS Code / Terminal IDE layout. Sidebar always visible, content area changes.
 */
export default function Layout({ children, activeProject, onOpenProject }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar toggle */}
        <button
          className="md:hidden fixed bottom-8 right-4 z-50 bg-accent text-bg w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle navigation"
        >
          <Icon name={sidebarOpen ? "close" : "menu"} size="text-xl" />
        </button>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — always rendered, shown/hidden via CSS on mobile */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:relative z-50 md:z-auto transition-transform duration-200`}
        >
          <Sidebar activeProject={activeProject} onOpenProject={(id) => {
            onOpenProject?.(id);
            setSidebarOpen(false);
          }} />
        </div>

        <main className="flex-1 overflow-y-auto p-6 space-y-12 scroll-smooth">
          {children}
        </main>
      </div>
      <StatusBar />
    </div>
  );
}
