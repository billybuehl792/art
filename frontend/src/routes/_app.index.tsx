import { createFileRoute } from "@tanstack/react-router";
import {
  Container,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ProfileImage from "../components/images/ProfileImage";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const isLg = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  return (
    <Container
      sx={(theme) => ({
        position: "relative",
        minHeight: `calc(100vh - ${theme.layout.footerHeight}px - ${isLg ? 0 : theme.layout.appBarHeight}px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
