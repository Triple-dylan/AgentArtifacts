import { RuntimeState } from "../state.js";
import { PostgresStore } from "./postgres-store.js";

export async function createStorage() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return new RuntimeState();
  }

  let Pool;
  try {
    ({ Pool } = await import("pg"));
  } catch (error) {
    throw new Error(
      "DATABASE_URL is set but 'pg' is not installed. Install dependencies before running with Postgres."
    );
  }

  const pool = new Pool({ connectionString: databaseUrl });
  await pool.query("SELECT 1");

  return new PostgresStore(pool);
}
