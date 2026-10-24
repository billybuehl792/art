import React from "react";
import { styled } from "@mui/material/styles";
import {
  ButtonBase,
  ImageListItem,
  ImageListItemBar,
  type ImageListItemProps,
} from "@mui/material";
import type { Project } from "@/types/projects";

export interface ProjectGridItemProps extends Omit<
  ImageListItemProps,
  "children" | "onClick"
> {
  project: Project;
  onClick?: (project: Project) => void;
}

const StyledImageListItem = styled(ImageListItem)(({ theme }) => {
  const durationShort = `${theme.transitions.duration.shorter}ms`;
  const durationStandard = `${theme.transitions.duration.standard}ms`;
  const ease = theme.transitions.easing.easeInOut;

  return {
    aspectRatio: "1 / 1",
    "& .MuiImageListItemBar-root": {
      top: 0,
      textAlign: "center",
      color: "black",
      background: theme.alpha(theme.palette.background.paper, 0),
      transition: `background ${durationStandard} ${ease}`,
      "& .MuiImageListItemBar-titleWrap": {
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        opacity: 0,
        transition: `opacity ${durationStandard} ${ease}`,
        "& .MuiImageListItemBar-title": {
          width: "100%",
          fontWeight: 600,
          transform: "translateY(20px)",
          transition: `transform ${durationStandard} ${ease} ${durationShort}`,
        },
        "& .MuiImageListItemBar-subtitle": {
          width: "100%",
          transform: "translateY(30px)",
          transition: `transform ${durationStandard} ${ease} ${durationStandard}`,
        },
      },
    },
    "&:hover": {
      "& .MuiImageListItemBar-root": {
        background: theme.alpha(theme.palette.background.paper, 0.8),
        transition: `background ${durationStandard} ${ease}`,
        "& .MuiImageListItemBar-titleWrap": {
          opacity: 1,
          "& .MuiImageListItemBar-title": { transform: "translateY(0px)" },
          "& .MuiImageListItemBar-subtitle": { transform: "translateY(0px)" },
        },
      },
    },
  };
});

const srcset = (image: string, size = 1, rows = 1, cols = 1) => ({
  src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
  srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
});

const ProjectGridItem: React.FC<ProjectGridItemProps> = ({
  project,
  onClick,
  ...props
}) => {
  const Content = (
    <>
      <ImageListItemBar title={project.title} subtitle={project.subtitle} />
      <img
        {...srcset(project.mediaUrl ?? "")}
        alt={project.title}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </>
  );
  return (
    <StyledImageListItem {...props}>
      {onClick ? (
        <ButtonBase
          onClick={() => onClick(project)}
          sx={{ position: "relative", width: "100%", height: "100%" }}
        >
          {Content}
        </ButtonBase>
      ) : (
        Content
      )}
    </StyledImageListItem>
  );
};

export default ProjectGridItem;
