import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Container, useMediaQuery } from "@mui/material";
import PageHeader from "@/components/layout/PageHeader";
import ProjectList from "@/components/lists/ProjectList";
import { projectQueries } from "@/queries/projects";
import { projectListRequestSchema } from "@/schemas/projects";
import type { Project } from "@/types/projects";

const category: Project["category"] = "dev";

export const Route = createFileRoute("/_app/dev")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  /** Queries */

  const projectListQuery = useInfiniteQuery(
    projectQueries.projects.get(
      projectListRequestSchema.parse({ params: { category } }),
    ),
  );

  /** Data */

  const projects =
    projectListQuery.data?.pages.flatMap((page) => page.data.results) ?? [];

  return (
    <Container>
      <PageHeader title="Dev" sx={{ px: isSm ? 1 : 0 }} />
      <ProjectList
        projects={projects}
        hasMore={projectListQuery.hasNextPage}
        loading={projectListQuery.isFetching}
        error={projectListQuery.error}
        onLoadMore={projectListQuery.fetchNextPage}
        onRefetch={projectListQuery.refetch}
        sx={{ my: 2 }}
      />
    </Container>
  );
}
