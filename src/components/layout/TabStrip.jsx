// ============================================================
// TAB STRIP — VS Code editor tabs (open files).
// Click to activate, × or middle-click to close, wheel to
// scroll horizontally, arrow keys to move between tabs.
// ============================================================

import { useRef, useEffect } from "react";
import { Icon } from "../ui";
import { useWorkspace } from "../../workspace/WorkspaceContext";

export default function TabStrip() {
  const ws = useWorkspace();
  const { tabs, activeTabId } = ws.state;

  const stripRef = useRef(null);
  const tabRefs = useRef({});

  const activeIdx = Math.max(
    0,
    tabs.findIndex((t) => t.id === activeTabId)
  );

  // Horizontal wheel scrolling (non-passive so we can preventDefault).
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Keep the active tab visible when tabs overflow.
  useEffect(() => {
    tabRefs.current[activeTabId]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }, [activeTabId, tabs.length]);

  const focusTab = (idx) => {
    const clamped = (idx + tabs.length) % tabs.length;
    const el = tabRefs.current[tabs[clamped]?.id];
    el?.focus();
  };

  const onTabKeyDown = (e, idx) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusTab(idx + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusTab(idx - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      ws.setActiveTab(tabs[idx].id);
    } else if (e.key === "Delete") {
      ws.closeTab(tabs[idx].id);
    }
  };

  return (
    <div
      ref={stripRef}
      role="tablist"
      aria-label="Open editors"
      className="flex items-stretch h-9 bg-sidebar border-b border-border overflow-x-auto scrollbar-none shrink-0"
    >
      {tabs.map((tab, idx) => {
        const active = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            role="tab"
            aria-selected={active}
            aria-controls="editor-pane"
            tabIndex={idx === activeIdx ? 0 : -1}
            id={`tab-${tab.id}`}
            onClick={() => ws.setActiveTab(tab.id)}
            onAuxClick={(e) => {
              if (e.button === 1) ws.closeTab(tab.id);
            }}
            onKeyDown={(e) => onTabKeyDown(e, idx)}
            className={`group flex items-center gap-1.5 pl-3 pr-1.5 border-r border-border text-xs max-w-[200px] shrink-0 cursor-pointer select-none transition-colors border-t-2 tab-in ${
              active
                ? "bg-bg text-text border-t-accent"
                : "text-comment hover:bg-bg/50 border-t-transparent"
            }`}
          >
            <Icon
              name={tab.icon}
              size="text-[13px]"
              className={active ? "text-accent shrink-0" : "text-comment shrink-0"}
            />
            <span className="truncate">{tab.title}</span>
            {tab.closable !== false && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  ws.closeTab(tab.id);
                }}
                onAuxClick={(e) => e.stopPropagation()}
                aria-label={`Close ${tab.title}`}
                className={`w-5 h-5 flex items-center justify-center rounded shrink-0 transition-colors ${
                  active
                    ? "text-comment hover:text-keyword hover:bg-border/50"
                    : "text-comment/60 hover:text-keyword hover:bg-border/50"
                } ${"opacity-0 group-hover:opacity-100"}`}
              >
                <Icon name="close" size="text-[13px]" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
