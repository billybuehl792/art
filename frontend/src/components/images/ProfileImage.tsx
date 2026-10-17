import React from "react";
import { Box, type BoxProps } from "@mui/material";

const ProfileImage: React.FC<BoxProps> = () => {
  return (
    <Box
      component="img"
      src="./src/assets/profile.png"
      alt="Profile Picture"
      sx={{
        height: 200,
        width: 200,
        objectFit: "contain",
      }}
    />
  );
};

export default ProfileImage;
