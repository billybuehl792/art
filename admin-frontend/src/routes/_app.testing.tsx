import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs, Container, Typography } from "@mui/material";
import SortableList, {
  type SortableListProps,
} from "@/components/lists/SortableList";
import PageHeader from "@/components/layout/PageHeader";
import Link from "@/components/links/Link";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { projectQueries } from "@/queries/projects";
import { reorderInfiniteData } from "@/utils/queries";

export const Route = createFileRoute("/_app/testing")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const queryClient = useQueryClient();

  /** Queries */

  const projectListQueryOptions = projectQueries.projects.get();
  const projectListQuery = useInfiniteQuery(projectListQueryOptions);

  /** Mutations */

  const projectListReorderMutation = useMutation(
    projectQueries.projects.reorder(),
  );

  /** Callbacks */

  const handleOnSort: SortableListProps["onSort"] = async (
    sortedProjects,
    targetId,
  ) => {
    if (!projectListQuery.data) return;

    await queryClient.cancelQueries(projectListQueryOptions);

    const listQueryKey = projectListQueryOptions.queryKey;
    const sorted = reorderInfiniteData(projectListQuery.data, sortedProjects);

    queryClient.setQueryData(listQueryKey, sorted);

    const movedIndex = sortedProjects.findIndex((item) => item.id === targetId);
    const afterId = movedIndex > 0 ? sortedProjects[movedIndex - 1].id : null;

    await projectListReorderMutation.mutateAsync({ targetId, afterId });
  };

  return (
    <Container>
      <PageHeader
        title={
          <Breadcrumbs>
            <Link to="/">Home</Link>
            <Typography>Testing</Typography>
          </Breadcrumbs>
        }
      />
      <SortableList query={projectListQuery} onSort={handleOnSort} />
    </Container>
  );
}
