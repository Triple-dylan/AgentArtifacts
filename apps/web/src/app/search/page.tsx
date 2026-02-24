import Link from "next/link";
import { loadCatalog, loadBundles, categoryBadgeClass, categoryLabel } from "@/lib/catalog";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = (sp.q ?? "").toLowerCase().trim();

  const allProducts = loadCatalog();
  const allBundles = loadBundles();

  const productResults = query
    ? allProducts.filter((r) =>
        r.name.toLowerCase().includes(query) ||
        r.short_desc.toLowerCase().includes(query) ||
        r.tags.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query) ||
        r.compatibility.toLowerCase().includes(query)
      )
    : [];

  const bundleResults = query
    ? allBundles.filter((b) =>
        b.name.toLowerCase().includes(query) ||
        b.short_desc.toLowerCase().includes(query)
      )
    : [];

  const total = productResults.length + bundleResults.length;

  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "2.5rem 0 2rem" }}>
        <div className="container">
          <div className="section-label">Search</div>
          <h1 style={{ marginBottom: "1rem" }}>Search the catalog</h1>
          <form method="GET" action="/search" style={{ display: "flex", gap: "0.5rem", maxWidth: "640px" }}>
            <div className="search-box" style={{ flex: 1, maxWidth: "none" }}>
              <span className="search-icon">🔍</span>
              <input
                name="q"
                type="search"
                className="search-input"
                placeholder='e.g. "trading tools", "marketing agent", "skill module"'
                defaultValue={sp.q}
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          {query && <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--ink-muted)" }}>{total} results for &quot;{sp.q}&quot;</p>}
        </div>
      </div>

      <div className="section-sm">
        <div className="container">
          {!query ? (
            <div>
              <div className="section-label" style={{ marginBottom: "1rem" }}>Popular searches</div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                {["trading tools", "marketing agent", "skill module", "openai prompts", "support ops", "langchain"].map((q) => (
                  <Link key={q} href={`/search?q=${encodeURIComponent(q)}`} className="filter-chip">{q}</Link>
                ))}
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Link href="/catalog" className="btn btn-primary">Browse all products →</Link>
                <Link href="/catalog?type=bundle" className="btn btn-outline">View bundles</Link>
              </div>
            </div>
          ) : total === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No results for &quot;{sp.q}&quot;</h3>
              <p style={{ marginBottom: "1rem" }}>Try a different search term or browse the catalog directly.</p>
              <Link href="/catalog" className="btn btn-primary">Browse catalog →</Link>
            </div>
          ) : (
            <div>
              {bundleResults.length > 0 && (
                <div style={{ marginBottom: "2.5rem" }}>
                  <h2 style={{ marginBottom: "1rem" }}>Bundles ({bundleResults.length})</h2>
                  <div className="bundle-grid">
                    {bundleResults.map((b) => (
                      <Link key={b.bundle_id} href={`/bundles/${b.slug}`} className="bundle-card" style={{ textDecoration: "none", color: "inherit" }}>
                        <img className="bundle-card-img" src={b.cover_image_url} alt={b.name} style={{ height: "120px" }} />
                        <div className="bundle-card-body">
                          <div className="bundle-card-name">{b.name}</div>
                          <div className="bundle-card-desc">{b.short_desc}</div>
                          <div className="bundle-card-footer">
                            <div className="price-block"><span className="price-now">{b.price_label}</span>{b.savings_label && <span className="price-save">{b.savings_label}</span>}</div>
                            <span className="btn btn-green-outline btn-sm">View →</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {productResults.length > 0 && (
                <div>
                  <h2 style={{ marginBottom: "1rem" }}>Products ({productResults.length})</h2>
                  <div className="product-grid">
                    {productResults.map((row) => (
                      <Link key={row.product_id} href={`/products/${row.slug}`} className="product-card" style={{ textDecoration: "none", color: "inherit" }}>
                        <img className="product-card-img" src={row.cover_image_url} alt={row.name} />
                        <div className="product-card-body">
                          <div className="product-card-badges"><span className={`badge ${categoryBadgeClass(row.category)}`}>{categoryLabel(row.category)}</span></div>
                          <div className="product-card-name">{row.name}</div>
                          <div className="product-card-desc">{row.short_desc}</div>
                          <div className="product-card-footer">
                            <span className="price-now">{row.price_label}</span>
                            <span className="btn btn-green-outline btn-sm">View →</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
