"use client";

import React, { createContext, useContext, useCallback, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "tgk_theme";

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function getServerSnapshot(): Theme {
  return "dark";
}

function subscribeToTheme(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener("theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("theme-change", callback);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerSnapshot);

  const setTheme = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
    }
    document.documentElement.setAttribute("data-theme", newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    window.dispatchEvent(new Event("theme-change"));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
