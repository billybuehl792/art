import React from "react";
import { useMatches } from "@tanstack/react-router";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Typography,
  type BreadcrumbsProps as MuiBreadcrumbsProps,
} from "@mui/material";
import Link from "../links/Link";

const Breadcrumbs: React.FC<MuiBreadcrumbsProps> = (props) => {
  /** Values */

  const matches = useMatches();
  const breadcrumbs = matches.filter((match) => !!match.staticData.breadcrumb);

  return (
    <MuiBreadcrumbs {...props}>
      {breadcrumbs.map((match, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const { label, Icon, ...breadcrumb } = match.staticData.breadcrumb!;

        return isLast ? (
          <Typography key={match.id} color="text.primary" {...breadcrumb}>
            {label}
          </Typography>
        ) : (
          <Link
            key={match.id}
            to={match.fullPath}
            params={match.params}
            color="inherit"
            {...breadcrumb}
          >
            {label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
