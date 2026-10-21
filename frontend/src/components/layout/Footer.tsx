import React from "react";
import { styled, ThemeProvider, useTheme } from "@mui/material/styles";
import { Box, Typography, type BoxProps } from "@mui/material";
import { APP_TITLE } from "../../constants";
import { darkTheme, lightTheme } from "../../theme";
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
  color: theme.palette.text.primary,
  zIndex: theme.zIndex.appBar,
  [theme.breakpoints.up("sm")]: { left: theme.layout.navPanelWidth },
}));

const Footer: React.FC<BoxProps> = (props) => {
  /** Values */

  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";

  const currentYear = new Date().getFullYear();
  const label = `© ${currentYear} ${APP_TITLE}`;

  return (
    <ThemeProvider theme={isLightMode ? darkTheme : lightTheme}>
      <StyledBox component="footer" {...props}>
        <Typography variant="h4" sx={truncateText}>
          {label}
        </Typography>
      </StyledBox>
    </ThemeProvider>
  );
};

export default Footer;
