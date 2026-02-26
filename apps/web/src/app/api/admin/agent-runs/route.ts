// @ts-nocheck
import { NextResponse } from "next/server";
import { getRecentRuns } from "@agent-artifacts/agent-runner";
import { validateAdminAccess } from "@/lib/agents";

export async function GET(request: Request) {
  if (!validateAdminAccess(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = Math.min(30, Math.max(1, Number(searchParams.get("days")) || 7));
  const agentId = searchParams.get("agent_id") || undefined;

  const runs = await getRecentRuns(days, agentId ? [agentId] : undefined);
  return NextResponse.json({ runs });
}
