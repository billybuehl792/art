import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export const testDatabaseConnection = async () => {
  const client = await pool.connect();

  try {
    await client.query("SELECT 1");
    console.log("Database connection successful");
  } finally {
    client.release();
  }
};
