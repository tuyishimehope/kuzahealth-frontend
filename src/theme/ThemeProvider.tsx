import type { ReactNode} from "react";
import { useMemo } from "react";
import type { MantineThemeOverride } from "@mantine/core";
import { MantineProvider } from "@mantine/core";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { getColors, mantineShades } from "./colors";

/**
 * Feeds the design tokens (src/styles/tokens.css) into Mantine and MUI so
 * their components use the same palette as Tailwind.
 */
export function AppThemeProvider({ children }: { children: ReactNode }) {
  const c = getColors();

  const mantineTheme = useMemo<MantineThemeOverride>(() => {
    const brand = mantineShades(c.primary);
    const info = mantineShades(c.info);
    const success = mantineShades(c.success);
    const warning = mantineShades(c.warning);
    const danger = mantineShades(c.danger);
    return {
      primaryColor: "brand",
      primaryShade: 6,
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      headings: { fontFamily: "'Inter Tight', Inter, ui-sans-serif, sans-serif", fontWeight: 600 },
      defaultRadius: "md",
      black: c.foreground,
      shadows: {
        xs: "0 1px 2px rgba(11, 27, 63, 0.04)",
        sm: "0 1px 2px rgba(11, 27, 63, 0.04), 0 8px 24px -12px rgba(11, 27, 63, 0.12)",
        md: "0 1px 2px rgba(11, 27, 63, 0.04), 0 12px 32px -14px rgba(11, 27, 63, 0.16)",
        lg: "0 24px 60px -24px rgba(19, 47, 126, 0.30)",
        xl: "0 32px 80px -24px rgba(19, 47, 126, 0.35)",
      },
      components: {
        Paper: { defaultProps: { radius: "lg" } },
        Card: { defaultProps: { radius: "lg" } },
        Modal: { defaultProps: { radius: "lg" } },
        Button: { defaultProps: { radius: "md" } },
        Badge: { defaultProps: { radius: "sm" } },
        // Match the Tailwind `.field` style (src/index.css)
        Input: {
          styles: {
            input: {
              borderRadius: 12,
              borderColor: c.border,
              backgroundColor: c.card,
              fontSize: 14,
              boxShadow: "0 1px 2px rgba(11, 27, 63, 0.04)",
              transition: "border-color 150ms, box-shadow 150ms",
              "&::placeholder": { color: c.neutral[400] },
              "&:hover:not(:focus):not([data-invalid])": { borderColor: c.neutral[300] },
              "&:focus, &:focus-within": {
                borderColor: c.primary[500],
                boxShadow: `0 0 0 4px ${c.primary[500]}26`,
              },
              "&[data-invalid]": {
                borderColor: c.danger[400],
                backgroundColor: `${c.danger[50]}66`,
              },
              "&[data-invalid]:focus": { boxShadow: `0 0 0 4px ${c.danger[500]}26` },
            },
          },
        },
        InputWrapper: {
          styles: {
            label: { fontSize: 13, fontWeight: 500, color: c.foreground, marginBottom: 6 },
            description: { fontSize: 12, color: c.mutedForeground },
            error: { fontSize: 12, fontWeight: 500 },
          },
        },
      },
      colors: {
        brand,
        // Legacy color names used across the app now follow the tokens
        violet: brand,
        indigo: brand,
        grape: brand,
        purple: brand,
        blue: info,
        cyan: info,
        gray: mantineShades(c.neutral),
        green: success,
        teal: success,
        red: danger,
        orange: warning,
        yellow: warning,
        pink: mantineShades(c.highlight),
      },
    };
  }, [c]);

  const muiTheme = useMemo(
    () =>
      createTheme({
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          h1: { fontFamily: "'Inter Tight', Inter, sans-serif", fontWeight: 600 },
          h2: { fontFamily: "'Inter Tight', Inter, sans-serif", fontWeight: 600 },
          h3: { fontFamily: "'Inter Tight', Inter, sans-serif", fontWeight: 600 },
          h4: { fontFamily: "'Inter Tight', Inter, sans-serif", fontWeight: 600 },
          h5: { fontFamily: "'Inter Tight', Inter, sans-serif", fontWeight: 600 },
          h6: { fontFamily: "'Inter Tight', Inter, sans-serif", fontWeight: 600 },
          button: { textTransform: "none", fontWeight: 600 },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              rounded: { borderRadius: 16 },
              elevation1: {
                boxShadow: "0 1px 2px rgba(11, 27, 63, 0.04), 0 8px 24px -12px rgba(11, 27, 63, 0.12)",
                border: `1px solid ${c.border}`,
              },
            },
          },
          MuiButton: { defaultProps: { disableElevation: true } },
        },
        palette: {
          primary: {
            main: c.primary[600],
            light: c.primary[400],
            dark: c.primary[800],
            contrastText: "#FFFFFF",
          },
          secondary: { main: c.brandNavy, contrastText: "#FFFFFF" },
          error: { main: c.danger[500] },
          warning: { main: c.warning[500] },
          success: { main: c.success[500] },
          info: { main: c.info[500] },
          text: { primary: c.foreground, secondary: c.mutedForeground },
          divider: c.border,
          background: { default: c.background, paper: c.card },
        },
      }),
    [c]
  );

  return (
    <MantineProvider theme={mantineTheme}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </MantineProvider>
  );
}
