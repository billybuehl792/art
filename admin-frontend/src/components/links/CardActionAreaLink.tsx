import { forwardRef } from "react";
import { createLink } from "@tanstack/react-router";
import CardActionArea, {
  type CardActionAreaProps,
} from "@mui/material/CardActionArea";

const CardActionAreaLink = createLink(
  forwardRef<HTMLAnchorElement, CardActionAreaProps<"a">>(
    function CardActionAreaLink(props, ref) {
      return <CardActionArea ref={ref} component="a" {...props} />;
    },
  ),
);

export default CardActionAreaLink;
