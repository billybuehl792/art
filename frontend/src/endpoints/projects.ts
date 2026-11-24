import apiClient from "@/api";
import type {
  Project,
  ProjectListRequest,
  ProjectListResponse,
} from "@/types/projects";

export const projectEndpoints = {
  projects: {
    get: (body?: ProjectListRequest) =>
      apiClient.get<ProjectListResponse>("/projects", body),
    project: (id: Project["id"]) => ({
      get: () => apiClient.get<Project>(`/projects/${id}`),
    }),
  },
};
