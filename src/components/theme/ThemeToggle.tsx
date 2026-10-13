"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-card/60 hover:bg-card text-foreground/80 hover:text-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0 shadow-sm cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform duration-200 -rotate-12 hover:rotate-0" />
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}
