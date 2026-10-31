import apiClient from "@/api";
import type {
  Login,
  Project,
  ProjectCreate,
  ProjectListRequestParams,
  ProjectListResponse,
  ProjectUpdate,
  UploadResponse,
} from "./types";

const endpoints = {
  health: { get: () => apiClient.get<{ status: string }>("/health") },
  auth: { post: async (_body: Login) => {} },
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
  uploads: {
    post: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return apiClient.post<UploadResponse>("/uploads", formData);
    },
    delete: (filename: string) => apiClient.delete<void>(`/uploads${filename}`),
  },
};

export default endpoints;
