import "dotenv/config";

import { pathToFileURL } from "node:url";
import pool from "../../src/db";
import { createProject } from "../../src/queries/projects";
import { projectCreateSchema } from "../../src/schemas/projects";

const createProjects = async (count: number) => {
  const projects = await Promise.all(
    Array.from({ length: count }, (_, index) => {
      const project = createProject(
        projectCreateSchema.parse({
          title: `Test Project ${index}`,
          subtitle: `Test Subtitle ${index}`,
          description: `This is test project number ${index}.`,
          category: index % 2 === 0 ? "art" : "dev",
          sortOrder: index,
        }),
      );

      return project;
    }),
  );

  return projects;
};

const main = async () => {
  const count = process.argv[2] ? Number(process.argv[2]) : 100;
  if (isNaN(count)) throw new Error("Invalid count");

  const projects = await createProjects(count);

  console.log(`Created ${projects.length} projects`);
};

if (import.meta.url === pathToFileURL(process.argv[1]).href)
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await pool.end();
    });
