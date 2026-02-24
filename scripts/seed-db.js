const path = require("node:path");
const { readCsv } = require("./lib");

function boolYN(value) {
  return String(value || "").toUpperCase() === "Y";
}

function nullable(value) {
  if (value == null) return null;
  const trimmed = String(value).trim();
  if (!trimmed || trimmed === "-" || trimmed === "none") return null;
  return trimmed;
}

function listText(value) {
  return nullable(value) || "";
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for db:seed");
  }

  const { Client } = require("pg");
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  const root = path.resolve(__dirname, "..");
  const catalog = readCsv(path.join(root, "data", "catalog_master.csv"));
  const bundleRows = readCsv(path.join(root, "data", "bundles_master.csv"));
  const disclosureRows = readCsv(path.join(root, "data", "disclosure_versions.csv"));
  const upsellRows = readCsv(path.join(root, "data", "upsell_rules.csv"));

  const productById = new Map(catalog.map((row) => [row.product_id, row]));

  try {
    await client.query("BEGIN");

    for (const row of catalog) {
      await client.query(
        `
          INSERT INTO products (
            id, slug, name, short_desc, long_desc, category, subcategory, tags_keywords, format,
            file_count, included_files, size_estimate, current_version, release_date, compatibility,
            dependencies, license_type, seats, redistribution_policy, status, support_level,
            support_docs_link, demo_link, sample_available, sample_link, primary_keyword,
            secondary_keywords, intent, lead_magnet, email_capture_required, landing_page_type,
            execution_mode, market_type, risk_level, disclosure_required, updated_at
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,
            $10,$11,$12,$13,$14,$15,
            $16,$17,$18,$19,$20,$21,
            $22,$23,$24,$25,$26,
            $27,$28,$29,$30,$31,
            $32,$33,$34,$35,$36
          )
          ON CONFLICT (id) DO UPDATE SET
            slug = EXCLUDED.slug,
            name = EXCLUDED.name,
            short_desc = EXCLUDED.short_desc,
            long_desc = EXCLUDED.long_desc,
            category = EXCLUDED.category,
            subcategory = EXCLUDED.subcategory,
            tags_keywords = EXCLUDED.tags_keywords,
            format = EXCLUDED.format,
            file_count = EXCLUDED.file_count,
            included_files = EXCLUDED.included_files,
            size_estimate = EXCLUDED.size_estimate,
            current_version = EXCLUDED.current_version,
            release_date = EXCLUDED.release_date,
            compatibility = EXCLUDED.compatibility,
            dependencies = EXCLUDED.dependencies,
            license_type = EXCLUDED.license_type,
            seats = EXCLUDED.seats,
            redistribution_policy = EXCLUDED.redistribution_policy,
            status = EXCLUDED.status,
            support_level = EXCLUDED.support_level,
            support_docs_link = EXCLUDED.support_docs_link,
            demo_link = EXCLUDED.demo_link,
            sample_available = EXCLUDED.sample_available,
            sample_link = EXCLUDED.sample_link,
            primary_keyword = EXCLUDED.primary_keyword,
            secondary_keywords = EXCLUDED.secondary_keywords,
            intent = EXCLUDED.intent,
            lead_magnet = EXCLUDED.lead_magnet,
            email_capture_required = EXCLUDED.email_capture_required,
            landing_page_type = EXCLUDED.landing_page_type,
            execution_mode = EXCLUDED.execution_mode,
            market_type = EXCLUDED.market_type,
            risk_level = EXCLUDED.risk_level,
            disclosure_required = EXCLUDED.disclosure_required,
            updated_at = EXCLUDED.updated_at
        `,
        [
          row.product_id,
          row.slug,
          row.name,
          row.short_desc,
          row.long_desc,
          row.category,
          row.subcategory,
          listText(row.tags_keywords),
          row.format,
          Number(row.file_count || 0),
          listText(row.included_files),
          row.size_estimate,
          row.version,
          row.release_date,
          listText(row.compatibility),
          listText(row.dependencies),
          row.license_type,
          row.seats,
          row.redistribution_policy,
          row.status,
          row.support_level,
          nullable(row.support_docs_link),
          nullable(row.demo_link),
          boolYN(row.sample_available),
          nullable(row.sample_link),
          nullable(row.primary_keyword),
          listText(row.secondary_keywords),
          nullable(row.intent),
          boolYN(row.lead_magnet),
          boolYN(row.email_capture_required),
          row.landing_page_type,
          row.execution_mode,
          row.market_type,
          row.risk_level,
          boolYN(row.disclosure_required),
          nullable(row.last_updated) || new Date().toISOString(),
        ]
      );
    }

    for (const row of disclosureRows) {
      await client.query(
        `
          INSERT INTO disclosure_versions (version, title, summary, applies_to, effective_date, status)
          VALUES ($1,$2,$3,$4,$5,$6)
          ON CONFLICT (version) DO UPDATE SET
            title = EXCLUDED.title,
            summary = EXCLUDED.summary,
            applies_to = EXCLUDED.applies_to,
            effective_date = EXCLUDED.effective_date,
            status = EXCLUDED.status
        `,
        [
          row.disclosure_version,
          row.title,
          row.summary,
          row.applies_to,
          row.effective_date,
          row.status,
        ]
      );
    }

    for (const row of upsellRows) {
      await client.query(
        `
          INSERT INTO upsell_rules (
            id, trigger_event, trigger_filter, recommendation_type, recommendation_target,
            priority, suppression_condition, window_hours, notes, enabled
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true)
          ON CONFLICT (id) DO UPDATE SET
            trigger_event = EXCLUDED.trigger_event,
            trigger_filter = EXCLUDED.trigger_filter,
            recommendation_type = EXCLUDED.recommendation_type,
            recommendation_target = EXCLUDED.recommendation_target,
            priority = EXCLUDED.priority,
            suppression_condition = EXCLUDED.suppression_condition,
            window_hours = EXCLUDED.window_hours,
            notes = EXCLUDED.notes,
            enabled = EXCLUDED.enabled
        `,
        [
          row.rule_id,
          row.trigger_event,
          row.trigger_filter,
          row.recommendation_type,
          row.recommendation_target,
          Number(row.priority || 0),
          nullable(row.suppression_condition),
          Number(row.window_hours || 0),
          nullable(row.notes),
        ]
      );
    }

    for (const row of bundleRows) {
      const bundleProduct = productById.get(row.bundle_id);
      if (!bundleProduct) continue;

      await client.query(
        `
          INSERT INTO bundles (id, bundle_name, bundle_slug, bundle_version, notes)
          VALUES ($1,$2,$3,$4,$5)
          ON CONFLICT (id) DO UPDATE SET
            bundle_name = EXCLUDED.bundle_name,
            bundle_slug = EXCLUDED.bundle_slug,
            bundle_version = EXCLUDED.bundle_version,
            notes = EXCLUDED.notes
        `,
        [
          row.bundle_id,
          row.bundle_name,
          bundleProduct.slug,
          bundleProduct.version,
          "Seeded from data/bundles_master.csv",
        ]
      );

      await client.query(
        `
          INSERT INTO bundle_items (bundle_id, product_id, quantity, role, notes)
          VALUES ($1,$2,$3,$4,$5)
          ON CONFLICT (bundle_id, product_id) DO UPDATE SET
            quantity = EXCLUDED.quantity,
            role = EXCLUDED.role,
            notes = EXCLUDED.notes
        `,
        [
          row.bundle_id,
          row.component_product_id,
          Number(row.quantity || 1),
          row.role,
          nullable(row.notes),
        ]
      );
    }

    await client.query("COMMIT");
    console.log(`Seed complete: ${catalog.length} products, ${bundleRows.length} bundle rows.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
