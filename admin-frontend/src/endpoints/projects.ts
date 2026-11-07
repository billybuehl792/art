import apiClient from "@/api";
import type {
  Project,
  ProjectCreate,
  ProjectListRequestParams,
  ProjectListResponse,
  ProjectUpdate,
} from "@/types/projects";

export const projectEndpoints = {
  projects: {
    get: (params?: ProjectListRequestParams) =>
      apiClient.get<ProjectListResponse>("/projects", { params }),
    post: (body: ProjectCreate) => apiClient.post<Project>("/projects", body),
    project: (id: Project["id"]) => ({
      get: () => apiClient.get<Project>(`/projects/${id}`),
      patch: (body: ProjectUpdate) =>
        apiClient.patch<Project>(`/projects/${id}`, body),
      delete: () => apiClient.delete<void>(`/projects/${id}`),
    }),
  },
};
