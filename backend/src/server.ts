import "dotenv/config";

import app from "./app";
import fs from "node:fs/promises";
import { testDatabaseConnection } from "./db";
import { UPLOAD_THUMBNAIL_DIR, UPLOAD_DIR } from "./constants/upload";
import adminApp from "./adminApp";

const startServer = async () => {
  const port = process.env.PORT;
  const adminPort = process.env.ADMIN_PORT;

  if (!port) throw new Error("PORT is not configured");
  if (!adminPort) throw new Error("ADMIN_PORT is not configured");

  if (!process.env.ADMIN_API_KEY)
    throw new Error("ADMIN_API_KEY is not configured");

  await Promise.all([
    fs.mkdir(UPLOAD_DIR, { recursive: true }),
    fs.mkdir(UPLOAD_THUMBNAIL_DIR, { recursive: true }),
  ]);

  await testDatabaseConnection();

  app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
  adminApp.listen(Number(adminPort), "0.0.0.0", () => {
    console.log(`Admin server running on port ${adminPort}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
