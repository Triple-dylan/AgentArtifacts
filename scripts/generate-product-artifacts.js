#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const { readCsv } = require("./lib");

const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "data", "catalog_master.csv");
const bundlesPath = path.join(root, "data", "bundles_master.csv");
const outRoot = path.join(root, "artifacts");

function list(value) {
  if (!value || value === "none" || value === "-") return [];
  return String(value)
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function boolYN(value) {
  return String(value || "").toUpperCase() === "Y";
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function writeJson(filePath, value) {
  writeText(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function fileTemplate(fileName, row) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".json")) {
    return `${JSON.stringify(
      {
        _template_notice:
          "Starter template generated from catalog metadata. Replace with production content before launch.",
        product_id: row.product_id,
        slug: row.slug,
        version: row.version,
      },
      null,
      2
    )}\n`;
  }

  if (lower.endsWith(".yaml") || lower.endsWith(".yml")) {
    return [
      "# Starter template generated from catalog metadata",
      `product_id: ${row.product_id}`,
      `slug: ${row.slug}`,
      `version: ${row.version}`,
      "replace_with_production_content: true",
      "",
    ].join("\n");
  }

  if (lower.endsWith(".csv")) {
    return ["key,value", `product_id,${row.product_id}`, `version,${row.version}`, ""].join("\n");
  }

  return [
    `# ${row.name} - ${fileName}`,
    "",
    "Starter template generated from catalog metadata.",
    "Replace this content with production-ready material before launch.",
    "",
    `Product ID: ${row.product_id}`,
    `Version: ${row.version}`,
    `Category: ${row.category}`,
    "",
  ].join("\n");
}

function productManifest(row, includedFiles) {
  return {
    product_id: row.product_id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory,
    version: row.version,
    status: row.status,
    release_date: row.release_date,
    format: row.format,
    file_count: Number(row.file_count || 0),
    included_files: includedFiles,
    size_estimate: row.size_estimate,
    compatibility: list(row.compatibility),
    dependencies: list(row.dependencies),
    license_type: row.license_type,
    seats: row.seats,
    redistribution_policy: row.redistribution_policy,
    pricing: {
      price_usd: Number(row.price_usd || 0),
      compare_at_price: Number(row.compare_at_price || 0),
    },
    trading: {
      execution_mode: row.execution_mode,
      market_type: row.market_type,
      risk_level: row.risk_level,
      disclosure_required: boolYN(row.disclosure_required),
    },
  };
}

function productReadme(row) {
  const disclosure = boolYN(row.disclosure_required)
    ? "Disclosure acknowledgement is required before download/use."
    : "No special disclosure gate is required.";

  return [
    `# ${row.name}`,
    "",
    `- Product ID: \`${row.product_id}\``,
    `- Version: \`${row.version}\``,
    `- Category: \`${row.category}/${row.subcategory}\``,
    `- Execution Mode: \`${row.execution_mode}\``,
    `- Market Type: \`${row.market_type}\``,
    `- Risk Level: \`${row.risk_level}\``,
    "",
    row.short_desc,
    "",
    "## Notes",
    "- This package is generated as a structured starter deliverable.",
    "- Replace placeholder files with production-grade content before public launch.",
    `- ${disclosure}`,
    "",
  ].join("\n");
}

function bundleManifest(bundleProduct, items) {
  return {
    bundle_id: bundleProduct.product_id,
    slug: bundleProduct.slug,
    name: bundleProduct.name,
    version: bundleProduct.version,
    status: bundleProduct.status,
    price_usd: Number(bundleProduct.price_usd || 0),
    compare_at_price: Number(bundleProduct.compare_at_price || 0),
    execution_mode: bundleProduct.execution_mode,
    market_type: bundleProduct.market_type,
    risk_level: bundleProduct.risk_level,
    disclosure_required: boolYN(bundleProduct.disclosure_required),
    contents: items.map((item) => ({
      product_id: item.component_product_id,
      quantity: Number(item.quantity || 1),
      role: item.role,
      notes: item.notes || "",
    })),
  };
}

function bundleReadme(bundleProduct, items) {
  const lines = [
    `# ${bundleProduct.name}`,
    "",
    `- Bundle ID: \`${bundleProduct.product_id}\``,
    `- Version: \`${bundleProduct.version}\``,
    `- Price: $${Number(bundleProduct.price_usd || 0)}`,
    "",
    "## Included Products",
  ];

  for (const item of items) {
    lines.push(`- \`${item.component_product_id}\` (${item.role}, qty ${item.quantity || 1})`);
  }
  lines.push("");
  return lines.join("\n");
}

function main() {
  const catalog = readCsv(catalogPath);
  const bundleItems = readCsv(bundlesPath);
  const byBundle = new Map();

  for (const row of bundleItems) {
    if (!byBundle.has(row.bundle_id)) byBundle.set(row.bundle_id, []);
    byBundle.get(row.bundle_id).push(row);
  }

  const productsOut = path.join(outRoot, "products");
  const bundlesOut = path.join(outRoot, "bundles");
  ensureDir(productsOut);
  ensureDir(bundlesOut);

  let fileWrites = 0;

  for (const row of catalog) {
    const productDir = path.join(productsOut, row.product_id);
    ensureDir(productDir);
    const includes = list(row.included_files);

    writeJson(path.join(productDir, "manifest.json"), productManifest(row, includes));
    fileWrites += 1;
    writeText(path.join(productDir, "README.md"), productReadme(row));
    fileWrites += 1;

    for (const item of includes) {
      if (item === "manifest_only") continue;
      if (item.endsWith("/")) {
        const dir = path.join(productDir, item);
        ensureDir(dir);
        writeText(path.join(dir, "README.md"), fileTemplate("README.md", row));
        fileWrites += 1;
        continue;
      }

      const target = path.join(productDir, item);
      writeText(target, fileTemplate(item, row));
      fileWrites += 1;
    }

    if (row.category === "bundle") {
      const items = byBundle.get(row.product_id) || [];
      const bundleDir = path.join(bundlesOut, row.product_id);
      ensureDir(bundleDir);
      writeJson(path.join(bundleDir, "bundle.manifest.json"), bundleManifest(row, items));
      fileWrites += 1;
      writeText(path.join(bundleDir, "README.md"), bundleReadme(row, items));
      fileWrites += 1;
    }
  }

  console.log(`Generated artifact starter packs in ${outRoot}`);
  console.log(`Products: ${catalog.length}`);
  console.log(`Bundles: ${catalog.filter((r) => r.category === "bundle").length}`);
  console.log(`Files written: ${fileWrites}`);
}

main();
