import { pool } from "../src/db";

export default async function setup() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}
