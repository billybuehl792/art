import React, { useMemo } from "react";
import {
  List,
  ListItemIcon,
  ListItemText,
  type ListProps,
} from "@mui/material";
import {
  Home as HomeIcon,
  Brush as BrushIcon,
  Code as CodeIcon,
  ContactPage as ContactPageIcon,
} from "@mui/icons-material";
import ListItemButtonLink from "../links/ListItemButtonLink";

interface NavListProps extends ListProps {
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
    <List {...props}>
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
    </List>
  );
};

export default NavList;
