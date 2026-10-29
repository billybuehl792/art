import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from "@tanstack/react-query";
import { apiEndpoints } from "@/endpoints";
import { projectListRequestParamsSchema } from "@/schemas/projects";
import type { Project, ProjectListRequestParams } from "@/types/projects";

export const apiQueries = {
  health: {
    get: () =>
      queryOptions({ queryKey: ["health"], queryFn: apiEndpoints.health.get }),
  },
  admin: {
    login: () =>
      mutationOptions({
        mutationKey: ["admin", "login"],
        mutationFn: apiEndpoints.admin.login.post,
      }),
  },
  projects: {
    get: (params?: ProjectListRequestParams) =>
      infiniteQueryOptions({
        queryKey: ["projects", params],
        initialPageParam: 1,
        staleTime: Infinity,
        queryFn: ({ pageParam: page }) =>
          apiEndpoints.projects.get(
            projectListRequestParamsSchema.parse({ ...params, page }),
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
