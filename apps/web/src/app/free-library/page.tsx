import Link from "next/link";
import { loadCatalog, categoryBadgeClass, categoryLabel } from "@/lib/catalog";

export default function FreeLibraryPage() {
  const all = loadCatalog();
  const freeMagnets = all.filter((r) => r.lead_magnet === "Y");

  return (
    <>
      <div style={{ background: "linear-gradient(135deg,#0f2017 0%,#1a3a28 100%)", padding: "3.5rem 0 3rem", color: "white" }}>
        <div className="container">
          <div className="hero-eyebrow" style={{ marginBottom: "1rem" }}>Free Library</div>
          <h1 style={{ color: "white", marginBottom: "0.75rem", maxWidth: "600px" }}>Free samples and lead magnets</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", maxWidth: "520px", fontSize: "1rem", lineHeight: "1.65", marginBottom: "1.5rem" }}>
            {freeMagnets.length} free samples from our catalog — partial packs for you to evaluate quality before purchasing.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/catalog" className="btn btn-primary">Browse full catalog →</Link>
            <Link href="/catalog?type=bundle" className="btn btn-secondary">View bundles</Link>
          </div>
        </div>
      </div>

      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "1rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center", fontSize: "0.85rem", color: "var(--ink-muted)" }}>
            <span>📦 <strong>{freeMagnets.length}</strong> free samples</span>
            <span>📧 Email not required for preview</span>
            <span>⚡ Instant access to sample previews</span>
            <span>🔒 Full files require purchase</span>
          </div>
        </div>
      </div>

      <div className="section-sm">
        <div className="container">
          <div style={{ background: "var(--amber-light)", border: "1px solid rgba(138,96,0,0.2)", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
            <strong style={{ fontSize: "0.85rem", color: "var(--amber)" }}>Gating notice:</strong>
            <span style={{ fontSize: "0.85rem", color: "#6b4500", marginLeft: "0.5rem" }}>
              Free samples are capped to 20–30% of full paid value. No full production chains, no live connector packs, no commercial redistribution.
            </span>
          </div>

          <div className="product-grid">
            {freeMagnets.map((row) => (
              <div key={row.product_id} className="product-card">
                <img className="product-card-img" src={row.cover_image_url} alt={row.name} />
                <div className="product-card-body">
                  <div className="product-card-badges">
                    <span className={`badge ${categoryBadgeClass(row.category)}`}>{categoryLabel(row.category)}</span>
                    <span className="badge badge-plain" style={{ background: "#e8f4f0", color: "#1a6b50", border: "1px solid rgba(26,107,80,0.2)" }}>Free sample</span>
                  </div>
                  <div className="product-card-name">{row.name}</div>
                  <div className="product-card-desc">{row.short_desc}</div>
                  <div className="product-card-footer">
                    <div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1a6b50" }}>Free preview</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--ink-subtle)" }}>Full version: {row.price_label}</div>
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      {row.sample_link && (
                        <a href={row.sample_link} className="btn btn-green-outline btn-sm" target="_blank" rel="noopener noreferrer">Preview</a>
                      )}
                      <Link href={`/products/${row.slug}`} className="btn btn-outline btn-sm">Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "3rem", background: "var(--green-light)", border: "1px solid rgba(26,107,80,0.2)", borderRadius: "16px", padding: "2rem", textAlign: "center" }}>
            <h2 style={{ marginBottom: "0.5rem", color: "var(--ink)" }}>Ready for the full catalog?</h2>
            <p style={{ color: "var(--ink-muted)", marginBottom: "1.25rem" }}>Bundle packs offer the best value — save up to 44% vs individual prices.</p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/catalog" className="btn btn-primary">Browse full catalog →</Link>
              <Link href="/catalog?type=bundle" className="btn btn-outline">View bundles</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
