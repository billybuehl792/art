import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "../components/layout/Footer";
import NavPanel from "../components/layout/NavPanel";
import { useMediaQuery } from "@mui/material";
import AppBar from "../components/layout/AppBar";
import Main from "@/components/layout/Main";
import { APP_TITLE } from "@/constants";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  staticData: {
    breadcrumb: { label: APP_TITLE, variant: "h2", color: "primary" },
  },
});

function RouteComponent() {
  /** Values */

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <>
      {isXs ? <AppBar /> : <NavPanel />}
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </>
  );
}
