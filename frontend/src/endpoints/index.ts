import apiClient from "@/api/client";
import type {
  Project,
  ProjectListRequestParams,
  ProjectListResponse,
} from "@/types/projects";

export const apiEndpoints = {
  health: { get: () => apiClient.get<{ status: string }>("/health") },
  projects: {
    get: (params?: ProjectListRequestParams) =>
      apiClient.get<ProjectListResponse>("/projects", { params }),
    project: (id: Project["id"]) => ({
      get: () => apiClient.get<Project>(`/projects/${id}`),
    }),
  },
};
