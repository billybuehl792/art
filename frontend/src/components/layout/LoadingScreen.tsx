import React from "react";
import { Container, type ContainerProps } from "@mui/material";
import StatusCard, { type StatusCardProps } from "../cards/StatusCard";
import { sxArray } from "@/utils/sx";

interface LoadingScreenProps extends ContainerProps {
  fullScreen?: boolean;
  slotProps?: { card?: Partial<StatusCardProps> };
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  fullScreen,
  slotProps,
  ...props
}) => {
  return (
    <Container {...props} sx={sxArray({ my: 2 }, props?.sx)}>
      <StatusCard status="loading" {...slotProps?.card} />
    </Container>
  );
};

export default LoadingScreen;
