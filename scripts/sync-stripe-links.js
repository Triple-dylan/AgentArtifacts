#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const { readCsv } = require("./lib");

const STRIPE_API_BASE = "https://api.stripe.com/v1";
const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "data", "catalog_master.csv");
const outPath = path.join(root, "data", "stripe_links.csv");

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function formPairs(payload, prefix = "") {
  const out = [];
  for (const [key, value] of Object.entries(payload || {})) {
    if (value === undefined || value === null) continue;
    const formKey = prefix ? `${prefix}[${key}]` : key;

    if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        if (typeof item === "object" && item !== null) {
          out.push(...formPairs(item, `${formKey}[${idx}]`));
        } else {
          out.push([`${formKey}[${idx}]`, String(item)]);
        }
      });
      continue;
    }

    if (typeof value === "object") {
      out.push(...formPairs(value, formKey));
      continue;
    }

    out.push([formKey, String(value)]);
  }
  return out;
}

function toFormBody(payload) {
  return formPairs(payload)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

async function stripeRequest(secretKey, method, route, payload = {}, idempotencyKey = null) {
  const headers = {
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

  const res = await fetch(`${STRIPE_API_BASE}${route}`, {
    method,
    headers,
    body: method === "GET" ? undefined : toFormBody(payload),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.error?.message || `${method} ${route} failed with ${res.status}`;
    throw new Error(msg);
  }
  return body;
}

function slugifyForStripe(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

function csvEscape(value) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function writeCsv(filePath, rows, headers) {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`);
}

async function ensurePrice(secretKey, row) {
  const unitAmount = Math.round(Number(row.price_usd || 0) * 100);
  const lookupKey = `aa_${slugifyForStripe(row.product_id)}_usd_one_time`;

  return stripeRequest(
    secretKey,
    "POST",
    "/prices",
    {
      currency: "usd",
      unit_amount: unitAmount,
      lookup_key: lookupKey,
      transfer_lookup_key: true,
      product_data: {
        name: row.name,
        metadata: {
          product_id: row.product_id,
          slug: row.slug,
          category: row.category,
        },
      },
      metadata: {
        product_id: row.product_id,
      },
    },
    `price:${row.product_id}:${unitAmount}`
  );
}

async function createPaymentLink(secretKey, row, priceId, appBaseUrl) {
  const idempotencyKey = `plink:${row.product_id}:${priceId}`;
  const successTarget =
    row.category === "bundle"
      ? `${appBaseUrl}/success?bundle_id=${row.product_id}&session_id={CHECKOUT_SESSION_ID}`
      : `${appBaseUrl}/success?product_id=${row.product_id}&session_id={CHECKOUT_SESSION_ID}`;

  return stripeRequest(
    secretKey,
    "POST",
    "/payment_links",
    {
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      metadata: {
        product_id: row.product_id,
      },
      after_completion: {
        type: "redirect",
        redirect: {
          url: successTarget,
        },
      },
    },
    idempotencyKey
  );
}

async function main() {
  const secretKey = requireEnv("STRIPE_SECRET_KEY");
  const appBaseUrl = process.env.APP_BASE_URL || "https://app.agentassets.io";

  const rows = readCsv(catalogPath).filter((r) => r.status !== "archived");
  const results = [];

  for (const row of rows) {
    const price = await ensurePrice(secretKey, row);
    const paymentLink = await createPaymentLink(secretKey, row, price.id, appBaseUrl);

    results.push({
      product_id: row.product_id,
      checkout_url: paymentLink.url,
      stripe_price_id: price.id,
      stripe_payment_link_id: paymentLink.id,
    });

    // Avoid hitting Stripe write-rate limits when creating many links in one run.
    await new Promise((resolve) => setTimeout(resolve, 80));
  }

  writeCsv(outPath, results, [
    "product_id",
    "checkout_url",
    "stripe_price_id",
    "stripe_payment_link_id",
  ]);

  console.log(`Generated ${results.length} Stripe payment links -> ${outPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
