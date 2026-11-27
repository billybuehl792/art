import React, { useMemo } from "react";
import {
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  Stack,
  type ListProps,
  type StackProps,
} from "@mui/material";
import ListItemButtonLink from "../links/ListItemButtonLink";
import { ICONS } from "@/constants";

interface NavListProps extends StackProps {
  onNavigate?: VoidFunction;
  slotProps?: { list?: ListProps };
}

const NavList: React.FC<NavListProps> = ({
  onNavigate,
  slotProps,
  ...props
}) => {
  /** Values */

  const buttonProps = useMemo(
    () => ({
      activeProps: { "data-active": true },
      onClick: onNavigate,
    }),
    [onNavigate],
  );

  return (
    <Stack divider={<Divider />} {...props}>
      <List disablePadding {...slotProps?.list}>
        <ListItemButtonLink to="/" {...buttonProps}>
          <ListItemIcon children={<ICONS.HOME />} />
          <ListItemText primary="home" />
        </ListItemButtonLink>

        <ListItemButtonLink to="/art" {...buttonProps}>
          <ListItemIcon children={<ICONS.ART />} />
          <ListItemText primary="art" />
        </ListItemButtonLink>

        <ListItemButtonLink to="/dev" {...buttonProps}>
          <ListItemIcon children={<ICONS.DEV />} />
          <ListItemText primary="dev" />
        </ListItemButtonLink>

        <ListItemButtonLink to="/contact" {...buttonProps}>
          <ListItemIcon children={<ICONS.CONTACT />} />
          <ListItemText primary="contact" />
        </ListItemButtonLink>

        <Divider />

        <ListItemButtonLink to="/settings" {...buttonProps}>
          <ListItemIcon children={<ICONS.SETTINGS />} />
          <ListItemText primary="settings" />
        </ListItemButtonLink>
      </List>
    </Stack>
  );
};

export default NavList;
