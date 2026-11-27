import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, Container } from "@mui/material";
import SettingsForm from "@/components/forms/SettingsForm";

export const Route = createFileRoute("/_app/settings")({
  component: RouteComponent,
  staticData: { breadcrumb: { label: "settings" } },
});

function RouteComponent() {
  return (
    <Container variant="centered">
      <Card sx={{ my: 2 }}>
        <CardContent>
          <SettingsForm sx={{ px: 3, py: 1 }} />
        </CardContent>
      </Card>
    </Container>
  );
}
