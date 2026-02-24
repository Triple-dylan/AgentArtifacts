const path = require("node:path");
const { readCsv } = require("./lib");

const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "data", "catalog_master.csv");
const bundlePath = path.join(root, "data", "bundles_master.csv");

const catalog = readCsv(catalogPath);
const bundles = readCsv(bundlePath);

const errors = [];

if (catalog.length !== 50) {
  errors.push(`Expected 50 catalog rows, found ${catalog.length}`);
}

const categoryCounts = catalog.reduce((acc, row) => {
  acc[row.category] = (acc[row.category] || 0) + 1;
  return acc;
}, {});

const expected = {
  prompt: 12,
  skill: 11,
  agent: 8,
  utility: 7,
  doc: 4,
  bundle: 8,
};

for (const [key, count] of Object.entries(expected)) {
  if (categoryCounts[key] !== count) {
    errors.push(`Category ${key} expected ${count}, found ${categoryCounts[key] || 0}`);
  }
}

const ids = new Set();
for (const row of catalog) {
  if (!row.product_id) errors.push("Missing product_id");
  if (ids.has(row.product_id)) errors.push(`Duplicate product_id ${row.product_id}`);
  ids.add(row.product_id);

  const required = ["slug", "name", "category", "version", "price_usd", "status"];
  for (const field of required) {
    if (!row[field]) errors.push(`Missing ${field} for ${row.product_id}`);
  }

  if ((row.market_type || "none") !== "none") {
    if (!row.execution_mode) errors.push(`Missing execution_mode for trading SKU ${row.product_id}`);
    if (!row.risk_level) errors.push(`Missing risk_level for trading SKU ${row.product_id}`);
  }
}

for (const b of bundles) {
  if (!ids.has(b.bundle_id)) errors.push(`Bundle id not found in catalog: ${b.bundle_id}`);
  if (!ids.has(b.component_product_id)) {
    errors.push(`Bundle component missing in catalog: ${b.component_product_id}`);
  }
}

if (errors.length > 0) {
  console.error("Data validation failed:\n");
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log("Data validation passed.");
console.log("Catalog rows:", catalog.length);
console.log("Category counts:", categoryCounts);
console.log("Bundle component rows:", bundles.length);
