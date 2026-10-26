import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  type DialogProps,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { apiQueries } from "@/queries";
import { NULL_ID } from "@/constants";
import { sxArray, truncateText } from "@/utils/sx";
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
      maxWidth="lg"
      fullWidth
      closeAfterTransition
      onClose={handleOnClose}
      onTransitionExited={handleOnClosed}
      {...props}
    >
      <Stack
        direction="row"
        sx={(theme) => ({
          justifyContent: "space-between",
          alignItems: "center",
          p: theme.spacing(2),
          borderBottom: `1px solid ${theme.palette.divider}`,
        })}
      >
        {projectQuery.isLoading ? (
          <Skeleton variant="text" sx={{ width: 200, maxWidth: "100%" }} />
        ) : (
          <Stack spacing={0.5} sx={{ flexGrow: 1, overflow: "hidden" }}>
            <Typography variant="h2" sx={truncateText}>
              {project?.title}
            </Typography>
            <Typography variant="subtitle2" sx={truncateText}>
              {project?.subtitle}
            </Typography>
          </Stack>
        )}
        <IconButton aria-label="close" onClick={handleOnClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <DialogContent>
        <Box
          sx={sxArray({
            position: "relative",
            display: "flex",
            alignItems: "center",
            minHeight: 300,
          })}
        >
          {projectQuery.isLoading ? (
            <Skeleton
              variant="rounded"
              sx={{ position: "absolute", width: "100%", height: "100%" }}
            />
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
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
