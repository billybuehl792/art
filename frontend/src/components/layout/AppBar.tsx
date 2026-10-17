import React, { useState } from "react";
import { Link as TanstackLink } from "@tanstack/react-router";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  useTheme,
  ThemeProvider,
  Link,
  IconButton,
  Stack,
  type AppBarProps,
} from "@mui/material";
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
} from "@mui/icons-material";
import NavDrawer from "../modals/NavDrawer";
import { darkTheme, lightTheme } from "../../theme";
import { APP_TITLE } from "../../constants";

const AppBar: React.FC<AppBarProps> = (props) => {
  /** Values */

  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";

  /** Callbacks */

  const handleToggleMenuOpen = () => setMenuOpen((open) => !open);

  return (
    <ThemeProvider theme={isLightMode ? darkTheme : lightTheme}>
      <MuiAppBar position="fixed" color="default" {...props}>
        <Toolbar sx={{ position: "relative", justifyContent: "center" }}>
          <Link component={TanstackLink} to="/" underline="none">
            <Typography variant="h1">{APP_TITLE}</Typography>
          </Link>

          <Stack
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              mr: 2,
              justifyContent: "center",
            }}
          >
            <IconButton color="primary" onClick={handleToggleMenuOpen}>
              {menuOpen ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          </Stack>
        </Toolbar>
      </MuiAppBar>

      <NavDrawer open={menuOpen} onClose={handleToggleMenuOpen} />
    </ThemeProvider>
  );
};

export default AppBar;
