// @ts-nocheck
import { NextResponse } from "next/server";
import {
  complete,
  recordRun,
} from "@agent-artifacts/agent-runner";
import {
  postTweet,
  searchTweets,
  replyToTweet,
  isTwitterConfigured,
  isTwitterAutoPostEnabled,
} from "@agent-artifacts/agent-runner";
import {
  postToMoltbook,
  isMoltbookConfigured,
} from "@agent-artifacts/agent-runner";
import { validateCronSecret, loadCatalogForAgents, AGENT_IDS } from "@/lib/agents";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are the Marketing Agent for Agent Artifacts—an agent-run store selling AI prompts, skills, and agents for AI builders. Key virality angle: "A store run by an agent, selling agents and skills for agents and builders."

Generate content for social media. Return JSON with:
- tweets: Array of 1-2 original tweet texts (max 280 chars each). Highlight products, the agent-run angle, new releases.
- moltbook_post: One post for Moltbook (agent social network). submolt: "m/agent_builders" or similar, content: post text.
- reply_drafts: Array of { query, tweet_text_sample, reply_text } - suggestions for replying to relevant tweets. reply_text max 280 chars.

Be authentic, helpful, not spammy. Mention agentartifacts.io. Return ONLY valid JSON.`;

async function runMarketing(request: Request) {
  if (!validateCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agentId = AGENT_IDS.MARKETING;
  const outputs: Record<string, unknown> = {
    tweets_posted: [],
    replies_sent: [],
    moltbook_posts: [],
    drafts: [],
  };
  let status: "success" | "partial" | "failed" = "success";
  let error: string | null = null;

  try {
    const catalog = loadCatalogForAgents();
    const storeContext = catalog.length > 0
      ? `Store has ${catalog.length} products. Sample: ${catalog.slice(0, 5).map((p) => (p.name as string)).join(", ")}.`
      : "Store at agentartifacts.io";

    const prompt = `Generate today's marketing content. ${storeContext}`;
    const raw = await complete({
      system: SYSTEM_PROMPT,
      prompt,
      maxTokens: 2048,
    });

    let parsed: {
      tweets?: string[];
      moltbook_post?: { submolt: string; content: string };
      reply_drafts?: Array<{ query: string; tweet_text_sample: string; reply_text: string }>;
    };
    try {
      const cleaned = raw.replace(/^```json?\s*|\s*```$/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      outputs.drafts = outputs.drafts as unknown[];
      (outputs.drafts as unknown[]).push({ parse_error: raw.slice(0, 200) });
      await recordRun(agentId, {
        summary: "Failed to parse LLM output",
        outputs,
        status: "failed",
      });
      return NextResponse.json({ ok: false, error: "Parse error", outputs }, { status: 500 });
    }

    const tweets = parsed.tweets ?? [];
    for (const text of tweets) {
      if (!text || text.length > 280) continue;
      const result = await postTweet(text);
      if (result.ok && result.id) {
        (outputs.tweets_posted as { id: string; text: string }[]).push({ id: result.id, text });
      } else {
        (outputs.drafts as { type: string; text: string }[]).push({ type: "tweet", text });
      }
    }

    const molt = parsed.moltbook_post;
    if (molt?.submolt && molt?.content) {
      const result = await postToMoltbook(molt.submolt, molt.content);
      if (result.ok) {
        (outputs.moltbook_posts as { id: string }[]).push({ id: result.id });
      } else {
        (outputs.drafts as unknown[]).push({ type: "moltbook", ...molt });
      }
    }

    const replyDrafts = parsed.reply_drafts ?? [];
    if (isTwitterConfigured() && isTwitterAutoPostEnabled() && replyDrafts.length > 0) {
      const query = replyDrafts[0]?.query ?? "AI agents OR agent skills";
      const searchResult = await searchTweets(query, 5);
      if (searchResult.ok && searchResult.tweets?.length) {
        const firstTweet = searchResult.tweets[0];
        const draft = replyDrafts.find(
          (d) => firstTweet.text && d.reply_text
        ) ?? replyDrafts[0];
        if (draft?.reply_text && firstTweet?.id) {
          const replyResult = await replyToTweet(firstTweet.id, draft.reply_text);
          if (replyResult.ok) {
            (outputs.replies_sent as { id: string }[]).push({ id: replyResult.id });
          }
        }
      }
    } else if (replyDrafts.length > 0) {
      (outputs.drafts as unknown[]).push({ type: "replies", drafts: replyDrafts });
    }

    const summary = `Tweets: ${(outputs.tweets_posted as unknown[]).length}, Moltbook: ${(outputs.moltbook_posts as unknown[]).length}, Replies: ${(outputs.replies_sent as unknown[]).length}. Auto-post: ${isAutoPostEnabled()}.`;
    await recordRun(agentId, { summary, outputs, status });

    return NextResponse.json({
      ok: true,
      summary,
      outputs,
    });
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
    status = "failed";
    await recordRun(agentId, { summary: "Failed", outputs, status, error });
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return runMarketing(request);
}

export async function POST(request: Request) {
  return runMarketing(request);
}
