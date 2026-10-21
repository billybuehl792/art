import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import FormData from "form-data";
import axios from "axios";
import type { UploadResponse } from "../src/types/upload";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
const BACKEND_PORT = process.env.PORT;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;
const DEFAULT_TEST_DATA_DIR = path.resolve("./test-data");

export const getUploads = async () => {};

export const uploadFile = async (filePath: string) => {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  const response = await axios.post<UploadResponse>(
    `${BACKEND_URL}/api/upload`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${ADMIN_API_KEY}`,
      },
    },
  );

  return response.data;
};

export const uploadFilesFromDir = async (dirPath: string) => {
  if (!(await stat(dirPath).catch(() => null))?.isDirectory())
    throw new Error(`Upload directory does not exist: ${dirPath}`);

  const entries = await readdir(dirPath, { withFileTypes: true });

  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(dirPath, entry.name));

  const uploads = (
    await Promise.all(
      files.map((file) =>
        uploadFile(file).catch((error: Error) => console.error(error.message)),
      ),
    )
  ).filter((upload) => !!upload);

  console.log(`Uploaded ${uploads.length} files.`);

  return uploads;
};

const main = async () => {
  if (!BACKEND_PORT) throw new Error("PORT is not configured");
  if (!ADMIN_API_KEY) throw new Error("ADMIN_API_KEY is not configured");

  console.log("in main!");
  const uploadDir = process.argv[2]
    ? path.resolve(process.argv[2])
    : DEFAULT_TEST_DATA_DIR;

  await uploadFilesFromDir(uploadDir);
};

if (import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
