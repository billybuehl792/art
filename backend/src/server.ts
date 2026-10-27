import "dotenv/config";

import app from "./app";
import fs from "node:fs/promises";
import adminApp from "./adminApp";
import { testDatabaseConnection } from "./db";
import { UPLOAD_THUMBNAIL_DIR, UPLOAD_DIR } from "./constants/upload";

const startServer = () => {
  const url = "0.0.0.0";
  const port = process.env.PORT;
  if (!port) throw new Error("PORT is not configured");

  app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Server running at http://${url}:${port}`);
  });
};

const startAdminServer = () => {
  const url = "127.0.0.1";
  const port = process.env.ADMIN_PORT;
  if (!port) throw new Error("PORT is not configured");

  adminApp.listen(Number(port), url, () => {
    console.log(`Admin server running at http://${url}:${port}`);
  });
};

const start = async () => {
  if (!process.env.ADMIN_API_KEY)
    throw new Error("ADMIN_API_KEY is not configured");

  await Promise.all([
    fs.mkdir(UPLOAD_DIR, { recursive: true }),
    fs.mkdir(UPLOAD_THUMBNAIL_DIR, { recursive: true }),
  ]);

  await testDatabaseConnection();

  startServer();
  startAdminServer();
};

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
