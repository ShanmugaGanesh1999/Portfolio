// ============================================================
// TAB STRIP — VS Code editor tabs (open files).
// Click to activate, × or middle-click to close, wheel to
// scroll horizontally, arrow keys to move between tabs.
// ============================================================

import { useRef, useEffect, useState } from "react";
import { Icon } from "../ui";
import { useWorkspace } from "../../workspace/WorkspaceContext";

export default function TabStrip() {
  const ws = useWorkspace();
  const { tabs, activeTabId } = ws.state;

  const [menu, setMenu] = useState(null);
  const stripRef = useRef(null);
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    window.addEventListener("click", close);
    const escape = (event) => { if (event.key === "Escape") { close(); tabRefs.current[menu.tab.id]?.focus(); } };
    window.addEventListener("keydown", escape);
    return () => { window.removeEventListener("click", close); window.removeEventListener("keydown", escape); };
  }, [menu]);
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
    if (e.shiftKey && e.key === "F10") {
      e.preventDefault();
      const box = e.currentTarget.getBoundingClientRect();
      setMenu({ tab: tabs[idx], x: Math.min(box.left, window.innerWidth - 200), y: box.bottom });
    } else if (e.key === "ArrowRight") {
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
    <>
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
            onDoubleClick={() => ws.keepTab(tab.id)}
            onContextMenu={(event) => { event.preventDefault(); setMenu({ tab, x: Math.min(event.clientX, window.innerWidth - 200), y: event.clientY }); }}
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
            <span className={`truncate ${tab.preview ? "italic" : ""}`}>{tab.pinned ? "⌖ " : ""}{tab.title}</span>
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
                } opacity-0 group-hover:opacity-100 group-focus-within:opacity-100`}
              >
                <Icon name="close" size="text-[13px]" />
              </button>
            )}
          </div>
        );
      })}
    </div>
    {menu && <div role="menu" aria-label="Editor tab actions" onKeyDown={(event) => {
      if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      const items = [...event.currentTarget.querySelectorAll("button")];
      const index = items.indexOf(document.activeElement);
      items[(index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
    }} className="fixed z-[90] bg-sidebar border border-border rounded shadow-xl py-1 text-xs w-48" style={{ left: menu.x, top: menu.y }}>
      {[
        [menu.tab.pinned ? 'Unpin tab' : 'Pin tab', () => ws.pinTab(menu.tab.id)],
        ['Keep open', () => ws.keepTab(menu.tab.id)],
        ['Close', () => ws.closeTab(menu.tab.id)],
        ['Close others', () => ws.closeOtherTabs(menu.tab.id)],
        ['Close all', ws.closeAllTabs],
      ].map(([label, action], index) => <button key={label} role="menuitem" autoFocus={index === 0} className="block w-full text-left px-3 py-2 hover:bg-border focus:bg-border" onClick={() => { action(); setMenu(null); }}>{label}</button>)}
    </div>}
    </>
  );
}
