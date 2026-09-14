// ============================================================
// SPINNER — the Claude Code working indicator.
// Glyph ping-pong (· ✢ ✳ ✶ ✻ ✽), a whimsical gerund verb,
// elapsed time, and a live token counter.
// ============================================================

import { useState, useEffect } from "react";
import {
  SPINNER_FRAMES,
  formatElapsed,
  formatTokens,
  pastTense,
} from "./verbs";

const FRAME_MS = 120;

/**
 * @param {boolean} active   Spinner animates while true
 * @param {string}  verb     Gerund ("Pondering")
 * @param {number}  startedAt Timestamp (ms)
 * @param {number}  tokens   Live token count (chars ÷ 4)
 */
export default function Spinner({ active, verb, startedAt, tokens = 0 }) {
  const [frame, setFrame] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      setFrame((f) => (f + 1) % SPINNER_FRAMES.length);
      setElapsed(Date.now() - startedAt);
    };
    if (reduce) {
      tick();
      return;
    }
    const id = setInterval(tick, FRAME_MS);
    return () => clearInterval(id);
  }, [active, startedAt]);

  const glyph = active
    ? SPINNER_FRAMES[frame]
    : SPINNER_FRAMES[4]; // ✻ at rest

  return (
    <span
      className="inline-flex items-baseline gap-1.5 text-xs font-mono select-none"
      role="status"
      aria-label={active ? `${verb} — ${formatElapsed(elapsed)}` : undefined}
    >
      <span className="text-accent w-4 inline-block text-center">{glyph}</span>
      {active ? (
        <>
          <span className="text-comment italic">{verb}…</span>
          <span className="text-comment/60">
            ({formatElapsed(elapsed)}
            {tokens > 0 && <> · ↓ {formatTokens(tokens)} tokens</>})
          </span>
        </>
      ) : null}
    </span>
  );
}

/** Finished line: "✻ Sautéed for 1m 19s" (＋ optional token count). */
export function SpinnerDone({ verb, ms, tokens = 0 }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 text-xs font-mono text-comment/60 select-none">
      <span className="text-accent/70 w-4 inline-block text-center">✻</span>
      <span>
        {pastTense(verb)} for {formatElapsed(ms)}
        {tokens > 0 && <> · ↓ {formatTokens(tokens)} tokens</>}
      </span>
    </span>
  );
}
