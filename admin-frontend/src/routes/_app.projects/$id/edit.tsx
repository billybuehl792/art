import {
  createFileRoute,
  notFound,
  useCanGoBack,
  useRouter,
} from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { idSchema, projectUpdateSchema, uploadCreateSchema } from "@/schemas";
import { isSameFile, urlToFile } from "@/utils";
import type { MenuOption } from "@/types";

export const Route = createFileRoute("/_app/projects/$id/edit")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const idParse = idSchema.safeParse(params.id);
    if (!idParse.success) throw notFound();

    const { data: project } = await context.queryClient.query(
      queries.projects.project(idParse.data).get(),
    );

    let media: File | null = null;
    try {
      media = project.mediaUrl ? await urlToFile(project.mediaUrl) : null;
    } catch (error) {
      console.error("Failed to fetch media or thumbnail:", error);
    }

    return { project: { ...project, media } };
  },
});

function RouteComponent() {
  /** Values */

  const router = useRouter();
  const navigate = Route.useNavigate();
  const loaderData = Route.useLoaderData();
  const queryClient = useQueryClient();
  const canGoBack = useCanGoBack();
  const confirm = useConfirm();

  const project = loaderData.project;

  /** Mutations */

  const uploadCreateMutation = useMutation(queries.uploads.post());
  const projectUpdateMutation = useMutation({
    ...queries.projects.project(project.id).patch(),
    onSuccess: () => queryClient.invalidateQueries(queries.projects.get()),
  });
  const projectDeleteMutation = useMutation({
    ...queries.projects.project(project.id).delete(),
    onSuccess: () => queryClient.invalidateQueries(queries.projects.get()),
  });

  /** Callbacks */

  const handleBack = () => {
    if (canGoBack) router.history.back();
    else router.navigate({ to: "/projects" });
  };

  const handleUpdateProject: ProjectFormProps["onSubmit"] = async ({
    media,
    ...data
  }) => {
    let mediaBody;

    if (media === null) {
      mediaBody = { mediaType: null, mediaUrl: null, thumbnailUrl: null };
    } else {
      const isSameMediaFile =
        !!project.media && !!media && isSameFile(media, project.media);
      if (!isSameMediaFile) {
        const mediaUploadResponse = await uploadCreateMutation.mutateAsync(
          uploadCreateSchema.parse({ file: media }),
        );
        mediaBody = mediaUploadResponse.data;
      }
    }

    await projectUpdateMutation.mutateAsync(
      projectUpdateSchema.parse({ ...data, ...mediaBody }),
      {
        onSuccess: (res) =>
          navigate({
            to: "/projects/$id",
            params: { id: String(res.data.id) },
            ignoreBlocker: true,
          }),
      },
    );
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
            <Link to="/">Home</Link>
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
              defaultValues={project}
              onSubmit={handleUpdateProject}
              onCancel={handleBack}
            />
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
