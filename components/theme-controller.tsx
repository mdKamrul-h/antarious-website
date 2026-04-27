"use client";

import { useEffect } from "react";

/** Site is light-only: no dark mode or system theme following. */
const LIGHT = "light" as const;

const applyLightOnly = () => {
  document.documentElement.setAttribute("data-theme", LIGHT);
  document.documentElement.classList.remove("dark");
  document.documentElement.style.colorScheme = "light";
  try {
    window.localStorage.setItem("antarious-theme", LIGHT);
  } catch {
    /* ignore */
  }
};

declare global {
  interface Window {
    toggleTheme?: () => void;
    setAntariousTheme?: (theme: typeof LIGHT) => void;
  }
}

export default function ThemeController() {
  useEffect(() => {
    applyLightOnly();

    window.toggleTheme = () => applyLightOnly();
    window.setAntariousTheme = () => applyLightOnly();

    return () => {
      delete window.toggleTheme;
      delete window.setAntariousTheme;
    };
  }, []);

  return null;
}
