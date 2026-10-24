import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Container, useMediaQuery } from "@mui/material";
import PageHeader from "@/components/layout/PageHeader";
import ProjectGrid, {
  type ProjectGridProps,
} from "@/components/lists/ProjectGrid";
import ProjectDialog from "@/components/modals/ProjectDialog";
import { idSchema } from "@/schemas/basic";

const validateSearch = z.object({ project: idSchema.optional() });

export const Route = createFileRoute("/_app/art")({
  component: RouteComponent,
  validateSearch,
});

function RouteComponent() {
  /** Values */

  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const project = search.project ?? null;

  /** Callbacks */

  const handleOnOpenProject: ProjectGridProps["onProjectClick"] = (project) =>
    navigate({
      search: (prev) => ({ ...prev, project: String(project.id) }),
      resetScroll: false,
    });

  const handleOnCloseProject = () =>
    navigate({ search: ({ project: _, ...prev }) => prev, resetScroll: false });

  return (
    <Container disableGutters={isSm}>
      <PageHeader title="Art" sx={{ px: isSm ? 1 : 0 }} />
      <ProjectGrid onProjectClick={handleOnOpenProject} />
      <ProjectDialog
        open={!!project}
        project={project}
        onClose={handleOnCloseProject}
      />
    </Container>
  );
}
