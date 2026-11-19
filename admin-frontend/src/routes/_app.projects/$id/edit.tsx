import {
  createFileRoute,
  notFound,
  useCanGoBack,
  useRouter,
} from "@tanstack/react-router";
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
import useConfirm from "@/hooks/useConfirm";
import Link from "@/components/links/Link";
import MenuOptionsIconButton from "@/components/buttons/MenuOptionsIconButton";
import PageHeader from "@/components/layout/PageHeader";
import ProjectForm, {
  type ProjectFormProps,
} from "@/components/forms/ProjectForm";
import { idSchema } from "@/schemas/basic";
import { uploadCreateSchema } from "@/schemas/uploads";
import { projectUpdateSchema } from "@/schemas/projects";
import { isSameFile, urlToFile } from "@/utils/files";
import { projectQueries } from "@/queries/projects";
import { uploadQueries } from "@/queries/uploads";
import type { MenuOption } from "@/types/basic";
import type { Project, ProjectUpdate } from "@/types/projects";

export const Route = createFileRoute("/_app/projects/$id/edit")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const idParse = idSchema.safeParse(params.id);
    if (!idParse.success) throw notFound();

    const { data: project } = await context.queryClient.query(
      projectQueries.projects.project(idParse.data).get(),
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
  const canGoBack = useCanGoBack();
  const confirm = useConfirm();

  const project = loaderData.project;

  /** Mutations */

  const uploadCreateMutation = useMutation(uploadQueries.uploads.post());
  const projectUpdateMutation = useMutation(
    projectQueries.projects.project(project.id).patch(),
  );
  const projectDeleteMutation = useMutation(
    projectQueries.projects.project(project.id).delete(),
  );

  /** Callbacks */

  const handleBack = () => {
    if (canGoBack) router.history.back();
    else router.navigate({ to: "/projects" });
  };

  const handleProjectNavigate = (project: Project) =>
    navigate({
      to: "/projects/$id",
      params: { id: String(project.id) },
      ignoreBlocker: true,
    });

  const handleProjectUpdate: ProjectFormProps["onSubmit"] = async ({
    media,
    ...data
  }) => {
    let mediaBody:
      | Pick<ProjectUpdate, "mediaType" | "mediaUrl" | "thumbnailUrl">
      | undefined;

    if (media) {
      const isSameMediaFile =
        !!project.media && isSameFile(media, project.media);

      if (!isSameMediaFile) {
        const mediaUploadResponse = await uploadCreateMutation.mutateAsync(
          uploadCreateSchema.parse({ file: media }),
        );
        mediaBody = mediaUploadResponse.data;
      }
    } else {
      mediaBody = { mediaType: null, mediaUrl: null, thumbnailUrl: null };
    }

    await projectUpdateMutation.mutateAsync(
      projectUpdateSchema.parse({ ...data, ...mediaBody }),
      { onSuccess: (res) => handleProjectNavigate(res.data) },
    );
  };

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
          onSuccess: () => navigate({ to: "/projects" }),
        });
    });

  /** Options */

  const options: MenuOption[] = [
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
              onSubmit={handleProjectUpdate}
              onCancel={handleBack}
            />
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
