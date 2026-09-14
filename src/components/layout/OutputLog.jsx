// ============================================================
// OUTPUT LOG — VS Code Output panel: timestamped workspace events
// (tabs opened/closed, theme toggles, palette queries, terminal
// commands, chat usage). Reads from the workspace log store.
// ============================================================

import { useRef, useEffect } from "react";
import { useWorkspace } from "../../workspace/WorkspaceContext";

const fmtTime = (t) =>
  new Date(t).toLocaleTimeString([], { hour12: false });

export default function OutputLog() {
  const ws = useWorkspace();
  const entries = ws.state.outputLog;
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries.length]);

  return (
    <div
      ref={scrollRef}
      role="log"
      aria-label="Output log"
      className="h-full overflow-y-auto scrollbar-thin px-3 py-2 text-xs font-mono space-y-0.5"
    >
      {entries.length === 0 ? (
        <div className="text-comment/60 italic">
          No events yet — interact with the workspace and they will appear here.
        </div>
      ) : (
        entries.map((entry, i) => (
          <div key={`${entry.t}-${i}`} className="whitespace-pre-wrap break-words">
            <span className="text-comment/60">[{fmtTime(entry.t)}]</span>{" "}
            <span className="text-variable">[{entry.source}]</span>{" "}
            <span className="text-comment">{entry.message}</span>
          </div>
        ))
      )}
    </div>
  );
}
