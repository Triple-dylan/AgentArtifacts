import path from "node:path";
import { readCsv } from "./csv.js";
import { dataDir } from "./paths.js";

function list(value) {
  if (!value || value === "-" || value === "none") return [];
  return value
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function boolYN(value) {
  return String(value || "").toUpperCase() === "Y";
}

function num(value) {
  if (value === "" || value == null || value === "custom") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function isoDate(dateStr) {
  if (!dateStr) return null;
  return `${dateStr}T00:00:00Z`;
}

function mapProduct(row) {
  return {
    id: row.product_id,
    slug: row.slug,
    name: row.name,
    short_desc: row.short_desc,
    long_desc: row.long_desc,
    category: row.category,
    subcategory: row.subcategory,
    tags_keywords: list(row.tags_keywords),
    format: row.format,
    file_count: Number(row.file_count || 0),
    included_files: list(row.included_files),
    size_estimate: row.size_estimate,
    version: row.version,
    changelog: row.changelog,
    release_date: row.release_date,
    release_date_iso: isoDate(row.release_date),
    compatibility: list(row.compatibility),
    dependencies: list(row.dependencies),
    license_type: row.license_type,
    seats: row.seats,
    redistribution_policy: row.redistribution_policy,
    price_usd: num(row.price_usd),
    compare_at_price: num(row.compare_at_price),
    cost_basis: num(row.cost_basis),
    discount_eligibility: row.discount_eligibility,
    bundle_id: list(row.bundle_id),
    bundle_role: row.bundle_role,
    upsell_targets: list(row.upsell_targets),
    cross_sell_targets: list(row.cross_sell_targets),
    status: row.status,
    last_updated: row.last_updated,
    owner: row.owner,
    support_level: row.support_level,
    support_docs_link: row.support_docs_link,
    demo_link: row.demo_link,
    sample_available: boolYN(row.sample_available),
    sample_link: row.sample_link,
    primary_keyword: row.primary_keyword,
    secondary_keywords: list(row.secondary_keywords),
    intent: row.intent,
    lead_magnet: boolYN(row.lead_magnet),
    email_capture_required: boolYN(row.email_capture_required),
    landing_page_type: row.landing_page_type,
    execution_mode: row.execution_mode,
    market_type: row.market_type,
    risk_level: row.risk_level,
    disclosure_required: boolYN(row.disclosure_required),
  };
}

function mapBundleItem(row) {
  return {
    bundle_id: row.bundle_id,
    bundle_name: row.bundle_name,
    component_product_id: row.component_product_id,
    quantity: Number(row.quantity || 1),
    role: row.role,
    notes: row.notes,
  };
}

function mapDisclosure(row) {
  return {
    disclosure_version: row.disclosure_version,
    effective_date: row.effective_date,
    title: row.title,
    applies_to: row.applies_to,
    summary: row.summary,
    status: row.status,
  };
}

function mapUpsellRule(row) {
  return {
    rule_id: row.rule_id,
    trigger_event: row.trigger_event,
    trigger_filter: row.trigger_filter,
    recommendation_type: row.recommendation_type,
    recommendation_target: row.recommendation_target,
    priority: Number(row.priority || 0),
    suppression_condition: row.suppression_condition,
    window_hours: Number(row.window_hours || 0),
    notes: row.notes,
  };
}

export function loadDataStore() {
  const products = readCsv(path.join(dataDir, "catalog_master.csv")).map(mapProduct);
  const bundleItems = readCsv(path.join(dataDir, "bundles_master.csv")).map(mapBundleItem);
  const disclosures = readCsv(path.join(dataDir, "disclosure_versions.csv")).map(mapDisclosure);
  const upsellRules = readCsv(path.join(dataDir, "upsell_rules.csv")).map(mapUpsellRule);

  const productsById = new Map(products.map((p) => [p.id, p]));
  const bundles = new Map();

  for (const item of bundleItems) {
    if (!bundles.has(item.bundle_id)) {
      bundles.set(item.bundle_id, {
        id: item.bundle_id,
        name: item.bundle_name,
        items: [],
      });
    }
    bundles.get(item.bundle_id).items.push(item);
  }

  return {
    products,
    productsById,
    bundles,
    bundleItems,
    disclosures,
    upsellRules,
  };
}
