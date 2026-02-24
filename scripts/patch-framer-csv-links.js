#!/usr/bin/env node
"use strict";

/**
 * Patches Framer import CSVs with deterministic routing and featured-home fields.
 *
 * Input files:
 *  - framer-import/products.collection.csv
 *  - framer-import/bundles.collection.csv
 *
 * Output files:
 *  - framer-import/products.collection.patched.csv
 *  - framer-import/bundles.collection.patched.csv
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const FRAMER_DIR = path.join(ROOT, "framer-import");

const PRODUCTS_IN = path.join(FRAMER_DIR, "products.collection.csv");
const BUNDLES_IN = path.join(FRAMER_DIR, "bundles.collection.csv");
const PRODUCTS_OUT = path.join(FRAMER_DIR, "products.collection.patched.csv");
const BUNDLES_OUT = path.join(FRAMER_DIR, "bundles.collection.patched.csv");

const FEATURED_PRODUCTS = [
  "AA-PRM-GEN-IDEATION-BASE-001",
  "AA-SKL-GEN-TOOLROUTER-CORE-013",
  "AA-AGT-GEN-WORKFLOWORCH-PRO-027",
  "AA-UTL-GEN-JSONSCHEMAPACK-CORE-032",
  "AA-PRM-TRD-MARKETTHESIS-PRO-009",
  "AA-SKL-TRD-RISKCHECK-PRO-022",
  "AA-AGT-TRD-LIVECOORD-PRO-030",
  "AA-DOC-GEN-AGENTCOOKBOOK-CORE-039",
];

const FEATURED_BUNDLES = [
  "AA-BND-GEN-STARTER-STD-043",
  "AA-BND-GEN-BUILDERKIT-PRO-044",
  "AA-BND-TRD-PREDICTION-STD-047",
  "AA-BND-TRD-SYSTEMS-PRO-048",
];

function parseCsv(input) {
  const rows = [];
  const text = input.replace(/\r\n/g, "\n");
  let i = 0;
  let field = "";
  let row = [];
  let inQuotes = false;

  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 2;
        continue;
      }
      if (ch === '"') {
        inQuotes = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }

    if (ch === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }

    if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
      continue;
    }

    field += ch;
    i += 1;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const headers = rows.shift() || [];
  return rows
    .filter((r) => r.some((v) => String(v).trim().length > 0))
    .map((r) => {
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = r[idx] ?? "";
      });
      return obj;
    });
}

function escapeCsv(value) {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function writeCsv(rows, orderedHeaders) {
  const headers = [...orderedHeaders];
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!headers.includes(key)) headers.push(key);
    }
  }
  const lines = [headers.map(escapeCsv).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsv(row[h] ?? "")).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function patchProducts(rows) {
  const rank = new Map(FEATURED_PRODUCTS.map((id, idx) => [id, idx + 1]));
  return rows.map((row) => {
    const slug = row.slug || "";
    const id = row.product_id || "";
    const cardLink = `/products/${slug}`;
    const buyLink = row.checkout_url || "";
    const sampleLink = (row.sample_link || "").trim();
    const hasSample = String(row.sample_available || "").toUpperCase() === "Y" && sampleLink;

    return {
      ...row,
      card_link_url: cardLink,
      buy_link_url: buyLink,
      sample_or_secondary_url: hasSample ? sampleLink : cardLink,
      cta_detail_label: "View details",
      home_featured: rank.has(id) ? "Y" : "N",
      home_featured_rank: rank.get(id) || "",
    };
  });
}

function patchBundles(rows) {
  const rank = new Map(FEATURED_BUNDLES.map((id, idx) => [id, idx + 1]));
  return rows.map((row) => {
    const slug = row.slug || "";
    const id = row.bundle_id || "";
    const cardLink = `/bundles/${slug}`;
    const buyLink = row.checkout_url || "";

    return {
      ...row,
      card_link_url: cardLink,
      buy_link_url: buyLink,
      sample_or_secondary_url: cardLink,
      cta_detail_label: "View details",
      home_featured: rank.has(id) ? "Y" : "N",
      home_featured_rank: rank.get(id) || "",
    };
  });
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function main() {
  if (!fs.existsSync(PRODUCTS_IN) || !fs.existsSync(BUNDLES_IN)) {
    throw new Error("Missing Framer CSV inputs in framer-import/.");
  }

  const products = parseCsv(readText(PRODUCTS_IN));
  const bundles = parseCsv(readText(BUNDLES_IN));

  const patchedProducts = patchProducts(products);
  const patchedBundles = patchBundles(bundles);

  fs.writeFileSync(PRODUCTS_OUT, writeCsv(patchedProducts, Object.keys(products[0] || {})));
  fs.writeFileSync(BUNDLES_OUT, writeCsv(patchedBundles, Object.keys(bundles[0] || {})));

  console.log(`Wrote ${PRODUCTS_OUT}`);
  console.log(`Wrote ${BUNDLES_OUT}`);
}

main();

