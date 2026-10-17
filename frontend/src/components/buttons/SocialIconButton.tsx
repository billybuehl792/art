import React, { type ComponentType } from "react";
import { IconButton, type IconButtonProps } from "@mui/material";

interface SocialIconButtonProps extends IconButtonProps<"a"> {
  Icon: ComponentType;
}

const SocialIconButton: React.FC<SocialIconButtonProps> = ({
  Icon,
  ...props
}) => {
  return (
    <IconButton
      component="a"
      target="_blank"
      rel="noopener noreferrer"
      color="primary"
      {...props}
    >
      <Icon />
    </IconButton>
  );
};

export default SocialIconButton;
