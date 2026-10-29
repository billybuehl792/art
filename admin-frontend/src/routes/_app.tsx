import { createFileRoute, Outlet } from "@tanstack/react-router";
import AppBar from "@/components/layout/AppBar";
import Main from "@/components/layout/Main";
import Footer from "@/components/layout/Footer";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <AppBar />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </>
  );
}
