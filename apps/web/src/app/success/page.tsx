import Link from "next/link";
import { loadCatalog, loadBundles } from "@/lib/catalog";

type Props = { searchParams: Promise<{ session_id?: string; order_id?: string; product_id?: string; bundle_id?: string }> };

export default async function SuccessPage({ searchParams }: Props) {
  const sp = await searchParams;
  const productId = sp.product_id;
  const bundleId = sp.bundle_id;

  const allProducts = loadCatalog();
  const allBundles = loadBundles();

  const product = productId ? allProducts.find((p) => p.product_id === productId) : null;
  const bundle = bundleId ? allBundles.find((b) => b.bundle_id === bundleId) : null;
  const item = product || bundle;

  return (
    <>
      <div style={{ background: "linear-gradient(135deg,#0f2017 0%,#1a3a28 100%)", padding: "3.5rem 0 3rem", color: "white", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: "600px" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>✅</div>
          <h1 style={{ color: "white", marginBottom: "0.65rem" }}>Purchase successful!</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: "1.65" }}>
            {item ? `Your purchase of ${item.name} is confirmed.` : "Your order is confirmed."} Your download links are ready below.
          </p>
        </div>
      </div>

      <div className="section-sm">
        <div className="container" style={{ maxWidth: "680px" }}>
          {/* Order details */}
          {sp.session_id && (
            <div className="content-block" style={{ marginBottom: "1.25rem" }}>
              <h2>Order details</h2>
              <div className="sidebar-meta" style={{ padding: "0", border: "none", margin: "0" }}>
                {sp.session_id && <div className="sidebar-meta-row"><span className="sidebar-meta-key">Stripe session</span><span className="sidebar-meta-val" style={{ fontSize: "0.8rem", fontFamily: "monospace" }}>{sp.session_id}</span></div>}
                {sp.order_id && <div className="sidebar-meta-row"><span className="sidebar-meta-key">Order ID</span><span className="sidebar-meta-val">{sp.order_id}</span></div>}
                {item && <div className="sidebar-meta-row"><span className="sidebar-meta-key">Product</span><span className="sidebar-meta-val">{item.name}</span></div>}
              </div>
            </div>
          )}

          {/* Download */}
          <div className="content-block" style={{ background: "var(--green-light)", borderColor: "rgba(26,107,80,0.2)" }}>
            <h2 style={{ color: "var(--green)" }}>📦 Your downloads</h2>
            <p style={{ fontSize: "0.875rem", marginBottom: "1rem", color: "var(--ink-muted)" }}>
              Download links are secured and will expire after 24 hours. Files are also accessible from your account page at any time.
            </p>
            <div className="included-list">
              <div className="included-item">
                <span>📄</span>
                <span className="included-item-name">Product manifest (JSON)</span>
                <span className="btn btn-green-outline btn-sm" style={{ marginLeft: "auto" }}>Download</span>
              </div>
              <div className="included-item">
                <span>💬</span>
                <span className="included-item-name">Main product files (MD + JSON)</span>
                <span className="btn btn-green-outline btn-sm" style={{ marginLeft: "auto" }}>Download</span>
              </div>
              <div className="included-item">
                <span>📖</span>
                <span className="included-item-name">Integration guide</span>
                <span className="btn btn-green-outline btn-sm" style={{ marginLeft: "auto" }}>Download</span>
              </div>
            </div>
            <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(255,255,255,0.6)", borderRadius: "8px", fontSize: "0.8rem", color: "#1a6b50" }}>
              💡 Tip: Files are also saved to your <Link href="/account" style={{ fontWeight: 700, textDecoration: "underline" }}>account page</Link> for future re-download.
            </div>
          </div>

          {/* Quickstart */}
          <div className="content-block">
            <h2>Quickstart</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { step: "1", text: "Unzip and review the product manifest (manifest.json) to understand included files" },
                { step: "2", text: "Read the integration guide (GUIDE.md) for your framework-specific setup" },
                { step: "3", text: "Copy the prompt or skill files into your agent project" },
                { step: "4", text: "Check compatibility notes for your specific AI provider" },
              ].map((s) => (
                <div key={s.step} style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--green)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.82rem", flexShrink: 0 }}>{s.step}</div>
                  <p style={{ fontSize: "0.875rem", paddingTop: "0.3rem", margin: 0 }}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Next steps */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
            <Link href="/account" className="btn btn-primary">Go to account →</Link>
            <Link href="/catalog" className="btn btn-outline">Continue shopping</Link>
            <Link href="/docs-guides" className="btn btn-outline">View docs</Link>
          </div>
        </div>
      </div>
    </>
  );
}
