"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "theme";

const ThemeContext = createContext(null);

function systemTheme() {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function resolve(mode) {
  return mode === "system" ? systemTheme() : mode;
}

function applyTheme(resolved) {
  document.documentElement.setAttribute("data-theme", resolved);
}

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState("system");
  const [resolved, setResolved] = useState("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initial =
      stored === "dark" || stored === "light" || stored === "system"
        ? stored
        : "system";
    setModeState(initial);
    setResolved(resolve(initial));
    applyTheme(resolve(initial));
  }, []);

  useEffect(() => {
    if (mode !== "system") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = resolve("system");
      setResolved(next);
      applyTheme(next);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [mode]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY) return;
      const next = event.newValue || "system";
      setModeState(next);
      const r = resolve(next);
      setResolved(r);
      applyTheme(r);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setMode = useCallback((next) => {
    setModeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    const r = resolve(next);
    setResolved(r);
    applyTheme(r);
  }, []);

  const cycleMode = useCallback(() => {
    setModeState((current) => {
      const next =
        current === "dark" ? "light" : current === "light" ? "system" : "dark";
      window.localStorage.setItem(STORAGE_KEY, next);
      const r = resolve(next);
      setResolved(r);
      applyTheme(r);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ mode, resolved, setMode, cycleMode }),
    [mode, resolved, setMode, cycleMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

export const themeInitScript = `(function(){try{var m=localStorage.getItem("theme");var d;if(m==="dark"||m==="light"){d=m;}else if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches){d="light";}else{d="dark";}document.documentElement.setAttribute("data-theme",d);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;
