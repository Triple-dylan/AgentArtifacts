import Link from "next/link";

export default function AccountPage() {
  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container">
          <div className="section-label">Account</div>
          <h1 style={{ marginBottom: "0.5rem" }}>My account</h1>
          <p>Purchases, licenses, download history, and disclosure records.</p>
        </div>
      </div>

      <div className="section-sm">
        <div className="container" style={{ maxWidth: "760px" }}>
          {/* Purchases placeholder */}
          <div className="content-block" style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ marginBottom: "0.5rem" }}>Purchases &amp; licenses</h2>
            <div className="empty-state" style={{ padding: "2rem 0" }}>
              <div className="empty-state-icon">🛒</div>
              <h3>No purchases yet</h3>
              <p style={{ marginBottom: "1rem" }}>Your purchased products and download links will appear here.</p>
              <Link href="/catalog" className="btn btn-primary">Browse catalog →</Link>
            </div>
          </div>

          {/* Download history */}
          <div className="content-block" style={{ marginBottom: "1.25rem" }}>
            <h2>Download history</h2>
            <p style={{ fontSize: "0.875rem" }}>Signed download URLs for all your purchases. Links are re-generatable from this page.</p>
            <div style={{ background: "var(--bg-alt)", borderRadius: "8px", padding: "1rem", marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--ink-muted)", textAlign: "center" }}>
              No downloads yet
            </div>
          </div>

          {/* Disclosure records */}
          <div className="content-block" style={{ marginBottom: "1.25rem" }}>
            <h2>Disclosure acknowledgements</h2>
            <p style={{ fontSize: "0.875rem", marginBottom: "0.75rem" }}>Record of all trading risk disclosures you have acknowledged, including version and timestamp.</p>
            <div style={{ background: "var(--bg-alt)", borderRadius: "8px", padding: "1rem", fontSize: "0.85rem", color: "var(--ink-muted)", textAlign: "center" }}>
              No acknowledgements on record
            </div>
          </div>

          {/* Support */}
          <div className="content-block" style={{ background: "var(--green-light)", borderColor: "rgba(26,107,80,0.2)" }}>
            <h2 style={{ color: "var(--green)" }}>Need help?</h2>
            <p style={{ fontSize: "0.875rem", marginBottom: "0.75rem", color: "var(--ink-muted)" }}>
              For download issues, license questions, or refund requests — reach out to support.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="mailto:support@agentassets.io" className="btn btn-green-outline btn-sm">Email support</Link>
              <Link href="/docs-guides" className="btn btn-outline btn-sm">View docs</Link>
              <Link href="/pricing#policy" className="btn btn-outline btn-sm">Refund policy</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
