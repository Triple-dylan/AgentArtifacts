import fs from "node:fs";
import path from "node:path";

export type CatalogRow = {
  product_id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  short_desc: string;
  cover_image_url: string;
  price_usd: string;
  compare_at_price: string;
  discount_percent: string;
  savings_usd: string;
  price_label: string;
  compare_at_label: string;
  savings_label: string;
  intent: string;
  tags: string;
  compatibility: string;
  sample_available: string;
  sample_link: string;
  execution_mode: string;
  market_type: string;
  risk_level: string;
  risk_badge: string;
  disclosure_required: string;
  disclosure_text_short: string;
  disclosure_version: string;
  disclosure_ack_text: string;
  lead_magnet: string;
  status: string;
  checkout_url: string;
  cta_label: string;
  cta_secondary_label: string;
};

export type BundleRow = {
  bundle_id: string;
  slug: string;
  name: string;
  short_desc: string;
  cover_image_url: string;
  price_usd: string;
  compare_at_price: string;
  discount_percent: string;
  savings_usd: string;
  price_label: string;
  compare_at_label: string;
  savings_label: string;
  execution_mode: string;
  market_type: string;
  risk_level: string;
  risk_badge: string;
  disclosure_required: string;
  disclosure_text_short: string;
  product_count: string;
  included_products: string;
  checkout_url: string;
  cta_label: string;
  status: string;
};

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else { inQuotes = !inQuotes; }
      continue;
    }
    if (ch === "," && !inQuotes) { cells.push(cur); cur = ""; continue; }
    cur += ch;
  }
  cells.push(cur);
  return cells.map((v) => v.trim());
}

function parseCsv<T>(text: string): T[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ""; });
    return row as T;
  });
}

function findMonoRoot(): string {
  // Walk up from cwd to find the framer-import directory
  let dir = process.cwd();
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(dir, "framer-import"))) return dir;
    dir = path.dirname(dir);
  }
  throw new Error("Could not locate monorepo root (framer-import not found)");
}

let _catalog: CatalogRow[] | null = null;
export function loadCatalog(): CatalogRow[] {
  if (_catalog) return _catalog;
  const root = findMonoRoot();
  const raw = fs.readFileSync(path.join(root, "framer-import", "products.collection.csv"), "utf8");
  _catalog = parseCsv<CatalogRow>(raw);
  return _catalog;
}

let _bundles: BundleRow[] | null = null;
export function loadBundles(): BundleRow[] {
  if (_bundles) return _bundles;
  const root = findMonoRoot();
  const raw = fs.readFileSync(path.join(root, "framer-import", "bundles.collection.csv"), "utf8");
  _bundles = parseCsv<BundleRow>(raw);
  return _bundles;
}

export function catalogStats(rows: CatalogRow[]) {
  const categories = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.category] = (acc[row.category] || 0) + 1;
    return acc;
  }, {});
  const trading = rows.filter((r) => r.market_type && r.market_type !== "none").length;
  const live = rows.filter((r) => r.execution_mode === "live").length;
  const freeMagnets = rows.filter((r) => r.lead_magnet === "Y").length;
  return { total: rows.length, categories, trading, live, freeMagnets };
}

export function categoryBadgeClass(cat: string): string {
  const map: Record<string, string> = {
    prompt: "badge-prompt", skill: "badge-skill",
    agent: "badge-agent", utility: "badge-utility",
    doc: "badge-doc", bundle: "badge-bundle",
  };
  return map[cat] ?? "badge-plain";
}

export function riskBadgeClass(risk: string): string {
  const map: Record<string, string> = { low: "badge-risk-low", med: "badge-risk-med", high: "badge-risk-high" };
  return map[risk] ?? "badge-plain";
}

export function modeBadgeClass(mode: string): string {
  const map: Record<string, string> = {
    research: "badge-mode-research", paper: "badge-mode-paper",
    live: "badge-mode-live", none: "badge-plain", mixed: "badge-plain",
  };
  return map[mode] ?? "badge-plain";
}

export function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    prompt: "Prompt", skill: "Skill", agent: "Agent",
    utility: "Utility", doc: "Doc", bundle: "Bundle",
  };
  return map[cat] ?? cat;
}
