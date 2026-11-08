import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs, Container, Typography } from "@mui/material";
import SortableList from "@/components/lists/SortableList";
import PageHeader from "@/components/layout/PageHeader";
import Link from "@/components/links/Link";
import { getMockProject } from "@/mocks/projects";
import type { Project } from "@/types/projects";

export const Route = createFileRoute("/_app/testing")({
  component: RouteComponent,
});

function RouteComponent() {
  const [items, setItems] = useState<Project[]>([
    getMockProject({ id: 1 }),
    getMockProject({ id: 2 }),
    getMockProject({ id: 3 }),
    getMockProject({ id: 4 }),
  ]);

  return (
    <Container>
      <PageHeader
        title={
          <Breadcrumbs>
            <Link to="/">Home</Link>
            <Typography>Testing</Typography>
          </Breadcrumbs>
        }
      />
      <SortableList items={items} onSort={setItems} />
    </Container>
  );
}
