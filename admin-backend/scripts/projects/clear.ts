import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import pool from "../../src/db/pool";
import { deleteAllProjects } from "../../src/db/queries/projects";
import { UPLOAD_DIR, UPLOAD_THUMBNAIL_DIR } from "../../src/constants/uploads";

const clearDirectory = async (dir: string) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = entries.filter(
    (entry) => entry.isFile() || entry.isSymbolicLink(),
  );

  await Promise.all(files.map((file) => fs.unlink(path.join(dir, file.name))));

  return files.length;
};

const main = async () => {
  if (process.env.NODE_ENV === "production")
    throw new Error("Refusing to clear production data.");

  const [uploadsDeleted, thumbnailsDeleted] = await Promise.all([
    clearDirectory(UPLOAD_DIR),
    clearDirectory(UPLOAD_THUMBNAIL_DIR),
  ]);

  console.log(`Deleted ${uploadsDeleted} files in ${UPLOAD_DIR}.`);
  console.log(`Deleted ${thumbnailsDeleted} files in ${UPLOAD_THUMBNAIL_DIR}.`);

  await deleteAllProjects();

  console.log("All projects deleted and identity reset.");
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
