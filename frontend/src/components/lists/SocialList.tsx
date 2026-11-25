import React from "react";
import { Stack, type StackProps } from "@mui/material";
import {
  GitHub as GitHubIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import SocialIconButton, {
  type SocialIconButtonProps,
} from "../buttons/SocialIconButton";
import ArtStationIcon from "../icons/ArtStationIcon";
import {
  ARTSTATION_URL,
  GITHUB_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
} from "../../constants";

interface SocialListProps extends StackProps {
  slotProps?: { iconButton?: Partial<SocialIconButtonProps> };
}

const SocialList: React.FC<SocialListProps> = ({ slotProps, ...props }) => {
  /** Values */

  const items = [
    { label: "GitHub Profile", href: GITHUB_URL, Icon: GitHubIcon },
    { label: "Instagram Profile", href: INSTAGRAM_URL, Icon: InstagramIcon },
    { label: "LinkedIn Profile", href: LINKEDIN_URL, Icon: LinkedInIcon },
    { label: "ArtStation Profile", href: ARTSTATION_URL, Icon: ArtStationIcon },
  ];

  return (
    <Stack direction="row" spacing={0.5} {...props}>
      {items.map((item) => (
        <SocialIconButton
          key={item.label}
          href={item.href}
          Icon={item.Icon}
          aria-label={item.label}
          {...slotProps?.iconButton}
        />
      ))}
    </Stack>
  );
};

export default SocialList;
