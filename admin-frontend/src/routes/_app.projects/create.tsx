import {
  createFileRoute,
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
import ProjectForm, {
  type ProjectFormProps,
} from "@/components/forms/ProjectForm";
import PageHeader from "@/components/layout/PageHeader";
import Link from "@/components/links/Link";
import { projectQueries } from "@/queries/projects";
import { uploadQueries } from "@/queries/uploads";
import { uploadCreateSchema } from "@/schemas/uploads";
import { projectCreateSchema } from "@/schemas/projects";

export const Route = createFileRoute("/_app/projects/create")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const router = useRouter();
  const navigate = Route.useNavigate();
  const canGoBack = useCanGoBack();

  /** Mutations */

  const uploadCreateMutation = useMutation(uploadQueries.uploads.post());
  const projectCreateMutation = useMutation(projectQueries.projects.post());

  /** Callbacks */

  const handleBack = () => {
    if (canGoBack) router.history.back();
    else router.navigate({ to: "/projects" });
  };

  const handleCreateProject: ProjectFormProps["onSubmit"] = async ({
    media,
    ...data
  }) => {
    let mediaBody;

    if (media) {
      const mediaUploadResponse = await uploadCreateMutation.mutateAsync(
        uploadCreateSchema.parse({ file: media }),
      );
      mediaBody = mediaUploadResponse.data;
    }

    await projectCreateMutation.mutateAsync(
      projectCreateSchema.parse({ ...data, ...mediaBody }),
      {
        onSuccess: ({ data }) =>
          navigate({
            to: "/projects/$id",
            params: { id: String(data.id) },
            ignoreBlocker: true,
          }),
      },
    );
  };

  return (
    <Container>
      <PageHeader
        title={
          <Breadcrumbs>
            <Link to="/">Home</Link>
            <Link to="/projects">Projects</Link>
            <Typography>Create</Typography>
          </Breadcrumbs>
        }
      />
      <Stack sx={{ my: 2 }}>
        <Card>
          <CardContent>
            <ProjectForm onSubmit={handleCreateProject} onCancel={handleBack} />
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
