import { useState, useEffect } from "react";

/**
 * useMediaQuery — Reactive CSS media query hook.
 * Re-renders when the query result changes (e.g. rotating a device or
 * resizing a window across a breakpoint), unlike one-off window.innerWidth reads.
 * @param {string} query - CSS media query, e.g. "(min-width: 768px)"
 * @returns {boolean} Whether the query currently matches
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
