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
import { useSnackbar } from "notistack";
import { Container, Typography } from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import useConfirm from "@/hooks/useConfirm";
import Link from "@/components/links/Link";
import ProjectList, {
  type ProjectListProps,
} from "@/components/lists/ProjectList";
import ProjectListPageHeader, {
  type ProjectListPageHeaderProps,
} from "@/components/lists/ProjectList/ProjectListPageHeader";
import { projectQueries } from "@/queries/projects";
import { projectListRequestSchema } from "@/schemas/projects";
import { reorderInfiniteData } from "@/utils/queries";
import type { Project } from "@/types/projects";
import type { MenuOption } from "@/types/basic";

const validateSearch = projectListRequestSchema.shape.params;

export const Route = createFileRoute("/_app/projects/")({
  validateSearch,
  search: { middlewares: [stripSearchParams(validateSearch.parse({}))] },
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate({ from: Route.fullPath });
  const params = Route.useSearch();
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const snackbar = useSnackbar();

  const { category, search } = params;
  const isSortable = !!category && !search;

  /** Queries */

  const projectListQueryOptions = projectQueries.projects.get({ params });
  const projectListQuery = useInfiniteQuery(projectListQueryOptions);

  /** Data */

  const projects =
    projectListQuery.data?.pages.flatMap((page) => page.data.results) ?? [];

  /** Mutations */

  const projectDeleteMutation = useMutation(projectQueries.projects.delete());
  const projectListReorderMutation = useMutation(
    projectQueries.projects.reorder(),
  );

  /** Callbacks */

  const handleOnSearch: ProjectListPageHeaderProps["onSearch"] = (search) =>
    navigate({ search: (params) => ({ ...params, search, page: 1 }) });

  const handleOnTabChange: ProjectListPageHeaderProps["onTabChange"] = (
    category,
  ) => navigate({ search: (params) => ({ ...params, category, page: 1 }) });

  const handleProjectOnClick = (project: Project) =>
    navigate({ to: "$id", params: { id: String(project.id) } });

  const handleProjectEdit = (project: Project) =>
    navigate({ to: "$id/edit", params: { id: String(project.id) } });

  const handleProjectDelete = (project: Project) =>
    confirm({
      title: `Delete "${project.title}"?`,
      description:
        "This project and its associated data will be permanently deleted.",
      confirmButton: { children: "Delete", color: "error" },
      cancelButton: { color: "primary" },
    }).then((confirmed) => {
      if (confirmed)
        projectDeleteMutation.mutate(project.id, {
          onSuccess: () =>
            snackbar.enqueueSnackbar(`Deleted Project: "${project.title}"`),
          onError: () =>
            snackbar.enqueueSnackbar({
              message: `Error while deleting project:  "${project.title}"`,
              variant: "error",
            }),
        });
    });

  const handleOnSort: ProjectListProps["onSort"] = async ({
    targetId,
    afterId,
    sorted,
  }) => {
    if (!isSortable || !projectListQuery.data) return;

    await queryClient.cancelQueries(projectListQueryOptions);

    const sortedProjects = reorderInfiniteData(projectListQuery.data, sorted);
    queryClient.setQueryData(projectListQueryOptions.queryKey, sortedProjects);

    const body = { targetId, afterId, category };
    await projectListReorderMutation.mutateAsync(body, {
      onSettled: (_, error) =>
        snackbar.enqueueSnackbar({
          message: "Projects reordered",
          variant: error ? "error" : "success",
        }),
    });
  };

  /** Options */

  const getProjectOptions = (project: Project): MenuOption[] => [
    {
      id: "view",
      title: "View",
      Icon: InfoIcon,
      onClick: () => handleProjectOnClick(project),
    },
    {
      id: "edit",
      title: "Edit",
      Icon: EditIcon,
      onClick: () => handleProjectEdit(project),
    },
    {
      id: "delete",
      title: "Delete",
      color: "error",
      Icon: DeleteIcon,
      onClick: () => handleProjectDelete(project),
    },
  ];

  return (
    <Container>
      <ProjectListPageHeader
        breadcrumbs={[
          <Link to="/">Home</Link>,
          <Typography>Projects</Typography>,
        ]}
        params={params}
        onSearch={handleOnSearch}
        onTabChange={handleOnTabChange}
      />
      <ProjectList
        projects={projects}
        hasMore={projectListQuery.hasNextPage}
        loading={projectListQuery.isFetching}
        error={projectListQuery.error}
        onLoadMore={projectListQuery.fetchNextPage}
        onRefetch={projectListQuery.refetch}
        {...(isSortable && { onSort: handleOnSort })}
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
