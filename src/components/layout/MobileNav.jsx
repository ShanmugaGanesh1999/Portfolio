import { useState, useRef, useEffect } from "react";
import { Icon } from "../ui";
import { PREP_COURSES } from "../../prep/prepData";

/**
 * MOBILE_SECTIONS — Main portfolio sections for quick nav
 */
const MOBILE_SECTIONS = [
  { id: "hero", label: "Home", icon: "terminal" },
  { id: "about", label: "About", icon: "person" },
  { id: "expertise", label: "Skills", icon: "settings" },
  { id: "experience", label: "Career", icon: "history" },
  { id: "work", label: "Projects", icon: "build" },
  { id: "contact", label: "Contact", icon: "mail" },
];

/**
 * MobileNav — VS Code-style mobile navigation bar
 * 
 * Renders below the header on mobile (md:hidden).
 * Contains: hamburger menu, scrollable section tabs, prep shortcut, copilot toggle.
 * Replaces the floating FABs for a cleaner mobile UX.
 */
export default function MobileNav({
  activeSection,
  activeProject,
  onOpenProject,
  sidebarOpen,
  onToggleSidebar,
  chatOpen,
  onToggleChat,
  onOpenPrepTab,
}) {
  const [prepOpen, setPrepOpen] = useState(false);
  const prepRef = useRef(null);

  // Close prep dropdown on outside click
  useEffect(() => {
    if (!prepOpen) return;
    const handleClick = (e) => {
      if (prepRef.current && !prepRef.current.contains(e.target)) {
        setPrepOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, [prepOpen]);

  // Determine which tab is active
  const getActiveTab = () => {
    if (activeProject?.startsWith("prep:")) return "prep";
    if (activeProject) return "work"; // viewing a project detail
    return activeSection || "hero";
  };

  const active = getActiveTab();

  const handleSectionClick = (sectionId) => {
    // If currently viewing a project, clear it first
    if (activeProject) {
      onOpenProject?.(null);
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePrepClick = (courseId) => {
    setPrepOpen(false);
    onOpenPrepTab?.(courseId);
  };

  return (
    <div className="md:hidden border-b border-border bg-sidebar shrink-0 relative">
      <div className="flex items-center h-10">
        {/* ── Hamburger / Explorer Toggle ── */}
        <button
          onClick={onToggleSidebar}
          className={`shrink-0 w-10 h-10 flex items-center justify-center border-r border-border transition-colors ${
            sidebarOpen
              ? "text-accent bg-border/30"
              : "text-comment hover:text-white hover:bg-border/20"
          }`}
          aria-label={sidebarOpen ? "Close Explorer" : "Open Explorer"}
        >
          <Icon name={sidebarOpen ? "close" : "menu"} size="text-[20px]" />
        </button>

        {/* ── Scrollable Section Tabs ── */}
        <div className="flex-1 overflow-x-auto flex items-center scrollbar-none">
          <div className="flex items-center">
            {MOBILE_SECTIONS.map((section) => {
              const isActive = active === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`flex items-center gap-1.5 px-3 h-10 text-[11px] font-medium whitespace-nowrap border-b-2 transition-all ${
                    isActive
                      ? "border-accent text-accent bg-border/15"
                      : "border-transparent text-comment hover:text-text hover:bg-border/10"
                  }`}
                >
                  <Icon name={section.icon} size="text-[14px]" />
                  {section.label}
                </button>
              );
            })}

            {/* ── Prep Dropdown ── */}
            <div className="relative" ref={prepRef}>
              <button
                onClick={() => setPrepOpen(!prepOpen)}
                className={`flex items-center gap-1.5 px-3 h-10 text-[11px] font-medium whitespace-nowrap border-b-2 transition-all ${
                  active === "prep"
                    ? "border-success text-success bg-success/5"
                    : "border-transparent text-comment hover:text-text hover:bg-border/10"
                }`}
              >
                <Icon name="school" size="text-[14px]" />
                Prep
                <Icon
                  name={prepOpen ? "expand_less" : "expand_more"}
                  size="text-[12px]"
                />
              </button>

              {/* Dropdown menu */}
              {prepOpen && (
                <div className="absolute top-full left-0 mt-px bg-sidebar border border-border rounded-md shadow-xl shadow-black/40 z-50 min-w-[180px] py-1 animate-fade-in-up" style={{ animationDuration: "0.15s" }}>
                  {PREP_COURSES.map((course) => {
                    const isActive = activeProject?.startsWith(`prep:${course.id}`);
                    return (
                      <button
                        key={course.id}
                        onClick={() => handlePrepClick(course.id)}
                        className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs transition-colors ${
                          isActive
                            ? "bg-border text-accent"
                            : "text-text hover:bg-border/50"
                        }`}
                      >
                        <Icon name={course.icon} size="text-[16px]" className={`text-${course.color}`} />
                        <div className="text-left">
                          <div className="font-medium">{course.title}</div>
                          <div className="text-[10px] text-comment">{course.subtitle}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Copilot Toggle ── */}
        <button
          onClick={onToggleChat}
          className={`shrink-0 w-10 h-10 flex items-center justify-center border-l border-border transition-colors ${
            chatOpen
              ? "text-success bg-success/10"
              : "text-comment hover:text-success hover:bg-border/20"
          }`}
          aria-label={chatOpen ? "Close Copilot" : "Open Copilot"}
        >
          <Icon name="smart_toy" size="text-[20px]" />
        </button>
      </div>
    </div>
  );
}
