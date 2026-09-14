// ============================================================
// PANEL — VS Code bottom panel hosting TERMINAL and OUTPUT tabs.
// Always mounted (display-toggled) so terminal state survives
// open/close. Resizable height on desktop; fixed 45dvh on mobile.
// ============================================================

import { useState, useEffect } from "react";
import { Icon, ResizeHandle } from "../ui";
import { useWorkspace } from "../../workspace/WorkspaceContext";
import usePanelResize from "../../hooks/usePanelResize";
import useMediaQuery from "../../hooks/useMediaQuery";
import Terminal from "./Terminal";
import OutputLog from "./OutputLog";

export default function Panel() {
  const ws = useWorkspace();
  const { panelOpen, panelView } = ws.state;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Keep max height in sync with the viewport.
  const [maxPanel, setMaxPanel] = useState(() =>
    Math.round(window.innerHeight * 0.6)
  );
  useEffect(() => {
    const onResize = () => setMaxPanel(Math.round(window.innerHeight * 0.6));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { size, startResize, handlers, nudge } = usePanelResize({
    axis: "y",
    invert: true, // bottom panel grows as the pointer moves up
    defaultSize: 280,
    minSize: 140,
    maxSize: maxPanel,
    collapseBelow: 110,
    onCollapse: () => ws.setPanel(false),
  });

  const setView = (view) => ws.setPanel(true, view);

  return (
    <div
      aria-hidden={!panelOpen}
      className="border-t border-border bg-sidebar flex-col shrink-0 relative"
      style={{
        display: panelOpen ? "flex" : "none",
        height: isDesktop ? `${size}px` : "45dvh",
      }}
    >
      {isDesktop && (
        <ResizeHandle
          side="top"
          startResize={startResize}
          handlers={handlers}
          nudge={nudge}
          label="Resize panel"
        />
      )}

      {/* Panel header: view tabs + close */}
      <div className="flex items-center justify-between border-b border-border h-8 px-2 shrink-0">
        <div role="tablist" aria-label="Panel views" className="flex items-center h-full">
          {[
            { id: "terminal", label: "TERMINAL", icon: "terminal" },
            { id: "output", label: "OUTPUT", icon: "list_alt" },
          ].map((v) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={panelView === v.id}
              onClick={() => setView(v.id)}
              className={`flex items-center gap-1.5 px-3 h-full text-[10px] font-bold tracking-wide border-b-2 transition-colors ${
                panelView === v.id
                  ? "text-accent border-accent"
                  : "text-comment border-transparent hover:text-text"
              }`}
            >
              <Icon name={v.icon} size="text-[14px]" />
              {v.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => ws.setPanel(false)}
          aria-label="Close panel"
          title="Close panel (Ctrl+J)"
          className="text-comment hover:text-keyword transition-colors px-1"
        >
          <Icon name="close" size="text-[16px]" />
        </button>
      </div>

      {/* Panel body — both views stay mounted to preserve state */}
      <div className="flex-1 overflow-hidden relative">
        <div className={panelView === "terminal" ? "absolute inset-0" : "hidden"}>
          <Terminal active={panelOpen && panelView === "terminal"} />
        </div>
        <div className={panelView === "output" ? "absolute inset-0" : "hidden"}>
          <OutputLog />
        </div>
      </div>
    </div>
  );
}
