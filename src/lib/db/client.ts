import { Pool, QueryResultRow } from "pg";

// Centralized PostgreSQL connection pool singleton
let poolInstance: Pool | null = null;

export function getDbPool(): Pool {
  if (!poolInstance) {
    const maxConns = parseInt(process.env.DB_MAX_OPEN_CONNS || "20", 10);
    const idleTimeout = 30000;

    poolInstance = new Pool({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432", 10),
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "samirimperia_db_pass",
      database: process.env.DB_NAME || "samirimperia_db",
      max: maxConns,
      idleTimeoutMillis: idleTimeout,
      connectionTimeoutMillis: 5000,
    });

    poolInstance.on("error", (err) => {
      console.error("Unexpected error on idle PostgreSQL client", err);
    });
  }

  return poolInstance;
}

export async function executeQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  const pool = getDbPool();
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;

  if (process.env.NODE_ENV !== "production") {
    console.log("[DB Query]", { text, duration, rows: res.rowCount });
  }

  return res;
}
