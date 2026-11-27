import type React from "react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { Button, Container } from "@mui/material";
import StatusCard from "../cards/StatusCard";

const ErrorScreen: React.FC<ErrorComponentProps> = ({ error, reset }) => {
  /** Values */

  const errorMessage = error instanceof Error ? error.message : undefined;

  return (
    <Container variant="centered">
      <StatusCard
        status="error"
        title="Something went wrong."
        message={errorMessage}
        action={
          <Button variant="contained" aria-label="retry" onClick={reset}>
            Retry
          </Button>
        }
      />
    </Container>
  );
};

export default ErrorScreen;
