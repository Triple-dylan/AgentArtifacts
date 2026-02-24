const fs = require("node:fs");
const path = require("node:path");

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for db:migrate");
  }

  const { Client } = require("pg");
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const baselineVersion = "0000_schema_sql";
    const baselineApplied = await client.query(
      "SELECT 1 FROM schema_migrations WHERE version = $1 LIMIT 1",
      [baselineVersion]
    );

    if (baselineApplied.rowCount === 0) {
      const productsExists = await client.query(
        "SELECT to_regclass('public.products') IS NOT NULL AS exists"
      );

      if (productsExists.rows[0].exists) {
        await client.query("INSERT INTO schema_migrations (version) VALUES ($1)", [baselineVersion]);
        console.log("Marked baseline as applied (existing schema detected).");
      } else {
        const schemaSql = fs.readFileSync(path.join(__dirname, "..", "db", "schema.sql"), "utf8");
        await client.query("BEGIN");
        await client.query(schemaSql);
        await client.query("INSERT INTO schema_migrations (version) VALUES ($1)", [baselineVersion]);
        await client.query("COMMIT");
        console.log("Applied baseline schema from db/schema.sql");
      }
    }

    const migrationsDir = path.join(__dirname, "..", "db", "migrations");
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort((a, b) => a.localeCompare(b));

    for (const file of files) {
      const version = file.replace(/\.sql$/, "");
      const already = await client.query("SELECT 1 FROM schema_migrations WHERE version = $1 LIMIT 1", [version]);
      if (already.rowCount > 0) {
        console.log(`Skipping ${file} (already applied)`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (version) VALUES ($1)", [version]);
      await client.query("COMMIT");
      console.log(`Applied ${file}`);
    }

    console.log("Database migration complete.");
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // ignore rollback errors
    }
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
