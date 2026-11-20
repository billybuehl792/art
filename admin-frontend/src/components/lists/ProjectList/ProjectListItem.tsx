import React from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  type ListItemProps,
} from "@mui/material";
import MenuOptionsIconButton from "@/components/buttons/MenuOptionsIconButton";
import { sxArray, truncateText } from "@/utils/sx";
import type { Project } from "@/types/projects";
import type { MenuOption } from "@/types/basic";

interface ProjectListItemBaseProps extends Omit<
  ListItemProps,
  "id" | "onClick"
> {
  project: Project;
  sortIndex?: number;
  disabled?: boolean;
  options?: MenuOption[];
  onClick?: (project: Project) => void;
}

export interface ProjectListItemProps extends ProjectListItemBaseProps {
  sortIndex?: number;
}

const ProjectListItemBase: React.FC<ProjectListItemBaseProps> = ({
  project,
  disabled,
  options,
  onClick,
  ...props
}) => {
  /** Callbacks */

  const renderBody = () => (
    <>
      {!!project.thumbnailUrl && (
        <ListItemAvatar>
          <Avatar
            variant="rounded"
            alt={project.title}
            src={project.thumbnailUrl}
          />
        </ListItemAvatar>
      )}
      <ListItemText
        primary={project.title}
        secondary={project.subtitle}
        sx={truncateText}
      />
    </>
  );

  return (
    <ListItem
      disablePadding
      {...props}
      sx={sxArray(
        {
          position: "relative",
          border: `1px solid`,
          borderColor: "divider",
          borderRadius: 1,
        },
        props?.sx,
      )}
    >
      {onClick ? (
        <ListItemButton
          disabled={disabled}
          onClick={() => onClick(project)}
          sx={{ borderRadius: "inherit" }}
        >
          {renderBody()}
        </ListItemButton>
      ) : (
        renderBody()
      )}
      {!!options?.length && (
        <Stack
          sx={{
            position: "absolute",
            right: 8,
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

const SortableProjectListItem: React.FC<ProjectListItemProps> = ({
  project,
  sortIndex = 0,
  ...props
}) => {
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
