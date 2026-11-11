import React from "react";
import type { AxiosResponse } from "axios";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import {
  Button,
  MenuList,
  Skeleton,
  Stack,
  type StackProps,
} from "@mui/material";
import InfiniteScrollTrigger from "@/components/layout/InfiniteScrollTrigger";
import StatusCard from "@/components/cards/StatusCard";
import ProjectListItem, { type ProjectListItemProps } from "./ProjectListItem";
import type { Project, ProjectListResponse } from "@/types/projects";

export interface ProjectListProps extends StackProps {
  query: UseInfiniteQueryResult<
    InfiniteData<AxiosResponse<ProjectListResponse>>
  >;
  onSort?: (projects: Project[], target: Project["id"]) => void;
  slotProps?: {
    card?: (
      project: Project,
    ) => Partial<Omit<ProjectListItemProps, "project" | "index">>;
  };
}

const ProjectList: React.FC<ProjectListProps> = ({
  query,
  onSort,
  slotProps,
  ...props
}) => {
  /** Values */

  const projects = query.data?.pages.flatMap((page) => page.data.results) ?? [];

  const isEmpty =
    !query.isLoading && !query.isFetchingNextPage && projects.length <= 0;

  /** Callbacks */

  const renderProjects = (sortable?: boolean) =>
    projects.map((project, index) => (
      <ProjectListItem
        key={project.id}
        project={project}
        disabled={query.isRefetching}
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
        <Button
          variant="contained"
          loading={query.isFetching}
          onClick={() => query.refetch()}
        >
          Try again
        </Button>
      }
      sx={{ mt: 2 }}
    />
  );

  /** Callbacks */

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
      {query.error ? (
        renderError(query.error)
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
          {(!!query.isLoading || query.isFetchingNextPage) &&
            Array.from({ length: 20 }).map((_, index) => (
              <Skeleton
                key={`skeleton-${index}`}
                variant="rectangular"
                sx={{ mt: 1 }}
              />
            ))}
          <InfiniteScrollTrigger
            children={<Skeleton variant="rectangular" />}
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
          />
        </MenuList>
      )}
    </Stack>
  );
};

export default ProjectList;
