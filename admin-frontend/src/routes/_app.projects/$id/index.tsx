import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
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
import useConfirm from "@/hooks/useConfirm";
import { projectQueries } from "@/queries/projects";
import { idSchema } from "@/schemas/basic";
import type { MenuOption } from "@/types/basic";

export const Route = createFileRoute("/_app/projects/$id/")({
  loader: async ({ params, context }) => {
    const idParse = idSchema.safeParse(params.id);
    if (!idParse.success) throw notFound();

    const res = await context.queryClient.query(
      projectQueries.projects.project(idParse.data).get(),
    );

    return res.data;
  },
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = Route.useNavigate();
  const project = Route.useLoaderData();
  const confirm = useConfirm();
  const snackbar = useSnackbar();

  /** Mutations */

  const projectDeleteMutation = useMutation(
    projectQueries.projects.project(project.id).delete(),
  );

  /** Callbacks */

  const handleProjectEdit = () =>
    navigate({ to: "/projects/$id/edit", params: { id: String(project.id) } });

  const handleProjectDelete = () =>
    confirm({
      title: `Delete "${project.title}"?`,
      description:
        "This project and its associated data will be permanently deleted.",
      confirmButton: { children: "Delete", color: "error" },
      cancelButton: { color: "primary" },
    }).then((confirmed) => {
      if (confirmed)
        projectDeleteMutation.mutate(undefined, {
          onSuccess: () => {
            snackbar.enqueueSnackbar(`Deleted Project: "${project.title}"`);
            navigate({ to: "/projects" });
          },
          onError: () =>
            snackbar.enqueueSnackbar({
              message: `Error while deleting project: "${project.title}"`,
              variant: "error",
            }),
        });
    });

  /** Options */

  const options: MenuOption[] = [
    {
      id: "edit",
      title: "Edit",
      Icon: EditIcon,
      onClick: handleProjectEdit,
    },
    {
      id: "delete",
      title: "Delete",
      color: "error",
      Icon: DeleteIcon,
      onClick: handleProjectDelete,
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
