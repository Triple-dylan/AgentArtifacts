import Link from "next/link";

const ENDPOINTS = [
  { method: "GET", path: "/catalog", desc: "Paginated product catalog with filter support (category, compat, mode, market_type, price range)." },
  { method: "GET", path: "/catalog/trading", desc: "Trading-specific catalog subset. Returns only products with execution_mode != none." },
  { method: "GET", path: "/registry/index.json", desc: "Machine-readable registry index (JSON Schema v1.1.0). Paginated, sortable." },
  { method: "GET", path: "/registry/products/{id}.json", desc: "Full registry metadata for a single product by ID." },
  { method: "GET", path: "/registry/products/{id}/risk-profile", desc: "Risk profile payload for trading products. Returns guardrails, kill-switch config, and disclosure version." },
  { method: "POST", path: "/checkout/session", desc: "Create a Stripe checkout session. Returns session URL for redirect." },
  { method: "POST", path: "/leads/capture", desc: "Email lead capture for free library downloads. Stores email + tag for onboarding sequence." },
  { method: "POST", path: "/downloads/signed-url", desc: "Generate a time-limited signed download URL. Requires valid entitlement (post-purchase)." },
  { method: "POST", path: "/disclosures/acknowledge", desc: "Record a user's acceptance of a versioned trading disclosure. Required before live/paper download." },
  { method: "POST", path: "/upsell/evaluate", desc: "Evaluate upsell rules for a given trigger context. Returns ranked offer list." },
  { method: "POST", path: "/webhooks/stripe", desc: "Stripe webhook receiver for payment events. Triggers entitlement creation on success." },
  { method: "GET", path: "/health", desc: "Service health check. Returns status and version." },
];

export default function ApiRegistryPage() {
  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container">
          <div className="section-label">API &amp; Registry</div>
          <h1 style={{ marginBottom: "0.65rem" }}>API &amp; registry docs</h1>
          <p style={{ maxWidth: "540px", fontSize: "1rem" }}>
            Machine-readable product registry (JSON Schema v1.1.0) and REST API for catalog access, checkout, entitlements, and download delivery.
          </p>
        </div>
      </div>

      <div className="section-sm">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2.5rem" }}>
            <div className="content-block">
              <h2>Registry schema</h2>
              <p style={{ fontSize: "0.875rem", marginBottom: "0.75rem" }}>JSON Schema draft 2020-12. Version 1.1.0.</p>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {["registry_schema_version", "id", "type", "name", "version", "files", "compatibility", "license", "price_usd", "risk_profile"].map((f) => (
                  <span key={f} className="badge badge-plain" style={{ fontFamily: "monospace" }}>{f}</span>
                ))}
              </div>
            </div>
            <div className="content-block">
              <h2>Base URL</h2>
              <div style={{ background: "var(--bg-alt)", borderRadius: "8px", padding: "0.75rem 1rem", fontFamily: "monospace", fontSize: "0.85rem", color: "var(--ink)", marginBottom: "0.75rem" }}>
                https://api.agentartifacts.io
              </div>
              <p style={{ fontSize: "0.875rem" }}>All endpoints accept and return JSON. Authentication via session token for protected routes.</p>
            </div>
          </div>

          <h2 style={{ marginBottom: "1.25rem" }}>Endpoint reference</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {ENDPOINTS.map((ep) => (
              <div key={ep.path} style={{ borderBottom: "1px solid var(--border)", padding: "1rem 0", display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                <span style={{
                  padding: "0.2rem 0.55rem", borderRadius: "5px", fontFamily: "monospace", fontSize: "0.72rem", fontWeight: 700,
                  background: ep.method === "GET" ? "#e8f0f8" : "#e8f4f0",
                  color: ep.method === "GET" ? "#1e4a7a" : "#1a6b50",
                  border: ep.method === "GET" ? "1px solid rgba(30,74,122,0.2)" : "1px solid rgba(26,107,80,0.2)",
                  flexShrink: 0
                }}>
                  {ep.method}
                </span>
                <div style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--ink)", fontWeight: 600, flexShrink: 0, paddingTop: "0.2rem" }}>{ep.path}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--ink-muted)", flex: 1, paddingTop: "0.2rem" }}>{ep.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "2.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="content-block" style={{ background: "var(--blue-light)", borderColor: "rgba(30,74,122,0.2)" }}>
              <h2>Registry index format</h2>
              <p style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>Paginated product index with sort and filter support.</p>
              <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: "8px", padding: "0.75rem", fontFamily: "monospace", fontSize: "0.78rem", color: "#1e4a7a" }}>
                {"{"}<br/>
                &nbsp;&nbsp;"page": 1,<br/>
                &nbsp;&nbsp;"page_size": 20,<br/>
                &nbsp;&nbsp;"total": 42,<br/>
                &nbsp;&nbsp;"products": [...]<br/>
                {"}"}
              </div>
            </div>
            <div className="content-block" style={{ background: "#f0ecff", borderColor: "rgba(74,45,143,0.2)" }}>
              <h2>Trading risk profile</h2>
              <p style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>Structured risk metadata for high-risk products.</p>
              <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: "8px", padding: "0.75rem", fontFamily: "monospace", fontSize: "0.78rem", color: "#4a2d8f" }}>
                {"{"}<br/>
                &nbsp;&nbsp;"execution_mode": "live",<br/>
                &nbsp;&nbsp;"risk_level": "high",<br/>
                &nbsp;&nbsp;"kill_switch": true,<br/>
                &nbsp;&nbsp;"disclosure_version": "1.0.0"<br/>
                {"}"}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
            <Link href="/catalog" className="btn btn-primary">Browse catalog →</Link>
            <Link href="/docs-guides" className="btn btn-outline">Integration guides</Link>
          </div>
        </div>
      </div>
    </>
  );
}
