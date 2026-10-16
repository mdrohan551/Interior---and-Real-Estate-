import { executeQuery, getDbPool } from "./db/client";

export const query = executeQuery;

export async function checkDbConnection() {
  try {
    const pool = getDbPool();
    const res = await pool.query("SELECT NOW(), version();");
    return {
      connected: true,
      timestamp: res.rows[0].now,
      version: res.rows[0].version,
    };
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export default getDbPool();
