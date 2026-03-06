import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trading Risk Playbook",
  description: "Disclosure requirements, preflight validation, kill-switch configuration, and fallback templates for trading and prediction market products.",
};

export default function TradingRiskPlaybookPage() {
  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container" style={{ maxWidth: "820px" }}>
          <nav style={{ fontSize: "0.82rem", color: "var(--ink-muted)", marginBottom: "1rem" }}>
            <Link href="/docs-guides">Docs &amp; Guides</Link> / Trading Risk Playbook
          </nav>
          <div className="section-label">Guide</div>
          <h1 style={{ marginBottom: "0.5rem" }}>Trading Risk Playbook</h1>
          <p style={{ maxWidth: "580px", fontSize: "1rem" }}>
            Disclosure requirements, preflight validation, kill-switch configuration, and fallback templates for all trading and prediction market products.
          </p>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "1rem" }}>
            {["Trading", "Risk", "Compliance", "Disclosure"].map((t) => <span key={t} className="badge badge-plain">{t}</span>)}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "820px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>

            {/* Mandatory disclaimer */}
            <div className="disclosure-panel">
              <div className="disclosure-panel-header">⚠️ Mandatory disclaimer</div>
              <p>All trading, prediction market, and execution-related products on this platform are tooling and educational resources only. They are <strong>not</strong> investment advice, financial advice, or trading signals. Users are solely responsible for all execution decisions, risk management, and regulatory compliance. Past performance of any strategy or model is not indicative of future results. Nothing in these products or this guide constitutes a recommendation to buy, sell, or hold any financial instrument.</p>
            </div>

            {/* Product tiers */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Trading product execution tiers</h2>
              <p style={{ marginBottom: "0.75rem" }}>Trading products are tagged with an execution mode that determines required safeguards:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[
                  { mode: "research", color: "var(--blue)", bg: "var(--blue-light)", label: "Research", desc: "Analysis, modeling, and hypothesis generation only. No execution connectivity. Lowest risk tier." },
                  { mode: "paper", color: "var(--amber)", bg: "var(--amber-light)", label: "Paper Trading", desc: "Simulated execution against live market data. No real money at risk. Risk disclosure required before download." },
                  { mode: "live", color: "var(--red)", bg: "var(--red-light)", label: "Live Execution", desc: "Real execution connectors and order routing. Highest risk tier. Full disclosure + preflight checklist required." },
                ].map((tier) => (
                  <div key={tier.mode} style={{ display: "flex", gap: "1rem", padding: "0.85rem 1rem", background: tier.bg, border: `1px solid ${tier.color}30`, borderRadius: "var(--r)", alignItems: "flex-start" }}>
                    <span style={{ fontWeight: 700, color: tier.color, fontSize: "0.82rem", flexShrink: 0, minWidth: "80px" }}>{tier.label}</span>
                    <p style={{ fontSize: "0.875rem", margin: 0 }}>{tier.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Disclosure requirements */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Disclosure requirements</h2>
              <p style={{ marginBottom: "0.75rem" }}>All products with <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.4em", borderRadius: "4px" }}>execution_mode: paper</code> or <code style={{ background: "var(--bg-alt)", padding: "0.1em 0.4em", borderRadius: "4px" }}>execution_mode: live</code> require explicit risk acknowledgement before download. This is enforced at checkout.</p>
              <p style={{ marginBottom: "0.75rem" }}>The disclosure acknowledgement records:</p>
              <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.875rem" }}>
                <li>Product ID and version</li>
                <li>Timestamp of acknowledgement</li>
                <li>The disclosure text version that was presented</li>
              </ul>
              <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: "var(--ink-muted)" }}>If the disclosure text is updated (e.g., new regulatory language), re-acknowledgement is required before accessing the updated product version.</p>
            </section>

            {/* Preflight checklist */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Preflight checklist — live execution</h2>
              <p style={{ marginBottom: "0.75rem" }}>Before running any live-execution product, verify each item:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  "Paper-traded the strategy for a minimum of 30 days with representative market conditions",
                  "Defined maximum position size and per-trade risk in the config (never more than you can afford to lose)",
                  "Kill-switch tested: confirm the emergency stop halts all orders within 5 seconds",
                  "API keys are scoped to minimum required permissions (trade-only, no withdrawal access)",
                  "Rate limits confirmed against broker/exchange API documentation",
                  "Slippage and transaction cost assumptions validated against actual fills in paper mode",
                  "Logging enabled and routed to a persistent store (not just console output)",
                  "Regulatory compliance reviewed for your jurisdiction (some products are restricted)",
                  "Backup connectivity plan in place if primary API endpoint goes down",
                  "Position limits set at the broker/exchange level as a secondary safety layer",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", padding: "0.6rem 0.75rem", background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", alignItems: "flex-start" }}>
                    <div style={{ width: "20px", height: "20px", border: "2px solid var(--border)", borderRadius: "4px", flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "0.875rem" }}>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Kill switch */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Kill-switch configuration</h2>
              <p style={{ marginBottom: "0.75rem" }}>Every live-execution product ships with a kill-switch template. Configure it before your first live run.</p>
              <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "1rem", fontSize: "0.8rem", overflowX: "auto", lineHeight: 1.6 }}>{`# kill_switch_config.yaml
# ---
# Customize thresholds to match your risk tolerance

kill_switch:
  enabled: true

  # Halt if daily P&L drops below this (absolute value or %)
  max_daily_loss: -500          # USD
  max_daily_loss_pct: -2.0      # % of starting capital

  # Halt if drawdown from peak exceeds this
  max_drawdown_pct: -5.0

  # Halt after N consecutive losing trades
  max_consecutive_losses: 5

  # Halt if API error rate exceeds this in a rolling 5m window
  max_api_error_rate: 0.10      # 10%

  # On trigger: cancel_all_orders, close_all_positions, notify
  on_trigger:
    - cancel_all_orders
    - close_all_positions
    - notify: "support@yourdomain.com"

  # Manual reset required before resuming after kill
  require_manual_reset: true`}</pre>
            </section>

            {/* Fallback templates */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Fallback response templates</h2>
              <p style={{ marginBottom: "0.75rem" }}>Use these in your agent's error handling to produce safe, standardized responses when a trading action cannot be completed:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  {
                    scenario: "Signal confidence below threshold",
                    template: `{"action": "NO_TRADE", "reason": "Signal confidence {{confidence}} below minimum threshold {{min_threshold}}", "recommended_next": "WAIT_FOR_CONFIRMATION"}`,
                  },
                  {
                    scenario: "Kill switch triggered",
                    template: `{"action": "HALT", "reason": "Kill switch triggered: {{trigger_condition}}", "positions_closed": true, "requires_manual_reset": true}`,
                  },
                  {
                    scenario: "API unavailable",
                    template: `{"action": "DEFER", "reason": "Exchange API unavailable ({{error_code}})", "retry_after_seconds": 60, "open_positions_status": "UNCHANGED"}`,
                  },
                  {
                    scenario: "Risk limit exceeded",
                    template: `{"action": "REJECT", "reason": "Order rejected: would exceed {{limit_type}} limit ({{current}} / {{max}})", "alternative": "REDUCE_SIZE"}`,
                  },
                ].map((item) => (
                  <div key={item.scenario} className="content-block">
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.5rem" }}>{item.scenario}</div>
                    <pre style={{ background: "var(--bg-alt)", borderRadius: "var(--r-sm)", padding: "0.75rem", fontSize: "0.78rem", overflowX: "auto", lineHeight: 1.6 }}>{item.template}</pre>
                  </div>
                ))}
              </div>
            </section>

            {/* Regulatory note */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Regulatory notes</h2>
              <div style={{ background: "var(--amber-light)", border: "1px solid rgba(146,64,14,0.2)", borderRadius: "var(--r)", padding: "1.1rem" }}>
                <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>Automated trading is regulated differently across jurisdictions. Some notes:</p>
                <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.875rem" }}>
                  <li><strong>US:</strong> Retail forex automated trading requires CFTC/NFA oversight for advisors. Futures require CFTC registration for CTAs managing others&apos; funds.</li>
                  <li><strong>EU/UK:</strong> MiFID II / FCA regulations apply. Algo trading systems may require pre-trade risk controls and documentation.</li>
                  <li><strong>Prediction markets:</strong> PredictIt, Kalshi, and similar platforms have jurisdiction restrictions. Verify eligibility before use.</li>
                  <li><strong>All:</strong> These products are personal use tooling. Running them as a service for others likely triggers additional licensing requirements.</li>
                </ul>
                <p style={{ fontSize: "0.82rem", color: "var(--amber)", marginTop: "0.75rem", fontWeight: 600 }}>This is not legal advice. Consult a financial or legal professional for your specific situation.</p>
              </div>
            </section>

            {/* Next steps */}
            <section>
              <h2 style={{ marginBottom: "1rem" }}>Next steps</h2>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link href="/catalog?mode=paper" className="btn btn-primary">Browse Paper Trading Products →</Link>
                <Link href="/docs-guides/agent-builder" className="btn btn-outline">Agent Builder Guide</Link>
                <Link href="/pricing#disclosure" className="btn btn-outline">Disclosure Policy</Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
