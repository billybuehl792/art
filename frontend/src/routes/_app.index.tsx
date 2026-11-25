import { createFileRoute } from "@tanstack/react-router";
import { Container, Divider, Stack, Typography } from "@mui/material";
import ProfileImage from "../components/images/ProfileImage";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

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
      <Stack spacing={1} sx={{ p: 2 }}>
        <Stack direction="row" sx={{ justifyContent: "center" }}>
          <ProfileImage />
        </Stack>
        <Divider />
        <Stack sx={{ textAlign: "center" }}>
          <Typography variant="subtitle1">billy buehl</Typography>
          <Typography variant="caption">designer/developer</Typography>
        </Stack>
      </Stack>
    </Container>
  );
}
