import React from "react";
import {
  Button,
  MenuList,
  Skeleton,
  Stack,
  type StackProps,
} from "@mui/material";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import StatusCard from "@/components/cards/StatusCard";
import ProjectListItem, { type ProjectListItemProps } from "./ProjectListItem";
import type { Project } from "@/types/projects";

export interface ProjectListProps extends StackProps {
  projects: Project[];
  disabled?: boolean;
  loading?: boolean;
  error?: Error | null;
  hasMore: boolean;
  onLoadMore: VoidFunction;
  onRefetch?: VoidFunction;
  slotProps?: {
    card?: (project: Project) => Partial<Omit<ProjectListItemProps, "project">>;
  };
}

const ProjectList: React.FC<ProjectListProps> = ({
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

  const isEmpty = !loading && !error && projects.length < 1;

  /** Callbacks */

  const renderProjects = (options?: { sortable?: boolean }) =>
    projects.map((project, index) => (
      <ProjectListItem
        key={project.id}
        project={project}
        disabled={disabled}
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
    <Stack spacing={1} {...props}>
      {error ? (
        renderError(error)
      ) : isEmpty ? (
        renderEmpty()
      ) : (
        <MenuList sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {renderProjects()}
          {loading &&
            (hasMore || !projects.length) &&
            Array.from({ length: 20 }).map((_, index) => (
              <Skeleton
                key={`skeleton-${index}`}
                variant="rounded"
                sx={{ mt: 0.5, height: 72 }}
              />
            ))}
        </MenuList>
      )}
      {hasMore && <div ref={scrollRef} />}
    </Stack>
  );
};

export default ProjectList;
