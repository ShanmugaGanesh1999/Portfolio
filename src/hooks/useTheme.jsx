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

/**
 * useThemeColors — Returns the colour hex map that matches the current theme.
 * Use this in SVG diagram components instead of hardcoded COLOR_HEX / C objects.
 */
// eslint-disable-next-line react-refresh/only-export-components -- hook + provider co-located by design
export function useThemeColors() {
  const { theme } = useTheme();
  return theme === "light" ? LIGHT_COLORS : DARK_COLORS;
}
