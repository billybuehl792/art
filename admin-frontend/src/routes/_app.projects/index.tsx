import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Breadcrumbs, Container, Typography } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import Link from "@/components/links/Link";
import ProjectList, {
  type ProjectListProps,
} from "@/components/lists/ProjectList";
import PageHeader from "@/components/layout/PageHeader";
import queries from "@/queries";
import { useConfirm } from "@/providers/ConfirmProvider";
import type { Project } from "@/types";

export const Route = createFileRoute("/_app/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate({ from: Route.fullPath });
  const confirm = useConfirm();

  /** Queries */

  const projectListQuery = useInfiniteQuery(queries.projects.get());

  /** Mutations */

  const projectDeleteMutation = useMutation(queries.projects.delete());

  /** Data */

  const projects =
    projectListQuery.data?.pages.flatMap((page) => page.data.results) ?? [];

  /** Callbacks */

  const handleProjectOnClick: ProjectListProps["onProjectClick"] = (project) =>
    navigate({ to: "$id", params: { id: String(project.id) } });

  /** Callbacks */

  const handleDeleteProject = async (project: Project) => {
    const confirmed = await confirm({
      title: "Delete project?",
      description:
        "This project and its associated data will be permanently deleted.",
    });

    if (!confirmed) return;

    await projectDeleteMutation.mutateAsync(project.id, {
      onSuccess: () => projectListQuery.refetch(),
    });
  };

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
          <Breadcrumbs sx={{ flexGrow: 1 }}>
            <Typography>Projects</Typography>
          </Breadcrumbs>
        }
        endContent={<Link to="/projects/create">Create</Link>}
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
