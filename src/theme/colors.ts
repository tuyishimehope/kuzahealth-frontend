/**
 * JS bridge to the design tokens in `src/styles/tokens.css`.
 *
 * Chart libraries (Recharts, ApexCharts, Chart.js, MUI x-charts) and the
 * Mantine/MUI themes need real color strings, not Tailwind classes. This
 * module reads the CSS variables at runtime so tokens.css stays the single
 * source of truth. Never hard-code hex values in components; use these.
 */

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
type Step = (typeof STEPS)[number];
export type Scale = Record<Step, string>;

const SCALE_NAMES = [
  "primary",
  "neutral",
  "info",
  "success",
  "warning",
  "danger",
  "highlight",
] as const;
type ScaleName = (typeof SCALE_NAMES)[number];

const toHex = (channels: string): string => {
  const parts = channels.trim().split(/[\s,]+/).map(Number);
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return "";
  return (
    "#" +
    parts
      .slice(0, 3)
      .map((n) => Math.round(n).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
};

/** Read a token (e.g. "primary", "primary-600", "chart-1") as a hex string. */
export function token(name: string): string {
  if (typeof window === "undefined") return "";
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim();
  const hex = toHex(raw);
  if (!hex && import.meta.env.DEV) {
    console.warn(`[theme] CSS variable --${name} is missing or invalid`);
  }
  return hex;
}

/** Same as token() but with alpha, e.g. alpha("primary", 0.2) */
export function alpha(name: string, a: number): string {
  const hex = token(name);
  if (!hex) return "";
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

const readScale = (name: ScaleName): Scale =>
  Object.fromEntries(STEPS.map((s) => [s, token(`${name}-${s}`)])) as Scale;

function buildColors() {
  const scales = Object.fromEntries(
    SCALE_NAMES.map((n) => [n, readScale(n)])
  ) as Record<ScaleName, Scale>;

  return {
    ...scales,

    // Semantic tokens
    background: token("background"),
    foreground: token("foreground"),
    card: token("card"),
    muted: token("muted"),
    mutedForeground: token("muted-foreground"),
    border: token("border"),
    ring: token("ring"),
    brandNavy: token("brand-navy"),
    brandMidnight: token("brand-midnight"),

    // Status shortcuts (500 step)
    status: {
      primary: scales.primary[600],
      info: scales.info[500],
      success: scales.success[500],
      warning: scales.warning[500],
      danger: scales.danger[500],
      highlight: scales.highlight[500],
      neutral: scales.neutral[400],
    },

    /** Ordered categorical palette for chart series */
    chart: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => token(`chart-${i}`)),
  };
}

export type Colors = ReturnType<typeof buildColors>;

let cache: Colors | null = null;

/** Resolved colors. Cached; call refreshColors() after switching theme. */
export function getColors(): Colors {
  if (!cache) cache = buildColors();
  return cache;
}

export function refreshColors(): Colors {
  cache = buildColors();
  return cache;
}

/**
 * Convenience proxy so components can write `colors.primary[600]` or
 * `colors.chart[0]` without calling getColors() themselves.
 */
export const colors: Colors = new Proxy({} as Colors, {
  get: (_t, key) => getColors()[key as keyof Colors],
});

/** Mantine v6 wants 10 shades (0–9). Map them onto the 50–900 steps. */
export const mantineShades = (s: Scale) =>
  [s[50], s[100], s[200], s[300], s[400], s[500], s[600], s[700], s[800], s[900]] as [
    string, string, string, string, string, string, string, string, string, string,
  ];
