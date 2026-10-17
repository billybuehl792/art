import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@mui/material";

export const Route = createFileRoute("/_app/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Container>contact</Container>;
}
