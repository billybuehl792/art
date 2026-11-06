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
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useConfirm } from "@/providers/ConfirmProvider";
import MenuOptionsIconButton from "@/components/buttons/MenuOptionsIconButton";
import ProjectList, {
  type ProjectListProps,
} from "@/components/lists/ProjectList";
import PageHeader from "@/components/layout/PageHeader";
import SearchField from "@/components/fields/SearchField";
import queries from "@/queries";
import type { MenuOption, Project } from "@/types";
import { projectListRequestParamsSchema } from "@/schemas";
import Link from "@/components/links/Link";

export const Route = createFileRoute("/_app/projects/")({
  component: RouteComponent,
  validateSearch: projectListRequestParamsSchema,
  search: { middlewares: [stripSearchParams({ search: undefined })] },
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate({ from: Route.fullPath });
  const searchParams = Route.useSearch();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  /** Queries */

  const projectListQuery = useInfiniteQuery(
    queries.projects.get(projectListRequestParamsSchema.parse(searchParams)),
  );

  /** Mutations */

  const projectDeleteMutation = useMutation({
    ...queries.projects.delete(),
    onSuccess: () => queryClient.invalidateQueries(queries.projects.get()),
  });

  /** Data */

  const projects =
    projectListQuery.data?.pages.flatMap((page) => page.data.results) ?? [];

  /** Callbacks */

  const handleProjectOnClick: ProjectListProps["onProjectClick"] = (project) =>
    navigate({ to: "$id", params: { id: String(project.id) } });

  /** Callbacks */

  const handleOnSearch = (search: string) =>
    navigate({ to: ".", search: { search } });

  const handleDeleteProject = async (project: Project) => {
    const confirmed = await confirm({
      title: "Delete project?",
      description:
        "This project and its associated data will be permanently deleted.",
    });

    if (!confirmed) return;

    await projectDeleteMutation.mutateAsync(project.id);
  };

  /** Options */

  const options: MenuOption[] = [
    {
      id: "create",
      title: "Create",
      Icon: AddIcon,
      onClick: () => navigate({ to: "/projects/create" }),
    },
  ];

  const getProjectOptions: ProjectListProps["projectOptions"] = (project) => [
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
        endContent={<MenuOptionsIconButton options={options} />}
        bottomContent={
          <SearchField
            value={searchParams.search || ""}
            onChange={handleOnSearch}
          />
        }
      />
      <ProjectList
        projects={projects}
        loading={projectListQuery.isLoading}
        error={projectListQuery.error}
        hasNextPage={projectListQuery.hasNextPage}
        isFetchingNextPage={projectListQuery.isFetchingNextPage}
        isRefetching={projectListQuery.isRefetching}
        projectOptions={getProjectOptions}
        onProjectClick={handleProjectOnClick}
        onFetchNextPage={projectListQuery.fetchNextPage}
        onRetry={projectListQuery.refetch}
        sx={{ my: 2 }}
      />
    </Container>
  );
}
