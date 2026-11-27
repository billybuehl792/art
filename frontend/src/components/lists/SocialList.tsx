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
import { SOCIAL_URLS as SOCIAL } from "../../constants";

interface SocialListProps extends StackProps {
  slotProps?: { iconButton?: Partial<SocialIconButtonProps> };
}

const SocialList: React.FC<SocialListProps> = ({ slotProps, ...props }) => {
  /** Values */

  const items = [
    { label: "GitHub", href: SOCIAL.GITHUB, Icon: GitHubIcon },
    { label: "Instagram", href: SOCIAL.INSTAGRAM, Icon: InstagramIcon },
    { label: "LinkedIn", href: SOCIAL.LINKEDIN, Icon: LinkedInIcon },
    { label: "ArtStation", href: SOCIAL.ARTSTATION, Icon: ArtStationIcon },
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
