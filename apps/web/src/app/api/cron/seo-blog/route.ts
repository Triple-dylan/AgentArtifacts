import { NextResponse } from "next/server";
import {
  complete,
  recordRun,
  saveReport,
  saveBlogPost,
} from "@agent-artifacts/agent-runner";
import { validateCronSecret, loadCatalogForAgents, AGENT_IDS } from "@/lib/agents";

export const maxDuration = 60;

const BLOG_SYSTEM_PROMPT = `You are the SEO/Blog Agent for Agent Artifacts, a store selling AI prompts, skills, and agents for AI builders. The store is agent-run—an agent operates it. Write an SEO-optimized blog post.

Return a JSON object with exactly these keys:
- slug: URL-friendly slug (lowercase, hyphens, no spaces)
- title: H1 title (60 chars max for SEO)
- excerpt: 1-2 sentence summary (155 chars max for meta)
- content: Full markdown body with H2/H3 structure, 800-1200 words
- meta_title: SEO title (60 chars max)
- meta_description: Meta description (155 chars max)
- primary_keyword: Main target keyword

Focus on: agents, skills, AI builders, automation, Cursor, LangChain, use cases. Mention the store as "an agent-run store for agents and builders." Include a clear CTA to visit agentartifacts.io. Return ONLY valid JSON, no markdown fences.`;

const NEWSLETTER_SYSTEM_PROMPT = `You are the SEO/Blog Agent writing the weekly Agent Artifacts newsletter. Topics: agents, skills, AI automation, store updates.

Return a JSON object:
- subject: Email subject line (under 60 chars)
- html_body: HTML email content (headings, paragraphs, links). Include:
  - Brief intro on the week in agents/skills
  - 2-3 store highlights (new products, bundles)
  - CTA to agentartifacts.io
- plain_text: Plain text version (strip HTML)

Return ONLY valid JSON, no markdown fences.`;

async function runSeoBlog(request: Request) {
  if (!validateCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agentId = AGENT_IDS.SEO_BLOG;
  const outputs: Record<string, unknown> = {};
  let status: "success" | "partial" | "failed" = "success";
  let error: string | null = null;

  try {
    const catalog = loadCatalogForAgents();
    const storeContext = catalog.length > 0
      ? `Store has ${catalog.length} products. Sample: ${catalog.slice(0, 3).map((p) => (p.name as string)).join(", ")}.`
      : "Store catalog available at agentartifacts.io";

    const blogPrompt = `Write a weekly SEO blog post. Context: ${storeContext}. Topic: pick something timely for AI agents and builders (e.g. "Building Agent Skills for Cursor", "How to Use LangChain with Agent Artifacts").`;

    const blogRaw = await complete({
      system: BLOG_SYSTEM_PROMPT,
      prompt: blogPrompt,
      maxTokens: 4096,
    });

    let blogPost: Record<string, string>;
    try {
      const cleaned = blogRaw.replace(/^```json?\s*|\s*```$/g, "").trim();
      blogPost = JSON.parse(cleaned) as Record<string, string>;
    } catch {
      blogPost = {
        slug: `blog-${Date.now()}`,
        title: "Agents and Skills for AI Builders",
        excerpt: "Explore how agent artifacts help you build better AI workflows.",
        content: blogRaw || "# Placeholder\n\nContent could not be parsed.",
        meta_title: "Agents and Skills for AI Builders | Agent Artifacts",
        meta_description: "Explore agent artifacts for AI builders.",
        primary_keyword: "agent skills",
      };
      status = "partial";
    }

    const saved = await saveBlogPost(blogPost);
    outputs.blog_post = saved
      ? { slug: saved.slug, title: saved.title }
      : { skipped: "no DB" };

    await saveReport(agentId, "blog_post", blogPost.content || "");

    const newsletterPrompt = `Write this week's newsletter. Store context: ${storeContext}.`;
    const newsletterRaw = await complete({
      system: NEWSLETTER_SYSTEM_PROMPT,
      prompt: newsletterPrompt,
      maxTokens: 2048,
    });

    let newsletter: Record<string, string>;
    try {
      const cleaned = newsletterRaw.replace(/^```json?\s*|\s*```$/g, "").trim();
      newsletter = JSON.parse(cleaned) as Record<string, string>;
    } catch {
      newsletter = {
        subject: "Agent Artifacts Weekly",
        html_body: "<p>Newsletter content could not be parsed.</p>",
        plain_text: "Newsletter content could not be parsed.",
      };
    }

    if (process.env.RESEND_API_KEY) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.NEWSLETTER_FROM || "Agent Artifacts <news@agentartifacts.io>",
            to: process.env.NEWSLETTER_AUDIENCE || "subscribers@agentartifacts.io",
            subject: newsletter.subject,
            html: newsletter.html_body,
            text: newsletter.plain_text,
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as { id?: string };
          outputs.newsletter_sent = true;
          outputs.newsletter_id = data.id;
        } else {
          outputs.newsletter_sent = false;
          outputs.newsletter_error = await res.text();
          status = "partial";
        }
      } catch (e) {
        outputs.newsletter_sent = false;
        outputs.newsletter_error = e instanceof Error ? e.message : String(e);
        status = "partial";
      }
    } else {
      outputs.newsletter_sent = false;
      outputs.newsletter_skipped = "RESEND_API_KEY not set";
    }

    const summary = `Blog: ${blogPost.slug}. Newsletter: ${outputs.newsletter_sent ? "sent" : "skipped"}.`;
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
  return runSeoBlog(request);
}

export async function POST(request: Request) {
  return runSeoBlog(request);
}
