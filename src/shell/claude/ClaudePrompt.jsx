// ============================================================
// CLAUDE PROMPT — the CLI's input box.
//   ❯ input · "/" slash menu · "!" shell passthrough · plain
//   text → the portfolio assistant. Esc interrupts a running
//   response, ? toggles the shortcuts block, ↑/↓ history.
// ============================================================

import { useState, useEffect, useRef } from "react";
import SlashMenu from "./SlashMenu";
import Spinner from "./Spinner";

const PLACEHOLDERS = [
  'Try "what did he build at Zoho?"',
  'Try "/open market_data"',
  'Try "!neofetch"',
  'Try "/research his AI experience"',
];

export default function ClaudePrompt({
  commands,
  busy,
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
  const slashQuery = isSlash ? value.slice(1).split(/\s/)[0] : null;
  const menuOpen = isSlash && !busy;

  // Filtered slash commands — index shared between menu and keyboard.
  // A bare "/" shows the full list; typing after it filters.
  const filteredCommands = isSlash
    ? commands.filter(
        (c) =>
          !slashQuery ||
          c.name.toLowerCase().includes(slashQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(slashQuery.toLowerCase())
      )
    : commands;
  const clampedIdx = Math.min(menuIdx, Math.max(0, filteredCommands.length - 1));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onChange = (e) => {
    setValue(e.target.value);
    setMenuIdx(0); // reset menu selection as the query changes
  };

  const submit = (text) => {
    setValue("");
    setHistIdx(-1);
    onSubmit(text);
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
      if (e.key === "Tab") {
        e.preventDefault();
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
      {/* Slash command menu */}
      {menuOpen && (
        <SlashMenu
          commands={filteredCommands}
          activeIdx={clampedIdx}
          onHover={setMenuIdx}
          onRun={(cmd) => submit(`/${cmd.name}`)}
        />
      )}

      {/* Spinner / status line above the box */}
      <div className="h-5 flex items-center justify-between text-[10px] font-mono px-1 select-none">
        {busy ? (
          <Spinner
            active
            verb={busy.verb}
            startedAt={busy.startedAt}
            tokens={busy.tokens}
          />
        ) : (
          <span className="text-comment/50">● ready</span>
        )}
        {busy ? (
          <span className="text-comment/60">esc to interrupt</span>
        ) : (
          <span className="text-comment/40 hidden sm:inline">? for shortcuts</span>
        )}
      </div>

      {/* The input box */}
      <div className="flex items-center gap-2 border border-border rounded-lg bg-sidebar/60 focus-within:border-accent/60 transition-colors px-3 py-2.5">
        <span className="text-accent font-bold text-base shrink-0 select-none">❯</span>
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
          aria-label="Ask Claude or type a command"
        />
        {!busy && value && (
          <button
            onClick={() => submit(value)}
            aria-label="Send"
            className="shrink-0 text-accent hover:opacity-70 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px] align-middle" aria-hidden="true">
              arrow_upward
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
