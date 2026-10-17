import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "../components/layout/Footer";
import NavPanel from "../components/layout/NavPanel";
import { Box, useMediaQuery } from "@mui/material";
import AppBar from "../components/layout/AppBar";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const isLg = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  return (
    <>
      {isLg ? <NavPanel /> : <AppBar />}

      <Box
        component="main"
        sx={(theme) => ({
          ...{ pb: `${theme.layout.footerHeight}px` },
          ...(isLg
            ? { ml: `${theme.layout.navPanelWidth}px` }
            : { mt: `${theme.layout.appBarHeight}px` }),
        })}
      >
        <Outlet />
      </Box>

      <Footer
        sx={(theme) => ({
          ...{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: `${theme.layout.footerHeight}px`,
          },
          ...(isLg && { left: `${theme.layout.navPanelWidth}px` }),
        })}
      />
    </>
  );
}
