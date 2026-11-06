import {
  createFileRoute,
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
import ProjectForm, {
  type ProjectFormProps,
} from "@/components/forms/ProjectForm";
import PageHeader from "@/components/layout/PageHeader";
import Link from "@/components/links/Link";
import queries from "@/queries";
import { projectCreateSchema, uploadCreateSchema } from "@/schemas";

export const Route = createFileRoute("/_app/projects/create")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const router = useRouter();
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();
  const canGoBack = useCanGoBack();

  /** Mutations */

  const uploadCreateMutation = useMutation(queries.uploads.post());
  const projectCreateMutation = useMutation({
    ...queries.projects.post(),
    onSuccess: () => queryClient.invalidateQueries(queries.projects.get()),
  });

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
