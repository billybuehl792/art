import React from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Typography,
  type CardProps,
} from "@mui/material";
import MenuOptionsIconButton from "@/components/buttons/MenuOptionsIconButton";
import { sxArray, truncateText } from "@/utils/sx";
import type { MenuOption } from "@/types/basic";
import type { Project } from "@/types/projects";

export interface ProjectListCardProps extends Omit<CardProps, "onClick"> {
  project: Project;
  options?: MenuOption[];
  disabled?: boolean;
  onClick?: (project: Project) => void;
}

const ProjectListCard: React.FC<ProjectListCardProps> = ({
  project,
  options,
  disabled,
  onClick,
  ...props
}) => {
  /** Components */

  const Content = (
    <CardContent>
      <Typography variant="body2" sx={truncateText}>
        {project.title}
      </Typography>
      {/* {!!project.subtitle && (
        <Typography variant="h4" gutterBottom sx={truncateText}>
          {project.subtitle}
        </Typography>
      )}
      {!!project.description && (
        <Typography component="p" variant="caption" sx={truncateText}>
          {project.description}
        </Typography>
      )} */}
    </CardContent>
  );

  return (
    <Card {...props} sx={sxArray({ position: "relative" }, props?.sx)}>
      {onClick ? (
        <CardActionArea disabled={disabled} onClick={() => onClick?.(project)}>
          {Content}
        </CardActionArea>
      ) : (
        Content
      )}
      {!!options?.length && (
        <CardActions sx={{ position: "absolute", right: 0, top: 0, bottom: 0 }}>
          <MenuOptionsIconButton
            options={options}
            size="small"
            disabled={disabled}
          />
        </CardActions>
      )}
    </Card>
  );
};

export default ProjectListCard;
