import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@mui/material";

export const Route = createFileRoute("/_app/dev")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Container>dev</Container>;
}
