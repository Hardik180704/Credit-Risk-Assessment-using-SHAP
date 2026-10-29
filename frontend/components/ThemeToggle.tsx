"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-3.5 w-3.5"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.3 4.3l1.4 1.4M18.3 18.3l1.4 1.4M2.5 12h2M19.5 12h2M4.3 19.7l1.4-1.4M18.3 5.7l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  const base =
    "grid h-6 w-6 place-items-center rounded-full transition-colors duration-150";

  const idle =
    "text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-200";

  const activeLight =
    "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900";

  const activeDark = "bg-stone-100 text-stone-900 dark:bg-stone-900 dark:text-stone-100";

  return (
    <span
      role="group"
      aria-label="Color theme"
      className="inline-flex items-center gap-0.5 rounded-full border border-stone-200 bg-white p-0.5 dark:border-stone-800 dark:bg-stone-900"
    >
      <button
        type="button"
        aria-label="Switch to light mode"
        aria-pressed={isDark ? false : mounted}
        onClick={() => setTheme("light")}
        className={`${base} ${mounted && !isDark ? activeLight : idle}`}
      >
        <SunIcon />
      </button>
      <button
        type="button"
        aria-label="Switch to dark mode"
        aria-pressed={isDark}
        onClick={() => setTheme("dark")}
        className={`${base} ${isDark ? activeDark : idle}`}
      >
        <MoonIcon />
      </button>
    </span>
  );
}
