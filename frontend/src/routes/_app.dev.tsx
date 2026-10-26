import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Container, useMediaQuery } from "@mui/material";
import PageHeader from "@/components/layout/PageHeader";
import ProjectList from "@/components/lists/ProjectList";
import { apiQueries } from "@/queries";
import { projectListRequestParamsSchema } from "@/schemas/projects";

const category = "dev";

export const Route = createFileRoute("/_app/dev")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  /** Queries */

  const projectListQuery = useInfiniteQuery(
    apiQueries.projects.get(projectListRequestParamsSchema.parse({ category })),
  );

  /** Data */

  const projects =
    projectListQuery.data?.pages.flatMap((page) => page.data.results) ?? [];

  return (
    <Container>
      <PageHeader title="Dev" sx={{ px: isSm ? 1 : 0 }} />
      <ProjectList
        projects={projects}
        loading={projectListQuery.isLoading}
        error={projectListQuery.error}
        hasNextPage={projectListQuery.hasNextPage}
        isFetchingNextPage={projectListQuery.isFetchingNextPage}
        isRefetching={projectListQuery.isRefetching}
        onFetchNextPage={projectListQuery.fetchNextPage}
        onRetry={projectListQuery.refetch}
        sx={{ my: 2 }}
      />
    </Container>
  );
}
