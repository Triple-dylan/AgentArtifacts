import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Skill Module Integration",
  description: "How to install and invoke SKILL.md modules, handle tool routing, validate IO, and wire error retry patterns into your agent stack.",
};

export default function SkillModulePage() {
  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container" style={{ maxWidth: "820px" }}>
          <nav style={{ fontSize: "0.82rem", color: "var(--ink-muted)", marginBottom: "1rem" }}>
            <Link href="/docs-guides">Docs &amp; Guides</Link> / Skill Module Integration
          </nav>
          <div className="section-label">Guide</div>
          <h1 style={{ marginBottom: "0.5rem" }}>Skill Module Integration</h1>
          <p style={{ maxWidth: "580px", fontSize: "1rem" }}>
            How to install and invoke SKILL.md modules, handle tool routing, validate IO, and wire error retry patterns into your agent stack.
          </p>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "1rem" }}>
            {["Skill", "Tool Use", "SKILL.md", "Claude Code"].map((t) => <span key={t} className="badge badge-plain">{t}</span>)}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "820px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>

            {/* What is a skill */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>What is a SKILL.md module?</h2>
              <p style={{ marginBottom: "0.75rem" }}>A SKILL.md file is a self-contained, callable unit of AI capability. It defines:</p>
              <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.75rem" }}>
                <li>A skill name and invocation syntax</li>
                <li>The input parameters it accepts (required + optional)</li>
                <li>The output format it produces</li>
                <li>Error conditions and fallback behavior</li>
                <li>Compatibility notes (which models/frameworks support it)</li>
              </ul>
              <p>Skills are the composable building blocks of agent workflows. A single agent might call 5–10 skills in sequence or in parallel depending on the task.</p>
            </section>

            {/* File structure */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>SKILL.md file structure</h2>
              <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "1rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{`---
skill_id: AA-SKL-001
name: skill-name
version: 1.0.0
compatibility: claude-code, cursor, openai-functions, langchain-tools
---

# SKILL: skill-name

## Invocation
\`\`\`
/skill-name {required_param} [optional_param]
\`\`\`

## Input Schema
| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| required_param | string | yes | Description of what this is |
| optional_param | string | no  | Defaults to X if omitted    |

## Output Schema
\`\`\`json
{
  "status": "success | error | retry",
  "result": "...",
  "metadata": { "confidence": 0.0–1.0, "tokens_used": int }
}
\`\`\`

## Error Conditions
- MISSING_PARAM: required_param not provided
- INVALID_TYPE: param type mismatch
- TIMEOUT: execution exceeded 30s

## System Prompt
[The actual skill instructions for the LLM]`}</pre>
            </section>

            {/* Installation */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Installation</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="content-block">
                  <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Claude Code (recommended)</div>
                  <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "0.85rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{`# Single skill
cp your-skill.md ~/.claude/skills/

# Multiple skills from a bundle
cp bundle-folder/*.md ~/.claude/skills/

# Verify installation
ls ~/.claude/skills/`}</pre>
                  <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", marginTop: "0.5rem" }}>Skills are auto-discovered by Claude Code on startup. Restart the session after adding new skills.</p>
                </div>

                <div className="content-block">
                  <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Project-scoped skills</div>
                  <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "0.85rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{`# Install to project scope (takes precedence over global)
mkdir -p .claude/skills/
cp your-skill.md .claude/skills/

# Skills in .claude/skills/ are project-scoped
# Only available when Claude Code runs from this directory`}</pre>
                </div>
              </div>
            </section>

            {/* Invocation */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Invocation patterns</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  {
                    title: "Direct invocation",
                    code: `# Basic call\n/skill-name "your input"\n\n# With named params\n/skill-name context="your context" task="specific task"`,
                  },
                  {
                    title: "Chained invocation",
                    code: `# Output of one skill as input to next\nresult = /skill-a "input"\n/skill-b context={result.output} task="next step"`,
                  },
                  {
                    title: "Conditional invocation",
                    code: `# Route to different skills based on task type\nif task_type == "research":\n  /research-skill {input}\nelif task_type == "draft":\n  /writer-skill {input}`,
                  },
                ].map((item) => (
                  <div key={item.title} className="content-block">
                    <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>{item.title}</div>
                    <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "0.85rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{item.code}</pre>
                  </div>
                ))}
              </div>
            </section>

            {/* IO Validation */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>IO validation</h2>
              <p style={{ marginBottom: "0.75rem" }}>Always validate skill outputs before passing them to the next step. Each skill ships with a JSON schema you can use for programmatic validation.</p>
              <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "1rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{`import jsonschema
import json

output_schema = {
    "type": "object",
    "required": ["status", "result"],
    "properties": {
        "status": {"type": "string", "enum": ["success", "error", "retry"]},
        "result": {"type": "string"},
        "metadata": {"type": "object"}
    }
}

skill_output = json.loads(raw_output)
jsonschema.validate(skill_output, output_schema)  # raises if invalid

if skill_output["status"] == "error":
    handle_error(skill_output)
elif skill_output["status"] == "retry":
    retry_with_backoff(skill_call, max_retries=2)
else:
    pass_to_next_step(skill_output["result"])`}</pre>
            </section>

            {/* Error retry */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Error &amp; retry patterns</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { title: "Transient failures (retry)", body: "Network timeouts, rate limits, or brief model unavailability. Retry up to 3 times with exponential backoff (1s, 2s, 4s). Log each attempt." },
                  { title: "Validation failures (fix input)", body: "The skill output doesn't match the expected schema. Do not retry blindly — identify which field is wrong and fix the upstream input or prompt." },
                  { title: "Skill not found", body: "The model tried to invoke a skill that isn't installed. List all available skills in your system prompt. Add a fallback instruction: 'If a skill is not available, describe what you would do instead.'" },
                  { title: "Cascading failures", body: "A failure in step 3 should not silently corrupt steps 4–10. Design pipelines with checkpoints that verify state before proceeding. Use a status field in every handoff payload." },
                ].map((item) => (
                  <div key={item.title} style={{ borderLeft: "3px solid var(--border)", paddingLeft: "1rem" }}>
                    <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{item.title}</div>
                    <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)" }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Next steps */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Next steps</h2>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link href="/docs-guides/agent-builder" className="btn btn-primary">Agent Builder Guide →</Link>
                <Link href="/catalog?category=skill" className="btn btn-outline">Browse Skills</Link>
                <Link href="/api-registry" className="btn btn-outline">API &amp; Schema Reference</Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
