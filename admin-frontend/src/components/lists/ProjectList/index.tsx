import React from "react";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
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
  loading?: boolean;
  error?: Error | null;
  hasMore: boolean;
  onLoadMore: VoidFunction;
  onRefetch?: VoidFunction;
  onSort?: (projects: Project[], target: Project["id"]) => void;
  slotProps?: {
    card?: (
      project: Project,
    ) => Partial<Omit<ProjectListItemProps, "project" | "index">>;
  };
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  loading,
  error,
  hasMore,
  onLoadMore,
  onRefetch,
  onSort,
  slotProps,
  ...props
}) => {
  /** Values */

  const scrollRef = useInfiniteScroll({ disabled: loading, onLoadMore });

  const isEmpty = !loading && !error && projects.length < 1;

  /** Callbacks */

  const renderProjects = (sortable?: boolean) =>
    projects.map((project, index) => (
      <ProjectListItem
        key={project.id}
        project={project}
        disabled={loading}
        {...(!!sortable && { sortIndex: index })}
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

  const handleOnDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return;

    const targetId = event.operation.target?.id;
    if (!targetId) return;

    const sorted = move(projects, event);

    const hasChanged = projects.some((p, index) => p.id !== sorted[index].id);
    if (!hasChanged) return;

    onSort?.(sorted, Number(targetId));
  };

  return (
    <Stack spacing={1} {...props}>
      {error ? (
        renderError(error)
      ) : isEmpty ? (
        renderEmpty()
      ) : (
        <MenuList>
          {onSort ? (
            <DragDropProvider onDragEnd={handleOnDragEnd}>
              {renderProjects(true)}
            </DragDropProvider>
          ) : (
            renderProjects()
          )}
          {loading &&
            (hasMore || !projects.length) &&
            Array.from({ length: 20 }).map((_, index) => (
              <Skeleton
                key={`skeleton-${index}`}
                variant="rectangular"
                sx={{ mt: 1 }}
              />
            ))}
          <div ref={scrollRef} />
        </MenuList>
      )}
    </Stack>
  );
};

export default ProjectList;
