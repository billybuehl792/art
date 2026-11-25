import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@mui/material";
import ContactCard from "@/components/cards/ContactCard";

export const Route = createFileRoute("/_app/contact")({
  component: RouteComponent,
  staticData: { breadcrumb: { label: "contact" } },
});

function RouteComponent() {
  return (
    <Container
      sx={({ layout }) => ({
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: {
          xs: `calc(100vh - ${layout.footerHeight}px - ${layout.appBarHeight}px)`,
          sm: `calc(100vh - ${layout.footerHeight}px)`,
        },
      })}
    >
      <ContactCard sx={{ my: 2 }} />
    </Container>
  );
}
