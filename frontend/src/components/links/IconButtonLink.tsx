import { forwardRef } from "react";
import { createLink } from "@tanstack/react-router";
import { IconButton, type IconButtonProps } from "@mui/material";

const IconButtonLink = createLink(
  forwardRef<HTMLAnchorElement, IconButtonProps>((props, ref) => (
    <IconButton ref={ref} component="a" {...props} />
  )),
);

export default IconButtonLink;
