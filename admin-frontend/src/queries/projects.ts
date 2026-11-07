import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from "@tanstack/react-query";
import { projectEndpoints } from "@/endpoints/projects";
import { projectListRequestParamsSchema } from "@/schemas/projects";
import { PROJECTS_KEY } from "@/constants/projects";
import type { Project, ProjectListRequestParams } from "@/types/projects";

export const projectQueries = {
  projects: {
    get: (params?: ProjectListRequestParams) =>
      infiniteQueryOptions({
        queryKey: [...PROJECTS_KEY, params],
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
        queryFn: ({ pageParam: page }) =>
          projectEndpoints.projects.get(
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
    post: () =>
      mutationOptions({
        mutationKey: [...PROJECTS_KEY, "post"],
        mutationFn: projectEndpoints.projects.post,
      }),
    delete: () =>
      mutationOptions({
        mutationKey: [...PROJECTS_KEY, "delete"],
        mutationFn: (id: Project["id"]) =>
          projectEndpoints.projects.project(id).delete(),
      }),
    project: (id: Project["id"]) => ({
      get: () =>
        queryOptions({
          queryKey: [...PROJECTS_KEY, id],
          queryFn: () => projectEndpoints.projects.project(id).get(),
        }),
      patch: () =>
        mutationOptions({
          mutationKey: [...PROJECTS_KEY, "patch", id],
          mutationFn: projectEndpoints.projects.project(id).patch,
        }),
      delete: () =>
        mutationOptions({
          mutationKey: [...PROJECTS_KEY, "delete", id],
          mutationFn: projectEndpoints.projects.project(id).delete,
        }),
    }),
  },
};
