import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  type ImageListProps,
} from "@mui/material";
import { apiQueries } from "@/queries";
import { sxArray } from "@/utils/sx";
import { styled } from "@mui/material/styles";
import type { Project } from "@/types/projects";

const StyledImageListItem = styled(ImageListItem)(({ theme }) => {
  const durationShort = `${theme.transitions.duration.shorter}ms`;
  const durationStandard = `${theme.transitions.duration.standard}ms`;
  const ease = theme.transitions.easing.easeInOut;
  const transitionOpacity = `opacity ${durationStandard} ${ease}`;

  return {
    "& img": {
      opacity: 1,
      transition: transitionOpacity,
    },
    "& .MuiImageListItemBar-root": {
      opacity: 0,
      top: 0,
      background: "none",
      transition: transitionOpacity,
    },
    "&:hover": {
      cursor: "pointer",
      "& img": { opacity: 0.25 },
      "& .MuiImageListItemBar-root": {
        opacity: 1,
        transition: `${transitionOpacity} ${durationShort}`,
      },
    },
  };
});

const srcset = (image: string, size: number, rows = 1, cols = 1) => ({
  src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
  srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
});

const ProjectGrid: React.FC<Omit<ImageListProps, "children">> = (props) => {
  /** Values */

  const projectListQuery = useQuery(apiQueries.projects.get());
  const projects = projectListQuery.data?.data.results ?? [];

  /** Callbacks */

  const handleProjectOnClick = (project: Project) => {
    console.log(project);
  };

  return (
    <ImageList
      cols={3}
      rowHeight="auto"
      gap={1}
      {...props}
      sx={sxArray({ overflow: "visible" }, props?.sx)}
    >
      {projects.map((project) => (
        <StyledImageListItem
          key={project.id}
          onClick={() => handleProjectOnClick(project)}
        >
          <ImageListItemBar title={project.title} />
          <img
            {...srcset(project.mediaUrl ?? "", 200)}
            alt={project.title}
            loading="lazy"
          />
        </StyledImageListItem>
      ))}
    </ImageList>
  );
};

export default ProjectGrid;
