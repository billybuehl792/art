import "dotenv/config";

import path from "node:path";
import { pathToFileURL } from "node:url";
import { projectCreateSchema } from "../../src/schemas/projects";
import { uploadFilesFromDir } from "../upload/createUpload";
import { createProject } from "./createProject";
import { DEFAULT_TEST_DATA_DIR } from "../constants";
import type { UploadResponse } from "../../src/types/upload";

const createProjects = async (count = 100, uploads?: UploadResponse[]) => {
  const projects = await Promise.all(
    Array.from({ length: count }, (_, index) => {
      const upload = uploads?.length
        ? uploads[index % uploads.length]
        : undefined;

      const body = projectCreateSchema.parse({
        title: `Test Project ${index}`,
        subtitle: `Test Subtitle ${index}`,
        description: `This is test project number ${index}.`,
        category: index % 2 === 0 ? "art" : "dev",
        mediaType: upload?.mediaType,
        mediaUrl: upload?.mediaUrl,
        thumbnailUrl: upload?.thumbnailUrl,
        sortOrder: index,
      });

      return createProject(body);
    }),
  );

  console.log(`Successfully created ${projects.length} projects`);

  return projects;
};

const main = async () => {
  const uploadDir = process.argv[2]
    ? path.resolve(process.argv[2])
    : DEFAULT_TEST_DATA_DIR;

  const uploads = (await uploadFilesFromDir(uploadDir)).map(
    (upload) => upload.data,
  );

  await createProjects(100, uploads);
};

if (import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
