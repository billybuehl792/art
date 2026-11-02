import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import {
  Breadcrumbs,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Link from "@/components/links/Link";
import MenuOptionsIconButton from "@/components/buttons/MenuOptionsIconButton";
import PageHeader from "@/components/layout/PageHeader";
import ProjectForm, {
  type ProjectFormProps,
} from "@/components/forms/ProjectForm";
import { useConfirm } from "@/providers/ConfirmProvider";
import queries from "@/queries";
import { idSchema, projectUpdateSchema } from "@/schemas";
import { urlToFile } from "@/utils";
import type { MenuOption } from "@/types";

export const Route = createFileRoute("/_app/projects/$id/edit")({
  loader: async ({ params, context }) => {
    const idParse = idSchema.safeParse(params.id);
    if (!idParse.success) throw notFound();

    const { data } = await context.queryClient.query(
      queries.projects.project(idParse.data).get(),
    );

    let media: File | null = null;
    let thumbnail: File | null = null;
    try {
      media = data.mediaUrl
        ? await urlToFile(data.mediaUrl ?? "", "media.png")
        : null;
      thumbnail = data.thumbnailUrl
        ? await urlToFile(data.thumbnailUrl ?? "", "thumbnail.png")
        : null;
    } catch (error) {
      console.error("Failed to fetch media or thumbnail:", error);
    }

    return { ...data, media, thumbnail };
  },
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const router = useRouter();
  const navigate = Route.useNavigate();
  const project = Route.useLoaderData();
  const confirm = useConfirm();

  /** Mutations */

  const projectUpdateMutation = useMutation(
    queries.projects.project(project.id).patch(),
  );
  const projectDeleteMutation = useMutation(
    queries.projects.project(project.id).delete(),
  );

  /** Callbacks */

  const handleUpdateProject: ProjectFormProps["onSubmit"] = async (data) => {
    await projectUpdateMutation.mutateAsync(projectUpdateSchema.parse(data), {
      onSuccess: () => router.invalidate(),
    });
  };

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
            <Link to="/projects">Projects</Link>
            <Link to="/projects/$id" params={{ id: String(project.id) }}>
              {project.title}
            </Link>
            <Typography>Edit</Typography>
          </Breadcrumbs>
        }
        endContent={<MenuOptionsIconButton options={options} />}
      />
      <Stack sx={{ my: 2 }}>
        <Card>
          <CardContent>
            <ProjectForm
              defaultValues={{
                title: project.title,
                subtitle: project.subtitle,
                description: project.description,
                category: project.category,
                media: project.media,
                thumbnail: project.thumbnail,
                link: project.link,
                priority: project.priority,
                sortOrder: project.sortOrder,
              }}
              onSubmit={handleUpdateProject}
            />
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
