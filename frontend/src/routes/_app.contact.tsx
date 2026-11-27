import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@mui/material";
import ContactCard from "@/components/cards/ContactCard";

export const Route = createFileRoute("/_app/contact")({
  component: RouteComponent,
  staticData: { breadcrumb: { label: "contact" } },
});

function RouteComponent() {
  return (
    <Container variant="centered">
      <ContactCard sx={{ my: 2 }} />
    </Container>
  );
}
