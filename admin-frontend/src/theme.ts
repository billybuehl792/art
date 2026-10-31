import "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { drawerClasses } from "@mui/material";

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

export const createAppTheme = () =>
  createTheme({
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: DEFAULT_BLACK,
            dark: "#000",
            contrastText: DEFAULT_WHITE,
          },
          background: { default: DEFAULT_WHITE, paper: DEFAULT_WHITE },
          text: { primary: DEFAULT_BLACK, secondary: "#666666" },
        },
      },
      dark: {
        palette: {
          primary: {
            main: DEFAULT_WHITE,
            dark: "#FFF",
            contrastText: DEFAULT_BLACK,
          },
          background: { default: DEFAULT_BLACK, paper: DEFAULT_BLACK },
          text: { primary: DEFAULT_WHITE, secondary: "#BBBBBB" },
        },
      },
    },
    layout: {
      appBarHeight: 60,
      navPanelWidth: 200,
      footerHeight: 32,
      pageHeaderHeight: 60,
    },
    typography: {
      fontFamily: "Raleway, sans-serif",
      subtitle1: { fontWeight: 600, fontSize: "1.5rem", lineHeight: 1.4 },
      subtitle2: { fontWeight: 500, fontSize: "0.8rem" },
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
      MuiAppBar: { defaultProps: { elevation: 0 } },
      MuiButton: {
        styleOverrides: { root: { textTransform: "none" } },
        defaultProps: { disableElevation: true },
      },
      MuiCard: { defaultProps: { variant: "outlined" } },
      MuiCardHeader: {
        styleOverrides: { title: ({ theme }) => ({ ...theme.typography.h3 }) },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: ({ theme }) => ({
            "&:first-of-type": { paddingTop: theme.spacing(2) },
          }),
        },
      },
      MuiDrawer: {
        styleOverrides: {
          root: {
            [`&.${drawerClasses.anchorRight} > .${drawerClasses.paper}`]: {
              minWidth: 300,
            },
          },
        },
      },
      MuiLink: { defaultProps: { underline: "none" } },
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
      MuiImageList: { styleOverrides: { root: () => ({ margin: 0 }) } },
      MuiImageListItemBar: {
        styleOverrides: {
          titleWrap: ({ theme }) => ({ color: theme.palette.text.primary }),
          title: ({ theme }) => ({ color: theme.palette.text.primary }),
          subtitle: ({ theme }) => ({ color: theme.palette.text.secondary }),
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiToolbar: {
        styleOverrides: {
          root: ({ theme }) => ({
            minHeight: theme.layout.appBarHeight,
            borderBottom: `1px solid ${theme.palette.divider}`,
            [`@media (min-width: 0px) and (orientation: landscape)`]: {
              minHeight: theme.layout.appBarHeight,
            },
          }),
        },
      },
    },
  });
