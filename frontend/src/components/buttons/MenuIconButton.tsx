import React from "react";
import { Box, IconButton, Tooltip, type IconButtonProps } from "@mui/material";
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
} from "@mui/icons-material";

interface MenuButtonProps extends IconButtonProps {
  open?: boolean;
  title?: string;
}

const MenuIconButton: React.FC<MenuButtonProps> = ({
  open,
  title = "Menu",
  ...props
}) => {
  return (
    <Tooltip title={title}>
      <Box component="span">
        <IconButton aria-label={title} color="primary" {...props}>
          {open ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default MenuIconButton;
