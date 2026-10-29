import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Container } from "@mui/material";
import ProjectList, {
  type ProjectListProps,
} from "@/components/lists/ProjectList";
import PageHeader from "@/components/layout/PageHeader";
import { apiQueries } from "@/queries";

export const Route = createFileRoute("/_app/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate({ from: Route.fullPath });

  /** Queries */

  const projectListQuery = useInfiniteQuery(apiQueries.projects.get());

  /** Data */

  const projects =
    projectListQuery.data?.pages.flatMap((page) => page.data.results) ?? [];

  /** Callbacks */

  const handleProjectOnClick: ProjectListProps["onProjectClick"] = (project) =>
    navigate({ to: "$id", params: { id: String(project.id) } });

  return (
    <Container>
      <PageHeader title="Projects" />
      <ProjectList
        projects={projects}
        loading={projectListQuery.isLoading}
        error={projectListQuery.error}
        hasNextPage={projectListQuery.hasNextPage}
        isFetchingNextPage={projectListQuery.isFetchingNextPage}
        isRefetching={projectListQuery.isRefetching}
        onProjectClick={handleProjectOnClick}
        onFetchNextPage={projectListQuery.fetchNextPage}
        onRetry={projectListQuery.refetch}
        sx={{ my: 2 }}
      />
    </Container>
  );
}
