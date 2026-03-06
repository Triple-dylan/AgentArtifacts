import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Agent Builder Guide",
  description: "How to assemble prompts, skills, and agents into production workflows. Covers input/output contracts, handoff patterns, and error handling.",
};

export default function AgentBuilderGuidePage() {
  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container" style={{ maxWidth: "820px" }}>
          <nav style={{ fontSize: "0.82rem", color: "var(--ink-muted)", marginBottom: "1rem" }}>
            <Link href="/docs-guides">Docs &amp; Guides</Link> / Agent Builder Guide
          </nav>
          <div className="section-label">Guide</div>
          <h1 style={{ marginBottom: "0.5rem" }}>Agent Builder Guide</h1>
          <p style={{ maxWidth: "580px", fontSize: "1rem" }}>
            How to assemble prompts, skills, and agents from the catalog into production-grade workflows — including IO contracts, handoff patterns, and error handling.
          </p>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "1rem" }}>
            {["Prompt", "Skill", "Agent", "Workflow"].map((t) => <span key={t} className="badge badge-plain">{t}</span>)}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "820px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>

            {/* Overview */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>How Agent Artifacts are structured</h2>
              <p style={{ marginBottom: "0.75rem" }}>
                Every product in the catalog is a machine-readable file (Markdown, JSON, or YAML) with a defined structure. Products come in five types — prompts, skills, agents, utilities, and docs — and each type plays a distinct role in a workflow stack.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem", marginTop: "1rem" }}>
                {[
                  { type: "Prompt", role: "Single-turn or multi-turn instructions. The top of the call stack.", color: "var(--cat-prompt)" },
                  { type: "Skill", role: "SKILL.md modules with defined input/output schema. Callable tool units.", color: "var(--cat-skill)" },
                  { type: "Agent", role: "Orchestrated workflows with a manifest, task loop, and handoff rules.", color: "var(--cat-agent)" },
                  { type: "Utility", role: "JSON schemas, validators, and glue code between components.", color: "var(--cat-utility)" },
                  { type: "Doc", role: "Playbooks, SOP templates, and reference guides for runtime decisions.", color: "var(--cat-doc)" },
                ].map((item) => (
                  <div key={item.type} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "0.85rem" }}>
                    <div style={{ fontWeight: 700, color: item.color, fontSize: "0.85rem", marginBottom: "0.3rem" }}>{item.type}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--ink-muted)" }}>{item.role}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* IO Contracts */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Input/output contracts</h2>
              <p style={{ marginBottom: "0.75rem" }}>
                Every skill and agent product ships with an IO contract — a JSON schema specifying the exact inputs it expects and the outputs it produces. Before connecting two products, verify their contracts are compatible.
              </p>
              <div className="content-block" style={{ marginBottom: "0.75rem" }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.6rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Input contract structure</div>
                <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "1rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{`{
  "input_schema": {
    "required": ["context", "task"],
    "optional": ["tone", "max_tokens", "examples"],
    "types": {
      "context": "string",
      "task": "string",
      "tone": "enum:professional|casual|technical",
      "max_tokens": "integer"
    }
  }
}`}</pre>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)" }}>
                Replace <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.4em", borderRadius: "4px" }}>{"{{placeholder}}"}</code> tokens in prompt files before passing to your LLM. All tokens are listed in the product's manifest section.
              </p>
            </section>

            {/* Composition patterns */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Composition patterns</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                <div className="content-block">
                  <div style={{ fontWeight: 700, marginBottom: "0.4rem" }}>Pattern 1: Prompt → Skill chain</div>
                  <p style={{ fontSize: "0.875rem", marginBottom: "0.75rem" }}>Use a system prompt to establish context and persona, then invoke skills for discrete sub-tasks within the same session.</p>
                  <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "0.85rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{`system_prompt.md        → establishes role + constraints
  ↓ call
/skill-name {input}     → discrete tool-use unit
  ↓ output
next_prompt.md          → uses skill output as context`}</pre>
                </div>

                <div className="content-block">
                  <div style={{ fontWeight: 700, marginBottom: "0.4rem" }}>Pattern 2: Agent orchestrator</div>
                  <p style={{ fontSize: "0.875rem", marginBottom: "0.75rem" }}>A top-level agent manifest routes sub-tasks to specialized skills. The agent decides which skill to call based on task type.</p>
                  <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "0.85rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{`agent-manifest.md
  ├── task: "research"    → research-skill.md
  ├── task: "draft"       → writer-skill.md
  ├── task: "review"      → qa-skill.md
  └── task: "publish"     → publish-skill.md`}</pre>
                </div>

                <div className="content-block">
                  <div style={{ fontWeight: 700, marginBottom: "0.4rem" }}>Pattern 3: Prompt suite → pipeline</div>
                  <p style={{ fontSize: "0.875rem", marginBottom: "0.75rem" }}>Chain multiple system prompts in sequence, passing the output of each as the input context of the next. Use a utility schema to validate each handoff.</p>
                  <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "0.85rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{`step-1-intake.md        → structured JSON output
  ↓ validate with io-schema.json
step-2-analysis.md      → uses JSON as context
  ↓ validate
step-3-output.md        → final formatted response`}</pre>
                </div>

              </div>
            </section>

            {/* Handoff patterns */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Handoff patterns</h2>
              <p style={{ marginBottom: "0.75rem" }}>When passing output between components, use structured handoffs to avoid context drift.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { title: "Structured JSON handoff", body: "Always request JSON output from intermediate steps. Parse and validate before passing downstream. Include a \"status\" field so downstream components know whether to proceed or escalate." },
                  { title: "Context window management", body: "Large pipelines can overflow the context window. Pass only the essential structured output from each step, not the full conversation history. Each component should be self-contained." },
                  { title: "Role boundary enforcement", body: "Each component in a chain should stay within its defined role. Use the system prompt to hard-constrain behavior. If a downstream component needs the upstream role, pass it as a context string, not as a new system prompt." },
                  { title: "Explicit output format instruction", body: "End every prompt with an explicit output format instruction. E.g. \"Respond with a JSON object matching {field: type, ...}. No commentary, no markdown wrapping.\"" },
                ].map((item) => (
                  <div key={item.title} style={{ borderLeft: "3px solid var(--green)", paddingLeft: "1rem" }}>
                    <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{item.title}</div>
                    <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)" }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Error handling */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Error handling</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { code: "SCHEMA_MISMATCH", desc: "Output from upstream component does not match downstream input schema. Fix: add a validation step between components or relax the downstream schema." },
                  { code: "CONTEXT_OVERFLOW", desc: "Combined context length exceeds model limit. Fix: trim history to essential structured data, use summarization prompt before next step." },
                  { code: "HALLUCINATED_TOOL", desc: "Model invokes a skill that does not exist or uses wrong syntax. Fix: explicitly list available skills in system prompt and use strict tool-calling mode." },
                  { code: "RETRY_LOOP", desc: "Component fails and retries indefinitely. Fix: set explicit retry limits (typically 2–3) with exponential backoff, then escalate to human-in-the-loop or fallback response." },
                  { code: "DISCLOSURE_MISSING", desc: "Trading product invoked without risk disclosure acknowledgement. Fix: gate all trading skill invocations behind a disclosure check — see the Trading Risk Playbook." },
                ].map((item) => (
                  <div key={item.code} style={{ display: "flex", gap: "1rem", padding: "0.75rem", background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-sm)" }}>
                    <code style={{ background: "var(--red-light)", color: "var(--red)", padding: "0.2em 0.5em", borderRadius: "4px", fontSize: "0.78rem", fontWeight: 700, flexShrink: 0, alignSelf: "flex-start" }}>{item.code}</code>
                    <p style={{ fontSize: "0.85rem", margin: 0 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Next steps */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Next steps</h2>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link href="/docs-guides/skill-module" className="btn btn-primary">Skill Module Integration →</Link>
                <Link href="/docs-guides/quick-integration" className="btn btn-outline">Quick Integration</Link>
                <Link href="/catalog?category=agent" className="btn btn-outline">Browse Agents</Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
