import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Container } from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";
import ProjectList from "@/components/lists/ProjectList";
import { projectQueries } from "@/queries/projects";
import { projectListRequestSchema } from "@/schemas/projects";
import type { Project } from "@/types/projects";
import type { MenuOption } from "@/types/basic";

const category: Project["category"] = "dev";

export const Route = createFileRoute("/_app/dev")({
  component: RouteComponent,
  staticData: { breadcrumb: { label: category } },
});

function RouteComponent() {
  /** Values */

  const navigate = Route.useNavigate();

  /** Queries */

  const projectListQuery = useInfiniteQuery(
    projectQueries.projects.get(
      projectListRequestSchema.parse({ params: { category } }),
    ),
  );

  /** Data */

  const projects =
    projectListQuery.data?.pages.flatMap((page) => page.data.results) ?? [];

  /** Callbacks */

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
  ];

  return (
    <Container>
      <ProjectList
        projects={projects}
        hasMore={projectListQuery.hasNextPage}
        loading={projectListQuery.isFetching}
        error={projectListQuery.error}
        onLoadMore={projectListQuery.fetchNextPage}
        onRefetch={projectListQuery.refetch}
        sx={{ my: 2 }}
        slotProps={{
          card: (project) => ({
            options: getProjectOptions(project),
            onClick: handleProjectNavigate,
          }),
        }}
      />
    </Container>
  );
}
