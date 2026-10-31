import "dotenv/config";

import app from "./app";
import fs from "node:fs/promises";
import { testDatabaseConnection } from "./db";
import { UPLOAD_THUMBNAIL_DIR, UPLOAD_DIR } from "./constants";

const start = async () => {
  if (!process.env.ADMIN_API_KEY)
    throw new Error("ADMIN_API_KEY is not configured");

  await Promise.all([
    fs.mkdir(UPLOAD_DIR, { recursive: true }),
    fs.mkdir(UPLOAD_THUMBNAIL_DIR, { recursive: true }),
  ]);

  await testDatabaseConnection();

  const host = process.env.HOST;
  if (!host) throw new Error("HOST is not configured");

  const port = process.env.PORT;
  if (!port) throw new Error("PORT is not configured");

  app.listen(Number(port), host, () => {
    console.log(`Admin Server running at http://${host}:${port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
