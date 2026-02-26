import { NextResponse } from "next/server";
import { complete, recordRun, saveReport } from "@agent-artifacts/agent-runner";
import { validateCronSecret, loadCatalogForAgents, AGENT_IDS } from "@/lib/agents";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are the Product Improvement Agent for Agent Artifacts, a store selling AI prompts, skills, agents, and utilities for AI builders. Your job is to analyze the product catalog and produce a structured JSON report with:

1. products_to_review: Array of objects with { product_id, name, issue, suggestion } - flag products with weak descriptions, missing samples, or unclear positioning
2. pricing_suggestions: Array of objects with { product_id, name, current_price, compare_at_price, cost_basis, suggestion, margin_note } - suggest pricing adjustments based on margin, discount tiers, and competitive framing
3. improvement_notes: Array of general observations (string) about the catalog as a whole

Be specific and actionable. Use the exact product_id values from the catalog. Return ONLY valid JSON, no markdown fences.`;

async function runProductReview(request: Request) {
  if (!validateCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agentId = AGENT_IDS.PRODUCT_REVIEW;
  let status: "success" | "partial" | "failed" = "success";
  let error: string | null = null;
  let outputs: Record<string, unknown> = {};

  try {
    const catalog = loadCatalogForAgents();
    if (catalog.length === 0) {
      outputs = {
        products_to_review: [],
        pricing_suggestions: [],
        improvement_notes: ["No catalog data available."],
      };
      await recordRun(agentId, {
        summary: "Skipped - no catalog",
        outputs,
        status: "partial",
      });
      return NextResponse.json({ ok: true, outputs });
    }

    const catalogSummary = catalog.slice(0, 50).map((p) => ({
      product_id: p.product_id,
      name: p.name ?? p.slug,
      short_desc: String(p.short_desc ?? "").slice(0, 100),
      price_usd: p.price_usd,
      compare_at_price: p.compare_at_price,
      cost_basis: p.cost_basis,
      sample_available: p.sample_available ?? p.lead_magnet,
      category: p.category,
    }));

    const prompt = `Analyze this catalog and produce the JSON report. Catalog (first 50 products):\n\n${JSON.stringify(catalogSummary, null, 2)}`;

    const raw = await complete({
      system: SYSTEM_PROMPT,
      prompt,
      maxTokens: 4096,
    });

    let parsed: Record<string, unknown>;
    try {
      const cleaned = raw.replace(/^```json?\s*|\s*```$/g, "").trim();
      parsed = JSON.parse(cleaned) as Record<string, unknown>;
    } catch {
      parsed = {
        products_to_review: [],
        pricing_suggestions: [],
        improvement_notes: [`Parse error: ${raw.slice(0, 200)}`],
      };
      status = "partial";
    }

    outputs = {
      products_to_review: parsed.products_to_review ?? [],
      pricing_suggestions: parsed.pricing_suggestions ?? [],
      improvement_notes: parsed.improvement_notes ?? [],
    };

    const summary = `Reviewed ${catalog.length} products. ${Array.isArray(outputs.products_to_review) ? outputs.products_to_review.length : 0} to review, ${Array.isArray(outputs.pricing_suggestions) ? outputs.pricing_suggestions.length : 0} pricing suggestions.`;

    await recordRun(agentId, { summary, outputs, status });

    const reportContent = `# Product Improvement Report\n\n${summary}\n\n## Products to Review\n\n${JSON.stringify(outputs.products_to_review, null, 2)}\n\n## Pricing Suggestions\n\n${JSON.stringify(outputs.pricing_suggestions, null, 2)}\n\n## General Notes\n\n${JSON.stringify(outputs.improvement_notes, null, 2)}`;
    await saveReport(agentId, "product_review", reportContent);

    return NextResponse.json({ ok: true, summary, outputs });
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
    status = "failed";
    await recordRun(agentId, {
      summary: "Failed",
      outputs,
      status,
      error,
    });
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return runProductReview(request);
}

export async function POST(request: Request) {
  return runProductReview(request);
}
