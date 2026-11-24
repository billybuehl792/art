import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export const checkDbConnection = async () => {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT
        current_database() AS database,
        current_user AS user,
        current_schema() AS schema,
        inet_server_addr() AS host,
        inet_server_port() AS port
    `);

    console.log("Database connection successful:\n", result.rows[0]);
  } finally {
    client.release();
  }
};

export default pool;
