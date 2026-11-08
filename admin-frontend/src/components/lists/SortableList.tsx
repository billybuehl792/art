import React from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import {
  ListItem,
  ListItemButton,
  MenuList,
  type ListItemProps,
  type MenuListProps,
} from "@mui/material";
import type { Project } from "@/types/projects";

interface SortableListProps extends MenuListProps {
  items: Project[];
  onSort: (items: Project[]) => void;
}

interface SortableItemProps extends Omit<ListItemProps, "id" | "title"> {
  index: number;
  project: Project;
}

const SortableItem: React.FC<SortableItemProps> = ({
  index,
  project,
  ...props
}) => {
  const { ref } = useSortable({ id: project.id, index });

  return (
    <ListItem ref={ref} {...props}>
      <ListItemButton>{project.title}</ListItemButton>
    </ListItem>
  );
};

const SortableList: React.FC<SortableListProps> = ({
  items,
  onSort,
  ...props
}) => {
  return (
    <DragDropProvider
      onDragEnd={(event) => {
        onSort(move(items, event));
      }}
    >
      <MenuList {...props}>
        {items.map((item, index) => (
          <SortableItem key={item.id} index={index} project={item} />
        ))}
      </MenuList>
    </DragDropProvider>
  );
};

export default SortableList;
