import { useState, useCallback, useEffect } from "react";
import { loadString, saveString } from "../utils/storage";

const STORAGE_KEY = "forge-theme";

function getInitialTheme() {
  return loadString(STORAGE_KEY, {
    validate: (v) => v === "dark" || v === "light",
    // System preference is the fallback, not an error state.
    fallback: () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  });
}

export default function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next = prev === "dark" ? "light" : "dark";
      saveString(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
