import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PageHeader from "@/components/layout/PageHeader";
import CardActionAreaLink from "@/components/links/CardActionAreaLink";
import { ProjectIcon } from "@/constants";
import { truncateText } from "@/utils";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container>
      <PageHeader title="Admin Configuration" />
      <Grid container spacing={2} sx={{ my: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardActionAreaLink to="/projects">
              <CardContent>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: "center" }}
                >
                  <ProjectIcon fontSize="large" />
                  <Typography variant="h2" sx={truncateText}>
                    Projects
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionAreaLink>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
