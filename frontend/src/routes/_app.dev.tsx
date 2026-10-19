import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@mui/material";
import PageHeader from "@/components/layout/PageHeader";

export const Route = createFileRoute("/_app/dev")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container>
      <PageHeader title="Dev" />
    </Container>
  );
}
