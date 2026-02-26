/**
 * Shared agent helpers for the web app and cron routes.
 * Loads catalog, validates cron secret, etc.
 */

import fs from "node:fs";
import path from "node:path";

export const AGENT_IDS = {
  MARKETING: "marketing",
  SEO_BLOG: "seo-blog",
  PRODUCT_REVIEW: "product-review",
  EXECUTIVE: "executive",
} as const;

/**
 * Validate that the request is from a trusted cron caller.
 */
export function validateCronSecret(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // No secret = allow in dev
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  return authHeader.slice(7) === secret;
}

/**
 * Validate admin access (for dashboard).
 * Supports Bearer token in Authorization header or ?key= query param.
 */
export function validateAdminAccess(request: Request): boolean {
  const key = process.env.ADMIN_API_KEY;
  if (!key) return true; // No key = allow in dev

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7) === key;
  }

  const url = new URL(request.url);
  return url.searchParams.get("key") === key;
}

/**
 * Load catalog for agents. Prefers catalog_master.csv (has cost_basis), falls back to products.collection.csv.
 */
export function loadCatalogForAgents(): Array<Record<string, unknown>> {
  const candidates = [
    path.join(process.cwd(), "data", "catalog_master.csv"),
    path.join(process.cwd(), "..", "..", "data", "catalog_master.csv"),
    path.join(process.cwd(), "data", "products.collection.csv"),
    path.join(process.cwd(), "apps", "web", "data", "products.collection.csv"),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const text = fs.readFileSync(p, "utf8");
      return parseCatalogCsv(text);
    }
  }

  return [];
}

function parseCatalogCsv(text: string): Array<Record<string, unknown>> {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: Array<Record<string, unknown>> = [];
  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i]);
    const row: Record<string, unknown> = {};
    headers.forEach((h, j) => {
      row[h] = values[j] ?? "";
    });
    rows.push(row);
  }
  return rows;
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      cells.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  cells.push(cur);
  return cells.map((v) => v.trim());
}
