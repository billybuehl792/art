import React from "react";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import {
  ListItem,
  ListItemButton,
  MenuList,
  Skeleton,
  type ListItemProps,
  type MenuListProps,
} from "@mui/material";
import InfiniteScrollTrigger from "../layout/InfiniteScrollTrigger";
import type { Project } from "@/types/projects";

export interface SortableListProps extends MenuListProps {
  items: Project[];
  disabled?: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: VoidFunction;
  onSort: (items: Project[], target: Project["id"]) => void;
}

interface SortableItemProps extends Omit<ListItemProps, "id" | "title"> {
  index: number;
  project: Project;
  disabled?: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({
  index,
  project,
  disabled,
  ...props
}) => {
  const { ref } = useSortable({ id: project.id, index });

  return (
    <ListItem ref={ref} {...props}>
      <ListItemButton disabled={disabled}>{project.title}</ListItemButton>
    </ListItem>
  );
};

const SortableList: React.FC<SortableListProps> = ({
  items,
  disabled,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onSort,
  ...props
}) => {
  /** Callbacks */

  const handleOnDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return;

    const target = event.operation.target?.id;
    if (!target) return;

    onSort(move(items, event), Number(target));
  };

  return (
    <DragDropProvider onDragEnd={handleOnDragEnd}>
      <MenuList {...props}>
        {items.map((item, index) => (
          <SortableItem
            key={item.id}
            index={index}
            project={item}
            disabled={disabled}
          />
        ))}
        <InfiniteScrollTrigger
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        >
          <Skeleton />
        </InfiniteScrollTrigger>
      </MenuList>
    </DragDropProvider>
  );
};

export default SortableList;
