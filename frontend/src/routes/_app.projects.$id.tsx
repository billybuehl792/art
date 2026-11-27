import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container } from "@mui/material";
import BackButton from "@/components/buttons/BackButton";
import ProjectCard from "@/components/cards/ProjectCard";
import PageHeader from "@/components/layout/PageHeader";
import { projectQueries } from "@/queries/projects";
import { idSchema } from "@/schemas/basic";

export const Route = createFileRoute("/_app/projects/$id")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const idParse = idSchema.safeParse(params.id);
    if (!idParse.success) throw notFound();

    const res = await context.queryClient.query(
      projectQueries.projects.project(idParse.data).get(),
    );

    return { project: res.data };
  },
  staticData: { breadcrumb: { label: "Project" } },
});

function RouteComponent() {
  /** Values */

  const { project } = Route.useLoaderData();

  return (
    <Container>
      <PageHeader
        title={project.title}
        startContent={<BackButton label={false} />}
      />
      <ProjectCard project={project} sx={{ my: 2 }} />
    </Container>
  );
}
