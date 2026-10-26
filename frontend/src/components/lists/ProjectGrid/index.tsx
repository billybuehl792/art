import React from "react";
import { ImageList, useMediaQuery, type ImageListProps } from "@mui/material";
import ProjectGridItem, { type ProjectGridItemProps } from "./ProjectGridItem";
import ProjectGridSkeletonItem from "./ProjectGridSkeletonItem";
import InfiniteScrollTrigger from "@/components/layout/InfiniteScrollTrigger";
import { sxArray } from "@/utils/sx";
import type { Project, ProjectListRequestParams } from "@/types/projects";

export interface ProjectGridProps extends Omit<ImageListProps, "children"> {
  params?: ProjectListRequestParams;
  projects: Project[];
  loading?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onProjectClick?: ProjectGridItemProps["onClick"];
  onFetchNextPage: VoidFunction;
  slotProps?: {
    item?: Partial<Omit<ProjectGridItemProps, "project">>;
  };
}

const ProjectGrid: React.FC<ProjectGridProps> = ({
  params,
  projects,
  loading,
  hasNextPage,
  isFetchingNextPage,
  onProjectClick,
  onFetchNextPage,
  slotProps,
  ...props
}) => {
  /** Values */

  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const skeletonCount = (params?.limit ?? 20) - 1;

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
