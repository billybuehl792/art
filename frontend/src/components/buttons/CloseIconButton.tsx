import React from "react";
import { Box, IconButton, Tooltip, type IconButtonProps } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const CloseIconButton: React.FC<IconButtonProps> = (props) => {
  return (
    <Tooltip title="Close">
      <Box component="span">
        <IconButton aria-label="close" {...props}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default CloseIconButton;
