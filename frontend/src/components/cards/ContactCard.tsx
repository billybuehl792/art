import React from "react";
import {
  Card,
  CardContent,
  Divider,
  Link,
  Stack,
  Typography,
  type CardProps,
  type LinkProps,
} from "@mui/material";
import {
  Article,
  Mail as MailIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import SocialList from "../lists/SocialList";
import { sxArray, truncateText } from "@/utils/sx";
import { RESUME, EMAIL } from "@/constants";

const ContactCard: React.FC<CardProps> = (props) => {
  /** Values */

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
          <ContactCardLink children="Dev Resume" href={RESUME.DEV} />
          <ContactCardLink children="Design Resume" href={RESUME.DESIGN} />
        </Stack>
      ),
    },
  ];

  return (
    <Card {...props}>
      <CardContent>
        <Stack spacing={2} divider={<Divider />} sx={{ px: 3, py: 1 }}>
          <Stack spacing={0.5}>
            <Typography variant="h2">Here is my contact info</Typography>
            <Typography variant="caption">
              reach out if you like my art and stuff
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            divider={
              <Divider
                orientation="vertical"
                flexItem
                sx={{ display: { xs: "none", sm: "block" } }}
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
              direction={{ xs: "row", sm: "column" }}
              slotProps={{ iconButton: { size: "small" } }}
              sx={{ justifyContent: { xs: "space-around", sm: "flex-start" } }}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

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
export default ContactCard;
