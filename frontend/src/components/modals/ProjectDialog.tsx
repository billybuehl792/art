import React, { forwardRef, useState, type ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Dialog,
  DialogContent,
  Skeleton,
  Slide,
  Stack,
  type DialogProps,
} from "@mui/material";
import DialogHeader from "../layout/DialogHeader";
import StatusCard from "../cards/StatusCard";
import MenuOptionsIconButton from "../buttons/MenuOptionsIconButton";
import { projectQueries } from "@/queries/projects";
import type { Project } from "@/types/projects";
import type { MenuOption } from "@/types/basic";
import type { TransitionProps } from "@mui/material/transitions";

interface ProjectDialogProps extends Omit<DialogProps, "onClose"> {
  project: Project | Project["id"] | null;
  options?: MenuOption[] | ((project: Project) => MenuOption[]);
  onClose: VoidFunction | (() => Promise<void>);
}

const Transition = forwardRef<
  unknown,
  TransitionProps & { children: ReactElement }
>((props, ref) => <Slide direction="up" ref={ref} {...props} />);

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
  const projectId = isId ? projectProp : (projectProp?.id ?? 0);

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

  const handleOnClosed = async () => {
    await onClose();
    setClosing(false);
    onTransitionExited?.();
  };

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      fullWidth
      closeAfterTransition
      slots={{ transition: Transition }}
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
      <DialogContent
        sx={{
          flex: 1,
          minHeight: 0,
          padding: 0,
          overflowY: "auto",
        }}
      >
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
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
                minHeight: 200,
              }}
            />
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
