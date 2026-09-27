import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { flushSync } from "react-dom";

const ThemeContext = createContext(null);
const STORAGE_KEY = "cw_theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // If the person never explicitly chose a theme, keep following the OS
  // setting live. Once they use the toggle, localStorage takes over (the
  // effect above already persists their explicit choice).
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return undefined;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      vtSwapRef.current = false;
      setTheme(e.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const animTimer = useRef(null);
  // True only for the render immediately after a View Transitions swap.
  // ThemeToggle reads this to let the VT crossfade own the icon transition
  // (avoids the icon popping in after the snapshot finishes).
  const vtSwapRef = useRef(false);

  // Clear the temporary transition class on unmount so it never leaks.
  useEffect(() => () => {
    if (animTimer.current) clearTimeout(animTimer.current);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    vtSwapRef.current = false;
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      const reduceMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduceMotion) {
        // Jalur utama: View Transitions API. Browser meng-capture snapshot
        // sebelum/sesudah lalu crossfade di compositor (GPU) — jauh lebih
        // mulus daripada menganimasikan ratusan elemen di main thread.
        // Sengaja TANPA class theme-anim di sini agar tidak ada kerja ganda.
        if (typeof document.startViewTransition === "function") {
          vtSwapRef.current = true;
          document.startViewTransition(() => {
            flushSync(() => {
              setTheme(next);
            });
          });
          return;
        }
        // Fallback (browser tanpa VT, mis. Firefox lama): transisi warna
        // ringan — hanya properti murah, tanpa box-shadow/fill/stroke.
        root.classList.add("theme-anim");
        // Paksa style recalc dulu: kalau class ditambah dan warna diganti
        // dalam satu recalc, browser bisa langsung "lompat" tanpa transisi.
        root.getBoundingClientRect();
        if (animTimer.current) clearTimeout(animTimer.current);
        animTimer.current = setTimeout(() => root.classList.remove("theme-anim"), 350);
      }
    }
    setTheme(next);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, vtSwapRef }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
