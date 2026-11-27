import React from "react";
import { styled } from "@mui/material/styles";
import { Drawer, type DrawerProps, Stack } from "@mui/material";
import NavList from "../lists/NavList";
import SocialList from "../lists/SocialList";
import Link from "../links/Link";
import { APP_TITLE } from "../../constants";
import { truncateText } from "@/utils/sx";

const classes = { header: "nav-panel-header", footer: "nav-panel-footer" };

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  width: theme.layout.navPanelWidth,
  display: "flex",
  flexShrink: 0,
  zIndex: theme.zIndex.appBar,

  "& .MuiDrawer-paper": { width: theme.layout.navPanelWidth },

  [`& .${classes.header}`]: {
    height: theme.layout.appBarHeight,
    alignItems: "center",
    justifyContent: "center",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  [`& .${classes.footer}`]: {
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}));

const NavPanel: React.FC<DrawerProps> = (props) => {
  return (
    <StyledDrawer component="nav" variant="permanent" {...props}>
      <Stack className={classes.header}>
        <Link variant="h1" to="/" sx={truncateText}>
          {APP_TITLE}
        </Link>
      </Stack>

      <Stack sx={{ flexGrow: 1, overflow: "auto" }}>
        <NavList />
      </Stack>

      <SocialList className={classes.footer} />
    </StyledDrawer>
  );
};

export default NavPanel;
