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
import { HomeIcon } from "@/constants/basic";
import { ProjectIcon } from "@/constants/projects";

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
      <List {...slotProps?.list}>
        <ListItemButtonLink to="/" {...buttonProps}>
          <ListItemIcon children={<HomeIcon />} />
          <ListItemText primary="Home" />
        </ListItemButtonLink>

        <ListItemButtonLink to="/projects" {...buttonProps}>
          <ListItemIcon children={<ProjectIcon />} />
          <ListItemText primary="Projects" />
        </ListItemButtonLink>
      </List>
    </Stack>
  );
};

export default NavList;
