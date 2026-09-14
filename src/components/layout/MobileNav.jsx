// ============================================================
// MOBILE NAV — compact bar below the header on small screens.
// Hamburger (explorer drawer) + scrollable section tabs + prep
// dropdown (portal) + palette search + copilot + theme toggle.
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../ui";
import { PREP_COURSES } from "../../prep/prepData";
import { useWorkspace } from "../../workspace/WorkspaceContext";
import { useTheme } from "../../hooks/useTheme";

const MOBILE_SECTIONS = [
  { id: "hero", label: "Home", icon: "terminal" },
  { id: "about", label: "About", icon: "person" },
  { id: "expertise", label: "Skills", icon: "settings" },
  { id: "experience", label: "Career", icon: "history" },
  { id: "work", label: "Projects", icon: "build" },
  { id: "contact", label: "Contact", icon: "mail" },
];

/** Static color map — Tailwind can't see interpolated class names. */
const COURSE_ICON_COLORS = {
  success: "text-success",
  accent: "text-accent",
  keyword: "text-keyword",
  variable: "text-variable",
  func: "text-func",
};

export default function MobileNav({ activeSection }) {
  const ws = useWorkspace();
  const { theme, toggle } = useTheme();
  const [prepOpen, setPrepOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const prepBtnRef = useRef(null);
  const dropdownRef = useRef(null);

  const { activeTabId, mobileDrawerOpen, chatOpen } = ws.state;
  const activeTab = ws.state.tabs.find((t) => t.id === activeTabId);

  // Which tab appears active in the section strip.
  const active =
    activeTab?.kind === "prep"
      ? "prep"
      : activeTab?.kind === "project"
      ? "work"
      : activeSection || "hero";

  const openDropdown = useCallback(() => {
    if (prepBtnRef.current) {
      const r = prepBtnRef.current.getBoundingClientRect();
      setDropdownPos({ top: r.bottom + 1, left: Math.max(4, r.left) });
    }
    setPrepOpen((v) => !v);
  }, []);

  // Close the prep dropdown on outside click or Escape.
  useEffect(() => {
    if (!prepOpen) return;
    const handleClick = (e) => {
      if (
        prepBtnRef.current && !prepBtnRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setPrepOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setPrepOpen(false);
    };
    document.addEventListener("pointerdown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [prepOpen]);

  return (
    <div className="md:hidden border-b border-border bg-sidebar shrink-0 relative">
      <div className="flex items-center h-10">
        {/* Hamburger / Explorer drawer */}
        <button
          onClick={ws.toggleMobileDrawer}
          className={`shrink-0 w-10 h-10 flex items-center justify-center border-r border-border transition-colors ${
            mobileDrawerOpen
              ? "text-accent bg-border/30"
              : "text-comment hover:text-text hover:bg-border/20"
          }`}
          aria-label={mobileDrawerOpen ? "Close Explorer" : "Open Explorer"}
        >
          <Icon name={mobileDrawerOpen ? "close" : "menu"} size="text-[20px]" />
        </button>

        {/* Scrollable section tabs */}
        <div className="flex-1 overflow-x-auto flex items-center scrollbar-none">
          <div className="flex items-center">
            {MOBILE_SECTIONS.map((section) => {
              const isActive = active === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => ws.scrollToSection(section.id)}
                  className={`flex items-center gap-1.5 px-3 h-10 text-[11px] font-medium whitespace-nowrap border-b-2 transition-colors ${
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

            {/* Prep dropdown */}
            <div className="relative">
              <button
                ref={prepBtnRef}
                onClick={openDropdown}
                aria-expanded={prepOpen}
                aria-haspopup="menu"
                className={`flex items-center gap-1.5 px-3 h-10 text-[11px] font-medium whitespace-nowrap border-b-2 transition-colors ${
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

              {prepOpen &&
                createPortal(
                  <div
                    ref={dropdownRef}
                    role="menu"
                    className="fixed bg-sidebar border border-border rounded-md shadow-xl shadow-black/40 z-[9999] min-w-[180px] py-1 animate-fade-in-up"
                    style={{
                      top: dropdownPos.top,
                      left: dropdownPos.left,
                      animationDuration: "0.15s",
                    }}
                  >
                    {PREP_COURSES.map((course) => {
                      const isActive = activeTabId === `prep:${course.id}`;
                      return (
                        <button
                          key={course.id}
                          role="menuitem"
                          onClick={() => {
                            setPrepOpen(false);
                            ws.openPrepPanel(course.id);
                          }}
                          className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs transition-colors ${
                            isActive
                              ? "bg-border text-accent"
                              : "text-text hover:bg-border/50"
                          }`}
                        >
                          <Icon
                            name={course.icon}
                            size="text-[16px]"
                            className={COURSE_ICON_COLORS[course.color] ?? "text-accent"}
                          />
                          <div className="text-left">
                            <div className="font-medium">{course.title}</div>
                            <div className="text-[10px] text-comment">{course.subtitle}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>,
                  document.body
                )}
            </div>
          </div>
        </div>

        {/* Palette search */}
        <button
          onClick={() => ws.openPalette("files")}
          className="shrink-0 w-10 h-10 flex items-center justify-center border-l border-border text-comment hover:text-accent hover:bg-border/20 transition-colors"
          aria-label="Search (command palette)"
        >
          <Icon name="search" size="text-[20px]" />
        </button>

        {/* Copilot */}
        <button
          onClick={ws.toggleChat}
          className={`shrink-0 w-10 h-10 flex items-center justify-center border-l border-border transition-colors ${
            chatOpen
              ? "text-success bg-success/10"
              : "text-comment hover:text-success hover:bg-border/20"
          }`}
          aria-label={chatOpen ? "Close Copilot" : "Open Copilot"}
        >
          <Icon name="smart_toy" size="text-[20px]" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="shrink-0 w-10 h-10 flex items-center justify-center border-l border-border text-comment hover:text-accent hover:bg-border/20 transition-colors"
          aria-label={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          <Icon name={theme === "dark" ? "light_mode" : "dark_mode"} size="text-[20px]" />
        </button>
      </div>
    </div>
  );
}
