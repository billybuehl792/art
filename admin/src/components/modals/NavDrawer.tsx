import React from "react";
import {
  Divider,
  Drawer,
  type DrawerProps,
  IconButton,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import NavList from "../lists/NavList";
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
        <IconButton color="primary" onClick={handleOnClose}>
          <CloseIcon />
        </IconButton>
      </Toolbar>

      <Divider />

      <NavList
        onNavigate={handleOnClose}
        slotProps={{ list: { disablePadding: true } }}
        sx={{ flexGrow: 1, overflow: "auto" }}
      />
    </StyledDrawer>
  );
};

export default NavDrawer;
