import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Dialog,
  DialogContent,
  Skeleton,
  styled,
  type DialogProps,
} from "@mui/material";
import DialogHeader from "../layout/DialogHeader";
import StatusCard from "../cards/StatusCard";
import MenuOptionsIconButton from "../buttons/MenuOptionsIconButton";
import { projectQueries } from "@/queries/projects";
import { NULL_ID } from "@/constants";
import type { Project } from "@/types/projects";
import type { MenuOption } from "@/types/basic";

interface ProjectDialogProps extends Omit<DialogProps, "onClose"> {
  project: Project | Project["id"] | null;
  options?: MenuOption[] | ((project: Project) => MenuOption[]);
  onClose: VoidFunction;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: "calc(100% - 64px)",
    height: "calc(100% - 64px)",
    maxWidth: "none",
    maxHeight: "none",
    margin: theme.spacing(4),
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },

  "& .MuiDialogContent-root": {
    flex: "1 1 auto",
    minHeight: 0,
    minWidth: 0,
    overflow: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
}));

const ProjectDialog: React.FC<ProjectDialogProps> = ({
  open: openProp,
  project: projectProp,
  options: optionsProp,
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
    ...projectQueries.projects.project(projectId).get(),
    enabled: isId,
  });

  /** Data */

  const project = (isId ? projectQuery.data?.data : projectProp) ?? null;
  const options =
    (!!project &&
      !!optionsProp &&
      (typeof optionsProp === "function"
        ? optionsProp(project)
        : optionsProp
      ).filter(({ render }) => render !== false)) ||
    [];

  /** Callbacks */

  const handleOnClose = () => setClosing(true);

  const handleOnClosed = () => {
    setClosing(false);
    onClose();
    onTransitionExited?.();
  };

  return (
    <StyledDialog
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
        {...(!!options.length && {
          endContent: <MenuOptionsIconButton options={options} />,
        })}
      />
      <DialogContent>
        {projectQuery.isLoading ? (
          <Skeleton
            variant="rectangular"
            sx={{ width: "100%", height: "100%" }}
          />
        ) : projectQuery.isError || !project?.mediaUrl ? (
          <StatusCard
            status="empty"
            {...(projectQuery.error && {
              status: "error",
              message: projectQuery.error.message,
            })}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              border: 0,
            }}
          />
        ) : (
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
        )}
      </DialogContent>
    </StyledDialog>
  );
};

export default ProjectDialog;
