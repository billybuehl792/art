import type React from "react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { Button, Typography, Stack } from "@mui/material";

const ErrorScreen: React.FC<ErrorComponentProps> = ({ error, reset }) => {
  /** Values */

  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <Stack spacing={2} sx={{ alignItems: "center" }}>
      <Typography variant="h5">Something went wrong</Typography>

      {errorMessage && (
        <Typography color="text.secondary">{errorMessage}</Typography>
      )}

      <Button variant="contained" onClick={reset}>
        Try again
      </Button>
    </Stack>
  );
};

export default ErrorScreen;
