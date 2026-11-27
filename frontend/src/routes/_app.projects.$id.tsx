import BackButton from "@/components/buttons/BackButton";
import ProjectCard from "@/components/cards/ProjectCard";
import PageHeader from "@/components/layout/PageHeader";
import { projectQueries } from "@/queries/projects";
import { idSchema } from "@/schemas/basic";
import { Container } from "@mui/material";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/projects/$id")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const idParse = idSchema.safeParse(params.id);
    if (!idParse.success) throw notFound();

    const { data: project } = await context.queryClient.query(
      projectQueries.projects.project(idParse.data).get(),
    );

    return project;
  },
  staticData: { breadcrumb: { label: "Project" } },
});

function RouteComponent() {
  /** Values */

  const project = Route.useLoaderData();

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
