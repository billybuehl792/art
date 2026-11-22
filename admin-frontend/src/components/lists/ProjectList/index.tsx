import React from "react";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortableOperation } from "@dnd-kit/react/sortable";
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
  disabled?: boolean;
  loading?: boolean;
  error?: Error | null;
  hasMore: boolean;
  onLoadMore: VoidFunction;
  onRefetch?: VoidFunction;
  onSort?: (body: {
    targetId: number;
    afterId: number;
    sorted: Project[];
  }) => void;
  slotProps?: {
    card?: (
      project: Project,
    ) => Partial<Omit<ProjectListItemProps, "project" | "index">>;
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
  onSort,
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

  const handleOnDragEnd = (event: DragEndEvent) => {
    if (event.canceled || !isSortableOperation(event.operation) || !onSort)
      return;

    const targetId = event.operation.target?.id;
    if (!targetId) return;

    const initialIndex = event.operation.source?.initialIndex;
    const endIndex = event.operation.target?.index;

    if (initialIndex == null || endIndex == null || initialIndex === endIndex)
      return;

    const sorted = move(projects, event);
    const afterId = sorted[endIndex - 1]?.id ?? null;

    onSort({ targetId: Number(targetId), afterId, sorted });
  };

  return (
    <Stack spacing={1} {...props}>
      {error ? (
        renderError(error)
      ) : isEmpty ? (
        renderEmpty()
      ) : (
        <MenuList sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {onSort ? (
            <DragDropProvider onDragEnd={handleOnDragEnd}>
              {renderProjects({ sortable: true })}
            </DragDropProvider>
          ) : (
            renderProjects()
          )}
          {loading &&
            (hasMore || !projects.length) &&
            Array.from({ length: 20 }).map((_, index) => (
              <Skeleton
                key={`skeleton-${index}`}
                variant="rounded"
                sx={{ mt: 0.5, height: 72 }}
              />
            ))}
          <div ref={scrollRef} />
        </MenuList>
      )}
    </Stack>
  );
};

export default ProjectList;
