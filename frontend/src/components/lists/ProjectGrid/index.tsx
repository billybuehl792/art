import React from "react";
import {
  Button,
  ImageList,
  ImageListItem,
  Skeleton,
  Stack,
  useMediaQuery,
  type StackProps,
} from "@mui/material";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import ProjectGridItem, { type ProjectGridItemProps } from "./ProjectGridItem";
import StatusCard from "@/components/cards/StatusCard";
import type { Project } from "@/types/projects";

export interface ProjectGridProps extends Omit<StackProps, "children"> {
  projects: Project[];
  disabled?: boolean;
  loading?: boolean;
  error?: Error | null;
  hasMore: boolean;
  onLoadMore: VoidFunction;
  onRefetch?: VoidFunction;
  slotProps?: {
    card?: (project: Project) => Partial<Omit<ProjectGridItemProps, "project">>;
  };
}

const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  disabled,
  loading,
  error,
  hasMore,
  onLoadMore,
  onRefetch,
  slotProps,
  ...props
}) => {
  /** Values */

  const scrollRef = useInfiniteScroll({ disabled: loading, onLoadMore });

  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMd = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const isEmpty = !loading && !error && projects.length < 1;
  const showSkeletons = !!loading && (hasMore || !projects.length);

  /** Callbacks */

  const renderProjects = (options?: { sortable?: boolean }) =>
    projects.map((project, index) => (
      <ProjectGridItem
        key={project.id}
        project={project}
        disabled={loading || disabled}
        {...(!!options?.sortable && { sortIndex: index })}
        {...slotProps?.card?.(project)}
      />
    ));

  const renderEmpty = () => (
    <StatusCard
      status="empty"
      title="No projects."
      message="Nothing to show here."
      sx={{ mt: 2 }}
    />
  );

  const renderError = (error: Error) => (
    <StatusCard
      status="error"
      message={error.message}
      action={
        <Button variant="contained" loading={loading} onClick={onRefetch}>
          Try again
        </Button>
      }
      sx={{ mt: 2 }}
    />
  );

  return (
    <Stack {...props}>
      {error ? (
        renderError(error)
      ) : isEmpty ? (
        renderEmpty()
      ) : (
        <ImageList
          cols={isSm ? 1 : isMd ? 2 : 3}
          gap={1}
          sx={{ overflow: "visible" }}
        >
          {renderProjects()}
          {showSkeletons &&
            Array.from({ length: 20 }).map((_, index) => (
              <ImageListItem
                key={`skeleton-${index}`}
                sx={{ aspectRatio: "1 / 1" }}
              >
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  sx={{ width: "100%", height: "100%" }}
                />
              </ImageListItem>
            ))}
          {hasMore && <div ref={scrollRef} />}
        </ImageList>
      )}
    </Stack>
  );
};

export default ProjectGrid;
