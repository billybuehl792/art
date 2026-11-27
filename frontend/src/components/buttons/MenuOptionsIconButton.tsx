import React, { useState } from "react";
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  type IconButtonProps,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import type { MenuOption } from "@/types/basic";

interface MenuOptionsIconButtonProps extends IconButtonProps {
  options: MenuOption[];
}

const MenuOptionsIconButton: React.FC<MenuOptionsIconButtonProps> = ({
  options,
  disabled,
  ...props
}) => {
  /** Values */

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const filteredOptions = options.filter(({ render }) => render !== false);

  /** Callbacks */

  const handleOnClick: IconButtonProps["onClick"] = (event) =>
    setAnchorEl(event.currentTarget);

  const handleOnClose = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title="Options">
        <Box component="span">
          <IconButton
            disabled={disabled || !filteredOptions.length}
            {...props}
            onClick={handleOnClick}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleOnClose}>
        {filteredOptions.map(
          ({ id, title, subtitle, color, Icon, onClick }) => (
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
          ),
        )}
      </Menu>
    </>
  );
};

export default MenuOptionsIconButton;
