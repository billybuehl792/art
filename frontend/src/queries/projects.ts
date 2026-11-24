import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { projectEndpoints } from "@/endpoints/projects";
import { projectListRequestSchema } from "@/schemas/projects";
import { PROJECTS_KEY } from "@/constants/projects";
import type { Project, ProjectListRequest } from "@/types/projects";

export const projectQueries = {
  projects: {
    get: (body?: ProjectListRequest) =>
      infiniteQueryOptions({
        queryKey: [...PROJECTS_KEY, body] as const,
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
        queryFn: ({ pageParam: page, queryKey }) =>
          projectEndpoints.projects.get(
            projectListRequestSchema.parse({
              ...body,
              params: { ...queryKey[1]?.params, page },
            }),
          ),
        getNextPageParam: (lastPage) => {
          const nextPage = lastPage.data.page + 1;
          return nextPage <=
            Math.ceil(lastPage.data.total / lastPage.data.limit)
            ? nextPage
            : undefined;
        },
      }),
    project: (id: Project["id"]) => ({
      get: () =>
        queryOptions({
          queryKey: [...PROJECTS_KEY, id],
          queryFn: () => projectEndpoints.projects.project(id).get(),
        }),
    }),
  },
};
