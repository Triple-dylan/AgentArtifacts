import { NextResponse } from "next/server";
import { loadCatalog, loadBundles } from "@/lib/catalog";

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  const products = loadCatalog().map((p) => ({
    id: p.product_id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory,
    description: p.short_desc,
    price_usd: p.price_usd,
    price_label: p.price_label,
    compare_at_price: p.compare_at_price || null,
    savings_label: p.savings_label || null,
    risk_level: p.risk_level || "low",
    execution_mode: p.execution_mode || null,
    compatibility: p.compatibility ? p.compatibility.split(" | ") : [],
    tags: p.tags ? p.tags.split(" | ") : [],
    has_free_sample: p.lead_magnet === "Y",
    sample_link: p.sample_link || null,
    url: `https://agentassets.io/products/${p.slug}`,
    cover_image_url: p.cover_image_url || null,
    status: p.status,
  }));

  const bundles = loadBundles().map((b) => ({
    id: b.bundle_id,
    slug: b.slug,
    name: b.name,
    description: b.short_desc,
    price_usd: b.price_usd,
    price_label: b.price_label,
    product_count: b.product_count,
    url: `https://agentassets.io/bundles/${b.slug}`,
    cover_image_url: b.cover_image_url || null,
  }));

  return NextResponse.json(
    {
      meta: {
        site: "Agent Artifacts",
        url: "https://agentassets.io",
        description: "Production-ready AI prompts, skill modules, agents, utilities, and docs.",
        total_products: products.length,
        total_bundles: bundles.length,
        categories: ["prompt", "skill", "agent", "utility", "doc"],
        free_library: "https://agentassets.io/free-library",
        contact: "support@agentassets.io",
      },
      products,
      bundles,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
