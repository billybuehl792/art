import React, { useState } from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  type AppBarProps,
} from "@mui/material";
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
} from "@mui/icons-material";
import NavDrawer from "../modals/NavDrawer";
import Breadcrumbs from "./Breadcrumbs";

const AppBar: React.FC<AppBarProps> = (props) => {
  /** Values */

  const [menuOpen, setMenuOpen] = useState(false);

  /** Callbacks */

  const handleToggleMenuOpen = () => setMenuOpen((open) => !open);

  return (
    <>
      <MuiAppBar position="fixed" color="default" {...props}>
        <Toolbar>
          <Breadcrumbs
            sx={{
              flexGrow: 1,
              flexWrap: "nowrap",
              whiteSpace: "nowrap",
              overflow: "hidden",
              "& .MuiBreadcrumbs-ol": { flexWrap: "nowrap" },
            }}
          />
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
