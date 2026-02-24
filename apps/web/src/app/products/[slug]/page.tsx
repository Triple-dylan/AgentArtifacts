import Link from "next/link";
import { loadCatalog, categoryBadgeClass, riskBadgeClass, modeBadgeClass, categoryLabel } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return loadCatalog().map((r) => ({ slug: r.slug }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const all = loadCatalog();
  const row = all.find((r) => r.slug === slug);

  if (!row) {
    return (
      <div className="container section">
        <h1>Product not found</h1>
        <p><Link href="/catalog">← Back to catalog</Link></p>
      </div>
    );
  }

  const compat = row.compatibility.split("|").map((s) => s.trim()).filter(Boolean);
  const tags = row.tags.split("|").map((s) => s.trim()).filter(Boolean);
  const isTrading = row.market_type && row.market_type !== "none";
  const needsDisclosure = row.disclosure_required === "Y";

  const related = all.filter((r) => r.category === row.category && r.slug !== row.slug).slice(0, 4);

  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "1.25rem 0" }}>
        <div className="container">
          <nav style={{ fontSize: "0.82rem", color: "var(--ink-muted)" }}>
            <Link href="/">Home</Link> / <Link href="/catalog">Catalog</Link> / <Link href={`/catalog?category=${row.category}`} style={{ textTransform: "capitalize" }}>{row.category}s</Link> / {row.name}
          </nav>
        </div>
      </div>

      <div className="section-sm">
        <div className="container">
          <div className="detail-layout">
            <div className="detail-main">
              <div className="content-block" style={{ padding: "0", overflow: "hidden" }}>
                <img src={row.cover_image_url} alt={row.name} style={{ width: "100%", height: "240px", objectFit: "cover", display: "block" }} />
                <div style={{ padding: "1.5rem" }}>
                  <div className="product-card-badges" style={{ marginBottom: "0.75rem" }}>
                    <span className={`badge ${categoryBadgeClass(row.category)}`}>{categoryLabel(row.category)}</span>
                    {isTrading && <span className={`badge ${modeBadgeClass(row.execution_mode)}`}>{row.execution_mode}</span>}
                    {row.risk_level && <span className={`badge ${riskBadgeClass(row.risk_level)}`}>{row.risk_level} risk</span>}
                    {row.lead_magnet === "Y" && <span className="badge badge-plain">Free sample available</span>}
                    <span className="badge badge-plain" style={{ textTransform: "uppercase", letterSpacing: "0.03em" }}>#{row.product_id.split("-").pop()}</span>
                  </div>
                  <h1 style={{ marginBottom: "0.65rem", fontSize: "1.65rem" }}>{row.name}</h1>
                  <p style={{ fontSize: "1rem", color: "var(--ink-muted)", lineHeight: "1.65" }}>{row.short_desc}</p>
                </div>
              </div>

              {needsDisclosure && (
                <div className="disclosure-panel">
                  <div className="disclosure-panel-header">⚠️ Trading Risk Disclosure Required</div>
                  <p>{row.disclosure_text_short || "This asset is tooling and education only — not investment advice."}</p>
                </div>
              )}

              <div className="content-block">
                <h2>Compatibility</h2>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  {compat.map((c) => (
                    <span key={c} className="badge badge-plain" style={{ fontSize: "0.82rem", padding: "0.3rem 0.65rem" }}>{c.charAt(0).toUpperCase() + c.slice(1)}</span>
                  ))}
                </div>
                <p style={{ fontSize: "0.85rem" }}>Format: <strong>{row.subcategory.replace(/_/g, " ")}</strong> · Delivered as Markdown and JSON files</p>
              </div>

              <div className="content-block">
                <h2>What&apos;s included</h2>
                <div className="included-list">
                  <div className="included-item"><span>📄</span><span className="included-item-name">Product manifest (JSON)</span><span className="included-item-role">Metadata</span></div>
                  <div className="included-item"><span>💬</span><span className="included-item-name">Main prompt file (Markdown)</span><span className="included-item-role">Core</span></div>
                  <div className="included-item"><span>📋</span><span className="included-item-name">Schema definitions</span><span className="included-item-role">Structure</span></div>
                  <div className="included-item"><span>📖</span><span className="included-item-name">Integration guide</span><span className="included-item-role">Docs</span></div>
                  {isTrading && <div className="included-item"><span>🛡️</span><span className="included-item-name">Risk policy template</span><span className="included-item-role">Compliance</span></div>}
                </div>
              </div>

              {tags.length > 0 && (
                <div className="content-block">
                  <h2>Tags</h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {tags.map((t) => <span key={t} className="badge badge-plain">{t}</span>)}
                  </div>
                </div>
              )}

              <div className="content-block">
                <h2>License &amp; delivery</h2>
                <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}><strong>License:</strong> Commercial use permitted under single-seat license. Redistribution and resale of raw files not permitted.</p>
                <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}><strong>Delivery:</strong> Instant digital download via secure signed URL after checkout.</p>
                <p style={{ fontSize: "0.875rem" }}><strong>Updates:</strong> Includes current version. Opt into updates-feed subscription for future versions.</p>
              </div>

              {related.length > 0 && (
                <div>
                  <h2 style={{ marginBottom: "1rem" }}>Related products</h2>
                  <div className="product-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
                    {related.map((r) => (
                      <Link key={r.product_id} href={`/products/${r.slug}`} className="product-card" style={{ textDecoration: "none", color: "inherit" }}>
                        <img className="product-card-img" src={r.cover_image_url} alt={r.name} style={{ height: "100px" }} />
                        <div className="product-card-body">
                          <div className="product-card-name" style={{ fontSize: "0.88rem" }}>{r.name}</div>
                          <div className="product-card-footer">
                            <span className="price-now" style={{ fontSize: "0.95rem" }}>{r.price_label}</span>
                            <span className="btn btn-green-outline btn-sm">View →</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="detail-sidebar">
              <div className="sidebar-card">
                <div>
                  <span className="sidebar-price-now">{row.price_label}</span>
                  {row.compare_at_label && <span className="sidebar-price-was">{row.compare_at_label}</span>}
                </div>
                {row.savings_label && <div className="sidebar-price-save">{row.savings_label}</div>}
                <div className="sidebar-meta">
                  <div className="sidebar-meta-row"><span className="sidebar-meta-key">Category</span><span className="sidebar-meta-val" style={{ textTransform: "capitalize" }}>{row.category}</span></div>
                  <div className="sidebar-meta-row"><span className="sidebar-meta-key">Format</span><span className="sidebar-meta-val">MD + JSON</span></div>
                  {isTrading && (
                    <>
                      <div className="sidebar-meta-row"><span className="sidebar-meta-key">Execution mode</span><span className="sidebar-meta-val" style={{ textTransform: "capitalize" }}>{row.execution_mode}</span></div>
                      <div className="sidebar-meta-row"><span className="sidebar-meta-key">Market type</span><span className="sidebar-meta-val" style={{ textTransform: "capitalize" }}>{row.market_type}</span></div>
                    </>
                  )}
                  <div className="sidebar-meta-row"><span className="sidebar-meta-key">Risk level</span><span className={`badge ${riskBadgeClass(row.risk_level)}`} style={{ fontSize: "0.78rem" }}>{row.risk_level}</span></div>
                  <div className="sidebar-meta-row"><span className="sidebar-meta-key">Delivery</span><span className="sidebar-meta-val">Instant</span></div>
                </div>
                {needsDisclosure && (
                  <div style={{ background: "var(--red-light)", border: "1px solid rgba(184,74,63,0.2)", borderRadius: "8px", padding: "0.75rem", marginBottom: "0.85rem", fontSize: "0.8rem", color: "#7a3530" }}>
                    ⚠️ Disclosure acknowledgement required before download
                  </div>
                )}
                {row.checkout_url ? (
                  <a href={row.checkout_url} className="btn btn-buy" target="_blank" rel="noopener noreferrer">
                    {row.cta_label || "Buy Now"} — {row.price_label}
                  </a>
                ) : (
                  <div className="btn btn-buy" style={{ background: "var(--ink-subtle)", cursor: "default" }}>Coming soon</div>
                )}
                {row.sample_available === "Y" && row.sample_link && (
                  <a href={row.sample_link} className="btn btn-green-outline" style={{ marginTop: "0.75rem", width: "100%", justifyContent: "center" }} target="_blank" rel="noopener noreferrer">
                    {row.cta_secondary_label || "Preview Sample"} →
                  </a>
                )}
                <p className="sidebar-note">Instant digital delivery after checkout</p>
                <p className="sidebar-note">License terms apply. Redistribution not included.</p>
              </div>
              <div style={{ marginTop: "1rem", background: "var(--green-light)", border: "1px solid rgba(26,107,80,0.2)", borderRadius: "12px", padding: "1.1rem" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--green)", marginBottom: "0.35rem" }}>💡 Save more with a bundle</div>
                <p style={{ fontSize: "0.82rem", color: "var(--green)", lineHeight: "1.5" }}>Bundle packs include this and related products at up to 44% off.</p>
                <Link href="/catalog?type=bundle" className="btn btn-green-outline btn-sm" style={{ marginTop: "0.75rem", display: "inline-flex" }}>Browse bundles →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
