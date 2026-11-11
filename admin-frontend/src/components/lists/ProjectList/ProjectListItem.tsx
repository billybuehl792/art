import React from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import {
  ListItem,
  ListItemButton,
  Stack,
  Typography,
  type ListItemProps,
} from "@mui/material";
import MenuOptionsIconButton from "@/components/buttons/MenuOptionsIconButton";
import { sxArray, truncateText } from "@/utils/sx";
import type { Project } from "@/types/projects";
import type { MenuOption } from "@/types/basic";

export interface ProjectListItemProps extends Omit<
  ListItemProps,
  "id" | "onClick"
> {
  project: Project;
  sortIndex?: number;
  disabled?: boolean;
  options?: MenuOption[];
  onClick?: (project: Project) => void;
}

const ProjectListItemBase: React.FC<
  Omit<ProjectListItemProps, "sortIndex">
> = ({ project, disabled, options, onClick, ...props }) => {
  return (
    <ListItem
      disablePadding
      {...props}
      sx={sxArray({ position: "relative" }, props?.sx)}
    >
      <ListItemButton disabled={disabled} onClick={() => onClick?.(project)}>
        <Typography sx={truncateText}>{project.title}</Typography>
      </ListItemButton>
      {!!options?.length && (
        <Stack
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: "center",
          }}
        >
          <MenuOptionsIconButton
            options={options}
            size="small"
            disabled={disabled}
          />
        </Stack>
      )}
    </ListItem>
  );
};

const SortableProjectListItem: React.FC<
  Omit<ProjectListItemProps, "sortIndex"> & { sortIndex: number }
> = ({ project, sortIndex, ...props }) => {
  /** Values */

  const { ref, isDragging } = useSortable({ id: project.id, index: sortIndex });

  return (
    <ProjectListItemBase
      ref={ref}
      project={project}
      {...props}
      sx={sxArray(
        isDragging && {
          opacity: 0.5,
          bgcolor: ({ palette }) => palette.action.selected,
          boxShadow: ({ shadows }) => shadows[6],
        },
        props?.sx,
      )}
    />
  );
};

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  sortIndex,
  ...props
}) => {
  return sortIndex !== undefined ? (
    <SortableProjectListItem sortIndex={sortIndex} {...props} />
  ) : (
    <ProjectListItemBase {...props} />
  );
};

export default ProjectListItem;
