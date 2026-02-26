import Link from "next/link";
import { loadCatalog, loadBundles, categoryBadgeClass, modeBadgeClass, riskBadgeClass, categoryLabel } from "@/lib/catalog";

type Props = { searchParams: Promise<Record<string, string>> };

const CATEGORIES = ["prompt", "skill", "agent", "utility", "doc"];
const COMPAT = ["openai", "anthropic", "cursor", "langchain"];
const EXEC_MODES = ["none", "research", "paper", "live"];

export default async function CatalogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const type = sp.type ?? "product";
  const category = sp.category ?? "";
  const compat = sp.compat ?? "";
  const mode = sp.mode ?? "";

  const allProducts = loadCatalog();
  const allBundles = loadBundles();

  const showBundles = type === "bundle";

  // Filter products
  let products = allProducts;
  if (category) products = products.filter((r) => r.category === category);
  if (compat) products = products.filter((r) => r.compatibility.toLowerCase().includes(compat));
  if (mode) products = products.filter((r) => r.execution_mode === mode);

  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "2rem 0" }}>
        <div className="container">
          <div className="section-label">Store</div>
          <h1 style={{ marginBottom: "0.5rem" }}>{showBundles ? "Bundle Packs" : "Product Catalog"}</h1>
          <p style={{ marginBottom: "1.25rem", color: "var(--ink-muted)" }}>
            {showBundles
              ? `${allBundles.length} bundle packs — save up to 44% vs standalone prices`
              : `${allProducts.length} SKUs across prompts, skills, agents, utilities, and docs`}
          </p>
          {/* Type toggle */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <Link href="/catalog" className={`filter-chip ${!showBundles ? "active" : ""}`}>Products ({allProducts.length})</Link>
            <Link href="/catalog?type=bundle" className={`filter-chip ${showBundles ? "active" : ""}`}>Bundles ({allBundles.length})</Link>
          </div>
        </div>
      </div>

      <div className="section-sm">
        <div className="container">
          {!showBundles && (
            <div className="filter-bar">
              <div className="filter-group">
                <span className="filter-label">Category:</span>
                <Link href={`/catalog${compat ? `?compat=${compat}` : ""}${mode ? `${compat ? "&" : "?"}mode=${mode}` : ""}`} className={`filter-chip ${!category ? "active" : ""}`}>All</Link>
                {CATEGORIES.map((c) => (
                  <Link key={c} href={`/catalog?category=${c}${compat ? `&compat=${compat}` : ""}${mode ? `&mode=${mode}` : ""}`} className={`filter-chip ${category === c ? "active" : ""}`} style={{ textTransform: "capitalize" }}>
                    {c}s
                  </Link>
                ))}
              </div>
              <div className="filter-divider" />
              <div className="filter-group">
                <span className="filter-label">Compatible:</span>
                <Link href={`/catalog${category ? `?category=${category}` : ""}${mode ? `${category ? "&" : "?"}mode=${mode}` : ""}`} className={`filter-chip ${!compat ? "active" : ""}`}>Any</Link>
                {COMPAT.map((c) => (
                  <Link key={c} href={`/catalog?compat=${c}${category ? `&category=${category}` : ""}${mode ? `&mode=${mode}` : ""}`} className={`filter-chip ${compat === c ? "active" : ""}`} style={{ textTransform: "capitalize" }}>
                    {c === "langchain" ? "LangChain" : c.charAt(0).toUpperCase() + c.slice(1)}
                  </Link>
                ))}
              </div>
              <div className="filter-divider" />
              <div className="filter-group">
                <span className="filter-label">Mode:</span>
                <Link href={`/catalog${category ? `?category=${category}` : ""}${compat ? `${category ? "&" : "?"}compat=${compat}` : ""}`} className={`filter-chip ${!mode ? "active" : ""}`}>All</Link>
                {EXEC_MODES.filter((m) => m !== "none").map((m) => (
                  <Link key={m} href={`/catalog?mode=${m}${category ? `&category=${category}` : ""}${compat ? `&compat=${compat}` : ""}`} className={`filter-chip ${mode === m ? "active" : ""}`} style={{ textTransform: "capitalize" }}>
                    {m}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {showBundles ? (
            <div className="bundle-grid">
              {allBundles.map((b) => (
                <Link key={b.bundle_id} href={`/bundles/${b.slug}`} className="bundle-card" style={{ textDecoration: "none", color: "inherit" }}>
                  <img className="bundle-card-img" src={b.cover_image_url} alt={b.name} />
                  <div className="bundle-card-body">
                    <div className="product-card-badges" style={{ marginBottom: "0.5rem" }}>
                      <span className="badge badge-bundle">Bundle</span>
                      {b.disclosure_required === "Y" && <span className="badge badge-risk-high">Disclosure required</span>}
                      <span className="badge badge-plain">{b.product_count} items</span>
                      {b.market_type && b.market_type !== "none" && (
                        <span className="badge badge-mode-research">{b.market_type}</span>
                      )}
                    </div>
                    <div className="bundle-card-name">{b.name}</div>
                    <div className="bundle-card-desc">{b.short_desc}</div>
                    <div className="bundle-card-footer">
                      <div className="price-block">
                        <span className="price-now">{b.price_label}</span>
                        {b.compare_at_label && <span className="price-was">{b.compare_at_label}</span>}
                        {b.savings_label && <span className="price-save">{b.savings_label}</span>}
                      </div>
                      <span className="btn btn-buy" style={{ width: "auto", padding: "0.5rem 1.1rem", fontSize: "0.85rem" }}>
                        {b.cta_label}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="product-grid">
              {products.map((row) => (
                <Link key={row.product_id} href={`/products/${row.slug}`} className="product-card" style={{ textDecoration: "none", color: "inherit" }}>
                  <img className="product-card-img" src={row.cover_image_url} alt={row.name} />
                  <div className="product-card-body">
                    <div className="product-card-badges">
                      <span className={`badge ${categoryBadgeClass(row.category)}`}>{categoryLabel(row.category)}</span>
                      {row.execution_mode && row.execution_mode !== "none" && (
                        <span className={`badge ${modeBadgeClass(row.execution_mode)}`}>{row.execution_mode}</span>
                      )}
                      {row.risk_level && row.risk_level !== "low" && <span className={`badge ${riskBadgeClass(row.risk_level)}`}>{row.risk_level} risk</span>}
                      {row.lead_magnet === "Y" && <span className="badge badge-plain">Free sample</span>}
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
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No products match these filters</h3>
              <p>Try removing a filter or <Link href="/catalog">browse all products</Link>.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
