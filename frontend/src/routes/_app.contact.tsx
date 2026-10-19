import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@mui/material";
import PageHeader from "@/components/layout/PageHeader";

export const Route = createFileRoute("/_app/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container>
      <PageHeader title="Contact" />
    </Container>
  );
}
