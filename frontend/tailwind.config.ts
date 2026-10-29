import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "selector",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        paper: {
          light: "#EFF6F1",
          dark: "#0C110E",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#141916",
        },
      },
    },
  },
  plugins: [],
};

export default config;
