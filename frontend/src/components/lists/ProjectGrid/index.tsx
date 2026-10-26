import React from "react";
import {
  Button,
  ImageList,
  useMediaQuery,
  type ImageListProps,
} from "@mui/material";
import ProjectGridItem, { type ProjectGridItemProps } from "./ProjectGridItem";
import ProjectGridSkeletonItem from "./ProjectGridSkeletonItem";
import InfiniteScrollTrigger from "@/components/layout/InfiniteScrollTrigger";
import StatusCard from "@/components/cards/StatusCard";
import { sxArray } from "@/utils/sx";
import { DEFAULT_LIMIT } from "@/constants";
import type { Project, ProjectListRequestParams } from "@/types/projects";

export interface ProjectGridProps extends Omit<ImageListProps, "children"> {
  params?: ProjectListRequestParams;
  projects: Project[];
  loading?: boolean;
  error?: Error | null;
  hasNextPage: boolean;
  isRefetching?: boolean;
  isFetchingNextPage: boolean;
  onProjectClick?: ProjectGridItemProps["onClick"];
  onFetchNextPage: VoidFunction;
  onRetry?: VoidFunction;
  slotProps?: {
    item?: Partial<Omit<ProjectGridItemProps, "project">>;
  };
}

const ProjectGrid: React.FC<ProjectGridProps> = ({
  params,
  projects,
  loading,
  error,
  hasNextPage,
  isRefetching,
  isFetchingNextPage,
  onProjectClick,
  onFetchNextPage,
  onRetry,
  slotProps,
  ...props
}) => {
  /** Values */

  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMd = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const skeletonCount = (params?.limit ?? DEFAULT_LIMIT) - 1;
  const isError = !!error;
  const isEmpty = !loading && !isFetchingNextPage && projects.length <= 0;

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
    <ImageList
      cols={isSm ? 1 : isMd ? 2 : 3}
      gap={1}
      {...props}
      sx={sxArray({ overflow: "visible" }, props?.sx)}
    >
      {projects.map((project) => (
        <ProjectGridItem
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
        <ProjectGridSkeletonItem />
      </InfiniteScrollTrigger>
      {(!!loading || isFetchingNextPage) &&
        Array.from({ length: skeletonCount }).map((_, index) => (
          <ProjectGridSkeletonItem key={`skeleton-${index}`} />
        ))}
    </ImageList>
  );
};

export default ProjectGrid;
