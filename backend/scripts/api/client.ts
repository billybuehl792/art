import axios from "axios";
import qs from "qs";
import { BACKEND_URL } from "../constants";

const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10_000,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

export default apiClient;
