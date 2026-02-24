import Link from "next/link";
import { loadCatalog, loadBundles, catalogStats, categoryBadgeClass, riskBadgeClass, modeBadgeClass, categoryLabel } from "@/lib/catalog";

const FAQ = [
  { q: "What do I get after purchase?", a: "Digital files (Markdown, JSON, YAML) delivered instantly via the download page — including manifests and all docs listed on the product page." },
  { q: "Can I use these commercially?", a: "Yes, under your selected license tier. Redistribution or resale of raw assets is not permitted unless explicitly stated." },
  { q: "How do updates work?", a: "One-time purchases include the current version. An optional updates-feed subscription grants ongoing access to new versions, compat fixes, and changelog notes." },
  { q: "Do these work with my stack?", a: "Each product lists compatibility badges (OpenAI, Anthropic, Cursor, LangChain, etc.) and any framework dependencies. Check the product page before purchasing." },
  { q: "Are trading products investment advice?", a: "No. All trading and prediction assets are tooling and education only. Users control all execution decisions and must accept applicable disclosures before downloading." },
  { q: "What is your refund policy?", a: "Refunds are handled per our digital goods policy. Contact support within 7 days of purchase for issues. Misuse or fraud will result in entitlement revocation." },
];

const CATEGORY_META: Record<string, { icon: string; color: string; desc: string }> = {
  prompt: { icon: "💬", color: "#e8f4f0", desc: "Ready-to-use prompt packs and chains" },
  skill: { icon: "⚙️", color: "#f0ecff", desc: "Skill modules with schemas and error handling" },
  agent: { icon: "🤖", color: "#e8f0f8", desc: "Full packaged agents with configs and docs" },
  utility: { icon: "🔧", color: "#fff8e1", desc: "JSON schemas, guardrails, and templates" },
  doc: { icon: "📄", color: "#f4f3ef", desc: "Playbooks, cookbooks, and compat guides" },
};

export default function HomePage() {
  const rows = loadCatalog();
  const bundles = loadBundles();
  const stats = catalogStats(rows);

  const featured = rows.filter((r) => r.lead_magnet === "Y").slice(0, 8);
  const featuredBundles = bundles.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-eyebrow">✦ 50 launch SKUs · Instant digital delivery</div>
          <h1>Build faster with production-ready AI prompts, skills, and agents</h1>
          <p className="hero-sub">
            Shop machine-readable prompt packs, Skill MD modules, agents, and utilities with clear licensing and instant digital delivery.
          </p>
          <div className="hero-actions">
            <Link href="/catalog" className="btn btn-primary btn-lg">Browse Catalog →</Link>
            <Link href="/catalog?type=bundle" className="btn btn-secondary btn-lg">View Bundles</Link>
            <Link href="/free-library" className="btn btn-secondary btn-lg">Free Library</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">{stats.total}</span>
              <span className="hero-stat-label">Total SKUs</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{stats.trading}</span>
              <span className="hero-stat-label">Trading &amp; Prediction</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{stats.freeMagnets}</span>
              <span className="hero-stat-label">Free samples</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">8</span>
              <span className="hero-stat-label">Bundle packs</span>
            </div>
          </div>
        </div>
      </section>

      {/* COMPAT STRIP */}
      <div className="compat-strip">
        <div className="container">
          <div className="compat-inner">
            <span className="compat-label">Compatible with</span>
            {["OpenAI", "Anthropic", "Cursor", "LangChain", "LangGraph", "AutoGen", "OpenAPI"].map((c) => (
              <span key={c} className="compat-item">{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORY ENTRY */}
      <section className="section-sm">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">Browse by type</div>
              <h2>What are you building?</h2>
            </div>
            <Link href="/catalog" className="btn btn-outline btn-sm">View all →</Link>
          </div>
          <div className="cat-grid">
            {Object.entries(CATEGORY_META).map(([cat, meta]) => (
              <Link key={cat} href={`/catalog?category=${cat}`} className="cat-card">
                <div className="cat-icon" style={{ background: meta.color }}>{meta.icon}</div>
                <h3 style={{ textTransform: "capitalize" }}>{cat}s</h3>
                <p>{meta.desc}</p>
                <div className="cat-count">{stats.categories[cat] || 0} SKUs</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section-sm" style={{ background: "white", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">Popular picks</div>
              <h2>Featured products</h2>
            </div>
            <Link href="/catalog" className="btn btn-outline btn-sm">See all {stats.total} →</Link>
          </div>
          <div className="product-grid">
            {featured.map((row) => (
              <Link key={row.product_id} href={`/products/${row.slug}`} className="product-card" style={{ textDecoration: "none", color: "inherit" }}>
                <img className="product-card-img" src={row.cover_image_url} alt={row.name} />
                <div className="product-card-body">
                  <div className="product-card-badges">
                    <span className={`badge ${categoryBadgeClass(row.category)}`}>{categoryLabel(row.category)}</span>
                    {row.execution_mode && row.execution_mode !== "none" && (
                      <span className={`badge ${modeBadgeClass(row.execution_mode)}`}>{row.execution_mode}</span>
                    )}
                    {row.risk_level && row.risk_level !== "low" && (
                      <span className={`badge ${riskBadgeClass(row.risk_level)}`}>{row.risk_level} risk</span>
                    )}
                  </div>
                  <div className="product-card-name">{row.name}</div>
                  <div className="product-card-desc">{row.short_desc}</div>
                  <div className="product-card-footer">
                    <div className="price-block">
                      <span className="price-now">{row.price_label}</span>
                      {row.compare_at_label && <span className="price-was">{row.compare_at_label}</span>}
                      {row.savings_label && <span className="price-save">{row.savings_label}</span>}
                    </div>
                    <span className="btn btn-green-outline btn-sm">View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BUNDLES */}
      <section className="section-sm">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">Best value</div>
              <h2>Bundle packs — save up to 44%</h2>
            </div>
            <Link href="/catalog?type=bundle" className="btn btn-outline btn-sm">All bundles →</Link>
          </div>
          <div className="bundle-grid">
            {featuredBundles.map((b) => (
              <Link key={b.bundle_id} href={`/bundles/${b.slug}`} className="bundle-card" style={{ textDecoration: "none", color: "inherit" }}>
                <img className="bundle-card-img" src={b.cover_image_url} alt={b.name} />
                <div className="bundle-card-body">
                  <div className="product-card-badges" style={{ marginBottom: "0.5rem" }}>
                    <span className="badge badge-bundle">Bundle</span>
                    {b.disclosure_required === "Y" && <span className="badge badge-risk-high">Disclosure required</span>}
                    <span className="badge badge-plain">{b.product_count} items</span>
                  </div>
                  <div className="bundle-card-name">{b.name}</div>
                  <div className="bundle-card-desc">{b.short_desc}</div>
                  <div className="bundle-card-footer">
                    <div className="price-block">
                      <span className="price-now">{b.price_label}</span>
                      {b.compare_at_label && <span className="price-was">{b.compare_at_label}</span>}
                    </div>
                    <span className="btn btn-buy" style={{ width: "auto", padding: "0.45rem 1rem", fontSize: "0.82rem" }}>
                      {b.savings_label || "View bundle"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="section-sm" style={{ background: "white", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="trust-strip">
            <div className="trust-item"><div className="trust-icon">⚡</div>Instant digital delivery</div>
            <div className="trust-item"><div className="trust-icon">📄</div>Clear license terms</div>
            <div className="trust-item"><div className="trust-icon">🔒</div>Entitlement-gated downloads</div>
            <div className="trust-item"><div className="trust-icon">🛠️</div>Multi-framework compatible</div>
            <div className="trust-item"><div className="trust-icon">📦</div>Machine-readable formats</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container" style={{ maxWidth: "720px" }}>
          <div className="section-label">Common questions</div>
          <h2 style={{ marginBottom: "1.75rem" }}>Frequently asked questions</h2>
          <div className="faq-list">
            {FAQ.map((item) => (
              <div key={item.q} className="faq-item">
                <div className="faq-q">{item.q}</div>
                <div className="faq-a">{item.a}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/catalog" className="btn btn-primary">Browse catalog →</Link>
            <Link href="/pricing" className="btn btn-outline">Pricing &amp; licensing</Link>
          </div>
        </div>
      </section>
    </>
  );
}
