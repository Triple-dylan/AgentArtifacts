import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions governing use of the Agent Artifacts platform and digital products.",
};

const LAST_UPDATED = "February 27, 2026";

export default function TermsPage() {
  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <div className="section-label">Legal</div>
          <h1 style={{ marginBottom: "0.5rem" }}>Terms of Service</h1>
          <p style={{ color: "var(--ink-muted)", fontSize: "0.875rem" }}>Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "760px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>1. Agreement</h2>
              <p>By accessing or purchasing from agentartifacts.io ("the Site"), you agree to these Terms of Service ("Terms"). If you do not agree, do not use the Site. These Terms apply to all visitors, customers, and users.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>2. Products and digital delivery</h2>
              <p style={{ marginBottom: "0.75rem" }}>Agent Artifacts sells digital goods including AI prompt packs, skill modules (SKILL.md), agent configurations, utility schemas, and documentation. All products are delivered digitally as downloadable files (Markdown, JSON, YAML) via secure signed URLs.</p>
              <p>No physical goods are shipped. Delivery is instant upon successful payment confirmation. Download links are accessible from your account page for the license period.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>3. License</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Grant</div>
                  <p>Upon purchase, you receive a non-exclusive, non-transferable, single-seat commercial license to use the purchased digital files in your own projects, including client or employer projects.</p>
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Restrictions</div>
                  <p>You may not resell, redistribute, sublicense, or republish the raw files. You may not repackage purchased assets and sell them as a competing product or template store. Seat expansion for teams is available — contact us for team licensing.</p>
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Updates</div>
                  <p>One-time purchases include the version available at the time of purchase. An optional updates-feed subscription provides access to future versions, provider compatibility updates, and changelog notes.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>4. Payments</h2>
              <p>All purchases are processed by Stripe, Inc. By completing a purchase, you agree to Stripe's <a href="https://stripe.com/legal/consumer" target="_blank" rel="noopener noreferrer" style={{ color: "var(--green)", textDecoration: "underline" }}>terms of service</a>. Prices are listed in USD. We reserve the right to change prices at any time; price changes do not affect completed orders.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>5. Refunds</h2>
              <p>See our <Link href="/refund-policy" style={{ color: "var(--green)", textDecoration: "underline" }}>Refund Policy</Link> for full details. In summary: refunds are available within 7 days of purchase for verifiable technical issues that prevent access to or use of the product. Refunds are not available for change-of-mind or after files have been successfully downloaded.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>6. Trading and financial products</h2>
              <div className="disclosure-panel" style={{ marginBottom: "1rem" }}>
                <div className="disclosure-panel-header">⚠️ Important — trading product disclaimer</div>
                <p>All trading, prediction market, and execution-related products are tooling and educational resources only. They are not investment advice, financial advice, or trading signals. Users are solely responsible for all trading decisions, risk management, and regulatory compliance. Past performance does not indicate future results.</p>
              </div>
              <p>Products with live or paper execution modes require explicit acknowledgement of the risk disclosure before download.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>7. Prohibited uses</h2>
              <p style={{ marginBottom: "0.75rem" }}>You agree not to:</p>
              <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <li>Use purchased assets for any unlawful purpose</li>
                <li>Circumvent entitlement checks or access controls</li>
                <li>Share, redistribute, or resell purchased files</li>
                <li>Use the Site to transmit harmful, fraudulent, or abusive content</li>
                <li>Attempt to reverse-engineer or extract underlying systems</li>
              </ul>
              <p style={{ marginTop: "0.75rem" }}>Violation of these terms will result in immediate revocation of your license and purchase entitlements without refund.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>8. Intellectual property</h2>
              <p>All content on the Site — including product descriptions, documentation, UI, and branding — is owned by or licensed to Agent Artifacts. You may not reproduce, distribute, or create derivative works from Site content without written permission, except as expressly permitted by your product license.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>9. Disclaimer of warranties</h2>
              <p>Products are provided "as is" without warranty of any kind. We do not warrant that products will meet your specific requirements or that they will be error-free. AI outputs generated using our products may vary and are not guaranteed to produce any particular result.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>10. Limitation of liability</h2>
              <p>To the maximum extent permitted by law, Agent Artifacts' liability for any claim arising from your use of the Site or our products is limited to the amount you paid for the specific product giving rise to the claim. We are not liable for any indirect, incidental, consequential, or punitive damages.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>11. Changes to terms</h2>
              <p>We may update these Terms at any time. Changes will be posted on this page with an updated date. Continued use of the Site after changes constitutes acceptance of the updated Terms.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>12. Contact</h2>
              <p>Questions about these Terms? Contact us at <a href="mailto:support@agentartifacts.io" style={{ color: "var(--green)", textDecoration: "underline" }}>support@agentartifacts.io</a> or visit our <Link href="/contact" style={{ color: "var(--green)", textDecoration: "underline" }}>contact page</Link>.</p>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
