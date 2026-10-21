import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@mui/material";
import PageHeader from "@/components/layout/PageHeader";
import ProjectGrid from "@/components/lists/ProjectGrid";

export const Route = createFileRoute("/_app/art")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container>
      <PageHeader title="Art" />
      <ProjectGrid />
    </Container>
  );
}
