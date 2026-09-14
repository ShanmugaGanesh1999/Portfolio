import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ThemeContext = createContext({ theme: "dark", toggle: () => {}, setTheme: () => {} });

const THEME_BG = { dark: "#0d1117", light: "#ffffff" };

/**
 * ThemeProvider — Manages dark/light theme via data-theme attribute on <html>.
 * index.html applies the saved theme before first paint (no FOUC); this
 * provider keeps the attribute, localStorage, and <meta theme-color> in sync,
 * and applies a brief crossfade transition when switching.
 */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof document === "undefined") return "dark";
    const applied = document.documentElement.getAttribute("data-theme");
    if (applied === "light" || applied === "dark") return applied;
    try {
      return localStorage.getItem("sg-theme") === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("sg-theme", theme);
    } catch {
      /* private mode — ignore */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_BG[theme]);
  }, [theme]);

  const setTheme = useCallback((next) => {
    setThemeState((current) => {
      if (next === current) return current;
      const root = document.documentElement;
      root.classList.add("theme-transition");
      window.setTimeout(() => root.classList.remove("theme-transition"), 250);
      return next;
    });
  }, []);

  const toggle = useCallback(() => {
    setThemeState((current) => {
      const next = current === "dark" ? "light" : "dark";
      const root = document.documentElement;
      root.classList.add("theme-transition");
      window.setTimeout(() => root.classList.remove("theme-transition"), 250);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook + provider co-located by design
export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * DARK / LIGHT colour maps for SVG diagrams that use hardcoded hex values.
 * Components call useThemeColors() to get the right palette.
 */
const DARK_COLORS = {
  accent:   "#58a6ff",
  success:  "#3fb950",
  keyword:  "#ff7b72",
  variable: "#ffa657",
  func:     "#d2a8ff",
  string:   "#a5d6ff",
  comment:  "#8b949e",
  bg:       "#0d1117",
  sidebar:  "#161b22",
  border:   "#30363d",
  text:     "#c9d1d9",
};

const LIGHT_COLORS = {
  accent:   "#0969da",
  success:  "#16a34a",
  keyword:  "#d32f2f",
  variable: "#c2410c",
  func:     "#7c3aed",
  string:   "#0451a5",
  comment:  "#6a677d",
  bg:       "#ffffff",
  sidebar:  "#f3f3f3",
  border:   "#d1d5db",
  text:     "#1e1e1e",
};

/** Claude Code shell palettes (warm charcoal / ivory + terracotta). */
const CLAUDE_DARK_COLORS = {
  accent:   "#d97757",
  success:  "#4eba65",
  keyword:  "#ff6b80",
  variable: "#d4a27f",
  func:     "#a3b78c",
  string:   "#b1b9f9",
  comment:  "#a8a29a",
  bg:       "#1f1e1d",
  sidebar:  "#262624",
  border:   "#3e3c37",
  text:     "#faf9f5",
};

const CLAUDE_LIGHT_COLORS = {
  accent:   "#d97757",
  success:  "#2c7a39",
  keyword:  "#ab2b3f",
  variable: "#a9583e",
  func:     "#788c5d",
  string:   "#6a9bcc",
  comment:  "#73726c",
  bg:       "#faf9f5",
  sidebar:  "#f0eee6",
  border:   "#d1cfc5",
  text:     "#141413",
};

/** Codex shell palettes (neutral charcoal/white + cyan accent). */
const CODEX_DARK_COLORS = {
  accent:   "#6fd0e2",
  success:  "#2ea043",
  keyword:  "#f85149",
  variable: "#f2cc60",
  func:     "#cba6f7",
  string:   "#a6e3a1",
  comment:  "#8f9092",
  bg:       "#0e0f10",
  sidebar:  "#17181b",
  border:   "#2a2c30",
  text:     "#e6e6e3",
};

const CODEX_LIGHT_COLORS = {
  accent:   "#005f87",
  success:  "#1a7f37",
  keyword:  "#cf222e",
  variable: "#953800",
  func:     "#8250df",
  string:   "#116329",
  comment:  "#6e6e73",
  bg:       "#ffffff",
  sidebar:  "#f7f7f8",
  border:   "#e5e5e7",
  text:     "#202124",
};

/**
 * useThemeColors — Returns the colour hex map that matches the current theme
 * (and the active shell: VS Code, Claude Code, or Codex). Use this in SVG
 * diagram components instead of hardcoded hex values.
 */
// eslint-disable-next-line react-refresh/only-export-components -- hook + provider co-located by design
export function useThemeColors() {
  const { theme } = useTheme();
  const shell =
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-shell")
      : null;
  if (shell === "claude") {
    return theme === "light" ? CLAUDE_LIGHT_COLORS : CLAUDE_DARK_COLORS;
  }
  if (shell === "codex") {
    return theme === "light" ? CODEX_LIGHT_COLORS : CODEX_DARK_COLORS;
  }
  return theme === "light" ? LIGHT_COLORS : DARK_COLORS;
}
