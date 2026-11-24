import React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  ButtonBase,
  ImageListItem,
  ImageListItemBar,
  type ImageListItemProps,
} from "@mui/material";
import { ImageOutlined as ImageOutlinedIcon } from "@mui/icons-material";
import type { Project } from "@/types/projects";

export interface ProjectGridItemProps extends Omit<
  ImageListItemProps,
  "children" | "onClick"
> {
  project: Project;
  disabled?: boolean;
  onClick?: (project: Project) => void;
}

const StyledImageListItem = styled(ImageListItem)(({ theme }) => {
  const durationShort = `${theme.transitions.duration.shorter}ms`;
  const durationStandard = `${theme.transitions.duration.standard}ms`;
  const ease = theme.transitions.easing.easeInOut;

  return {
    aspectRatio: "1 / 1",

    "& .MuiButtonBase-root": {
      position: "relative",
      width: "100%",
      height: "100%",
    },
    "& img": { width: "100%", height: "100%", objectFit: "cover" },
    "& .MuiImageListItem-placeholder": {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.disabled,
    },
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

const srcset = (image: string, size = 300) => ({
  src: `${image}?w=${size}&h=${size}&fit=crop&auto=format`,
  srcSet: `${image}?w=${size * 2}&h=${size * 2}&fit=crop&auto=format 2x`,
});

const ProjectGridItem: React.FC<ProjectGridItemProps> = ({
  project,
  disabled,
  onClick,
  ...props
}) => {
  /** Callbacks */

  const renderContent = () => (
    <>
      <ImageListItemBar title={project.title} subtitle={project.subtitle} />
      {project.thumbnailUrl ? (
        <img
          alt={project.title}
          {...srcset(project.thumbnailUrl)}
          loading="lazy"
        />
      ) : (
        <Box className="MuiImageListItem-placeholder">
          <ImageOutlinedIcon fontSize="large" />
        </Box>
      )}
    </>
  );

  return (
    <StyledImageListItem {...props}>
      {onClick ? (
        <ButtonBase disabled={disabled} onClick={() => onClick(project)}>
          {renderContent()}
        </ButtonBase>
      ) : (
        renderContent()
      )}
    </StyledImageListItem>
  );
};

export default ProjectGridItem;
