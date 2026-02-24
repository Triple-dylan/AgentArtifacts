const fs = require("node:fs");
const path = require("node:path");
const { readCsv, list } = require("./lib");

const root = path.resolve(__dirname, "..");
const catalog = readCsv(path.join(root, "data", "catalog_master.csv"));
const bundleRows = readCsv(path.join(root, "data", "bundles_master.csv"));

const productsById = new Map(catalog.map((r) => [r.product_id, r]));
const bundleMap = new Map();

for (const row of bundleRows) {
  if (!bundleMap.has(row.bundle_id)) bundleMap.set(row.bundle_id, []);
  bundleMap.get(row.bundle_id).push(row);
}

function boolYN(v) {
  return String(v || "").toUpperCase() === "Y";
}

function sizeBytes(sizeEstimate) {
  const n = parseFloat(String(sizeEstimate || "").replace(/[^0-9.]/g, ""));
  if (Number.isNaN(n)) return 0;
  return Math.round(n * 1024 * 1024);
}

function typeFromCategory(category) {
  return category;
}

function toItem(row) {
  const type = typeFromCategory(row.category);
  const files = (row.category === "bundle"
    ? []
    : list(row.included_files).map((file) => ({
        path: file,
        type: file.endsWith(".json") ? "json" : file.endsWith(".yaml") ? "yaml" : "markdown",
        bytes: Math.max(512, Math.round(sizeBytes(row.size_estimate) / Math.max(1, list(row.included_files).length))),
      })));

  const base = {
    registry_schema_version: "1.1.0",
    id: row.product_id,
    type,
    name: row.name,
    description: row.short_desc,
    version: row.version,
    format: row.format,
    files,
    size_bytes: files.reduce((acc, f) => acc + f.bytes, 0),
    compatibility: list(row.compatibility),
    dependencies: list(row.dependencies),
    required_secrets: list(row.dependencies).map((d) => `${d.toUpperCase()}_KEY`),
    license: {
      type: row.license_type,
      seats: Number.isNaN(Number(row.seats)) ? row.seats : Number(row.seats),
      redistribution_policy: row.redistribution_policy,
      commercial_use: row.license_type !== "personal",
    },
    price_usd: Number(row.price_usd || 0),
    currency: "USD",
    billing_type: "one_time",
    availability: row.status,
    created_at: `${row.release_date}T00:00:00Z`,
    updated_at: row.last_updated,
    urls: {
      product_page: `https://agentassets.io/products/${row.slug}`,
      docs: row.support_docs_link,
      download_endpoint: `https://api.agentassets.io/downloads/${row.product_id}`,
      sample_endpoint: row.sample_link || `https://api.agentassets.io/samples/${row.product_id}`,
      changelog: `https://agentassets.io${row.changelog}`,
    },
    tags: list(row.tags_keywords),
    keywords: [row.primary_keyword, ...list(row.secondary_keywords)].filter(Boolean),
    support: {
      level: row.support_level,
      contact: "support@agentassets.io",
      sla: row.support_level === "priority" ? "1 business day" : "2 business days",
    },
    execution_mode: row.execution_mode,
    market_type: row.market_type,
    connector_type: row.market_type === "none" ? [] : ["api"],
    risk_level: row.risk_level,
    disclosure_required: boolYN(row.disclosure_required),
  };

  if (type === "skill" || type === "agent") {
    base.input_schema = `https://agentassets.io/schemas/${row.slug}-input-v1`;
    base.output_schema = `https://agentassets.io/schemas/${row.slug}-output-v1`;
  }

  if (type === "bundle") {
    base.bundle_contents = (bundleMap.get(row.product_id) || []).map((it) => ({
      product_id: it.component_product_id,
      quantity: Number(it.quantity || 1),
      notes: it.notes,
    }));
  }

  if (row.market_type !== "none") {
    base.trade_action_schema = "https://agentassets.io/schemas/trade-action-v1";
    base.market_data_schema = "https://agentassets.io/schemas/market-data-v1";
    base.risk_profile = {
      max_position_size: row.risk_level === "high" ? "2% NAV" : row.risk_level === "med" ? "3% NAV" : "5% NAV",
      max_exposure_pct: row.risk_level === "high" ? 15 : row.risk_level === "med" ? 20 : 30,
      stop_rules: row.risk_level === "high" ? ["hard_stop_required"] : ["soft_stop_required"],
      circuit_breaker_rules: ["api_error_pause"],
    };
  }

  if (boolYN(row.disclosure_required)) {
    base.disclosure_profile = {
      disclosure_version: row.execution_mode === "paper" ? "DISC-1.0.0-PAPER" : "DISC-1.0.0",
      ack_required: true,
      display_context: ["product_page", "checkout", "download"],
    };
  }

  return base;
}

const items = catalog.map(toItem);
const outputDir = path.join(root, "spec", "registry", "generated");
fs.mkdirSync(outputDir, { recursive: true });

for (const item of items) {
  fs.writeFileSync(path.join(outputDir, `${item.id}.json`), `${JSON.stringify(item, null, 2)}\n`);
}

const index = {
  registry_schema_version: "1.1.0",
  generated_at: new Date().toISOString(),
  pagination: {
    page: 1,
    page_size: 50,
    total_items: items.length,
    total_pages: 1,
    next_page: null,
    prev_page: null,
  },
  filters: {
    types: ["prompt", "skill", "agent", "utility", "doc", "bundle"],
    availability: ["draft", "active", "archived"],
    execution_mode: ["none", "research", "paper", "live", "mixed"],
    market_type: ["none", "prediction", "crypto_perps", "hybrid"],
  },
  items: items.map((item) => ({
    id: item.id,
    type: item.type,
    name: item.name,
    version: item.version,
    price_usd: item.price_usd,
    availability: item.availability,
    execution_mode: item.execution_mode,
    market_type: item.market_type,
    product_page: item.urls.product_page,
    tags: item.tags,
  })),
};

fs.writeFileSync(path.join(outputDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`);

console.log(`Generated ${items.length} registry item files in ${outputDir}`);
