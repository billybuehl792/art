import { queryOptions } from "@tanstack/react-query";
import { apiEndpoints } from "@/endpoints";
import type { Project, ProjectListRequestParams } from "@/types/projects";

export const apiQueries = {
  health: {
    get: () =>
      queryOptions({ queryKey: ["health"], queryFn: apiEndpoints.health.get }),
  },
  projects: {
    get: (params?: ProjectListRequestParams) =>
      queryOptions({
        queryKey: ["projects"],
        queryFn: () => apiEndpoints.projects.get(params),
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
