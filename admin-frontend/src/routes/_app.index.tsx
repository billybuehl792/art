import PageHeader from "@/components/layout/PageHeader";
import { Container } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container>
      <PageHeader title="Admin Configuration" />
    </Container>
  );
}
