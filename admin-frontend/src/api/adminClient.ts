import axios from "axios";
import qs from "qs";

const MOCK_DELAY = Number(import.meta.env.VITE_API_MOCK_DELAY ?? 0);

const adminApiClient = axios.create({
  baseURL: "/admin/api",
  timeout: 10_000,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

adminApiClient.interceptors.response.use(async (response) => {
  if (MOCK_DELAY > 0)
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
  return response;
});

export default adminApiClient;
