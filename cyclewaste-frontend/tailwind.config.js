/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Every color resolves through a CSS variable (see src/index.css's
        // :root / .dark blocks), using Tailwind's "rgb(var(--x) / <alpha-value>)"
        // pattern. This means bg-moss, text-ink-soft, bg-signal/15, etc. all
        // automatically respond to the .dark class with zero per-component
        // dark: variants needed.
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        "ink-soft": "rgb(var(--color-ink-soft) / <alpha-value>)",
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        "paper-dim": "rgb(var(--color-paper-dim) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        moss: {
          DEFAULT: "rgb(var(--color-moss) / <alpha-value>)",
          deep: "rgb(var(--color-moss-deep) / <alpha-value>)",
        },
        signal: {
          DEFAULT: "rgb(var(--color-signal) / <alpha-value>)",
          deep: "rgb(var(--color-signal-deep) / <alpha-value>)",
        },
        copper: {
          DEFAULT: "rgb(var(--color-copper) / <alpha-value>)",
          deep: "rgb(var(--color-copper-deep) / <alpha-value>)",
        },
        danger: "rgb(var(--color-danger) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Space Grotesk", "IBM Plex Sans", "sans-serif"],
        body: ["IBM Plex Sans", "Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        sm2: "6px",
        md2: "14px",
        lg2: "28px",
      },
      boxShadow: {
        card: "0 1px 0 rgb(var(--color-ink) / 0.04), 0 12px 24px -16px rgb(var(--color-ink) / 0.28)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0 50%" },
        },
        auroraDrift: {
          "0%, 100%": { transform: "translate(0%, 0%) rotate(0deg) scale(1)" },
          "33%": { transform: "translate(3%, -4%) rotate(8deg) scale(1.05)" },
          "66%": { transform: "translate(-3%, 3%) rotate(-6deg) scale(0.98)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.4s ease infinite",
        "aurora-drift": "auroraDrift 18s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
