import axios from "axios";
import qs from "qs";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10_000,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

export default apiClient;
