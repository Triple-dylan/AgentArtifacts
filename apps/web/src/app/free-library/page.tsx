import Link from "next/link";
import { loadCatalog, categoryBadgeClass, categoryLabel } from "@/lib/catalog";
import ProductCover from "@/components/ProductCover";

export default function FreeLibraryPage() {
  const all = loadCatalog();
  const freeProducts = all.filter((r) => r.lead_magnet === "Y");

  return (
    <>
      <div style={{ background: "linear-gradient(135deg,#0f2017 0%,#1a3a28 100%)", padding: "3.5rem 0 3rem", color: "white" }}>
        <div className="container">
          <div className="hero-eyebrow" style={{ marginBottom: "1rem" }}>Free Library</div>
          <h1 style={{ color: "white", marginBottom: "0.75rem", maxWidth: "600px" }}>Free downloads — no strings attached</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", maxWidth: "520px", fontSize: "1rem", lineHeight: "1.65", marginBottom: "1.5rem" }}>
            {freeProducts.length} complete, production-ready assets. Download any of them instantly — no email, no account, no catch.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/catalog" className="btn btn-primary">Browse full catalog →</Link>
          </div>
        </div>
      </div>

      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "1rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center", fontSize: "0.85rem", color: "var(--ink-muted)" }}>
            <span><strong>{freeProducts.length}</strong> free assets</span>
            <span>No email required</span>
            <span>Instant download</span>
            <span>Full files, not previews</span>
          </div>
        </div>
      </div>

      <div className="section-sm">
        <div className="container">
          <div className="product-grid">
            {freeProducts.map((row) => (
              <div key={row.product_id} className="product-card">
                <ProductCover category={row.category} name={row.name} />
                <div className="product-card-body">
                  <div className="product-card-badges">
                    <span className={`badge ${categoryBadgeClass(row.category)}`}>{categoryLabel(row.category)}</span>
                    <span className="badge badge-plain" style={{ background: "#e8f4f0", color: "#1a6b50", border: "1px solid rgba(26,107,80,0.2)" }}>Free</span>
                  </div>
                  <div className="product-card-name">{row.name}</div>
                  <div className="product-card-desc">{row.short_desc}</div>
                  <div className="product-card-footer">
                    <Link href={`/sample/${row.slug}`} className="btn btn-buy btn-sm" style={{ flex: 1, justifyContent: "center" }}>
                      ↓ Download free
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
