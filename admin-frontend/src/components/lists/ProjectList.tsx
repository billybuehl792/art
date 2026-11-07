import React from "react";
import { Button, Skeleton, Stack, type StackProps } from "@mui/material";
import InfiniteScrollTrigger from "@/components/layout/InfiniteScrollTrigger";
import StatusCard from "@/components/cards/StatusCard";
import ProjectListCard, {
  type ProjectListCardProps,
} from "../cards/ProjectListCard";
import type { MenuOption } from "@/types/basic";
import type { Project } from "@/types/projects";

export interface ProjectListProps extends StackProps {
  projects: Project[];
  loading?: boolean;
  error?: Error | null;
  hasNextPage: boolean;
  isRefetching?: boolean;
  isFetchingNextPage: boolean;
  projectOptions?: (project: Project) => MenuOption[];
  onProjectClick?: ProjectListCardProps["onClick"];
  onFetchNextPage: VoidFunction;
  onRetry?: VoidFunction;
  slotProps?: {
    item?: Partial<Omit<ProjectListCardProps, "project">>;
  };
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  loading,
  error,
  hasNextPage,
  isRefetching,
  isFetchingNextPage,
  projectOptions,
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

  const renderSkeletonCard = (key: string) => (
    <Skeleton key={key} variant="rounded" {...props} sx={{ height: 150 }} />
  );

  return (
    <Stack spacing={1} {...props}>
      {isError ? (
        <StatusCard
          status="error"
          message={error?.message}
          {...(!!onRetry && {
            action: (
              <Button
                variant="contained"
                loading={isRefetching}
                onClick={onRetry}
              >
                Try again
              </Button>
            ),
          })}
          sx={{ mt: 2 }}
        />
      ) : isEmpty ? (
        <StatusCard
          status="empty"
          title="No projects."
          message="Nothing to show here."
          sx={{ mt: 2 }}
        />
      ) : (
        projects.map((project) => (
          <ProjectListCard
            key={project.id}
            project={project}
            disabled={isRefetching}
            options={projectOptions?.(project)}
            onClick={onProjectClick}
            {...slotProps?.item}
          />
        ))
      )}
      <InfiniteScrollTrigger
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={onFetchNextPage}
      >
        {renderSkeletonCard("infinite-scroll")}
      </InfiniteScrollTrigger>
      {(!!loading || isFetchingNextPage) &&
        Array.from({ length: 20 }).map((_, index) =>
          renderSkeletonCard(`skeleton-${index}`),
        )}
    </Stack>
  );
};

export default ProjectList;
