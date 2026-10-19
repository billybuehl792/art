import apiClient from "@/api/client";

export const apiEndpoints = {
  health: { get: () => apiClient.get<{ status: string }>("/health") },
};
