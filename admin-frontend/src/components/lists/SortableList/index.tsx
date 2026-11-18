import React from "react";
import type { AxiosResponse } from "axios";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { MenuList, Skeleton, type MenuListProps } from "@mui/material";
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

  const scrollRef = useInfiniteScroll({
    disabled: query.isFetchingNextPage,
    onLoadMore: query.fetchNextPage,
  });

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
      {(query.isLoading || query.hasNextPage) && (
        <div ref={scrollRef}>
          {Array.from({ length: 20 }).map((_, index) => (
            <Skeleton
              key={`skeleton-${index}`}
              variant="rectangular"
              sx={{ mt: 1 }}
            />
          ))}
        </div>
      )}
    </MenuList>
  );
};

export default SortableList;
