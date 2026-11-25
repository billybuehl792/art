import React from "react";
import {
  Card,
  CardContent,
  Divider,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  type CardProps,
  type LinkProps,
} from "@mui/material";
import {
  Article,
  Mail as MailIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { sxArray, truncateText } from "@/utils/sx";
import { DESIGN_RESUME, DEV_RESUME, EMAIL } from "@/constants";
import SocialList from "../lists/SocialList";

const ContactCardLink: React.FC<LinkProps> = ({ children, ...props }) => {
  return (
    <Link
      variant="caption"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      sx={sxArray(
        truncateText,
        { display: "inline-flex", alignItems: "center", gap: 0.5 },
        props?.sx,
      )}
    >
      {children}
      <OpenInNewIcon fontSize="inherit" />
    </Link>
  );
};

const ContactCard: React.FC<CardProps> = (props) => {
  /** Values */

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const items = [
    {
      label: "Email",
      Icon: MailIcon,
      value: <ContactCardLink children={EMAIL} href={`mailto:${EMAIL}`} />,
    },
    {
      label: "Resume",
      Icon: Article,
      value: (
        <Stack sx={{ alignItems: "flex-start" }}>
          <ContactCardLink children="Dev Resume" href={DEV_RESUME} />
          <ContactCardLink children="Design Resume" href={DESIGN_RESUME} />
        </Stack>
      ),
    },
  ];

  return (
    <Card {...props}>
      <CardContent sx={{ px: { xs: 3, sm: 4 }, py: 2 }}>
        <Stack spacing={2} divider={<Divider />}>
          <Stack spacing={0.5}>
            <Typography variant="h2">Here is my contact info</Typography>
            <Typography variant="caption">
              reach out if you like my art and stuff
            </Typography>
          </Stack>

          <Stack
            direction={isXs ? "column" : "row"}
            spacing={2}
            divider={
              <Divider
                {...(!isXs && { orientation: "vertical", flexItem: true })}
              />
            }
          >
            <Stack spacing={1} sx={{ overflow: "hidden" }}>
              {items.map((item) => (
                <Stack key={item.label} direction="row" spacing={2}>
                  <item.Icon fontSize="small" />
                  <Stack spacing={0.5}>
                    <Typography variant="h3">{item.label}</Typography>
                    {item.value}
                  </Stack>
                </Stack>
              ))}
            </Stack>
            <SocialList
              direction={isXs ? "row" : "column"}
              slotProps={{ iconButton: { size: "small" } }}
              sx={[isXs && { justifyContent: "space-around" }]}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
