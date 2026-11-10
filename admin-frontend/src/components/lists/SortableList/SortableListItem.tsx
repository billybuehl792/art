import React from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { ListItem, ListItemButton, type ListItemProps } from "@mui/material";
import { sxArray } from "@/utils/sx";
import type { Project } from "@/types/projects";

interface SortableListItemProps extends Omit<ListItemProps, "id" | "title"> {
  index: number;
  project: Project;
  disabled?: boolean;
}

const SortableListItem: React.FC<SortableListItemProps> = ({
  index,
  project,
  disabled,
  ...props
}) => {
  /** Values */

  const { ref, isDragging } = useSortable({ id: project.id, index });

  return (
    <ListItem
      ref={ref}
      disablePadding
      {...props}
      sx={sxArray(
        isDragging && {
          opacity: 0.5,
          bgcolor: ({ palette }) => palette.action.selected,
          boxShadow: ({ shadows }) => shadows[6],
        },
        props?.sx,
      )}
    >
      <ListItemButton disabled={disabled}>{project.title}</ListItemButton>
    </ListItem>
  );
};

export default SortableListItem;
