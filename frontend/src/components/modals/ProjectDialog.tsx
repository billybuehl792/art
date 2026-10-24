import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Container,
  Dialog,
  IconButton,
  Skeleton,
  Toolbar,
  Typography,
  type DialogProps,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { apiQueries } from "@/queries";
import { truncateText } from "@/utils/sx";
import { NULL_ID } from "@/constants";
import type { Project } from "@/types/projects";

interface ProjectDialogProps extends DialogProps {
  project: Project | Project["id"] | null;
}

const ProjectDialog: React.FC<ProjectDialogProps> = ({
  open: openProp,
  project: projectProp,
  onClose,
  onTransitionExited,
  ...props
}) => {
  /** Values */

  const [closing, setClosing] = useState(false);
  const open = openProp && !closing;

  const isId = typeof projectProp === "number";
  const projectId = isId ? projectProp : (projectProp?.id ?? NULL_ID);

  /** Queries */

  const projectQuery = useQuery({
    ...apiQueries.projects.project(projectId).get(),
    enabled: isId,
  });

  /** Data */

  const project = (isId ? projectQuery.data?.data : projectProp) ?? null;

  /** Callbacks */

  const handleOnClose = () => setClosing(true);

  const handleOnClosed = () => {
    setClosing(false);
    onClose?.({}, "backdropClick");
    onTransitionExited?.();
  };

  return (
    <Dialog
      open={open}
      fullScreen
      closeAfterTransition
      onClose={handleOnClose}
      onTransitionExited={handleOnClosed}
      {...props}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h2" sx={truncateText}>
          {projectQuery.isLoading ? (
            <Skeleton variant="text" sx={{ width: 200, maxWidth: "100%" }} />
          ) : (
            project?.title
          )}
        </Typography>
        <IconButton color="primary" onClick={handleOnClose}>
          <CloseIcon />
        </IconButton>
      </Toolbar>

      <Container
        disableGutters
        sx={(theme) => ({
          position: "absolute",
          display: "flex",
          top: `${theme.layout.appBarHeight}px`,
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: "column",
          overflow: "auto",
        })}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: "100%",
            minHeight: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          {projectQuery.isLoading ? (
            <Skeleton sx={{ width: "100%", height: "100%" }} />
          ) : (
            <Box
              component="img"
              src={project?.mediaUrl ?? ""}
              loading="lazy"
              sx={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
              }}
            />
          )}
        </Box>
      </Container>
    </Dialog>
  );
};

export default ProjectDialog;
