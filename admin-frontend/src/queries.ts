import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from "@tanstack/react-query";
import endpoints from "@/endpoints";
import { projectListRequestParamsSchema } from "@/schemas";
import type { Project, ProjectListRequestParams } from "@/types";

const queries = {
  health: {
    get: () =>
      queryOptions({ queryKey: ["health"], queryFn: endpoints.health.get }),
  },
  auth: {
    post: () =>
      mutationOptions({
        mutationKey: ["auth", "post"],
        mutationFn: endpoints.auth.post,
      }),
  },
  projects: {
    get: (params?: ProjectListRequestParams) =>
      infiniteQueryOptions({
        queryKey: ["projects", params],
        initialPageParam: 1,
        queryFn: ({ pageParam: page }) =>
          endpoints.projects.get(
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
          queryFn: () => endpoints.projects.project(id).get(),
        }),
      patch: () =>
        mutationOptions({
          mutationKey: ["projects", id],
          mutationFn: endpoints.projects.project(id).patch,
        }),
    }),
  },
  uploads: {
    post: () =>
      mutationOptions({
        mutationKey: ["uploads", "create"],
        mutationFn: endpoints.uploads.post,
      }),
    delete: () =>
      mutationOptions({
        mutationKey: ["uploads", "delete"],
        mutationFn: endpoints.uploads.delete,
      }),
  },
};

export default queries;
