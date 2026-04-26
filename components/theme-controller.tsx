"use client";

import { useEffect } from "react";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "antarious-theme";

const isThemeMode = (value: string | null): value is ThemeMode => value === "light" || value === "dark";

const getCurrentTheme = (): ThemeMode => {
  const attrTheme = document.documentElement.getAttribute("data-theme");
  if (isThemeMode(attrTheme)) {
    return attrTheme;
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (isThemeMode(storedTheme)) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme: ThemeMode) => {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem(STORAGE_KEY, theme);
};

declare global {
  interface Window {
    toggleTheme?: () => void;
    setAntariousTheme?: (theme: ThemeMode) => void;
  }
}

export default function ThemeController() {
  useEffect(() => {
    applyTheme(getCurrentTheme());

    const setTheme = (theme: ThemeMode) => applyTheme(theme);
    const toggleTheme = () => {
      const nextTheme: ThemeMode = getCurrentTheme() === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    };

    window.toggleTheme = toggleTheme;
    window.setAntariousTheme = setTheme;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      const toggleNode = target.closest("[data-theme-toggle], .theme-toggle");
      if (!toggleNode) {
        return;
      }

      toggleTheme();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === "t") {
        event.preventDefault();
        toggleTheme();
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      const savedTheme = window.localStorage.getItem(STORAGE_KEY);
      if (!isThemeMode(savedTheme)) {
        applyTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
      mediaQuery.removeEventListener("change", handleMediaChange);
      delete window.toggleTheme;
      delete window.setAntariousTheme;
    };
  }, []);

  return null;
}
