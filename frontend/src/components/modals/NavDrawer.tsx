import React from "react";
import { styled } from "@mui/material/styles";
import { Drawer, type DrawerProps, Stack, Typography } from "@mui/material";
import NavList from "../lists/NavList";
import SocialList from "../lists/SocialList";
import CloseIconButton from "../buttons/CloseIconButton";
import { APP_TITLE } from "../../constants";
import { truncateText } from "../../utils/sx";

const classes = { header: "drawer-header", footer: "drawer-footer" };

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": { height: "calc(100vh - 60px)" },
  [`& .${classes.header}`]: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    zIndex: 1,
  },
  [`& .${classes.footer}`]: {
    position: "sticky",
    bottom: 0,
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.divider}`,
    bgcolor: theme.palette.background.paper,
  },
}));

const NavDrawer: React.FC<DrawerProps> = ({ onClose, ...props }) => {
  /** Callbacks */

  const handleOnClose = () => onClose?.({}, "backdropClick");

  return (
    <StyledDrawer anchor="bottom" onClose={onClose} {...props}>
      <Stack className={classes.header} direction="row">
        <Typography variant="h2" sx={truncateText}>
          {APP_TITLE}
        </Typography>
        <CloseIconButton onClick={handleOnClose} />
      </Stack>

      <Stack sx={{ flexGrow: 1, overflow: "auto" }}>
        <NavList onNavigate={handleOnClose} sx={{ flexGrow: 1 }} />
        <Stack className={classes.footer}>
          <SocialList />
        </Stack>
      </Stack>
    </StyledDrawer>
  );
};

export default NavDrawer;
