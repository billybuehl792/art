import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMediaQuery } from "@mui/material";
import { apiQueries } from "@/queries";
import NavPanel from "@/components/layout/NavPanel";
import AppBar from "@/components/layout/AppBar";
import Main from "@/components/layout/Main";
import Footer from "@/components/layout/Footer";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const isLg = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  /** Queries */

  const healthQuery = useQuery(apiQueries.health.get());

  /** Data */

  const health =
    healthQuery.status === "success"
      ? healthQuery.data.data.status
      : healthQuery.status;

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
