import React from "react";
import { Stack, type StackProps } from "@mui/material";
import {
  GitHub as GitHubIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import ArtStationIcon from "../icons/ArtStationIcon";
import {
  ARTSTATION_URL,
  GITHUB_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
} from "../../constants";
import SocialIconButton from "../buttons/SocialIconButton";

const SocialList: React.FC<StackProps> = (props) => {
  return (
    <Stack direction="row" spacing={0.5} {...props}>
      <SocialIconButton
        href={GITHUB_URL}
        Icon={GitHubIcon}
        aria-label="GitHub Profile"
      />
      <SocialIconButton
        href={INSTAGRAM_URL}
        Icon={InstagramIcon}
        aria-label="Instagram Profile"
      />
      <SocialIconButton
        href={LINKEDIN_URL}
        Icon={LinkedInIcon}
        aria-label="LinkedIn Profile"
      />
      <SocialIconButton
        href={ARTSTATION_URL}
        Icon={ArtStationIcon}
        aria-label="Artstation Profile"
      />
    </Stack>
  );
};

export default SocialList;
