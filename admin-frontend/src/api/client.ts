import axios from "axios";
import qs from "qs";

const MOCK_DELAY = Number(import.meta.env.VITE_API_MOCK_DELAY ?? 0);

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10_000,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

apiClient.interceptors.response.use(async (response) => {
  if (MOCK_DELAY > 0)
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
  return response;
});

export default apiClient;
