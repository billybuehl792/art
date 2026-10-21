import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "../components/layout/Footer";
import NavPanel from "../components/layout/NavPanel";
import { useMediaQuery } from "@mui/material";
import AppBar from "../components/layout/AppBar";
import Main from "@/components/layout/Main";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const isLg = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  return (
    <>
      {isLg ? <NavPanel /> : <AppBar />}
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </>
  );
}
