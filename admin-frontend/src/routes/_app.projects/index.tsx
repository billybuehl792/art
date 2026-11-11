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
import { Container, Typography } from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useConfirm } from "@/providers/ConfirmProvider";
import Link from "@/components/links/Link";
import ProjectList, {
  type ProjectListProps,
} from "@/components/lists/ProjectList";
import { projectQueries } from "@/queries/projects";
import { projectListRequestSchema } from "@/schemas/projects";
import { reorderInfiniteData } from "@/utils/queries";
import type { Project } from "@/types/projects";
import type { MenuOption } from "@/types/basic";
import ProjectListPageHeader, {
  type ProjectListPageHeaderProps,
} from "@/components/lists/ProjectList/ProjectListPageHeader";

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

  /** Queries */

  const projectListQueryOptions = projectQueries.projects.get({ params });
  const projectListQuery = useInfiniteQuery(projectListQueryOptions);

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

  const handleProjectDelete = (project: Project) =>
    confirm({
      title: `Delete "${project.title}"?`,
      description:
        "This project and its associated data will be permanently deleted.",
    }).then((confirmed) => {
      if (confirmed) projectDeleteMutation.mutate(project.id);
    });

  const handleOnSort: ProjectListProps["onSort"] = async (
    sortedProjects,
    targetId,
  ) => {
    if (!projectListQuery.data) return;

    await queryClient.cancelQueries(projectListQueryOptions);

    const sorted = reorderInfiniteData(projectListQuery.data, sortedProjects);
    queryClient.setQueryData(projectListQueryOptions.queryKey, sorted);

    const movedIndex = sortedProjects.findIndex((item) => item.id === targetId);
    const afterId = movedIndex > 0 ? sortedProjects[movedIndex - 1].id : null;

    await projectListReorderMutation.mutateAsync({ targetId, afterId });
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
      onClick: () =>
        navigate({ to: "$id/edit", params: { id: String(project.id) } }),
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
        query={projectListQuery}
        onSort={handleOnSort}
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
