import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quick Integration Guide",
  description: "Get up and running with Agent Artifacts in under 30 minutes. Copy-paste patterns for OpenAI, Anthropic, Cursor, and LangChain.",
};

export default function QuickIntegrationPage() {
  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container" style={{ maxWidth: "820px" }}>
          <nav style={{ fontSize: "0.82rem", color: "var(--ink-muted)", marginBottom: "1rem" }}>
            <Link href="/docs-guides">Docs &amp; Guides</Link> / Quick Integration
          </nav>
          <div className="section-label">Guide</div>
          <h1 style={{ marginBottom: "0.5rem" }}>Quick Integration</h1>
          <p style={{ maxWidth: "580px", fontSize: "1rem" }}>
            Get up and running in under 30 minutes. Copy-paste integration patterns for every supported platform.
          </p>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "1rem" }}>
            {["OpenAI", "Anthropic", "Cursor", "LangChain"].map((t) => <span key={t} className="badge badge-plain">{t}</span>)}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "820px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>

            {/* Step 1 */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Step 1 — Download and open your file</h2>
              <p style={{ marginBottom: "0.75rem" }}>After purchase, download your <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.4em", borderRadius: "4px" }}>.md</code> file from the success page or your account. Open it in any text editor.</p>
              <p style={{ marginBottom: "0.75rem" }}>Every file has this structure at the top:</p>
              <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "1rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{`---
product_id: AA-XXX
name: Product Name
category: prompt | skill | agent | utility | doc
version: 1.0.0
compatibility: openai, anthropic, cursor, langchain
---

# Product Name

## System Prompt / Skill Definition / ...`}</pre>
              <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)", marginTop: "0.75rem" }}>Find and replace all <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.4em", borderRadius: "4px" }}>{"{{placeholder}}"}</code> tokens before using. Every required token is listed in the manifest section of the file.</p>
            </section>

            {/* Anthropic / Claude */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Anthropic — Claude API</h2>
              <p style={{ marginBottom: "0.75rem" }}>Paste the file content as your system prompt. Works with all Claude models.</p>
              <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "1rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{`import anthropic
import pathlib

client = anthropic.Anthropic()
system_prompt = pathlib.Path("your-product.md").read_text()

message = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=4096,
    system=system_prompt,
    messages=[{"role": "user", "content": "Your task here"}]
)
print(message.content[0].text)`}</pre>
              <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)", marginTop: "0.75rem" }}>For skill modules, use the tool_use feature. Pass the skill's IO schema as a tool definition and call it by name.</p>
            </section>

            {/* Claude Code / Cursor */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Claude Code &amp; Cursor — Skills</h2>
              <p style={{ marginBottom: "0.75rem" }}>Skill (.md) files install directly into your IDE agent environment.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="content-block">
                  <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Claude Code</div>
                  <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "0.85rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{`# Install
cp your-skill.md ~/.claude/skills/skill-name.md

# Invoke in any Claude Code session
/skill-name {your input here}`}</pre>
                </div>
                <div className="content-block">
                  <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Cursor</div>
                  <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "0.85rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{`# Add to .cursor/rules/ or reference in Cursor Rules
cp your-skill.md .cursor/rules/skill-name.md

# Or paste directly as a Cursor Rule in Settings → Rules`}</pre>
                </div>
              </div>
            </section>

            {/* OpenAI */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>OpenAI — API &amp; Assistants</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="content-block">
                  <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Chat Completions API</div>
                  <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "0.85rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{`from openai import OpenAI
import pathlib

client = OpenAI()
system_prompt = pathlib.Path("your-product.md").read_text()

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "Your task here"}
    ]
)`}</pre>
                </div>
                <div className="content-block">
                  <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Assistants API</div>
                  <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "0.85rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{`# Create an assistant with your product as instructions
assistant = client.beta.assistants.create(
    name="My Agent",
    instructions=system_prompt,  # your .md file content
    model="gpt-4o",
    tools=[{"type": "code_interpreter"}]
)`}</pre>
                </div>
              </div>
            </section>

            {/* LangChain */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>LangChain &amp; LangGraph</h2>
              <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "1rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{`from langchain_core.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic
import pathlib

system_prompt = pathlib.Path("your-product.md").read_text()

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}")
])

model = ChatAnthropic(model="claude-opus-4-6")
chain = prompt | model

result = chain.invoke({"input": "Your task here"})`}</pre>
              <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)", marginTop: "0.75rem" }}>For LangGraph agents, assign the product as the system message for a specific node. Skill modules map naturally to LangGraph tool nodes.</p>
            </section>

            {/* Direct use */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Direct use — ChatGPT, Claude.ai</h2>
              <p>For no-code use: open the .md file, copy the content below the frontmatter divider (<code style={{ background: "var(--bg-alt)", padding: "0.1em 0.4em", borderRadius: "4px" }}>---</code>), and paste into a new conversation as the first message or as a custom instructions / project instructions block.</p>
            </section>

            {/* Next steps */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Next steps</h2>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link href="/docs-guides/agent-builder" className="btn btn-primary">Agent Builder Guide →</Link>
                <Link href="/docs-guides/compatibility-matrix" className="btn btn-outline">Compatibility Matrix</Link>
                <Link href="/catalog" className="btn btn-outline">Browse Catalog</Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
