import { forwardRef } from "react";
import { createLink } from "@tanstack/react-router";
import ListItemButton, {
  type ListItemButtonProps,
} from "@mui/material/ListItemButton";

const ListItemButtonLink = createLink(
  forwardRef<HTMLAnchorElement, ListItemButtonProps<"a">>((props, ref) => (
    <ListItemButton ref={ref} component="a" {...props} />
  )),
);

export default ListItemButtonLink;
