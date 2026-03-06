import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Agent Artifacts refund and return policy for digital product purchases.",
};

const LAST_UPDATED = "February 27, 2026";

export default function RefundPolicyPage() {
  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <div className="section-label">Legal</div>
          <h1 style={{ marginBottom: "0.5rem" }}>Refund Policy</h1>
          <p style={{ color: "var(--ink-muted)", fontSize: "0.875rem" }}>Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "760px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>Digital goods policy</h2>
              <p>All products sold on Agent Artifacts are digital goods delivered instantly upon payment. Because digital files are immediately accessible after purchase, our refund policy is limited — but we are committed to resolving legitimate issues promptly.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>When you are eligible for a refund</h2>
              <p style={{ marginBottom: "0.75rem" }}>You may request a refund within <strong>7 days of purchase</strong> if:</p>
              <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>The product files are corrupt, missing, or inaccessible through no fault of your own</li>
                <li>The product is materially different from its description on the product page</li>
                <li>You were charged in error (e.g., duplicate transaction)</li>
              </ul>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>When refunds are not available</h2>
              <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>Change of mind after successful download</li>
                <li>Purchased the wrong product (we will help you exchange where possible)</li>
                <li>The product did not produce a specific AI output you expected — AI results vary by model, configuration, and context</li>
                <li>More than 7 days have passed since purchase</li>
                <li>Violation of the license terms (redistribution, resale, etc.) — entitlements will be revoked without refund</li>
              </ul>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>How to request a refund</h2>
              <p style={{ marginBottom: "0.75rem" }}>Email <a href="mailto:support@agentartifacts.io" style={{ color: "var(--green)", textDecoration: "underline" }}>support@agentartifacts.io</a> with:</p>
              <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <li>The email address used at checkout</li>
                <li>Your order / Stripe session ID (included in your receipt email)</li>
                <li>A brief description of the issue</li>
              </ul>
              <p style={{ marginTop: "0.75rem" }}>We aim to respond within 1–2 business days. Approved refunds are processed back to the original payment method and typically appear within 5–10 business days depending on your bank.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>Exchanges</h2>
              <p>If you purchased the wrong product, contact us within 7 days and we will work with you to apply the value toward the correct product where feasible.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>Disputes</h2>
              <p>We encourage you to contact us before initiating a payment dispute with your bank or card issuer. Chargebacks filed without contacting us first may result in permanent revocation of your account and purchase entitlements. We respond to all legitimate chargebacks with full documentation.</p>
            </section>

            <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn btn-primary">Contact support →</Link>
              <Link href="/pricing" className="btn btn-outline">View pricing &amp; licensing</Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
