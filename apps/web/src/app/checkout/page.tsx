import Link from "next/link";
import { loadCatalog, loadBundles } from "@/lib/catalog";

type Props = { searchParams: Promise<{ product_id?: string; bundle_id?: string; canceled?: string }> };

export default async function CheckoutPage({ searchParams }: Props) {
  const sp = await searchParams;
  const allProducts = loadCatalog();
  const allBundles = loadBundles();

  const product = sp.product_id ? allProducts.find((p) => p.product_id === sp.product_id) : null;
  const bundle = sp.bundle_id ? allBundles.find((b) => b.bundle_id === sp.bundle_id) : null;
  const item = product || bundle;

  if (sp.canceled) {
    return (
      <div className="section">
        <div className="container" style={{ maxWidth: "500px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>↩️</div>
          <h1 style={{ marginBottom: "0.5rem" }}>Checkout canceled</h1>
          <p style={{ marginBottom: "1.5rem" }}>No charges were made. You can continue browsing or try again.</p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <Link href="/catalog" className="btn btn-primary">Back to catalog</Link>
            {item && <Link href={product ? `/products/${product.slug}` : `/bundles/${bundle!.slug}`} className="btn btn-outline">Back to product</Link>}
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="section">
        <div className="container" style={{ maxWidth: "500px", textAlign: "center" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>Ready to checkout?</h1>
          <p style={{ marginBottom: "1.5rem" }}>Choose a product from the catalog to get started.</p>
          <Link href="/catalog" className="btn btn-primary">Browse catalog →</Link>
        </div>
      </div>
    );
  }

  const isBundle = !!bundle;
  const name = item.name;
  const priceLabel = item.price_label;
  const compareLabel = item.compare_at_label;
  const savingsLabel = item.savings_label;
  const checkoutUrl = item.checkout_url;
  const needsDisclosure = item.disclosure_required === "Y";
  const disclosureText = item.disclosure_text_short;

  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "1.5rem 0" }}>
        <div className="container">
          <nav style={{ fontSize: "0.82rem", color: "var(--ink-muted)" }}>
            <Link href="/">Home</Link> / <Link href="/catalog">{isBundle ? "Bundles" : "Catalog"}</Link> / Checkout
          </nav>
        </div>
      </div>

      <div className="section-sm">
        <div className="container" style={{ maxWidth: "620px" }}>
          <h1 style={{ marginBottom: "1.5rem" }}>Order summary</h1>

          {/* Item card */}
          <div className="content-block" style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ink-subtle)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.25rem" }}>
                  {isBundle ? "Bundle" : "Product"}
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.25rem" }}>{name}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--ink-muted)" }}>Instant digital delivery · MD + JSON files</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--ink)" }}>{priceLabel}</div>
                {compareLabel && <div style={{ fontSize: "0.8rem", color: "var(--ink-subtle)", textDecoration: "line-through" }}>{compareLabel}</div>}
              </div>
            </div>
            {savingsLabel && (
              <div style={{ marginTop: "0.85rem", background: "var(--green-light)", border: "1px solid rgba(26,107,80,0.2)", borderRadius: "8px", padding: "0.5rem 0.85rem", fontSize: "0.82rem", fontWeight: 700, color: "var(--green)" }}>
                🎉 {savingsLabel}
              </div>
            )}
          </div>

          {/* Disclosure */}
          {needsDisclosure && (
            <div className="disclosure-panel" style={{ marginBottom: "1.25rem" }}>
              <div className="disclosure-panel-header">⚠️ Risk disclosure required</div>
              <p style={{ marginBottom: "0.75rem" }}>{disclosureText || "This asset includes trading tooling. Research outputs are informational and require independent judgment. Not investment advice."}</p>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", cursor: "pointer", fontSize: "0.82rem", color: "#7a3530" }}>
                <input type="checkbox" style={{ marginTop: "0.2rem", flexShrink: 0 }} />
                <span>I acknowledge the disclosure and understand this is tooling and education, not investment advice.</span>
              </label>
            </div>
          )}

          {/* License ack */}
          <div className="content-block" style={{ marginBottom: "1.25rem" }}>
            <h2>License acknowledgement</h2>
            <p style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>By completing this purchase you agree to the license terms: commercial single-seat use, no redistribution, no resale of raw files.</p>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", cursor: "pointer", fontSize: "0.85rem", color: "var(--ink-muted)" }}>
              <input type="checkbox" style={{ marginTop: "0.2rem", flexShrink: 0 }} />
              <span>I have read and agree to the <Link href="/pricing#license" style={{ color: "var(--green)" }}>license terms</Link>.</span>
            </label>
          </div>

          {/* CTA */}
          {checkoutUrl ? (
            <a href={checkoutUrl} className="btn btn-buy btn-lg" style={{ justifyContent: "center", fontSize: "1rem" }} target="_blank" rel="noopener noreferrer">
              Continue to payment — {priceLabel} →
            </a>
          ) : (
            <div className="btn btn-buy btn-lg" style={{ justifyContent: "center", background: "var(--ink-subtle)", cursor: "default" }}>Payment link coming soon</div>
          )}

          <p style={{ fontSize: "0.78rem", color: "var(--ink-subtle)", textAlign: "center", marginTop: "0.85rem" }}>
            Secured by Stripe · No card data stored on our servers
          </p>
        </div>
      </div>
    </>
  );
}
