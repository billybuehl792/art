import React from "react";
import { Box, type BoxProps } from "@mui/material";
import StatusCard, { type StatusCardProps } from "../cards/StatusCard";
import { sxArray } from "@/utils/sx";

interface LoadingScreenProps extends BoxProps {
  fullScreen?: boolean;
  slotProps?: { card?: Partial<StatusCardProps> };
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  fullScreen,
  slotProps,
  ...props
}) => {
  return (
    <Box
      {...props}
      sx={sxArray(
        {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "center",
          flex: "1 1 auto",
          minHeight: fullScreen ? "100dvh" : 240,
          width: "100%",
          p: 3,
          boxSizing: "border-box",
        },
        props?.sx,
      )}
    >
      <StatusCard
        status="loading"
        {...slotProps?.card}
        sx={sxArray({ width: "100%", flex: "1 1 auto" }, slotProps?.card?.sx)}
      />
    </Box>
  );
};

export default LoadingScreen;
