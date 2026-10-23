import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { apiEndpoints } from "@/endpoints";
import type { Project, ProjectListRequestParams } from "@/types/projects";
import { projectListRequestParamsSchema } from "@/schemas/projects";

export const apiQueries = {
  health: {
    get: () =>
      queryOptions({ queryKey: ["health"], queryFn: apiEndpoints.health.get }),
  },
  projects: {
    get: (params?: ProjectListRequestParams) =>
      infiniteQueryOptions({
        queryKey: ["projects"],
        initialPageParam: 1,
        queryFn: ({ pageParam: page }) =>
          apiEndpoints.projects.get(
            projectListRequestParamsSchema.parse({ page, ...params }),
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
          queryKey: ["projects", id],
          queryFn: () => apiEndpoints.projects.project(id).get(),
        }),
    }),
  },
};
