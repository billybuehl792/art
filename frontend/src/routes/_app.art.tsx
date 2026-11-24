import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Container, useMediaQuery } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import PageHeader from "@/components/layout/PageHeader";
import ProjectDialog from "@/components/modals/ProjectDialog";
import ProjectGrid from "@/components/lists/ProjectGrid";
import { idSchema } from "@/schemas/basic";
import { projectQueries } from "@/queries/projects";
import { projectListRequestSchema } from "@/schemas/projects";
import { downloadFile } from "@/utils/files";
import type { Project } from "@/types/projects";
import type { MenuOption } from "@/types/basic";

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
    projectQueries.projects.get(
      projectListRequestSchema.parse({ params: { category } }),
    ),
  );

  /** Data */

  const projects =
    projectListQuery.data?.pages.flatMap((page) => page.data.results) ?? [];

  const selectedProject = selectedProjectId
    ? (projects.find(({ id }) => id === selectedProjectId) ?? selectedProjectId)
    : null;

  /** Callbacks */

  const handleProjectOnClick = (project: Project) =>
    navigate({
      search: (prev) => ({ ...prev, project: String(project.id) }),
      resetScroll: false,
    });

  const handleProjectOnClose = () =>
    navigate({ search: ({ project: _, ...prev }) => prev, resetScroll: false });

  const getProjectOptions = (project: Project): MenuOption[] => [
    {
      id: "download",
      render: !!project.mediaUrl,
      title: "Download",
      Icon: DownloadIcon,
      onClick: () => {
        if (project.mediaUrl) downloadFile(project.mediaUrl, project.title);
      },
    },
  ];

  return (
    <Container disableGutters={isSm}>
      <PageHeader title="Art" sx={{ px: isSm ? 1 : 0 }} />
      <ProjectGrid
        projects={projects}
        hasMore={projectListQuery.hasNextPage}
        loading={projectListQuery.isFetching}
        error={projectListQuery.error}
        onLoadMore={projectListQuery.fetchNextPage}
        onRefetch={projectListQuery.refetch}
        sx={{ my: 2 }}
        slotProps={{
          card: (project) => ({ onClick: () => handleProjectOnClick(project) }),
        }}
      />
      <ProjectDialog
        open={!!selectedProject}
        project={selectedProject}
        options={selectedProject ? getProjectOptions : undefined}
        onClose={handleProjectOnClose}
      />
    </Container>
  );
}
