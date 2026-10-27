import PageHeader from "@/components/layout/PageHeader";
import { apiQueries } from "@/queries";
import { idSchema } from "@/schemas/basic";
import { Container, Stack, Typography } from "@mui/material";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/projects/$id")({
  loader: async ({ params, context }) => {
    const idParse = idSchema.safeParse(params.id);
    if (!idParse.success) throw notFound();

    const result = await context.queryClient.query({
      staleTime: "static",
      ...apiQueries.projects.project(idParse.data).get(),
    });

    return result.data;
  },
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const project = Route.useLoaderData();

  return (
    <Container>
      <PageHeader title={project.title} />
      <Stack sx={{ my: 2 }}>
        <Typography variant="h3">{project.subtitle}</Typography>
      </Stack>
    </Container>
  );
}
