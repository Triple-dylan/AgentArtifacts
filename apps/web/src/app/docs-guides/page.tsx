import Link from "next/link";

const GUIDES = [
  { icon: "🤖", title: "Agent Builder Guide", desc: "How to assemble prompts, skills, and agents into production workflows. Covers input/output contracts, handoff patterns, and error handling.", tags: ["Prompt", "Skill", "Agent"], link: "#" },
  { icon: "⚡", title: "Quick Integration", desc: "Get up and running in under 30 minutes. Copy-paste patterns for OpenAI, Anthropic, and LangChain integrations with any product from the catalog.", tags: ["OpenAI", "Anthropic", "LangChain"], link: "#" },
  { icon: "🛡️", title: "Trading Risk Playbook", desc: "Disclosure requirements, preflight validation, kill-switch configuration, and fallback templates for all trading and prediction market products.", tags: ["Trading", "Risk", "Compliance"], link: "#" },
  { icon: "🔄", title: "Compatibility Matrix", desc: "Provider and framework adaptation rules. How to port any product between OpenAI, Anthropic, Cursor, and LangGraph without breaking contracts.", tags: ["Compatibility", "Migration"], link: "#" },
  { icon: "📦", title: "Schema &amp; Format Reference", desc: "JSON schema definitions, Markdown format specs, and YAML guardrail structures used across all product types.", tags: ["Schema", "JSON", "YAML"], link: "/api-registry" },
  { icon: "🔧", title: "Skill Module Integration", desc: "How to install and call SKILL.md modules, handle tool routing, validate IO, and wire error retry patterns into your agent stack.", tags: ["Skill", "Tool Use"], link: "#" },
];

export default function DocsGuidesPage() {
  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container">
          <div className="section-label">Documentation</div>
          <h1 style={{ marginBottom: "0.65rem" }}>Docs &amp; guides</h1>
          <p style={{ maxWidth: "520px", fontSize: "1rem" }}>
            Implementation walkthroughs, compatibility playbooks, and integration guides for every product type in the catalog.
          </p>
        </div>
      </div>

      <div className="section-sm">
        <div className="container">
          <div className="product-grid">
            {GUIDES.map((g) => (
              <div key={g.title} className="content-block" style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <div style={{ fontSize: "2rem" }}>{g.icon}</div>
                <h3 dangerouslySetInnerHTML={{ __html: g.title }} />
                <p style={{ fontSize: "0.875rem", flex: 1 }}>{g.desc}</p>
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                  {g.tags.map((t) => <span key={t} className="badge badge-plain">{t}</span>)}
                </div>
                <Link href={g.link} className="btn btn-outline btn-sm" style={{ marginTop: "0.5rem", display: "inline-flex" }}>
                  {g.link === "#" ? "Coming soon" : "View guide →"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-sm" style={{ background: "white", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <h2 style={{ marginBottom: "1.25rem" }}>Included with every product</h2>
          <div className="cat-grid">
            {[
              { icon: "📄", label: "Product manifest", desc: "JSON metadata for every SKU" },
              { icon: "📖", label: "Integration guide", desc: "Step-by-step setup instructions" },
              { icon: "📋", label: "Schema definitions", desc: "Input/output contracts" },
              { icon: "🔗", label: "Compatibility notes", desc: "Framework-specific adaptation tips" },
              { icon: "📝", label: "Changelog", desc: "Version history and migration notes" },
            ].map((item) => (
              <div key={item.label} style={{ background: "var(--bg-alt)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.1rem" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.icon}</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.2rem" }}>{item.label}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/catalog" className="btn btn-primary">Browse catalog →</Link>
            <Link href="/api-registry" className="btn btn-outline">API &amp; Registry docs</Link>
          </div>
        </div>
      </div>
    </>
  );
}
