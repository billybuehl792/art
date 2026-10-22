import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { pool, testDatabaseConnection } from "../src/db";
import { UPLOAD_DIR, UPLOAD_THUMBNAIL_DIR } from "../src/constants/upload";

const clearProjects = async () => {
  await pool.query("TRUNCATE TABLE projects RESTART IDENTITY");
  console.log("Cleared projects.");
};

const clearDirectory = async (dir: string) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = entries.filter(
    (entry) => entry.isFile() || entry.isSymbolicLink(),
  );

  await Promise.all(files.map((file) => fs.unlink(path.join(dir, file.name))));
  console.log(`Deleted files in ${dir}.`);

  return files.length;
};

const main = async () => {
  if (process.env.NODE_ENV === "production")
    throw new Error("Refusing to clear production data.");

  await testDatabaseConnection();

  clearProjects();

  await Promise.all([
    clearDirectory(UPLOAD_DIR),
    clearDirectory(UPLOAD_THUMBNAIL_DIR),
  ]);
};

if (import.meta.url === pathToFileURL(process.argv[1]).href)
  main()
    .catch((error) => {
      console.error("Failed to clear seed data:", error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await pool.end();
    });
