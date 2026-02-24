import Link from "next/link";

const TIERS = [
  { name: "Free", price: "$0", desc: "Partial packs, sample skill excerpts, template snippets. Lead capture preferred." },
  { name: "Entry Prompts", price: "$9–$29", desc: "Focused prompt packs and chains for top-of-funnel use cases." },
  { name: "Prompt Suites", price: "$29–$49", desc: "Multi-role system prompts, campaign suites, and research chains." },
  { name: "Skills", price: "$49–$199", desc: "SKILL.md modules with schemas, error handling, and compatibility docs." },
  { name: "Agents", price: "$299–$999", desc: "Packaged agents with configs, tests, and deployment documentation." },
  { name: "Pro Bundles", price: "$999–$2,999", desc: "Multi-asset suites across categories. Core average order value driver.", featured: true },
  { name: "Enterprise", price: "$5,000+", desc: "Tailored packages, SLAs, seat licensing, and support contracts." },
];

const FAQ = [
  { q: "Is this a one-time purchase or subscription?", a: "One-time purchase is the default for all SKUs. An optional updates-feed subscription is available for ongoing version access, provider compatibility updates, and premium changelog notes." },
  { q: "What does the license cover?", a: "Single-seat commercial use. You may use assets in client or employer projects. Redistribution, resale, or republication of raw files is prohibited unless explicitly granted." },
  { q: "How do bundle discounts work?", a: "Bundle prices target 15–35% off the sum of standalone prices. Savings are shown on each bundle page." },
  { q: "Are there refunds?", a: "Refunds are available within 7 days of purchase for technical issues. Misuse, fraud, or redistribution will result in entitlement revocation." },
  { q: "How does the updates-feed work?", a: "The updates-feed subscription grants access to new versions of purchased products, provider compat updates, and migration guides. It can be purchased standalone or added at checkout." },
  { q: "What is required for trading products?", a: "Products with live or paper execution modes require you to acknowledge a risk disclosure before download. All trading assets are tooling and education only — not investment advice." },
];

export default function PricingPage() {
  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container">
          <div className="section-label">Pricing &amp; Licensing</div>
          <h1 style={{ marginBottom: "0.65rem" }}>Simple, transparent pricing</h1>
          <p style={{ maxWidth: "520px", fontSize: "1rem" }}>
            One-time purchases for all SKUs. Optional updates-feed subscription for ongoing access. No seat restrictions for solo use.
          </p>
        </div>
      </div>

      <div className="section-sm">
        <div className="container">
          <h2 style={{ marginBottom: "1.25rem" }}>Pricing tiers</h2>
          <div className="pricing-table">
            {TIERS.map((tier) => (
              <div key={tier.name} className={`pricing-tier${tier.featured ? " featured" : ""}`}>
                {tier.featured && <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--green)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Best value</div>}
                <div className="tier-name">{tier.name}</div>
                <div className="tier-price">{tier.price}</div>
                <div className="tier-desc">{tier.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-sm" id="license" style={{ background: "white", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <h2 style={{ marginBottom: "1.25rem" }}>License terms</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {[
              { title: "Scope", body: "License grants commercial use rights for a single seat. You may use assets in client or employer projects. Seat expansion is available for teams." },
              { title: "Redistribution", body: "Raw file redistribution, resale, or republication is prohibited. Assets may not be repackaged and sold as a competing product or template store." },
              { title: "Delivery", body: "Products are delivered as digital files (Markdown, JSON, YAML) via secure signed URLs. Files are accessible from your account page for the license period." },
              { title: "Updates", body: "One-time purchases include the version at time of purchase. The optional updates-feed subscription provides ongoing version access." },
              { title: "Support", body: "Email support is included. Priority response for Pro Bundle and Enterprise customers. SLA contracts available on Enterprise tier." },
            ].map((item) => (
              <div key={item.title} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1.1rem" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.3rem" }}>{item.title}</div>
                <p style={{ fontSize: "0.875rem" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-sm" id="disclosure">
        <div className="container" style={{ maxWidth: "760px" }}>
          <h2 style={{ marginBottom: "0.75rem" }}>Trading &amp; risk disclosure</h2>
          <div className="disclosure-panel" style={{ marginBottom: "1.5rem" }}>
            <div className="disclosure-panel-header">⚠️ For trading and prediction market products only</div>
            <p>All trading, prediction market, and execution-related assets on this platform are tooling and education resources. They are not investment advice, financial advice, or trading signals. Users are solely responsible for all execution decisions, risk management, and regulatory compliance. Past performance of any strategy or model is not indicative of future results.</p>
          </div>
          <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)", lineHeight: "1.65" }}>
            Products with live or paper execution modes require explicit acknowledgement of the trading risk disclosure before download. This acknowledgement is tracked per version — changes to disclosure text will require re-acknowledgement.
          </p>
        </div>
      </div>

      <div className="section" id="policy" style={{ background: "white", borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ maxWidth: "720px" }}>
          <div className="section-label">FAQ</div>
          <h2 style={{ marginBottom: "1.5rem" }}>Pricing questions</h2>
          <div className="faq-list">
            {FAQ.map((item) => (
              <div key={item.q} className="faq-item">
                <div className="faq-q">{item.q}</div>
                <div className="faq-a">{item.a}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/catalog" className="btn btn-primary">Browse catalog →</Link>
            <Link href="/catalog?type=bundle" className="btn btn-outline">View bundles</Link>
          </div>
        </div>
      </div>
    </>
  );
}
