// ============================================================
// INLINE AI BAR — Cursor's signature Ctrl+K prompt bar,
// floating at the top of the editor. Type instructions,
// Enter generates: streams a portfolio-assistant answer into
// a card below the bar. Esc closes.
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import { chatQuery, getDefaultModelId } from "../../services/chatService";
import { offerAgentContext } from "../../services/agentContext";
import { Icon } from "../ui";
import { useWorkspace } from "../../workspace/WorkspaceContext";

export default function InlineAIBar() {
  const ws = useWorkspace();
  const [selection] = useState(() => window.getSelection()?.toString().slice(0,4000) || "");
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState(null); // {content, streaming, error}
  const abortRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generate();
    }
  };

  const close = useCallback(() => {
    abortRef.current?.abort();
    ws.setInlineBar(false);
  }, [ws]);

  const generate = useCallback(async () => {
    const q = prompt.trim();
    if (!q || abortRef.current) return;
    setAnswer({ content: "", streaming: true });
    const controller = new AbortController();
    abortRef.current = controller;
    ws.log("ai", `inline generate: ${q}`);
    try {
      await chatQuery(q, [], (chunk) => {
        setAnswer((a) => ({ ...a, content: a.content + chunk }));
      }, controller.signal, getDefaultModelId(), {mode:"ask", documents:ws.state.activeTabId.startsWith("doc:") ? [ws.state.activeTabId] : [], selection});
      setAnswer((a) => ({ ...a, streaming: false }));
    } catch (err) {
      if (err.name !== "AbortError") {
        setAnswer({ content: `⚠ ${err.message}`, streaming: false, error: true });
      }
    } finally {
      abortRef.current = null;
    }
  }, [prompt, ws, selection]);

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-[min(92%,640px)] space-y-2">
      {selection && <div className="text-xs text-comment bg-sidebar p-2 border border-border rounded truncate">Selection: {selection}</div>}
      <button className="text-xs bg-sidebar border border-border rounded px-2 py-1" onClick={() => { offerAgentContext({selection,prompt}); ws.setChat(true); close(); }}>Open in Agent ↗</button>
      {/* The prompt bar */}
      <div className="flex items-center gap-2 rounded-lg border border-accent/50 bg-sidebar shadow-xl shadow-black/30 px-3 py-2">
        <Icon name="edit" size="text-[15px]" className="text-accent shrink-0" />
        <input
          ref={inputRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={selection ? "Ask about selected text…" : "Ask about this document…"}
          className="flex-1 bg-transparent outline-none text-sm text-text placeholder:text-comment/60 min-w-0"
          spellCheck={false}
          aria-label="Inline question"
        />
        <span className="text-[10px] text-comment/70 border border-border rounded px-1.5 py-0.5 shrink-0 select-none">
          Ask
        </span>
        <button
          onClick={generate}
          disabled={!prompt.trim() || answer?.streaming}
          className={`text-xs px-3 py-1 rounded-md font-semibold shrink-0 transition-colors ${
            prompt.trim() && !answer?.streaming
              ? "bg-accent text-bg hover:opacity-90 cursor-pointer"
              : "bg-border/60 text-comment/60 cursor-default"
          }`}
        >
          {answer?.streaming ? "…" : "Generate"}
        </button>
        <button
          onClick={close}
          aria-label="Close inline edit bar"
          className="text-comment hover:text-keyword transition-colors shrink-0"
        >
          <Icon name="close" size="text-[15px]" />
        </button>
      </div>

      {/* Streamed answer card */}
      {answer && (
        <div className="rounded-lg border border-border bg-sidebar/95 shadow-xl shadow-black/30 p-3 max-h-[50vh] overflow-y-auto scrollbar-thin msg-in">
          <div className="flex items-center gap-2 text-[10px] text-comment/70 mb-1.5 select-none">
            <Icon name="auto_awesome" size="text-[12px]" className="text-accent" />
            {answer.streaming ? "Generating…" : "Portfolio answer"}
            <span className="ml-auto">esc to close</span>
          </div>
          <p
            className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
              answer.error ? "text-keyword" : "text-text"
            }`}
          >
            {answer.content || "…"}
          </p>
        </div>
      )}
    </div>
  );
}
