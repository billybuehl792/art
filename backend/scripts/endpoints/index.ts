import fs from "node:fs";
import FormData from "form-data";
import apiClient from "../api/client";
import { ADMIN_API_KEY } from "../constants";
import type {
  Project,
  ProjectCreate,
  ProjectListRequestParams,
  ProjectListResponse,
  ProjectUpdate,
} from "../../src/types/projects";
import type { UploadResponse } from "../../src/types/upload";

const adminHeaders = { Authorization: `Bearer ${ADMIN_API_KEY}` };

export const apiEndpoints = {
  health: { get: () => apiClient.get<{ status: string }>("/health") },
  projects: {
    get: (params?: ProjectListRequestParams) =>
      apiClient.get<ProjectListResponse>("/projects", { params }),
    post: (body: ProjectCreate) =>
      apiClient.post<Project>("/projects", body, { headers: adminHeaders }),
    project: (id: Project["id"]) => ({
      get: () => apiClient.get<Project>(`/projects/${id}`),
      patch: (body: ProjectUpdate) =>
        apiClient.post<Project>(`/projects/${id}`, body, {
          headers: adminHeaders,
        }),
      delete: () =>
        apiClient.delete<void>(`/projects/${id}`, { headers: adminHeaders }),
    }),
  },
  upload: {
    post: (file: fs.ReadStream) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiClient.post<UploadResponse>("/upload", formData, {
        headers: { ...formData.getHeaders(), ...adminHeaders },
      });
    },
  },
};
