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

  const url = "0.0.0.0";
  const port = process.env.PORT;
  if (!port) throw new Error("PORT is not configured");

  app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Admin Server running at http://${url}:${port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
