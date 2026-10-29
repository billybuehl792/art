import apiClient from "@/api/client";
import type { Login } from "@/types/admin";
import type {
  Project,
  ProjectCreate,
  ProjectListRequestParams,
  ProjectListResponse,
  ProjectUpdate,
} from "@/types/projects";

export const apiEndpoints = {
  health: { get: () => apiClient.get<{ status: string }>("/health") },
  admin: { login: { post: async (_body: Login) => {} } },
  projects: {
    get: (params?: ProjectListRequestParams) =>
      apiClient.get<ProjectListResponse>("/projects", { params }),
    post: (body: ProjectCreate) =>
      apiClient.post<Project>("/projects", { body }),
    project: (id: Project["id"]) => ({
      get: () => apiClient.get<Project>(`/projects/${id}`),
      patch: (body: ProjectUpdate) =>
        apiClient.patch<Project>(`/projects/${id}`, { body }),
    }),
  },
};
