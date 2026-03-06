import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compatibility Matrix",
  description: "Provider and framework adaptation rules. How to port any Agent Artifacts product between OpenAI, Anthropic, Cursor, and LangGraph.",
};

const MATRIX = [
  {
    feature: "System prompt",
    openai: "✅ messages[system]",
    anthropic: "✅ system param",
    cursor: "✅ .cursorrules / Rules",
    langchain: "✅ SystemMessage",
  },
  {
    feature: "Skill invocation",
    openai: "✅ function_call / tool_call",
    anthropic: "✅ tool_use block",
    cursor: "✅ /skill-name syntax",
    langchain: "✅ @tool decorator",
  },
  {
    feature: "Structured output",
    openai: "✅ response_format: json_object",
    anthropic: "✅ tool_use + input_schema",
    cursor: "⚠️ Prompt-enforced only",
    langchain: "✅ with_structured_output()",
  },
  {
    feature: "Multi-step agents",
    openai: "✅ Assistants API / Swarm",
    anthropic: "✅ claude-agent-sdk",
    cursor: "✅ Sub-agents via Agent tool",
    langchain: "✅ LangGraph StateGraph",
  },
  {
    feature: "Streaming",
    openai: "✅ stream=True",
    anthropic: "✅ stream=True",
    cursor: "✅ Native (IDE)",
    langchain: "✅ .stream()",
  },
  {
    feature: "Tool use / function calling",
    openai: "✅ tools[]",
    anthropic: "✅ tools[]",
    cursor: "⚠️ Via Agent tool only",
    langchain: "✅ bind_tools()",
  },
  {
    feature: "Context window (max)",
    openai: "200K (o3), 128K (4o)",
    anthropic: "200K (Claude 4)",
    cursor: "Varies by model",
    langchain: "Varies by model",
  },
  {
    feature: "Image / multimodal",
    openai: "✅ GPT-4o",
    anthropic: "✅ Claude 3+",
    cursor: "✅ Via model",
    langchain: "✅ Via model",
  },
];

export default function CompatibilityMatrixPage() {
  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <nav style={{ fontSize: "0.82rem", color: "var(--ink-muted)", marginBottom: "1rem" }}>
            <Link href="/docs-guides">Docs &amp; Guides</Link> / Compatibility Matrix
          </nav>
          <div className="section-label">Reference</div>
          <h1 style={{ marginBottom: "0.5rem" }}>Compatibility Matrix</h1>
          <p style={{ maxWidth: "580px", fontSize: "1rem" }}>
            Provider and framework adaptation rules. How to port any product between OpenAI, Anthropic, Cursor, and LangGraph without breaking contracts.
          </p>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "1rem" }}>
            {["OpenAI", "Anthropic", "Cursor", "LangChain", "LangGraph"].map((t) => <span key={t} className="badge badge-plain">{t}</span>)}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "900px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>

            {/* Matrix table */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Feature support matrix</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-alt)", borderBottom: "2px solid var(--border)" }}>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 700 }}>Feature</th>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 700 }}>OpenAI</th>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 700 }}>Anthropic</th>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 700 }}>Cursor</th>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 700 }}>LangChain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MATRIX.map((row, i) => (
                      <tr key={row.feature} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "white" : "transparent" }}>
                        <td style={{ padding: "0.65rem 1rem", fontWeight: 600 }}>{row.feature}</td>
                        <td style={{ padding: "0.65rem 1rem", color: "var(--ink-muted)" }}>{row.openai}</td>
                        <td style={{ padding: "0.65rem 1rem", color: "var(--ink-muted)" }}>{row.anthropic}</td>
                        <td style={{ padding: "0.65rem 1rem", color: "var(--ink-muted)" }}>{row.cursor}</td>
                        <td style={{ padding: "0.65rem 1rem", color: "var(--ink-muted)" }}>{row.langchain}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--ink-subtle)", marginTop: "0.5rem" }}>✅ = full support, ⚠️ = partial/workaround required, ❌ = not supported</p>
            </section>

            {/* Porting rules */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Porting between providers</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                <div className="content-block">
                  <div style={{ fontWeight: 700, marginBottom: "0.75rem" }}>OpenAI → Anthropic</div>
                  <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.875rem" }}>
                    <li>Move <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>messages[0].role="system"</code> content to the <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>system</code> parameter</li>
                    <li>Convert <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>function_call</code> definitions to Anthropic <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>tools</code> format (input_schema is JSON Schema)</li>
                    <li>Replace <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>role: "tool"</code> messages with <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>role: "user"</code> with <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>tool_result</code> blocks</li>
                    <li>Remove <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>response_format: json_object</code> — use a tool with structured input_schema instead</li>
                  </ul>
                </div>

                <div className="content-block">
                  <div style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Anthropic → OpenAI</div>
                  <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.875rem" }}>
                    <li>Move the <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>system</code> parameter to <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>messages[0]</code> with <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>role: "system"</code></li>
                    <li>Convert <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>tool_use</code> blocks to OpenAI <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>function</code> format</li>
                    <li>Rename <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>input_schema</code> → <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>parameters</code> in tool definitions</li>
                    <li>Use <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>response_format: json_object</code> if structured output is needed without tool use</li>
                  </ul>
                </div>

                <div className="content-block">
                  <div style={{ fontWeight: 700, marginBottom: "0.75rem" }}>API → Cursor / Claude Code</div>
                  <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.875rem" }}>
                    <li>System prompts become <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>CLAUDE.md</code> or <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>.cursorrules</code> files</li>
                    <li>Tool definitions become skill files installed to <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.3em", borderRadius: "3px" }}>.claude/skills/</code></li>
                    <li>Remove JSON output format enforcement — IDE agents respond in natural language by default</li>
                    <li>Multi-step pipelines become sequential prompts in an IDE session</li>
                  </ul>
                </div>

              </div>
            </section>

            {/* Model selection */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Model selection guide</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-alt)", borderBottom: "2px solid var(--border)" }}>
                      <th style={{ padding: "0.65rem 1rem", textAlign: "left" }}>Use case</th>
                      <th style={{ padding: "0.65rem 1rem", textAlign: "left" }}>Recommended model</th>
                      <th style={{ padding: "0.65rem 1rem", textAlign: "left" }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { use: "Complex agents, multi-step reasoning", model: "claude-opus-4-6 / o3", notes: "Best capability, higher cost" },
                      { use: "High-volume production pipelines", model: "claude-sonnet-4-6 / gpt-4o", notes: "Balanced speed + capability" },
                      { use: "Simple prompts, fast classification", model: "claude-haiku-4-5 / gpt-4o-mini", notes: "Lowest latency + cost" },
                      { use: "Code generation, IDE agents", model: "claude-sonnet-4-6 (Claude Code)", notes: "Best code + tool-use combo" },
                      { use: "Trading execution agents", model: "claude-opus-4-6 or o3", notes: "Use most capable model for high-stakes decisions" },
                    ].map((row, i) => (
                      <tr key={row.use} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "white" : "transparent" }}>
                        <td style={{ padding: "0.65rem 1rem", fontWeight: 500 }}>{row.use}</td>
                        <td style={{ padding: "0.65rem 1rem" }}><code style={{ background: "var(--bg-alt)", padding: "0.1em 0.4em", borderRadius: "4px", fontSize: "0.8rem" }}>{row.model}</code></td>
                        <td style={{ padding: "0.65rem 1rem", color: "var(--ink-muted)", fontSize: "0.85rem" }}>{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Known limitations */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Known limitations</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[
                  { platform: "Cursor", issue: "No programmatic tool routing — all tool use is mediated by the IDE's agent loop" },
                  { platform: "LangChain", issue: "Prompt template syntax ({{variable}}) conflicts with Python format strings — use template variables or escape braces" },
                  { platform: "OpenAI Assistants", issue: "Assistants persist conversation state across runs — reset thread ID between independent tasks" },
                  { platform: "All", issue: "Model outputs are non-deterministic — do not rely on exact output format without schema validation or structured output mode" },
                ].map((item) => (
                  <div key={item.platform} style={{ display: "flex", gap: "0.75rem", padding: "0.65rem 0.75rem", background: "var(--amber-light)", border: "1px solid rgba(146,64,14,0.2)", borderRadius: "var(--r-sm)" }}>
                    <span style={{ fontWeight: 700, color: "var(--amber)", fontSize: "0.82rem", flexShrink: 0 }}>{item.platform}</span>
                    <span style={{ fontSize: "0.85rem" }}>{item.issue}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Next steps */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Next steps</h2>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link href="/docs-guides/quick-integration" className="btn btn-primary">Quick Integration →</Link>
                <Link href="/docs-guides/skill-module" className="btn btn-outline">Skill Module Guide</Link>
                <Link href="/api-registry" className="btn btn-outline">API &amp; Schema Reference</Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
