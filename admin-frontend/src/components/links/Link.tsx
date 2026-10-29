import { forwardRef } from "react";
import { createLink } from "@tanstack/react-router";
import { Link as MuiLink, type LinkProps } from "@mui/material";

const Link = createLink(
  forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
    return <MuiLink ref={ref} {...props} />;
  }),
);

export default Link;
