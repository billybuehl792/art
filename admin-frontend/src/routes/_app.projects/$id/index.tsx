import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Breadcrumbs,
  Card,
  CardContent,
  CardMedia,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import Link from "@/components/links/Link";
import MenuOptionsIconButton from "@/components/buttons/MenuOptionsIconButton";
import PageHeader from "@/components/layout/PageHeader";
import { useConfirm } from "@/providers/ConfirmProvider";
import { projectQueries } from "@/queries/projects";
import { idSchema } from "@/schemas/basic";
import type { MenuOption } from "@/types/basic";
import { PROJECTS_KEY } from "@/constants/projects";

export const Route = createFileRoute("/_app/projects/$id/")({
  loader: async ({ params, context }) => {
    const idParse = idSchema.safeParse(params.id);
    if (!idParse.success) throw notFound();

    const { data } = await context.queryClient.query(
      projectQueries.projects.project(idParse.data).get(),
    );

    return data;
  },
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = Route.useNavigate();
  const project = Route.useLoaderData();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  /** Mutations */

  const projectDeleteMutation = useMutation({
    ...projectQueries.projects.project(project.id).delete(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });

  /** Callbacks */

  const handleDeleteProject = async () => {
    const confirmed = await confirm({
      title: "Delete project?",
      description:
        "This project and its associated data will be permanently deleted.",
    });

    if (!confirmed) return;

    await projectDeleteMutation.mutateAsync(undefined, {
      onSuccess: () => navigate({ to: "/projects" }),
    });
  };

  /** Options */

  const options: MenuOption[] = [
    {
      id: "edit",
      title: "Edit",
      Icon: EditIcon,
      onClick: () =>
        navigate({
          to: "/projects/$id/edit",
          params: { id: String(project.id) },
        }),
    },
    {
      id: "delete",
      title: "Delete",
      color: "error",
      Icon: DeleteIcon,
      onClick: handleDeleteProject,
    },
  ];

  return (
    <Container>
      <PageHeader
        title={
          <Breadcrumbs sx={{ flexGrow: 1 }}>
            <Link to="/">Home</Link>
            <Link to="/projects">Projects</Link>
            <Typography>{project.title}</Typography>
          </Breadcrumbs>
        }
        endContent={<MenuOptionsIconButton options={options} />}
      />
      <Stack sx={{ my: 2 }}>
        <Card>
          {!!project.mediaUrl && (
            <CardMedia
              component="img"
              height="194"
              image={project.mediaUrl}
              sx={{ objectFit: "contain" }}
            />
          )}
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h2">{project.title}</Typography>
              {!!project.subtitle && (
                <Typography variant="h4">{project.subtitle}</Typography>
              )}
              {!!project.description && (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {project.description}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
