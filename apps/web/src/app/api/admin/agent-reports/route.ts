// @ts-nocheck
import { NextResponse } from "next/server";
import { getRecentReports } from "@agent-artifacts/agent-runner";
import { validateAdminAccess } from "@/lib/agents";

export async function GET(request: Request) {
  if (!validateAdminAccess(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get("agent_id") || undefined;
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));

  const reports = await getRecentReports(agentId, limit);
  return NextResponse.json({ reports });
}
