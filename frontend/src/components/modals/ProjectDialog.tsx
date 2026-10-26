import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Dialog,
  DialogContent,
  Skeleton,
  type DialogProps,
} from "@mui/material";
import DialogHeader from "../layout/DialogHeader";
import ProjectOptionsIconButton from "../buttons/ProjectOptionsIconButton";
import StatusCard from "../cards/StatusCard";
import { apiQueries } from "@/queries";
import { NULL_ID } from "@/constants";
import { sxArray } from "@/utils/sx";
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
      <DialogHeader
        title={project?.title}
        subtitle={project?.subtitle}
        loading={projectQuery.isLoading}
        onClose={handleOnClose}
        {...(!!project && {
          endContent: <ProjectOptionsIconButton project={project} />,
        })}
      />
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
          ) : projectQuery.isError ? (
            <StatusCard
              status="error"
              message={projectQuery.error.message}
              sx={{ flexGrow: 1 }}
            />
          ) : project?.mediaUrl ? (
            <Box
              component="img"
              src={project.mediaUrl}
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
          ) : null}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
