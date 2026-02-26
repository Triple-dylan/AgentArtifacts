import type { Metadata } from "next";
import Link from "next/link";
import { loadBundles, loadCatalog, categoryBadgeClass, categoryLabel } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return loadBundles().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bundle = loadBundles().find((b) => b.slug === slug);
  if (!bundle) return { title: "Bundle not found" };
  const url = `https://agentartifacts.io/bundles/${slug}`;
  return {
    title: bundle.name,
    description: bundle.short_desc,
    openGraph: {
      title: bundle.name,
      description: bundle.short_desc,
      url,
      type: "website",
      images: bundle.cover_image_url ? [{ url: bundle.cover_image_url, width: 1200, height: 800, alt: bundle.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: bundle.name,
      description: bundle.short_desc,
      images: bundle.cover_image_url ? [bundle.cover_image_url] : [],
    },
  };
}

function parseIncluded(str: string): { id: string; role: string }[] {
  return str.split("|").map((s) => s.trim()).filter(Boolean).map((entry) => {
    const match = entry.match(/^([\w-]+)\s*\((\w+)\)$/);
    if (match) return { id: match[1], role: match[2] };
    return { id: entry, role: "core" };
  });
}

export default async function BundleDetailPage({ params }: Props) {
  const { slug } = await params;
  const bundles = loadBundles();
  const bundle = bundles.find((b) => b.slug === slug);

  if (!bundle) {
    return (
      <div className="container section">
        <h1>Bundle not found</h1>
        <p><Link href="/catalog?type=bundle">← Back to bundles</Link></p>
      </div>
    );
  }

  const allProducts = loadCatalog();
  const included = parseIncluded(bundle.included_products);
  const includedProducts = included.map(({ id, role }) => ({
    product: allProducts.find((p) => p.product_id === id),
    role,
  })).filter((x) => x.product);

  const otherBundles = bundles.filter((b) => b.slug !== slug).slice(0, 3);
  const needsDisclosure = bundle.disclosure_required === "Y";

  const bundleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": bundle.name,
    "description": bundle.short_desc,
    "image": bundle.cover_image_url,
    "brand": { "@type": "Brand", "name": "Agent Artifacts" },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": bundle.price_usd,
      "availability": "https://schema.org/InStock",
      "url": `https://agentartifacts.io/bundles/${bundle.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://agentartifacts.io" },
      { "@type": "ListItem", "position": 2, "name": "Bundles", "item": "https://agentartifacts.io/catalog?type=bundle" },
      { "@type": "ListItem", "position": 3, "name": bundle.name },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bundleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "1.25rem 0" }}>
        <div className="container">
          <nav style={{ fontSize: "0.82rem", color: "var(--ink-muted)" }}>
            <Link href="/">Home</Link> / <Link href="/catalog?type=bundle">Bundles</Link> / {bundle.name}
          </nav>
        </div>
      </div>
      <div className="section-sm">
        <div className="container">
          <div className="detail-layout">
            <div className="detail-main">
              <div className="content-block" style={{ padding: "0", overflow: "hidden" }}>
                <img src={bundle.cover_image_url} alt={bundle.name} style={{ width: "100%", height: "240px", objectFit: "cover", display: "block" }} />
                <div style={{ padding: "1.5rem" }}>
                  <div className="product-card-badges" style={{ marginBottom: "0.75rem" }}>
                    <span className="badge badge-bundle">Bundle</span>
                    <span className="badge badge-plain">{bundle.product_count} products</span>
                  </div>
                  <h1 style={{ marginBottom: "0.65rem", fontSize: "1.65rem" }}>{bundle.name}</h1>
                  <p style={{ fontSize: "1rem", color: "var(--ink-muted)", lineHeight: "1.65" }}>{bundle.short_desc}</p>
                </div>
              </div>

              {needsDisclosure && (
                <div className="disclosure-panel">
                  <div className="disclosure-panel-header">⚠️ Important Disclosure</div>
                  <p>{bundle.disclosure_text_short || "Research outputs are informational and require independent judgment. Not investment advice."}</p>
                </div>
              )}

              <div className="content-block" style={{ background: "var(--green-light)", borderColor: "rgba(26,107,80,0.2)" }}>
                <h2 style={{ color: "var(--green)" }}>Bundle savings</h2>
                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                  <div><div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--green)", marginBottom: "0.2rem" }}>Bundle price</div><div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--ink)" }}>{bundle.price_label}</div></div>
                  <div><div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--ink-muted)", marginBottom: "0.2rem" }}>Standalone value</div><div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--ink-muted)", textDecoration: "line-through" }}>{bundle.compare_at_label}</div></div>
                  <div><div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--green)", marginBottom: "0.2rem" }}>You save</div><div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--green)" }}>{bundle.savings_label}</div></div>
                </div>
              </div>

              <div className="content-block">
                <h2>What&apos;s included ({bundle.product_count} products)</h2>
                <div className="included-list">
                  {includedProducts.map(({ product: p, role }) => p && (
                    <Link key={p.product_id} href={`/products/${p.slug}`} className="included-item" style={{ textDecoration: "none" }}>
                      <span className={`badge ${categoryBadgeClass(p.category)}`} style={{ flexShrink: 0 }}>{categoryLabel(p.category)}</span>
                      <span className="included-item-name">{p.name}</span>
                      <span style={{ fontSize: "0.82rem", color: "var(--ink-muted)", marginLeft: "auto" }}>{p.price_label}</span>
                      <span className="included-item-role">{role}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="content-block">
                <h2>License &amp; delivery</h2>
                <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}><strong>License:</strong> All included products covered under bundle license. Commercial use permitted. Redistribution not included.</p>
                <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}><strong>Delivery:</strong> All files delivered instantly via secure signed URL. Access from your download page.</p>
                <p style={{ fontSize: "0.875rem" }}><strong>Support:</strong> Bundle customers receive priority email support.</p>
              </div>

              {otherBundles.length > 0 && (
                <div>
                  <h2 style={{ marginBottom: "1rem" }}>Other bundles</h2>
                  <div className="bundle-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
                    {otherBundles.map((b) => (
                      <Link key={b.bundle_id} href={`/bundles/${b.slug}`} className="bundle-card" style={{ textDecoration: "none", color: "inherit" }}>
                        <img className="bundle-card-img" src={b.cover_image_url} alt={b.name} style={{ height: "120px" }} />
                        <div className="bundle-card-body">
                          <div className="bundle-card-name" style={{ fontSize: "0.95rem" }}>{b.name}</div>
                          <div className="bundle-card-desc" style={{ fontSize: "0.8rem" }}>{b.short_desc}</div>
                          <div className="bundle-card-footer">
                            <div className="price-block"><span className="price-now" style={{ fontSize: "0.95rem" }}>{b.price_label}</span></div>
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
                  <span className="sidebar-price-now">{bundle.price_label}</span>
                  {bundle.compare_at_label && <span className="sidebar-price-was">{bundle.compare_at_label}</span>}
                </div>
                {bundle.savings_label && <div className="sidebar-price-save">{bundle.savings_label}</div>}
                <div className="sidebar-meta">
                  <div className="sidebar-meta-row"><span className="sidebar-meta-key">Products included</span><span className="sidebar-meta-val">{bundle.product_count}</span></div>
                  {bundle.execution_mode && bundle.execution_mode !== "none" && <div className="sidebar-meta-row"><span className="sidebar-meta-key">Execution mode</span><span className="sidebar-meta-val" style={{ textTransform: "capitalize" }}>{bundle.execution_mode}</span></div>}
                  {bundle.market_type && bundle.market_type !== "none" && <div className="sidebar-meta-row"><span className="sidebar-meta-key">Market type</span><span className="sidebar-meta-val" style={{ textTransform: "capitalize" }}>{bundle.market_type}</span></div>}
                  <div className="sidebar-meta-row"><span className="sidebar-meta-key">Delivery</span><span className="sidebar-meta-val">Instant</span></div>
                </div>
                {bundle.checkout_url ? (
                  <a href={bundle.checkout_url} className="btn btn-buy" target="_blank" rel="noopener noreferrer">
                    {bundle.cta_label || "Buy Bundle"} — {bundle.price_label}
                  </a>
                ) : (
                  <div className="btn btn-buy" style={{ background: "var(--ink-subtle)", cursor: "default" }}>Coming soon</div>
                )}
                <p className="sidebar-note">Instant digital delivery after checkout</p>
                <p className="sidebar-note">All {bundle.product_count} products delivered together</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
