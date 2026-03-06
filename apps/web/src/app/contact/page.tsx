import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Agent Artifacts team for support, licensing questions, or enterprise inquiries.",
};

const TOPICS = [
  { label: "Order & download issues", email: "support@agentartifacts.io", desc: "Problems accessing files, missing downloads, or account issues." },
  { label: "Refund requests", email: "support@agentartifacts.io", desc: "See our refund policy, then email us with your order ID." },
  { label: "Licensing & team seats", email: "support@agentartifacts.io", desc: "Questions about commercial use, multi-seat licensing, or redistribution." },
  { label: "Enterprise & custom packages", email: "support@agentartifacts.io", desc: "Custom bundles, SLAs, white-label, and volume licensing." },
];

export default function ContactPage() {
  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <div className="section-label">Support</div>
          <h1 style={{ marginBottom: "0.5rem" }}>Contact us</h1>
          <p style={{ maxWidth: "520px", fontSize: "1rem" }}>
            We typically respond within 1–2 business days. For urgent order issues, include your Stripe order ID in your email.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "760px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

            {/* Primary contact */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Email support</h2>
              <div className="content-block" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{ fontSize: "2rem", flexShrink: 0 }}>✉️</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.2rem" }}>support@agentartifacts.io</div>
                  <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)" }}>For all inquiries — orders, billing, licensing, and general questions.</p>
                  <a
                    href="mailto:support@agentartifacts.io"
                    className="btn btn-primary"
                    style={{ display: "inline-block", marginTop: "0.85rem" }}
                  >
                    Send an email →
                  </a>
                </div>
              </div>
            </section>

            {/* Topic guide */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>What are you contacting us about?</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {TOPICS.map((topic) => (
                  <div
                    key={topic.label}
                    style={{
                      background: "white",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--r)",
                      padding: "1rem 1.25rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>{topic.label}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--ink-muted)" }}>{topic.desc}</div>
                    </div>
                    <a
                      href={`mailto:${topic.email}?subject=${encodeURIComponent(topic.label)}`}
                      className="btn btn-outline btn-sm"
                      style={{ flexShrink: 0 }}
                    >
                      Email →
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* Response times */}
            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>Response times</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[
                  { tier: "All customers", time: "1–2 business days" },
                  { tier: "Pro Bundle customers", time: "Same business day (best effort)" },
                  { tier: "Enterprise", time: "SLA-guaranteed response times" },
                ].map((row) => (
                  <div
                    key={row.tier}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.6rem 0",
                      borderBottom: "1px solid var(--border)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span style={{ color: "var(--ink-muted)" }}>{row.tier}</span>
                    <span style={{ fontWeight: 600 }}>{row.time}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick links */}
            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>Quick links</h2>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link href="/refund-policy" className="btn btn-outline btn-sm">Refund Policy</Link>
                <Link href="/pricing#license" className="btn btn-outline btn-sm">License Terms</Link>
                <Link href="/account" className="btn btn-outline btn-sm">My Account</Link>
                <Link href="/docs-guides" className="btn btn-outline btn-sm">Docs &amp; Guides</Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
