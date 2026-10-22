import path from "node:path";

export const BACKEND_PORT = process.env.PORT;
export const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;
export const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export const DEFAULT_TEST_DATA_DIR = path.resolve("./test-data");
