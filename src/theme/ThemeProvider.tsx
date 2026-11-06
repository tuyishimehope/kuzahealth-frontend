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
