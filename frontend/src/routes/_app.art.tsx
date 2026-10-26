import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Container, useMediaQuery } from "@mui/material";
import PageHeader from "@/components/layout/PageHeader";
import ProjectDialog from "@/components/modals/ProjectDialog";
import ProjectGrid, {
  type ProjectGridProps,
} from "@/components/lists/ProjectGrid";
import { apiQueries } from "@/queries";
import { idSchema } from "@/schemas/basic";
import { projectListRequestParamsSchema } from "@/schemas/projects";

const category = "art";
const validateSearch = z.object({ project: idSchema.optional() });

export const Route = createFileRoute("/_app/art")({
  component: RouteComponent,
  validateSearch,
});

function RouteComponent() {
  /** Values */

  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const selectedProjectId = search.project;

  /** Queries */

  const projectListQuery = useInfiniteQuery(
    apiQueries.projects.get(projectListRequestParamsSchema.parse({ category })),
  );

  /** Data */

  const projects =
    projectListQuery.data?.pages.flatMap((page) => page.data.results) ?? [];
  const selectedProject = selectedProjectId
    ? (projects.find(({ id }) => id === selectedProjectId) ?? selectedProjectId)
    : null;

  /** Callbacks */

  const handleProjectOnClick: ProjectGridProps["onProjectClick"] = (project) =>
    navigate({
      search: (prev) => ({ ...prev, project: String(project.id) }),
      resetScroll: false,
    });

  const handleProjectOnClose = () =>
    navigate({ search: ({ project: _, ...prev }) => prev, resetScroll: false });

  return (
    <Container disableGutters={isSm}>
      <PageHeader title="Art" sx={{ px: isSm ? 1 : 0 }} />
      <ProjectGrid
        projects={projects}
        loading={projectListQuery.isLoading}
        error={projectListQuery.error}
        hasNextPage={projectListQuery.hasNextPage}
        isFetchingNextPage={projectListQuery.isFetchingNextPage}
        isRefetching={projectListQuery.isRefetching}
        onProjectClick={handleProjectOnClick}
        onFetchNextPage={projectListQuery.fetchNextPage}
        onRetry={projectListQuery.refetch}
      />
      <ProjectDialog
        open={!!selectedProject}
        project={selectedProject}
        onClose={handleProjectOnClose}
      />
    </Container>
  );
}
