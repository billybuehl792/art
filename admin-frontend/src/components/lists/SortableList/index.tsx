import React from "react";
import type { AxiosResponse } from "axios";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { MenuList, Skeleton, type MenuListProps } from "@mui/material";
import InfiniteScrollTrigger from "../../layout/InfiniteScrollTrigger";
import SortableListItem from "./SortableListItem";
import type { Project, ProjectListResponse } from "@/types/projects";

export interface SortableListProps extends MenuListProps {
  query: UseInfiniteQueryResult<
    InfiniteData<AxiosResponse<ProjectListResponse>>
  >;
  onSort: (projects: Project[], target: Project["id"]) => void;
}

const SortableList: React.FC<SortableListProps> = ({
  query,
  onSort,
  ...props
}) => {
  /** Values */

  const projects = query.data?.pages.flatMap((page) => page.data.results) ?? [];

  /** Callbacks */

  const handleOnDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return;

    const targetId = event.operation.target?.id;
    if (!targetId) return;

    onSort(move(projects, event), Number(targetId));
  };

  return (
    <MenuList {...props}>
      <DragDropProvider onDragEnd={handleOnDragEnd}>
        {projects.map((item, index) => (
          <SortableListItem
            key={item.id}
            index={index}
            project={item}
            disabled={query.isFetching}
          />
        ))}
      </DragDropProvider>
      <InfiniteScrollTrigger
        isFetchingNextPage={query.isFetchingNextPage}
        hasNextPage={query.hasNextPage}
        fetchNextPage={query.fetchNextPage}
      >
        <Skeleton variant="rectangular" height={40} />
      </InfiniteScrollTrigger>
      {(!!query.isLoading || query.isFetchingNextPage) &&
        Array.from({ length: 20 }).map((_, index) => (
          <Skeleton
            key={`skeleton-${index}`}
            variant="rectangular"
            height={40}
            sx={{ mb: 0.5 }}
          />
        ))}
    </MenuList>
  );
};

export default SortableList;
