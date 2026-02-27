import Link from "next/link";
import { loadCatalog, loadBundles } from "@/lib/catalog";
import Stripe from "stripe";

type Props = { searchParams: Promise<{ session_id?: string; product_id?: string; bundle_id?: string }> };

async function getSessionProducts(sessionId: string): Promise<{ productIds: string[]; bundleIds: string[] }> {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });

    if (session.payment_status !== "paid") return { productIds: [], bundleIds: [] };

    const productIds: string[] = [];
    const bundleIds: string[] = [];

    for (const item of session.line_items?.data || []) {
      const product = item.price?.product as Stripe.Product | null;
      if (!product || typeof product === "string") continue;
      if (product.metadata?.product_id) productIds.push(product.metadata.product_id);
      if (product.metadata?.bundle_id) bundleIds.push(product.metadata.bundle_id);
    }

    return { productIds, bundleIds };
  } catch {
    return { productIds: [], bundleIds: [] };
  }
}

export default async function SuccessPage({ searchParams }: Props) {
  const sp = await searchParams;
  const allProducts = loadCatalog();
  const allBundles = loadBundles();

  // Verify Stripe session and get purchased items
  let verifiedProductIds: string[] = [];
  let verifiedBundleIds: string[] = [];
  let paymentVerified = false;

  if (sp.session_id) {
    const result = await getSessionProducts(sp.session_id);
    verifiedProductIds = result.productIds;
    verifiedBundleIds = result.bundleIds;
    paymentVerified = verifiedProductIds.length > 0 || verifiedBundleIds.length > 0;
  }

  // Fall back to URL params (for direct testing / legacy links)
  if (!paymentVerified) {
    if (sp.product_id) verifiedProductIds = [sp.product_id];
    if (sp.bundle_id) verifiedBundleIds = [sp.bundle_id];
  }

  // Resolve what was purchased
  const purchasedProducts = verifiedProductIds
    .map((id) => allProducts.find((p) => p.product_id === id))
    .filter(Boolean) as typeof allProducts;

  const purchasedBundles = verifiedBundleIds
    .map((id) => allBundles.find((b) => b.bundle_id === id))
    .filter(Boolean) as typeof allBundles;

  // For bundles, also collect all included product files
  const bundleProductFiles: { bundle: typeof allBundles[0]; products: typeof allProducts }[] = [];
  for (const bundle of purchasedBundles) {
    const includedIds = bundle.included_products
      .split("|")
      .map((s) => s.trim().split(" ")[0].trim())
      .filter(Boolean);
    const includedProducts = includedIds
      .map((id) => allProducts.find((p) => p.product_id === id))
      .filter(Boolean) as typeof allProducts;
    bundleProductFiles.push({ bundle, products: includedProducts });
  }

  const hasDownloads = purchasedProducts.length > 0 || purchasedBundles.length > 0;

  return (
    <>
      <div style={{ background: "linear-gradient(135deg,#0f2017 0%,#1a3a28 100%)", padding: "3.5rem 0 3rem", color: "white", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: "600px" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>✅</div>
          <h1 style={{ color: "white", marginBottom: "0.65rem" }}>Purchase confirmed!</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: "1.65" }}>
            Your files are ready to download below. No email required.
          </p>
        </div>
      </div>

      <div className="section-sm">
        <div className="container" style={{ maxWidth: "720px" }}>

          {hasDownloads ? (
            <>
              {/* Individual product downloads */}
              {purchasedProducts.map((product) => (
                <div key={product.product_id} className="content-block" style={{ marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div>
                      <h2 style={{ marginBottom: "0.25rem" }}>{product.name}</h2>
                      <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", margin: 0 }}>{product.short_desc}</p>
                    </div>
                    <a
                      href={`/downloads/paid/${product.product_id}.md`}
                      download={`${product.slug}.md`}
                      className="btn btn-buy"
                      style={{ display: "inline-flex", width: "auto", flexShrink: 0 }}
                    >
                      ↓ Download
                    </a>
                  </div>
                </div>
              ))}

              {/* Bundle downloads */}
              {bundleProductFiles.map(({ bundle, products }) => (
                <div key={bundle.bundle_id} className="content-block" style={{ marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
                    <div>
                      <span className="badge badge-bundle" style={{ marginBottom: "0.5rem", display: "inline-block" }}>Bundle</span>
                      <h2 style={{ marginBottom: "0.25rem" }}>{bundle.name}</h2>
                      <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", margin: 0 }}>{bundle.product_count} products included</p>
                    </div>
                  </div>
                  <div className="included-list">
                    {products.map((p) => (
                      <div key={p.product_id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0", borderBottom: "1px solid var(--border)" }}>
                        <span style={{ flex: 1, fontSize: "0.88rem", fontWeight: 500 }}>{p.name}</span>
                        <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)", textTransform: "capitalize" }}>{p.category}</span>
                        <a
                          href={`/downloads/paid/${p.product_id}.md`}
                          download={`${p.slug}.md`}
                          className="btn btn-green-outline btn-sm"
                          style={{ flexShrink: 0 }}
                        >
                          ↓ Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ background: "var(--green-light)", border: "1px solid rgba(26,107,80,0.2)", borderRadius: "12px", padding: "1.1rem", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.85rem", color: "#1a6b50" }}>
                  <strong>💡 Bookmark this page</strong> — your download links are available here as long as you have the URL.
                  All files are Markdown format, compatible with any text editor or AI tool.
                </div>
              </div>
            </>
          ) : (
            <div className="content-block" style={{ marginBottom: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⚠️</div>
              <h2>Couldn&apos;t verify your purchase</h2>
              <p style={{ color: "var(--ink-muted)", marginBottom: "1rem" }}>
                If you just completed checkout, try refreshing. If the problem persists, contact support with your Stripe receipt email.
              </p>
              <Link href="mailto:support@agentartifacts.io" className="btn btn-outline btn-sm">Contact support</Link>
            </div>
          )}

          {/* Quickstart */}
          <div className="content-block" style={{ marginBottom: "1.25rem" }}>
            <h2>Getting started</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                "Open the downloaded .md file in any text editor or import into your AI tool",
                "Replace all {{placeholder}} tokens with your specific context",
                "For prompts: paste directly into Claude, ChatGPT, or your preferred LLM",
                "For skills: place in .claude/skills/ and invoke with /skill-name in Claude Code",
                "Check the compatibility section in each file for framework-specific integration",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--green)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.78rem", flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ fontSize: "0.875rem", paddingTop: "0.25rem", margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/catalog" className="btn btn-primary">Continue shopping →</Link>
            <Link href="/free-library" className="btn btn-outline">Free library</Link>
            <Link href="mailto:support@agentartifacts.io" className="btn btn-outline">Support</Link>
          </div>
        </div>
      </div>
    </>
  );
}
