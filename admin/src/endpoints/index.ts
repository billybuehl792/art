import apiClient from "@/api/client";
import type { Login } from "@/types/admin";
import type {
  Project,
  ProjectListRequestParams,
  ProjectListResponse,
} from "@/types/projects";

export const apiEndpoints = {
  health: { get: () => apiClient.get<{ status: string }>("/health") },
  admin: {
    login: {
      post: async (_body: Login) => {
        return;
      },
    },
  },
  projects: {
    get: (params?: ProjectListRequestParams) =>
      apiClient.get<ProjectListResponse>("/projects", { params }),
    project: (id: Project["id"]) => ({
      get: () => apiClient.get<Project>(`/projects/${id}`),
    }),
  },
};
