import React from "react";
import { styled } from "@mui/material/styles";
import {
  Divider,
  Drawer,
  type DrawerProps,
  Stack,
  Toolbar,
} from "@mui/material";
import NavList from "../lists/NavList";
import SocialList from "../lists/SocialList";
import Link from "../links/Link";
import { APP_TITLE } from "../../constants";
import { truncateText } from "@/utils/sx";

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
}));

const NavPanel: React.FC<DrawerProps> = (props) => {
  return (
    <StyledDrawer component="nav" variant="permanent" {...props}>
      <Toolbar>
        <Link variant="h1" to="/" sx={truncateText}>
          {APP_TITLE}
        </Link>
      </Toolbar>

      <Stack sx={{ flexGrow: 1, overflow: "auto" }}>
        <NavList />
      </Stack>

      <Divider />

      <SocialList sx={{ p: 2 }} />
    </StyledDrawer>
  );
};

export default NavPanel;
