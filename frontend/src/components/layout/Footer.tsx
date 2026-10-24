import React from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, type BoxProps } from "@mui/material";
import { APP_TITLE } from "../../constants";
import { truncateText } from "../../utils/sx";

const StyledBox = styled(Box)(({ theme }) => ({
  position: "fixed",
  display: "flex",
  bottom: 0,
  left: 0,
  right: 0,
  height: theme.layout.footerHeight,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  zIndex: theme.zIndex.appBar,
  [theme.breakpoints.up("sm")]: { left: theme.layout.navPanelWidth },
}));

const Footer: React.FC<BoxProps> = (props) => {
  /** Values */

  const currentYear = new Date().getFullYear();
  const label = `© ${currentYear} ${APP_TITLE}`;

  return (
    <StyledBox component="footer" {...props}>
      <Typography variant="h4" sx={truncateText}>
        {label}
      </Typography>
    </StyledBox>
  );
};

export default Footer;
