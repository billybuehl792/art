import apiClient from "@/api";
import type { UploadCreate, UploadResponse } from "@/types/uploads";

export const uploadEndpoints = {
  uploads: {
    post: (body: UploadCreate) => {
      const formData = new FormData();
      formData.append("file", body.file);
      return apiClient.post<UploadResponse>("/uploads", formData);
    },
    delete: (filename: string) => apiClient.delete<void>(`/uploads${filename}`),
  },
};
