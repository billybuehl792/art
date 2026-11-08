import apiClient from "@/api";
import type {
  Project,
  ProjectCreate,
  ProjectUpdate,
  ProjectListRequest,
  ProjectListResponse,
  ProjectListReorder,
} from "@/types/projects";

export const projectEndpoints = {
  projects: {
    get: (body?: ProjectListRequest) =>
      apiClient.get<ProjectListResponse>("/projects", body),
    post: (body: ProjectCreate) => apiClient.post<Project>("/projects", body),
    project: (id: Project["id"]) => ({
      get: () => apiClient.get<Project>(`/projects/${id}`),
      patch: (body: ProjectUpdate) =>
        apiClient.patch<Project>(`/projects/${id}`, body),
      delete: () => apiClient.delete<void>(`/projects/${id}`),
    }),
    reorder: {
      patch: (body: ProjectListReorder) => {
        throw new Error("not implemented ");
        return apiClient.patch<void>(`/projects/reorder`, body);
      },
    },
  },
};
