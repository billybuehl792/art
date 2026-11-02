import { createFileRoute } from "@tanstack/react-router";
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
import queries from "@/queries";
import { projectCreateSchema } from "@/schemas";

export const Route = createFileRoute("/_app/projects/create")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = Route.useNavigate();

  /** Mutations */

  const projectCreateMutation = useMutation(queries.projects.post());

  /** Callbacks */

  const handleCreateProject: ProjectFormProps["onSubmit"] = async (data) => {
    await projectCreateMutation.mutateAsync(projectCreateSchema.parse(data), {
      onSuccess: (res) =>
        navigate({ to: "/projects/$id", params: { id: String(res.data.id) } }),
    });
  };

  return (
    <Container>
      <PageHeader
        title={
          <Breadcrumbs>
            <Link to="/projects">Projects</Link>
            <Typography>Create</Typography>
          </Breadcrumbs>
        }
      />
      <Stack sx={{ my: 2 }}>
        <Card>
          <CardContent>
            <ProjectForm onSubmit={handleCreateProject} />
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
