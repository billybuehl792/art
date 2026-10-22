import "dotenv/config";

import { pathToFileURL } from "node:url";
import { apiEndpoints } from "../endpoints";
import { projectCreateSchema } from "../../src/schemas/projects";
import type { ProjectCreate } from "../../src/types/projects";

export const createProject = async (body: ProjectCreate) => {
  const res = await apiEndpoints.projects.post(body);
  console.log(JSON.stringify(res.data, null, 2));
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const body = projectCreateSchema.parse({ title: process.argv[2] });
  createProject(body).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
