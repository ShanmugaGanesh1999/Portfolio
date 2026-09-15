// ============================================================
// TERMINAL — VS Code panel shell.
// Command logic lives in src/shell/commands.js (shared with
// the Claude Code shell). This component owns the skin:
// prompt echo, history, keyboard handling, line rendering.
// ============================================================

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useWorkspace } from "../../workspace/WorkspaceContext";
import { useTheme } from "../../hooks/useTheme";
import useMediaQuery from "../../hooks/useMediaQuery";
import { createShellExecutor } from "../../shell/commands";

const PROMPT = "shanmuga@sg-sys:~/portfolio$";
const MAX_LINES = 400;

export default function Terminal({ active = true }) {
  const ws = useWorkspace();
  const { theme, setTheme } = useTheme();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [lines, setLines] = useState(() => [
    { type: "ok", text: "SG-SYS shell v3.0 — type 'help' for available commands." },
  ]);
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [input, setInput] = useState("");

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (active && isDesktop) inputRef.current?.focus();
  }, [active, isDesktop]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const push = useCallback((...newLines) => {
    setLines((prev) => [...prev, ...newLines].slice(-MAX_LINES));
  }, []);

  // Shared executor — the same commands run in the Claude Code shell.
  const runCommand = useMemo(
    () => createShellExecutor({
      ws,
      theme,
      setTheme,
      print: (type, text) => push({ type, text }),
      exit: () => ws.setPanel(false),
    }),
    [ws, theme, setTheme, push]
  );

  const run = () => {
    const raw = input;
    const cmd = raw.trim();
    push({ type: "in", text: `${PROMPT} ${cmd}` });
    setInput("");
    setHistIdx(-1);
    if (!cmd) return;
    setHistory((h) => [...h, cmd].slice(-100));
    const result = runCommand(cmd);
    if (result?.clear) setLines([]);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length) {
        const next = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const next = histIdx + 1;
      if (next >= history.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(next);
        setInput(history[next]);
      }
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLines([]);
    } else if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      push({ type: "in", text: `${PROMPT} ${input}^C` });
      setInput("");
    }
  };

  const lineClass = {
    in: "text-text",
    out: "text-comment",
    err: "text-keyword",
    ok: "text-success",
  };

  return (
    <div className="h-full flex flex-col" onClick={() => inputRef.current?.focus()}>
      <div
        ref={scrollRef}
        role="log"
        aria-label="Terminal output"
        className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2 text-xs leading-relaxed font-mono"
      >
        {lines.map((line, i) => (
          <div key={i} className={`${lineClass[line.type] ?? "text-comment"} whitespace-pre-wrap break-words`}>
            {line.text}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 border-t border-border/50 shrink-0">
        <span className="text-accent font-bold shrink-0 text-xs">{PROMPT}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent outline-none text-text text-xs min-w-0"
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          aria-label="Terminal command input"
          placeholder="type 'help'…"
        />
      </div>
    </div>
  );
}
