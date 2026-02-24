const fs = require("node:fs");
const path = require("node:path");
const { readCsv } = require("./lib");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "framer-import");
const stripeLinksPath = path.join(root, "data", "stripe_links.csv");

function list(value) {
  if (!value || value === "-" || value === "none") return [];
  return value
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function boolYN(v) {
  return String(v || "").toUpperCase() === "Y";
}

function csvEscape(value) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatUsd(value) {
  return `$${Math.round(toNumber(value)).toLocaleString("en-US")}`;
}

function pricing(row) {
  const price = toNumber(row.price_usd);
  const compare = toNumber(row.compare_at_price);
  const savings = compare > price ? compare - price : 0;
  const discountPct = savings > 0 ? Math.round((savings / compare) * 100) : 0;

  return {
    price,
    compare,
    savings,
    discountPct,
    priceLabel: `Now ${formatUsd(price)}`,
    compareLabel: compare > 0 ? `Was ${formatUsd(compare)}` : "",
    savingsLabel: savings > 0 ? `Save ${formatUsd(savings)} (${discountPct}% off)` : "",
  };
}

function toCsv(rows, headers) {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function disclosureText(row) {
  if (!boolYN(row.disclosure_required)) return "";

  if (row.execution_mode === "live") {
    return "This product supports live execution workflows. It is for tooling and education only, not investment advice. User is responsible for all execution decisions.";
  }

  if (row.execution_mode === "paper") {
    return "Paper-trading outputs are hypothetical and do not guarantee future results.";
  }

  return "Research outputs are informational and require independent judgment.";
}

function riskBadge(row) {
  if (row.market_type === "none") return "General";
  return `${row.execution_mode.toUpperCase()} / ${row.risk_level.toUpperCase()} RISK`;
}

function disclosureVersion(row) {
  if (!boolYN(row.disclosure_required)) return "";
  if (row.execution_mode === "paper") return "DISC-1.0.0-PAPER";
  if (row.execution_mode === "research") return "DISC-1.0.0-RESEARCH";
  return "DISC-1.0.0";
}

function titleForCover(row) {
  const execution = row.execution_mode && row.execution_mode !== "none" ? ` ${row.execution_mode.toUpperCase()}` : "";
  return `${row.name}${execution}`.trim();
}

function coverPalette(row, isBundle = false) {
  if (isBundle) {
    if (row.market_type && row.market_type !== "none") {
      return { bg: "1F2A44", fg: "F5F9FF" };
    }
    return { bg: "2D2A4A", fg: "F8F7FF" };
  }

  const hasTrading = row.market_type && row.market_type !== "none";
  if (hasTrading) {
    return { bg: "16324F", fg: "EAF5FF" };
  }

  switch (row.category) {
    case "prompt":
      return { bg: "1F4D3A", fg: "F0FFF7" };
    case "skill":
      return { bg: "3D2E6E", fg: "F5F1FF" };
    case "agent":
      return { bg: "7A2E1F", fg: "FFF6F2" };
    case "utility":
      return { bg: "1B3A4B", fg: "EFF8FF" };
    case "doc":
      return { bg: "5A4A1F", fg: "FFFBEA" };
    default:
      return { bg: "2C3748", fg: "F5F8FC" };
  }
}

function coverImageUrl(row, isBundle = false) {
  const { bg, fg } = coverPalette(row, isBundle);
  const text = encodeURIComponent(titleForCover(row).replace(/\s+/g, " ").trim());
  return `https://placehold.co/1200x800/${bg}/${fg}.png?text=${text}`;
}

function loadStripeLinks() {
  if (!fs.existsSync(stripeLinksPath)) return new Map();
  const rows = readCsv(stripeLinksPath);
  const map = new Map();
  for (const row of rows) {
    if (!row.product_id || !row.checkout_url) continue;
    map.set(row.product_id, row.checkout_url);
  }
  return map;
}

function main() {
  const catalog = readCsv(path.join(root, "data", "catalog_master.csv"));
  const bundleRows = readCsv(path.join(root, "data", "bundles_master.csv"));
  const stripeLinks = loadStripeLinks();

  const products = catalog
    .filter((row) => row.category !== "bundle")
    .map((row) => {
      const p = pricing(row);
      return {
        product_id: row.product_id,
        slug: row.slug,
        name: row.name,
        category: row.category,
        subcategory: row.subcategory,
        short_desc: row.short_desc,
        cover_image_url: coverImageUrl(row),
        price_usd: p.price,
        compare_at_price: p.compare,
        discount_percent: p.discountPct,
        savings_usd: p.savings,
        price_label: p.priceLabel,
        compare_at_label: p.compareLabel,
        savings_label: p.savingsLabel,
        intent: row.intent,
        tags: list(row.tags_keywords).join(" | "),
        compatibility: list(row.compatibility).join(" | "),
        sample_available: row.sample_available,
        sample_link: row.sample_link || "",
        execution_mode: row.execution_mode,
        market_type: row.market_type,
        risk_level: row.risk_level,
        risk_badge: riskBadge(row),
        disclosure_required: row.disclosure_required,
        disclosure_text_short: disclosureText(row),
        disclosure_version: disclosureVersion(row),
        disclosure_ack_text: boolYN(row.disclosure_required)
          ? "I acknowledge the disclosure and understand this is tooling/education, not investment advice."
          : "",
        disclosure_ack_required: boolYN(row.disclosure_required) ? "Y" : "N",
        lead_magnet: row.lead_magnet,
        email_capture_required: row.email_capture_required,
        status: row.status,
        product_page_url: `https://app.agentassets.io/products/${row.slug}`,
        checkout_url:
          stripeLinks.get(row.product_id) || `https://app.agentassets.io/checkout?product_id=${row.product_id}`,
        success_page_url: `https://app.agentassets.io/success?product_id=${row.product_id}`,
        download_page_url: `https://app.agentassets.io/success?product_id=${row.product_id}#downloads`,
        stripe_lookup_key: row.product_id,
        checkout_api_endpoint: "https://api.agentassets.io/checkout/session",
        download_api_endpoint: "https://api.agentassets.io/downloads/signed-url",
        disclosure_api_endpoint: "https://api.agentassets.io/disclosures/acknowledge",
        cta_label: "Buy Now",
        cta_secondary_label: boolYN(row.sample_available) ? "Preview Sample" : "View Details",
      };
    });

  const bundleById = new Map();
  for (const row of bundleRows) {
    if (!bundleById.has(row.bundle_id)) {
      bundleById.set(row.bundle_id, {
        bundle_id: row.bundle_id,
        bundle_name: row.bundle_name,
        items: [],
      });
    }
    bundleById.get(row.bundle_id).items.push(row);
  }

  const bundles = catalog
    .filter((row) => row.category === "bundle")
    .map((row) => {
      const p = pricing(row);
      const items = bundleById.get(row.product_id)?.items || [];
      return {
        bundle_id: row.product_id,
        slug: row.slug,
        name: row.name,
        short_desc: row.short_desc,
        cover_image_url: coverImageUrl(row, true),
        price_usd: p.price,
        compare_at_price: p.compare,
        discount_percent: p.discountPct,
        savings_usd: p.savings,
        price_label: p.priceLabel,
        compare_at_label: p.compareLabel,
        savings_label: p.savingsLabel,
        execution_mode: row.execution_mode,
        market_type: row.market_type,
        risk_level: row.risk_level,
        risk_badge: riskBadge(row),
        disclosure_required: row.disclosure_required,
        disclosure_text_short: disclosureText(row),
        disclosure_version: disclosureVersion(row),
        disclosure_ack_text: boolYN(row.disclosure_required)
          ? "I acknowledge the disclosure and understand this is tooling/education, not investment advice."
          : "",
        status: row.status,
        product_count: items.length,
        included_products: items
          .map((i) => `${i.component_product_id} (${i.role})`)
          .join(" | "),
        bundle_page_url: `https://app.agentassets.io/bundles/${row.slug}`,
        checkout_url:
          stripeLinks.get(row.product_id) || `https://app.agentassets.io/checkout?bundle_id=${row.product_id}`,
        success_page_url: `https://app.agentassets.io/success?bundle_id=${row.product_id}`,
        download_page_url: `https://app.agentassets.io/success?bundle_id=${row.product_id}#downloads`,
        stripe_lookup_key: row.product_id,
        checkout_api_endpoint: "https://api.agentassets.io/checkout/session",
        cta_label: "Buy Bundle",
      };
    });

  const endpointRows = [
    {
      key: "catalog",
      endpoint: "https://api.agentassets.io/catalog",
      method: "GET",
      usage: "Catalog list",
    },
    {
      key: "trading_catalog",
      endpoint: "https://api.agentassets.io/catalog/trading",
      method: "GET",
      usage: "Trading filter list",
    },
    {
      key: "checkout_session",
      endpoint: "https://api.agentassets.io/checkout/session",
      method: "POST",
      usage: "Create checkout session",
    },
    {
      key: "disclosure_ack",
      endpoint: "https://api.agentassets.io/disclosures/acknowledge",
      method: "POST",
      usage: "Record disclosure acknowledgement",
    },
    {
      key: "signed_download",
      endpoint: "https://api.agentassets.io/downloads/signed-url",
      method: "POST",
      usage: "Entitlement + disclosure gated download",
    },
    {
      key: "upsell",
      endpoint: "https://api.agentassets.io/upsell/evaluate",
      method: "POST",
      usage: "Get recommendation list",
    },
  ];

  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, "products.collection.csv"),
    toCsv(products, [
      "product_id",
      "slug",
      "name",
      "category",
      "subcategory",
      "short_desc",
      "cover_image_url",
      "price_usd",
      "compare_at_price",
      "discount_percent",
      "savings_usd",
      "price_label",
      "compare_at_label",
      "savings_label",
      "intent",
      "tags",
      "compatibility",
      "sample_available",
      "sample_link",
      "execution_mode",
      "market_type",
      "risk_level",
      "risk_badge",
      "disclosure_required",
      "disclosure_text_short",
      "disclosure_version",
      "disclosure_ack_text",
      "disclosure_ack_required",
      "lead_magnet",
      "email_capture_required",
      "status",
      "product_page_url",
      "checkout_url",
      "success_page_url",
      "download_page_url",
      "stripe_lookup_key",
      "checkout_api_endpoint",
      "download_api_endpoint",
      "disclosure_api_endpoint",
      "cta_label",
      "cta_secondary_label",
    ])
  );

  fs.writeFileSync(
    path.join(outDir, "bundles.collection.csv"),
    toCsv(bundles, [
      "bundle_id",
      "slug",
      "name",
      "short_desc",
      "cover_image_url",
      "price_usd",
      "compare_at_price",
      "discount_percent",
      "savings_usd",
      "price_label",
      "compare_at_label",
      "savings_label",
      "execution_mode",
      "market_type",
      "risk_level",
      "risk_badge",
      "disclosure_required",
      "disclosure_text_short",
      "disclosure_version",
      "disclosure_ack_text",
      "status",
      "product_count",
      "included_products",
      "bundle_page_url",
      "checkout_url",
      "success_page_url",
      "download_page_url",
      "stripe_lookup_key",
      "checkout_api_endpoint",
      "cta_label",
    ])
  );

  fs.writeFileSync(path.join(outDir, "endpoint-map.csv"), toCsv(endpointRows, ["key", "endpoint", "method", "usage"]));

  console.log(`Generated Framer import pack in ${outDir}`);
  console.log(`Products rows: ${products.length}`);
  console.log(`Bundles rows: ${bundles.length}`);
}

main();
