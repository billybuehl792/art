import React from "react";
import { styled } from "@mui/material/styles";
import {
  Drawer,
  type DrawerProps,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import NavList from "../lists/NavList";
import SocialList from "../lists/SocialList";
import CloseIconButton from "../buttons/CloseIconButton";
import { APP_TITLE } from "../../constants";
import { truncateText } from "../../utils/sx";

const StyledDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": { height: "calc(100vh - 60px)" },
});

const NavDrawer: React.FC<DrawerProps> = ({ onClose, ...props }) => {
  /** Callbacks */

  const handleOnClose = () => onClose?.({}, "backdropClick");

  return (
    <StyledDrawer anchor="bottom" onClose={onClose} {...props}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h2" sx={truncateText}>
          {APP_TITLE}
        </Typography>
        <CloseIconButton onClick={handleOnClose} />
      </Toolbar>

      <Stack sx={{ flexGrow: 1, overflow: "auto" }}>
        <NavList onNavigate={handleOnClose} sx={{ flexGrow: 1 }} />
        <Stack
          sx={(theme) => ({
            position: "sticky",
            bottom: 0,
            display: "flex",
            alignItems: "center",
            p: 1,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
          })}
        >
          <SocialList />
        </Stack>
      </Stack>
    </StyledDrawer>
  );
};

export default NavDrawer;
