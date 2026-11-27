import React from "react";
import { type NotFoundRouteProps } from "@tanstack/react-router";
import { Container } from "@mui/material";
import StatusCard from "@/components/cards/StatusCard";
import BackButton from "../buttons/BackButton";

const NotFoundScreen: React.FC<NotFoundRouteProps> = () => {
  return (
    <Container variant="centered">
      <StatusCard
        status="error"
        title="Page not found."
        message="Sorry, the page you're looking for doesn't exist or may have been moved."
        action={<BackButton />}
      />
    </Container>
  );
};

export default NotFoundScreen;
