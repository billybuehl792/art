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
    post: (body: ProjectCreate) => {
      const { media, thumbnail, ...values } = body;
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null)
          formData.append(key, String(value));
      });

      if (media) formData.append("media", media);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      return apiClient.post<Project>("/projects", formData);
    },
    project: (id: Project["id"]) => ({
      get: () => apiClient.get<Project>(`/projects/${id}`),
      patch: (body: ProjectUpdate) => {
        const { media, thumbnail, ...values } = body;
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
          if (value !== undefined && value !== null)
            formData.append(key, String(value));
        });

        if (media) formData.append("media", media);
        if (thumbnail) formData.append("thumbnail", thumbnail);

        return apiClient.patch<Project>(`/projects/${id}`, formData);
      },
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
