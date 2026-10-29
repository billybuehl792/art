import React from "react";
import { Button, Stack, type StackProps } from "@mui/material";
import ProjectListItem, { type ProjectListItemProps } from "./ProjectListItem";
import InfiniteScrollTrigger from "@/components/layout/InfiniteScrollTrigger";
import ProjectListItemSkeleton from "./ProjectListItemSkeleton";
import StatusCard from "@/components/cards/StatusCard";
import { DEFAULT_LIMIT } from "@/constants";
import type { Project } from "@/types/projects";

export interface ProjectListProps extends StackProps {
  projects: Project[];
  loading?: boolean;
  error?: Error | null;
  hasNextPage: boolean;
  isRefetching?: boolean;
  isFetchingNextPage: boolean;
  onProjectClick?: ProjectListItemProps["onClick"];
  onFetchNextPage: VoidFunction;
  onRetry?: VoidFunction;
  slotProps?: {
    item?: Partial<Omit<ProjectListItemProps, "project">>;
  };
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  loading,
  error,
  hasNextPage,
  isRefetching,
  isFetchingNextPage,
  onFetchNextPage,
  onProjectClick,
  onRetry,
  slotProps,
  ...props
}) => {
  /** Values */

  const isError = !!error;
  const isEmpty = !loading && !isFetchingNextPage && projects.length <= 0;

  /** Callbacks */

  const renderError = () => (
    <StatusCard
      status="error"
      message={error?.message}
      {...(!!onRetry && {
        action: (
          <Button variant="contained" loading={isRefetching} onClick={onRetry}>
            Try again
          </Button>
        ),
      })}
      sx={{ mt: 2 }}
    />
  );

  const renderEmpty = () => (
    <StatusCard
      status="empty"
      title="No projects."
      message="Nothing to show here."
      sx={{ mt: 2 }}
    />
  );

  if (isError) return renderError();
  if (isEmpty) return renderEmpty();
  return (
    <Stack spacing={1} {...props}>
      {projects.map((project) => (
        <ProjectListItem
          key={project.id}
          project={project}
          onClick={onProjectClick}
          {...slotProps?.item}
        />
      ))}
      <InfiniteScrollTrigger
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={onFetchNextPage}
      >
        <ProjectListItemSkeleton />
      </InfiniteScrollTrigger>
      {(!!loading || isFetchingNextPage) &&
        Array.from({ length: DEFAULT_LIMIT - 1 }).map((_, index) => (
          <ProjectListItemSkeleton key={`skeleton-${index}`} />
        ))}
    </Stack>
  );
};

export default ProjectList;
