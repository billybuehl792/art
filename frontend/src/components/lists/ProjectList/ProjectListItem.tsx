import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  type CardProps,
} from "@mui/material";
import type { Project } from "@/types/projects";

export interface ProjectListItemProps extends CardProps {
  project: Project;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  project,
  ...props
}) => {
  return (
    <Card {...props}>
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
