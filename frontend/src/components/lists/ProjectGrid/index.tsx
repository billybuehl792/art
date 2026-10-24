import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ImageList, useMediaQuery, type ImageListProps } from "@mui/material";
import ProjectGridItem, { type ProjectGridItemProps } from "./ProjectGridItem";
import ProjectGridSkeletonItem from "./ProjectGridSkeletonItem";
import InfiniteScrollTrigger from "@/components/layout/InfiniteScrollTrigger";
import { apiQueries } from "@/queries";
import { sxArray } from "@/utils/sx";
import type { ProjectListRequestParams } from "@/types/projects";

export interface ProjectGridProps extends Omit<ImageListProps, "children"> {
  params?: ProjectListRequestParams;
  onProjectClick?: ProjectGridItemProps["onClick"];
  slotProps?: {
    item?: Partial<Omit<ProjectGridItemProps, "project">>;
  };
}

const ProjectGrid: React.FC<ProjectGridProps> = ({
  params,
  onProjectClick,
  slotProps,
  ...props
}) => {
  /** Values */

  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const skeletonCount = (params?.limit ?? 10) - 1;

  /** Queries */

  const projectListQuery = useInfiniteQuery(apiQueries.projects.get(params));

  /** Data */

  const projects =
    projectListQuery.data?.pages.flatMap((page) => page.data.results) ?? [];

  return (
    <ImageList
      cols={isSm ? 1 : 3}
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
        isFetchingNextPage={projectListQuery.isFetchingNextPage}
        hasNextPage={projectListQuery.hasNextPage}
        fetchNextPage={projectListQuery.fetchNextPage}
      >
        <ProjectGridSkeletonItem />
      </InfiniteScrollTrigger>
      {(projectListQuery.isLoading || projectListQuery.isFetchingNextPage) &&
        Array.from({ length: skeletonCount }).map((_, index) => (
          <ProjectGridSkeletonItem key={`skeleton-${index}`} />
        ))}
    </ImageList>
  );
};

export default ProjectGrid;
