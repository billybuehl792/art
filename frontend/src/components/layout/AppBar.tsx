import React, { useState } from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Stack,
  type AppBarProps,
} from "@mui/material";
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
} from "@mui/icons-material";
import NavDrawer from "../modals/NavDrawer";
import Link from "../links/Link";
import { APP_TITLE } from "../../constants";
import { truncateText } from "@/utils/sx";

const AppBar: React.FC<AppBarProps> = (props) => {
  /** Values */

  const [menuOpen, setMenuOpen] = useState(false);

  /** Callbacks */

  const handleToggleMenuOpen = () => setMenuOpen((open) => !open);

  return (
    <>
      <MuiAppBar position="fixed" color="default" {...props}>
        <Toolbar>
          <Stack direction="row" sx={{ minWidth: 0, flexGrow: 1 }}>
            <Link variant="h1" to="/" sx={truncateText}>
              {APP_TITLE}
            </Link>
          </Stack>

          <IconButton color="primary" onClick={handleToggleMenuOpen}>
            {menuOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </MuiAppBar>

      <NavDrawer open={menuOpen} onClose={handleToggleMenuOpen} />
    </>
  );
};

export default AppBar;
