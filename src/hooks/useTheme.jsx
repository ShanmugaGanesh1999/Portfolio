import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ThemeContext = createContext({ theme: "dark", toggle: () => {} });

/**
 * ThemeProvider — Manages dark/light theme via data-theme attribute on <html>.
 * Persists preference to localStorage.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("sg-theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sg-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme — Access current theme and toggle function.
 */
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
  comment:  "#6a737d",
  bg:       "#ffffff",
  sidebar:  "#f3f3f3",
  border:   "#d1d5db",
  text:     "#1e1e1e",
};

/**
 * useThemeColors — Returns the colour hex map that matches the current theme.
 * Use this in SVG diagram components instead of hardcoded COLOR_HEX / C objects.
 */
export function useThemeColors() {
  const { theme } = useTheme();
  return theme === "light" ? LIGHT_COLORS : DARK_COLORS;
}
