import { createFileRoute } from "@tanstack/react-router";
import { Container, Divider, Stack, Tooltip, Typography } from "@mui/material";
import ProfileImage from "../components/images/ProfileImage";
import IconButtonLink from "@/components/links/IconButtonLink";
import { ICONS } from "@/constants";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const links = [
    {
      label: "Art",
      value: <IconButtonLink to="/art" size="small" children={<ICONS.ART />} />,
    },
    {
      label: "Dev",
      value: <IconButtonLink to="/dev" size="small" children={<ICONS.DEV />} />,
    },
    {
      label: "Contact",
      value: (
        <IconButtonLink
          to="/contact"
          size="small"
          children={<ICONS.CONTACT />}
        />
      ),
    },
  ];

  return (
    <Container variant="centered">
      <Stack spacing={1} sx={{ p: 2 }}>
        <Stack direction="row" sx={{ justifyContent: "center" }}>
          <ProfileImage />
        </Stack>
        <Divider />
        <Stack spacing={1}>
          <Stack sx={{ textAlign: "center" }}>
            <Typography variant="subtitle1">billy buehl</Typography>
            <Typography variant="caption">designer/developer</Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", justifyContent: "center" }}
          >
            {links.map(({ label, value }) => (
              <Tooltip key={label} title={label}>
                {value}
              </Tooltip>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
