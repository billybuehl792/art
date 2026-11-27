import React from "react";
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

const ProjectListItem: React.FC<ProjectListItemProps> = ({
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
          <MenuOptionsIconButton options={options} disabled={disabled} />
        </Stack>
      )}
    </ListItem>
  );
};

export default ProjectListItem;
