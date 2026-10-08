import app from "./app";
import { testDatabaseConnection } from "./db/pool";

const port = process.env.PORT || 3000;

const startServer = async () => {
  if (!process.env.ADMIN_API_KEY)
    throw new Error("ADMIN_API_KEY is not configured");

  await testDatabaseConnection();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
