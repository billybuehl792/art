import path from "node:path";
import { pathToFileURL } from "node:url";
import axios from "axios";
import { uploadFilesFromDir } from "./seedUploads";
import type { UploadResponse } from "../src/types/upload";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
const BACKEND_PORT = process.env.PORT;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;
const DEFAULT_TEST_DATA_DIR = path.resolve("./test-data");

const createProject = async (index: number, upload?: UploadResponse) => {
  const response = await axios.post(
    `${BACKEND_URL}/api/projects`,
    {
      title: `Test Project ${index}`,
      subtitle: `Test Subtitle ${index}`,
      description: `This is test project number ${index}.`,
      category: "art",
      link: `https://example.com/project-${index}`,
      mediaType: upload?.mediaType,
      mediaUrl: upload?.mediaUrl,
      thumbnailUrl: upload?.thumbnailUrl,
      sortOrder: index,
    },
    { headers: { Authorization: `Bearer ${ADMIN_API_KEY}` } },
  );

  return response.data;
};

const createProjects = async (count = 100, uploads?: UploadResponse[]) => {
  const projects = await Promise.all(
    Array.from({ length: count }, (_, index) => {
      const upload = uploads?.length
        ? uploads[index % uploads.length]
        : undefined;
      return createProject(index + 1, upload);
    }),
  );

  console.log(`Successfully created ${projects.length} projects`);

  return projects;
};

const main = async () => {
  if (!BACKEND_PORT) throw new Error("PORT is not configured");
  if (!ADMIN_API_KEY) throw new Error("ADMIN_API_KEY is not configured");

  const uploadDir = process.argv[2]
    ? path.resolve(process.argv[2])
    : DEFAULT_TEST_DATA_DIR;

  const uploads = await uploadFilesFromDir(uploadDir);
  await createProjects(100, uploads);
};

if (import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
