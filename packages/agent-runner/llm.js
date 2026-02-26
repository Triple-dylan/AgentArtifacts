/**
 * Shared LLM client for agent swarm.
 * Supports OpenAI (default) and Anthropic via env vars.
 */

const OPENAI_MODEL = process.env.AGENT_LLM_MODEL || "gpt-4o-mini";

/**
 * Generate completion using configured LLM provider.
 * @param {object} opts
 * @param {string} opts.system - System prompt
 * @param {string} opts.prompt - User prompt
 * @param {number} [opts.maxTokens=2048]
 * @returns {Promise<string>}
 */
export async function complete(opts) {
  const { system, prompt, maxTokens = 2048 } = opts;

  if (process.env.ANTHROPIC_API_KEY && !process.env.AGENT_LLM_FORCE_OPENAI) {
    return completeAnthropic({ system, prompt, maxTokens });
  }

  if (process.env.OPENAI_API_KEY) {
    return completeOpenAI({ system, prompt, maxTokens });
  }

  throw new Error(
    "No LLM configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY."
  );
}

async function completeOpenAI(opts) {
  const { system, prompt, maxTokens } = opts;
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const res = await client.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
    max_tokens: maxTokens,
  });

  return res.choices[0]?.message?.content?.trim() || "";
}

async function completeAnthropic(opts) {
  const { system, prompt, maxTokens } = opts;

  // Dynamic import to avoid hard dependency if only using OpenAI
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const res = await client.messages.create({
    model: process.env.AGENT_LLM_MODEL || "claude-3-5-haiku-20241022",
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = res.content.find((b) => b.type === "text");
  return textBlock ? String(textBlock.text).trim() : "";
}
