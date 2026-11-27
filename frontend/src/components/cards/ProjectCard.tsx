import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import type { Project } from "@/types/projects";

interface ProjectCardProps extends CardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, ...props }) => {
  return (
    <Card {...props}>
      <CardContent>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h2">{project.title}</Typography>
            <Typography>{project.subtitle}</Typography>
            <Typography variant="caption">{project.description}</Typography>
          </Stack>
        </Stack>
        {!!project.mediaUrl && (
          <CardMedia
            component="img"
            height="194"
            image={project.mediaUrl}
            alt="Paella dish"
            sx={{ objectFit: "contain" }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
