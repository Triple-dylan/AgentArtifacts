import type { Metadata } from "next";
import AccountPageClient from "./AccountPageClient";

export const metadata: Metadata = {
  title: "My Account",
  description: "Your Agent Artifacts library, saved products, and purchase history.",
};

export default function AccountPage() {
  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <div className="section-label">Account</div>
          <h1 style={{ marginBottom: "0.4rem" }}>My account</h1>
          <p style={{ color: "var(--ink-muted)" }}>Your saved library, purchased products, and download history.</p>
        </div>
      </div>

      <div className="section-sm">
        <div className="container" style={{ maxWidth: "760px" }}>
          <AccountPageClient />
        </div>
      </div>
    </>
  );
}
