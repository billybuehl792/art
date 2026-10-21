import { styled } from "@mui/material/styles";

const Main = styled("main")(({ theme }) => ({
  position: "relative",
  top: theme.layout.appBarHeight,
  marginLeft: 0,
  paddingBottom: theme.layout.footerHeight,
  [theme.breakpoints.up("sm")]: {
    top: 0,
    marginLeft: theme.layout.navPanelWidth,
  },
}));

export default Main;
