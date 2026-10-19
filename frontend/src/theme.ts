import "@mui/material/styles";
import { createTheme, type PaletteMode } from "@mui/material/styles";
import { hexToRgba, toRgbaString } from "./utils/color";

const DEFAULT_WHITE = "#f0f0f0";
const DEFAULT_BLACK = "#141414";

declare module "@mui/material/styles" {
  interface Theme {
    layout: {
      appBarHeight: number;
      navPanelWidth: number;
      footerHeight: number;
      pageHeaderHeight: number;
    };
  }
  interface ThemeOptions {
    layout?: {
      appBarHeight: number;
      navPanelWidth?: number;
      footerHeight?: number;
      pageHeaderHeight?: number;
    };
  }
}

export const createAppTheme = (mode: PaletteMode = "dark") => {
  const isLight = mode === "light";

  return createTheme({
    layout: {
      appBarHeight: 60,
      navPanelWidth: 200,
      footerHeight: 32,
      pageHeaderHeight: 60,
    },
    palette: {
      mode,
      primary: {
        main: isLight ? DEFAULT_BLACK : DEFAULT_WHITE,
        dark: isLight ? "#000" : "#FFF",
        contrastText: isLight ? DEFAULT_WHITE : DEFAULT_BLACK,
      },
      background: {
        default: isLight ? DEFAULT_WHITE : DEFAULT_BLACK,
        paper: isLight ? DEFAULT_WHITE : DEFAULT_BLACK,
      },
      text: {
        primary: isLight ? DEFAULT_BLACK : DEFAULT_WHITE,
      },
    },
    typography: {
      fontFamily: "Raleway, sans-serif",
      subtitle1: { fontWeight: 800, fontSize: "1.5rem", lineHeight: 1.4 },
      subtitle2: { fontWeight: 600, fontSize: "1rem" },
      caption: { fontWeight: 400, fontSize: "0.75rem" },
      h1: { fontWeight: 700, fontSize: "1.5rem" },
      h2: { fontWeight: 600, fontSize: "1.25rem" },
      h3: { fontWeight: 600, fontSize: "1rem" },
      h4: { fontWeight: 600, fontSize: "0.85rem" },
      h5: { fontWeight: 500, fontSize: "0.75rem" },
      h6: { fontWeight: 500, fontSize: "0.7rem" },
    },
    shape: { borderRadius: 8 },
    zIndex: { appBar: 1100, drawer: 1200 },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            minHeight: theme.layout.appBarHeight,
            "& .MuiToolbar-root": { flexGrow: 1 },
          }),
        },
        defaultProps: { elevation: 0 },
      },
      MuiButton: {
        styleOverrides: { root: { textTransform: "none" } },
        defaultProps: { disableElevation: true },
      },
      MuiLink: {
        styleOverrides: {
          root: ({ theme }) => ({
            transition: "color 0.2s ease",
            ":hover": {
              color: toRgbaString(hexToRgba(theme.palette.text.primary, 0.4)),
            },
            ":active": {
              color: toRgbaString(hexToRgba(theme.palette.text.primary, 0.25)),
            },
          }),
        },
        defaultProps: { underline: "none" },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            "&[data-active='true']": {
              backgroundColor: theme.palette.action.selected,
              color: theme.palette.primary.main,
              "& .MuiListItemText-root": {
                "& .MuiTypography-root": { fontWeight: 600 },
              },
              "& .MuiListItemIcon-root": { color: theme.palette.primary.main },
            },
          }),
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    },
  });
};

export const lightTheme = createAppTheme("light");
export const darkTheme = createAppTheme("dark");
