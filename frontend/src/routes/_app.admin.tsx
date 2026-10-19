import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Container, Stack, Typography } from "@mui/material";
import PageHeader from "@/components/layout/PageHeader";
import { apiQueries } from "@/queries";

export const Route = createFileRoute("/_app/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Queries */

  const healthQuery = useQuery(apiQueries.health.get());

  /** Data */

  const health =
    healthQuery.status === "success"
      ? healthQuery.data.data.status
      : healthQuery.status;

  return (
    <Container>
      <PageHeader title="Admin" />
      <Stack sx={{ py: 2 }}>
        <Typography>Status: {health}</Typography>
      </Stack>
    </Container>
  );
}
