import animate from "tailwindcss-animate";

/**
 * All colors come from CSS variables in src/styles/tokens.css.
 * Do not add hex values here — edit tokens.css instead.
 */
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/** rgb(var(--name) / <alpha-value>) so opacity modifiers keep working */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** Build a 50–950 ramp from --{name}-{step} variables */
const scale = (name, extra = {}) => ({
  ...Object.fromEntries(STEPS.map((s) => [s, v(`${name}-${s}`)])),
  ...extra,
});

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palette ramps
        primary: scale("primary", {
          DEFAULT: v("primary"),
          foreground: v("primary-foreground"),
        }),
        neutral: scale("neutral"),
        info: scale("info", { DEFAULT: v("info-500") }),
        success: scale("success", { DEFAULT: v("success-500") }),
        warning: scale("warning", { DEFAULT: v("warning-500") }),
        danger: scale("danger", { DEFAULT: v("danger-500") }),
        highlight: scale("highlight", { DEFAULT: v("highlight-500") }),

        // Semantic tokens (shadcn-compatible)
        background: v("background"),
        foreground: v("foreground"),
        card: { DEFAULT: v("card"), foreground: v("card-foreground") },
        popover: { DEFAULT: v("popover"), foreground: v("popover-foreground") },
        secondary: { DEFAULT: v("secondary"), foreground: v("secondary-foreground") },
        muted: { DEFAULT: v("muted"), foreground: v("muted-foreground") },
        accent: { DEFAULT: v("accent"), foreground: v("accent-foreground") },
        destructive: { DEFAULT: v("destructive"), foreground: v("destructive-foreground") },
        border: v("border"),
        input: v("input"),
        ring: v("ring"),
        brand: { navy: v("brand-navy"), midnight: v("brand-midnight") },
        chart: Object.fromEntries(
          [1, 2, 3, 4, 5, 6, 7, 8].map((i) => [i, v(`chart-${i}`)])
        ),
      },
      backgroundImage: {
        heroImage: "url(./assets/image.png) !important",
        heroVideo: "url(./assets/heroVide.mp4)",
      },
    },
  },
  plugins: [animate],
};
