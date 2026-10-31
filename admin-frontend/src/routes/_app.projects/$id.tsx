import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, Container, Stack } from "@mui/material";
import PageHeader from "@/components/layout/PageHeader";
import ProjectForm, {
  type ProjectFormProps,
} from "@/components/forms/ProjectForm";
import queries from "@/queries";
import { idSchema, projectUpdateSchema } from "@/schemas";

export const Route = createFileRoute("/_app/projects/$id")({
  loader: async ({ params, context }) => {
    const idParse = idSchema.safeParse(params.id);
    if (!idParse.success) throw notFound();

    const result = await context.queryClient.query(
      queries.projects.project(idParse.data).get(),
    );

    return result.data;
  },
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const router = useRouter();
  const project = Route.useLoaderData();

  /** Mutations */

  const projectUpdateMutation = useMutation(
    queries.projects.project(project.id).patch(),
  );

  /** Callbacks */

  const handleUpdateProject: ProjectFormProps["onSubmit"] = async (data) => {
    await projectUpdateMutation.mutateAsync(projectUpdateSchema.parse(data), {
      onSuccess: () => router.invalidate(),
    });
  };

  return (
    <Container>
      <PageHeader title={project.title} />
      <Stack sx={{ my: 2 }}>
        <Card>
          <CardContent>
            <ProjectForm
              defaultValues={project}
              onSubmit={handleUpdateProject}
            />
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
