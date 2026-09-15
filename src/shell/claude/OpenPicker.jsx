// ============================================================
// OPEN PICKER — /open with no argument: a filterable,
// keyboard-navigable project list (Claude panel style).
// ↑↓ to move, Enter to open, Esc to dismiss. Typing filters
// by name/tech. Selection opens a full-screen agent pane.
// ============================================================

import { useState, useEffect, useMemo, useRef } from "react";
import { PROJECT_TABS } from "../../workspace/registry";
import { PREP_COURSES } from "../../prep/prepData";

export default function OpenPicker({ onPick, onClose }) {
  const [query, setQuery] = useState("");
  const [idx, setIdx] = useState(0);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const items = useMemo(() => {
    const projects = Object.entries(PROJECT_TABS).map(([id, m]) => ({
      id,
      kind: "project",
      label: m.title.replace(/\.(md|py)$/, ""),
      detail: `${m.language} · system design deep dive`,
    }));
    const preps = PREP_COURSES.map((c) => ({
      id: `prep:${c.id}`,
      kind: "prep",
      label: c.title,
      detail: `prep reader · ${c.subtitle}`,
    }));
    const all = [...projects, ...preps];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        it.detail.toLowerCase().includes(q)
    );
  }, [query]);

  const clampedIdx = Math.min(idx, Math.max(0, items.length - 1));

  useEffect(() => {
    const id = requestAnimationFrame(() => setIdx(0));
    return () => cancelAnimationFrame(id);
  }, [query]);
  useEffect(() => inputRef.current?.focus(), []);

  // Keep the highlighted row in view while navigating.
  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [clampedIdx, items]);

  // Esc closes; arrows/Enter navigate (handled on the input).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  const pick = (item) => {
    if (!item) return;
    onPick(item.kind === "prep" ? `prep:${item.id.slice(5)}` : item.id);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(items[clampedIdx]);
    }
  };

  return (
    <div className="ct-panel-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="ct-panel" role="dialog" aria-modal="true" aria-label="Open a project">
        <div className="ct-panel-header">
          <h2 className="ct-panel-title">Open a project</h2>
          <button type="button" className="ct-text-button ct-panel-close" onClick={onClose}>
            esc to close
          </button>
        </div>
        <p className="ct-panel-description">
          Pick a deep-dive to open as a full-screen agent pane. ↑↓ to move · enter to open.
        </p>

        {/* Filter box */}
        <div
          className="ct-setting"
          style={{ marginBottom: 14 }}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Filter projects… (e.g. market, java, dsa)"
            spellCheck={false}
            aria-label="Filter projects"
          />
        </div>

        {/* Options */}
        <div className="ct-option-list" ref={listRef} role="listbox" aria-label="Projects">
          {items.length === 0 && (
            <p style={{ color: "var(--color-comment)", fontSize: "0.85em", padding: "6px 12px" }}>
              No matches for “{query}”.
            </p>
          )}
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected={i === clampedIdx}
              className={`ct-option-button${i === clampedIdx ? " is-selected" : ""}`}
              onMouseEnter={() => setIdx(i)}
              onClick={() => pick(item)}
            >
              <span>
                {i + 1}. {item.label}
              </span>
              <span style={{ color: "var(--color-comment)", fontSize: "0.85em" }}>{item.detail}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
