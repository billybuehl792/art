import app from "./app";
import fs from "node:fs/promises";
import { testDatabaseConnection } from "./db/pool";
import { UPLOAD_THUMBNAIL_DIR, UPLOAD_DIR } from "./constants/upload";

const port = process.env.PORT || 3000;

const startServer = async () => {
  if (!process.env.ADMIN_API_KEY)
    throw new Error("ADMIN_API_KEY is not configured");

  await Promise.all([
    fs.mkdir(UPLOAD_DIR, { recursive: true }),
    fs.mkdir(UPLOAD_THUMBNAIL_DIR, { recursive: true }),
  ]);

  await testDatabaseConnection();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
