import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Breadcrumbs, Container, Typography } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useConfirm } from "@/providers/ConfirmProvider";
import Link from "@/components/links/Link";
import ProjectList from "@/components/lists/ProjectList";
import PageHeader from "@/components/layout/PageHeader";
import SearchField from "@/components/fields/SearchField";
import { projectQueries } from "@/queries/projects";
import { projectListRequestSchema } from "@/schemas/projects";
import { PROJECTS_KEY } from "@/constants/projects";
import type { Project } from "@/types/projects";
import type { MenuOption } from "@/types/basic";

export const Route = createFileRoute("/_app/projects/")({
  component: RouteComponent,
  validateSearch: projectListRequestSchema.shape.params,
  search: { middlewares: [stripSearchParams({ search: undefined })] },
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate({ from: Route.fullPath });
  const params = Route.useSearch();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  /** Queries */

  const projectListQuery = useInfiniteQuery(
    projectQueries.projects.get(projectListRequestSchema.parse({ params })),
  );

  /** Mutations */

  const projectDeleteMutation = useMutation({
    ...projectQueries.projects.delete(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });

  /** Data */

  const projects =
    projectListQuery.data?.pages.flatMap((page) => page.data.results) ?? [];

  /** Callbacks */

  const handleProjectOnClick = (project: Project) =>
    navigate({ to: "$id", params: { id: String(project.id) } });

  /** Callbacks */

  const handleOnSearch = (search: string) =>
    navigate({ to: ".", search: { search } });

  const handleDeleteProject = async (project: Project) => {
    const confirmed = await confirm({
      title: `Delete "${project.title}"?`,
      description:
        "This project and its associated data will be permanently deleted.",
    });

    if (!confirmed) return;

    await projectDeleteMutation.mutateAsync(project.id);
  };

  /** Options */

  const getProjectOptions = (project: Project): MenuOption[] => [
    {
      id: "edit",
      title: "Edit",
      Icon: EditIcon,
      onClick: () =>
        navigate({ to: "$id/edit", params: { id: String(project.id) } }),
    },
    {
      id: "delete",
      title: "Delete",
      color: "error",
      Icon: DeleteIcon,
      onClick: () => handleDeleteProject(project),
    },
  ];

  return (
    <Container>
      <PageHeader
        title={
          <Breadcrumbs>
            <Link to="/">Home</Link>
            <Typography>Projects</Typography>
          </Breadcrumbs>
        }
        endContent={<Link to="/projects/create">Create</Link>}
        bottomContent={
          <SearchField value={params.search || ""} onChange={handleOnSearch} />
        }
      />
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
        slotProps={{
          card: (project) => ({
            options: getProjectOptions(project),
            onClick: handleProjectOnClick,
          }),
        }}
      />
    </Container>
  );
}
