import React from "react";
import { Container, type ContainerProps } from "@mui/material";
import StatusCard, { type StatusCardProps } from "../cards/StatusCard";

interface LoadingScreenProps extends ContainerProps {
  slotProps?: { card?: Partial<StatusCardProps> };
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  slotProps,
  ...props
}) => {
  return (
    <Container variant="centered" {...props}>
      <StatusCard status="loading" {...slotProps?.card} />
    </Container>
  );
};

export default LoadingScreen;
