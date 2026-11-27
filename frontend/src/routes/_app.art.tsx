import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { z } from "zod";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Container } from "@mui/material";
import {
  Download as DownloadIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import ProjectDialog from "@/components/modals/ProjectDialog";
import ProjectGrid from "@/components/lists/ProjectGrid";
import { idSchema } from "@/schemas/basic";
import { projectQueries } from "@/queries/projects";
import { projectListRequestSchema } from "@/schemas/projects";
import { downloadFile } from "@/utils/files";
import type { Project } from "@/types/projects";
import type { MenuOption } from "@/types/basic";

const category: Project["category"] = "art";
const validateSearch = z.object({
  project: z.preprocess((value) => {
    const res = idSchema.safeParse(value);
    return res.success ? res.data : undefined;
  }, idSchema.optional()),
});

export const Route = createFileRoute("/_app/art")({
  component: RouteComponent,
  validateSearch,
  search: { middlewares: [stripSearchParams(validateSearch.parse({}))] },
  staticData: { breadcrumb: { label: category } },
});

function RouteComponent() {
  /** Values */

  const search = Route.useSearch();
  const navigate = Route.useNavigate();
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
      replace: true,
    });

  const handleProjectOnClose = () =>
    navigate({
      search: ({ project: _, ...prev }) => prev,
      resetScroll: false,
      replace: true,
    });

  const handleProjectNavigate = (project: Project) =>
    navigate({
      to: "/projects/$id",
      params: { id: String(project.id) },
    });

  const getProjectOptions = (project: Project): MenuOption[] => [
    {
      id: "view",
      title: "View",
      Icon: InfoIcon,
      onClick: () => handleProjectNavigate(project),
    },
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
    <Container disableGutters maxWidth="xl">
      <ProjectGrid
        projects={projects}
        hasMore={projectListQuery.hasNextPage}
        loading={projectListQuery.isFetching}
        error={projectListQuery.error}
        onLoadMore={projectListQuery.fetchNextPage}
        onRefetch={projectListQuery.refetch}
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
