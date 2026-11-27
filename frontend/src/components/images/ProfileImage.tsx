import React from "react";
import { Box, styled, type BoxProps } from "@mui/material";

interface ProfileImageProps extends BoxProps {
  size?: number;
}

const StyledProfileImage = styled(Box, {
  shouldForwardProp: (prop) => prop !== "size",
})<ProfileImageProps>(({ theme, size = 200 }) => ({
  position: "relative",
  aspectRatio: 1,
  height: size,
  width: size,
  boxSizing: "border-box",
  borderRadius: "50%",
  border: `1px solid ${theme.palette.divider}`,
  overflow: "hidden",

  "& img": {
    aspectRatio: 1,
    height: "100%",
    width: "100%",
    objectFit: "cover",
    transform: "scale(1.05)",
  },
}));

const ProfileImage: React.FC<ProfileImageProps> = ({
  size = 200,
  ...props
}) => {
  return (
    <StyledProfileImage {...props} size={size}>
      <img src="./src/assets/profile.png" alt="Profile Picture" />
    </StyledProfileImage>
  );
};

export default ProfileImage;
