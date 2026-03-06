import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Account",
  description: "Account features coming soon.",
};

export default function AccountPage() {
  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <div className="section-label">Account</div>
          <h1 style={{ marginBottom: "0.4rem" }}>My account</h1>
          <p style={{ color: "var(--ink-muted)" }}>Account features coming soon.</p>
        </div>
      </div>

      <div className="section-sm">
        <div className="container" style={{ maxWidth: "760px" }}>
          <div className="content-block" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🚧</div>
            <h2 style={{ marginBottom: "0.5rem" }}>Coming soon</h2>
            <p style={{ fontSize: "0.9rem", color: "var(--ink-muted)", marginBottom: "1.75rem" }}>
              Account management is under construction. In the meantime, check your email for download links after purchase.
            </p>
            <Link href="/catalog" className="btn btn-buy" style={{ display: "inline-flex", width: "auto" }}>
              Browse catalog →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
