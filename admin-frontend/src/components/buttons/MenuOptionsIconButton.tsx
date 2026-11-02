import React, { useState } from "react";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  type IconButtonProps,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import type { MenuOption } from "@/types";

interface MenuOptionsIconButtonProps extends IconButtonProps {
  options: MenuOption[];
}

const MenuOptionsIconButton: React.FC<MenuOptionsIconButtonProps> = ({
  options,
  ...props
}) => {
  /** Values */

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  /** Callbacks */

  const handleOnClick: IconButtonProps["onClick"] = (event) =>
    setAnchorEl(event.currentTarget);

  const handleOnClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton {...props} onClick={handleOnClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleOnClose}>
        {options
          .filter(({ render }) => render != false)
          .map(({ id, title, subtitle, color, Icon, onClick }) => (
            <MenuItem
              key={id}
              onClick={() => {
                onClick();
                handleOnClose();
              }}
              sx={{ "& .MuiSvgIcon-root": { mr: 1 } }}
            >
              {!!Icon && (
                <ListItemIcon>
                  <Icon color={color} />
                </ListItemIcon>
              )}
              <ListItemText
                primary={title}
                secondary={subtitle}
                sx={{ color: `${color}.main` }}
              />
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};

export default MenuOptionsIconButton;
