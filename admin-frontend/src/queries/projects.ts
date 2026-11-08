import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from "@tanstack/react-query";
import { projectEndpoints } from "@/endpoints/projects";
import { projectListRequestSchema } from "@/schemas/projects";
import { PROJECTS_KEY } from "@/constants/projects";
import type { Project, ProjectListRequest } from "@/types/projects";

export const projectQueries = {
  projects: {
    get: (body?: ProjectListRequest) =>
      infiniteQueryOptions({
        queryKey: [...PROJECTS_KEY, body],
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
        queryFn: ({ pageParam: page }) =>
          projectEndpoints.projects.get(
            projectListRequestSchema.parse({
              ...body,
              params: { ...body?.params, page },
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
    post: () =>
      mutationOptions({
        mutationKey: [...PROJECTS_KEY, "post"],
        mutationFn: projectEndpoints.projects.post,
        onSuccess: (_, __, ___, { client }) =>
          client.invalidateQueries({ queryKey: PROJECTS_KEY }),
      }),
    delete: () =>
      mutationOptions({
        mutationKey: [...PROJECTS_KEY, "delete"],
        mutationFn: (id: Project["id"]) =>
          projectEndpoints.projects.project(id).delete(),
        onSuccess: (_, __, ___, { client }) =>
          client.invalidateQueries({ queryKey: PROJECTS_KEY }),
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
          onSuccess: (_, __, ___, { client }) =>
            client.invalidateQueries({ queryKey: PROJECTS_KEY }),
        }),
      delete: () =>
        mutationOptions({
          mutationKey: [...PROJECTS_KEY, "delete", id],
          mutationFn: projectEndpoints.projects.project(id).delete,
          onSuccess: (_, __, ___, { client }) =>
            client.invalidateQueries({ queryKey: PROJECTS_KEY }),
        }),
    }),
    reorder: () =>
      mutationOptions({
        mutationKey: [...PROJECTS_KEY, "reorder"],
        mutationFn: projectEndpoints.projects.reorder.patch,
        onSettled: (_, __, ___, ____, { client }) =>
          client.invalidateQueries({ queryKey: PROJECTS_KEY }),
      }),
  },
};
