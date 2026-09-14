// ============================================================
// CODEX PROMPT — the "›" composer with the Codex footer
// grammar: shimmering • Working indicator, "esc to
// interrupt", "? for shortcuts", "N% context left".
// ============================================================

import { useState, useEffect, useRef } from "react";
import SlashMenu from "../claude/SlashMenu";

const PLACEHOLDERS = [
  'Try "what did he build at Zoho?"',
  'Try "/open market_data"',
  'Try "/status"',
  'Try "!neofetch"',
];

export default function CodexPrompt({
  commands,
  busy,
  contextLeft,
  onSubmit,
  onInterrupt,
  history,
}) {
  const [value, setValue] = useState("");
  const [histIdx, setHistIdx] = useState(-1);
  const [menuIdx, setMenuIdx] = useState(0);
  const [placeholder] = useState(
    () => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  );
  const inputRef = useRef(null);

  const isSlash = value.startsWith("/");
  const menuOpen = isSlash && !busy;
  const slashQuery = isSlash ? value.slice(1).split(/\s/)[0] : null;
  const filteredCommands = isSlash
    ? commands.filter(
        (c) =>
          !slashQuery ||
          c.name.toLowerCase().includes(slashQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(slashQuery.toLowerCase())
      )
    : commands;
  const clampedIdx = Math.min(menuIdx, Math.max(0, filteredCommands.length - 1));

  // Working elapsed — async-initialized state (rAF + interval), never
  // computed synchronously during render.
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!busy) return;
    const raf = requestAnimationFrame(() =>
      setElapsed(Math.max(0, Math.round((Date.now() - busy.startedAt) / 1000)))
    );
    const id = setInterval(
      () => setElapsed(Math.max(0, Math.round((Date.now() - busy.startedAt) / 1000))),
      1000
    );
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [busy]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (text) => {
    setValue("");
    setHistIdx(-1);
    onSubmit(text);
  };

  const onChange = (e) => {
    setValue(e.target.value);
    setMenuIdx(0);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (busy) onInterrupt();
      return;
    }
    if (menuOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMenuIdx((i) => Math.min(i + 1, filteredCommands.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setMenuIdx((i) => Math.max(0, i - 1));
        return;
      }
      if (e.key === "Enter" && !value.includes(" ")) {
        e.preventDefault();
        const cmd = filteredCommands[clampedIdx];
        if (cmd) submit(`/${cmd.name}`);
        else submit(value);
        return;
      }
    }
    if (e.key === "ArrowUp" && !menuOpen) {
      e.preventDefault();
      if (history.length) {
        const next = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(next);
        setValue(history[next]);
      }
      return;
    }
    if (e.key === "ArrowDown" && !menuOpen) {
      e.preventDefault();
      if (histIdx >= 0) {
        const next = histIdx + 1;
        if (next >= history.length) {
          setHistIdx(-1);
          setValue("");
        } else {
          setHistIdx(next);
          setValue(history[next]);
        }
      }
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      submit(value);
      return;
    }
    if (e.key === "?" && value === "") {
      e.preventDefault();
      onSubmit("?");
    }
  };

  return (
    <div className="relative shrink-0 px-3 sm:px-5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
      {menuOpen && (
        <SlashMenu
          commands={filteredCommands}
          activeIdx={clampedIdx}
          onHover={setMenuIdx}
          onRun={(cmd) => submit(`/${cmd.name}`)}
        />
      )}

      {/* Footer-style status line above the composer */}
      <div className="h-5 flex items-center justify-between text-[10px] font-mono px-1 select-none">
        {busy ? (
          <span className="text-text">
            <span className="shimmer text-accent inline-block">•</span>{" "}
            Working ({elapsed}s · <span className="text-comment">esc to interrupt</span>)
          </span>
        ) : (
          <span className="text-comment/60">› ready</span>
        )}
        <span className="text-comment/50">
          {contextLeft}% context left · ? for shortcuts
        </span>
      </div>

      {/* Composer box */}
      <div className="flex items-center gap-2 border border-border rounded-lg bg-sidebar/60 focus-within:border-accent/60 transition-colors px-3 py-2.5">
        <span className="text-accent font-bold text-base shrink-0 select-none">›</span>
        <input
          ref={inputRef}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={busy}
          className="flex-1 bg-transparent outline-none text-text text-base min-w-0 placeholder:text-comment/50"
          placeholder={placeholder}
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          aria-label="Ask Codex or type a command"
        />
      </div>
    </div>
  );
}
