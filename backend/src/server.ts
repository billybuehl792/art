import app from "./app";
import { testDatabaseConnection } from "./db/pool";

const port = process.env.PORT || 3000;

testDatabaseConnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
