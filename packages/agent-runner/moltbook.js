/**
 * Moltbook API adapter for Marketing Agent.
 * Moltbook is an agent-first social network. Set MOLTBOOK_AGENT_TOKEN.
 * MARKETING_AUTO_POST=true to actually post; otherwise drafts are queued for review.
 *
 * API docs: https://moltbook.com/developers (adapt when official API is available)
 */

export function isMoltbookConfigured() {
  return !!process.env.MOLTBOOK_AGENT_TOKEN;
}

export function isAutoPostEnabled() {
  return process.env.MARKETING_AUTO_POST === "true" || process.env.MARKETING_AUTO_POST === "1";
}

export async function postToMoltbook(submolt, content) {
  const token = process.env.MOLTBOOK_AGENT_TOKEN;
  if (!token) return { ok: false, error: "Moltbook not configured", draft: { submolt, content } };
  if (!isAutoPostEnabled()) return { ok: false, draft: { submolt, content } };

  try {
    const res = await fetch("https://api.moltbook.com/v1/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ submolt, content }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: err, draft: { submolt, content } };
    }

    const data = await res.json();
    return { ok: true, id: data.id };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
      draft: { submolt, content },
    };
  }
}
