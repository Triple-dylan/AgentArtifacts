// @ts-nocheck
import { NextResponse } from "next/server";
import { complete, getRecentRuns, saveReport, recordRun } from "@agent-artifacts/agent-runner";
import { validateCronSecret, AGENT_IDS } from "@/lib/agents";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are the Executive Agent for Agent Artifacts, an agent-run store selling AI prompts, skills, and agents. Your job is to review the outputs of the Marketing, SEO/Blog, and Product Improvement agents over the past week.

Produce a structured markdown report with:
1. **Executive Summary** - 2-3 sentences on overall agent swarm health
2. **Marketing Agent** - What was posted/replied, quality assessment, any risks (off-brand, tone)
3. **SEO/Blog Agent** - Content published, newsletter sent, SEO relevance
4. **Product Improvement Agent** - Key recommendations, pricing suggestions quality
5. **Risks & Corrective Actions** - Flag issues and suggest what to fix
6. **Next Week** - Priorities for each agent

Be concise and actionable.`;

async function runExecutive(request: Request) {
  if (!validateCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agentId = AGENT_IDS.EXECUTIVE;
  const agentIds = [AGENT_IDS.MARKETING, AGENT_IDS.SEO_BLOG, AGENT_IDS.PRODUCT_REVIEW];

  try {
    const runs = await getRecentRuns(7, agentIds);
    const runsContext = runs.length > 0
      ? JSON.stringify(runs.map((r) => ({
          agent_id: r.agent_id,
          started_at: r.started_at,
          status: r.status,
          summary: r.summary,
          outputs: r.outputs,
          error: r.error,
        })), null, 2)
      : "No agent runs in the past 7 days. (Agents may not have run yet.)";

    const prompt = `Review these agent runs and produce the markdown report:\n\n${runsContext}`;

    const reportContent = await complete({
      system: SYSTEM_PROMPT,
      prompt,
      maxTokens: 4096,
    });

    await saveReport(agentId, "executive_weekly", reportContent);
    await recordRun(agentId, {
      summary: `Reviewed ${runs.length} runs from Marketing, SEO, Product agents`,
      outputs: { run_count: runs.length, report_preview: reportContent.slice(0, 500) },
      status: "success",
    });

    return NextResponse.json({
      ok: true,
      summary: `Executive report saved. ${runs.length} runs reviewed.`,
      report_preview: reportContent.slice(0, 300),
    });
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    await recordRun(agentId, {
      summary: "Failed",
      outputs: {},
      status: "failed",
      error,
    });
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return runExecutive(request);
}

export async function POST(request: Request) {
  return runExecutive(request);
}
