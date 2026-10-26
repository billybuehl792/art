import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  type IconButtonProps,
} from "@mui/material";
import {
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { downloadFile } from "@/utils/files";
import type { Project } from "@/types/projects";

interface ProjectOptionsIconButtonProps extends IconButtonProps {
  project: Project;
}

const ProjectOptionsIconButton: React.FC<ProjectOptionsIconButtonProps> = ({
  project,
  ...props
}) => {
  /** Values */

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const options = [
    {
      render: !!project.mediaUrl,
      title: "Download",
      Icon: DownloadIcon,
      onClick: () => {
        if (project.mediaUrl) downloadFile(project.mediaUrl, project.title);
      },
    },
  ];

  /** Callbacks */

  const handleOnClick: IconButtonProps["onClick"] = (event) =>
    setAnchorEl(event.currentTarget);

  const handleOnClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton {...props} onClick={handleOnClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleOnClose}>
        {options
          .filter(({ render }) => !!render)
          .map((option) => (
            <MenuItem
              key={option.title}
              onClick={() => {
                option.onClick();
                handleOnClose();
              }}
              sx={{ "& .MuiSvgIcon-root": { mr: 1 } }}
            >
              <option.Icon />
              {option.title}
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};

export default ProjectOptionsIconButton;
