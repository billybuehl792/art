import React from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Typography,
  type CardProps,
} from "@mui/material";
import type { Project } from "@/types";

export interface ProjectListItemProps extends Omit<CardProps, "onClick"> {
  project: Project;
  onClick?: (project: Project) => void;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  project,
  onClick,
  ...props
}) => {
  /** Components */

  const Content = (
    <CardContent>
      <Typography variant="h2" gutterBottom>
        {project.title}
      </Typography>
      {!!project.subtitle && (
        <Typography variant="h4" gutterBottom>
          {project.subtitle}
        </Typography>
      )}
      {!!project.description && (
        <Typography variant="caption">{project.description}</Typography>
      )}
    </CardContent>
  );

  return (
    <Card {...props}>
      {onClick ? (
        <CardActionArea onClick={() => onClick?.(project)}>
          {Content}
        </CardActionArea>
      ) : (
        Content
      )}
      {!!project.link && (
        <CardActions>
          <Button
            component="a"
            size="small"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            href={project.link}
          >
            View Project
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default ProjectListItem;
