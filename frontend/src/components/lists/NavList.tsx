import React, { useMemo } from "react";
import {
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  Stack,
  type StackProps,
} from "@mui/material";
import {
  Home as HomeIcon,
  Brush as BrushIcon,
  Code as CodeIcon,
  ContactPage as ContactPageIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import ListItemButtonLink from "../links/ListItemButtonLink";

interface NavListProps extends StackProps {
  onNavigate?: VoidFunction;
}

const NavList: React.FC<NavListProps> = ({ onNavigate, ...props }) => {
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
      <List>
        <ListItemButtonLink to="/" {...buttonProps}>
          <ListItemIcon children={<HomeIcon />} />
          <ListItemText primary="home" />
        </ListItemButtonLink>

        <ListItemButtonLink to="/art" {...buttonProps}>
          <ListItemIcon children={<BrushIcon />} />
          <ListItemText primary="art" />
        </ListItemButtonLink>

        <ListItemButtonLink to="/dev" {...buttonProps}>
          <ListItemIcon children={<CodeIcon />} />
          <ListItemText primary="dev" />
        </ListItemButtonLink>

        <ListItemButtonLink to="/contact" {...buttonProps}>
          <ListItemIcon children={<ContactPageIcon />} />
          <ListItemText primary="contact" />
        </ListItemButtonLink>

        <ListItemButtonLink to="/admin" {...buttonProps}>
          <ListItemIcon children={<AdminIcon />} />
          <ListItemText primary="admin" />
        </ListItemButtonLink>
      </List>
    </Stack>
  );
};

export default NavList;
