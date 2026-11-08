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

  const projectListReorderMutation = useMutation({
    ...projectQueries.projects.reorder(),
    onMutate: async (_body, { client }) => {
      await client.cancelQueries(projectListQueryOptions);

      const previousData = client.getQueryData(
        projectListQueryOptions.queryKey,
      );

      return { previousData };
    },
    onError: (_, __, queryContext, { client }) => {
      if (queryContext?.previousData)
        client.setQueryData(
          projectListQueryOptions.queryKey,
          queryContext.previousData,
        );
    },
  });
  /** Data */

  const projects =
    projectListQuery.data?.pages.flatMap((page) => page.data.results) ?? [];

  /** Callbacks */

  const handleOnSort: SortableListProps["onSort"] = (
    sortedProjects,
    targetId,
  ) => {
    if (!projectListQuery.data) return;

    queryClient.setQueryData(
      projectListQueryOptions.queryKey,
      reorderInfiniteData(projectListQuery.data, sortedProjects),
    );

    const movedIndex = sortedProjects.findIndex((item) => item.id === targetId);
    const afterId = movedIndex > 0 ? sortedProjects[movedIndex - 1].id : null;

    projectListReorderMutation.mutate({ targetId, afterId });
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
      <SortableList
        items={projects}
        disabled={projectListQuery.isFetching}
        hasNextPage={projectListQuery.hasNextPage}
        isFetchingNextPage={projectListQuery.isFetchingNextPage}
        fetchNextPage={projectListQuery.fetchNextPage}
        onSort={handleOnSort}
      />
    </Container>
  );
}
