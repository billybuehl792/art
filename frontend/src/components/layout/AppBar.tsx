import React, { useState } from "react";
import { AppBar as MuiAppBar, Toolbar, type AppBarProps } from "@mui/material";
import NavDrawer from "../modals/NavDrawer";
import Breadcrumbs from "./Breadcrumbs";
import MenuIconButton from "../buttons/MenuIconButton";

const AppBar: React.FC<AppBarProps> = (props) => {
  /** Values */

  const [menuOpen, setMenuOpen] = useState(false);

  /** Callbacks */

  const handleToggleMenuOpen = () => setMenuOpen((open) => !open);

  return (
    <>
      <MuiAppBar position="fixed" color="default" {...props}>
        <Toolbar>
          <Breadcrumbs />
          <MenuIconButton open={menuOpen} onClick={handleToggleMenuOpen} />
        </Toolbar>
      </MuiAppBar>

      <NavDrawer open={menuOpen} onClose={handleToggleMenuOpen} />
    </>
  );
};

export default AppBar;
