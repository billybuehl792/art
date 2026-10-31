import React from "react";
import {
  Divider,
  Drawer,
  type DrawerProps,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import NavList from "../lists/NavList";
import { truncateText } from "@/utils";
import { APP_TITLE } from "@/constants";

const NavDrawer: React.FC<DrawerProps> = ({ onClose, ...props }) => {
  /** Callbacks */

  const handleOnClose = () => onClose?.({}, "backdropClick");

  return (
    <Drawer anchor="bottom" onClose={onClose} {...props}>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          p: 1.5,
        }}
      >
        <Typography variant="h2" sx={truncateText}>
          {APP_TITLE}
        </Typography>
        <IconButton color="primary" onClick={handleOnClose}>
          <CloseIcon />
        </IconButton>
      </Stack>

      <Divider />

      <NavList
        onNavigate={handleOnClose}
        slotProps={{ list: { disablePadding: true } }}
        sx={{ flexGrow: 1, overflow: "auto" }}
      />
    </Drawer>
  );
};

export default NavDrawer;
