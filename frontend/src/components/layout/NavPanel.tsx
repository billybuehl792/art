import React from "react";
import { styled, ThemeProvider, useTheme } from "@mui/material/styles";
import { Link as TanstackLink } from "@tanstack/react-router";
import {
  Divider,
  Drawer,
  type DrawerProps,
  Link,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import NavList from "../lists/NavList";
import SocialList from "../lists/SocialList";
import { darkTheme, lightTheme } from "../../theme";
import { APP_TITLE } from "../../constants";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  width: theme.layout.navPanelWidth,
  display: "flex",
  flexShrink: 0,
  zIndex: theme.zIndex.appBar,
  "& .MuiDrawer-paper": {
    width: theme.layout.navPanelWidth,
  },
}));

const NavPanel: React.FC<DrawerProps> = (props) => {
  /** Values */

  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";

  return (
    <ThemeProvider theme={isLightMode ? darkTheme : lightTheme}>
      <StyledDrawer component="nav" variant="permanent" {...props}>
        <Toolbar>
          <Link component={TanstackLink} to="/" underline="none">
            <Typography variant="h1">{APP_TITLE}</Typography>
          </Link>
        </Toolbar>

        <Divider />

        <Stack sx={{ flexGrow: 1 }}>
          <NavList />
        </Stack>

        <Divider />

        <SocialList sx={{ p: 2 }} />
      </StyledDrawer>
    </ThemeProvider>
  );
};

export default NavPanel;
