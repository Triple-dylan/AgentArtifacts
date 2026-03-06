import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Agent Artifacts collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "February 27, 2026";

export default function PrivacyPage() {
  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <div className="section-label">Legal</div>
          <h1 style={{ marginBottom: "0.5rem" }}>Privacy Policy</h1>
          <p style={{ color: "var(--ink-muted)", fontSize: "0.875rem" }}>Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "760px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>1. Who we are</h2>
              <p>Agent Artifacts ("we," "us," or "our") operates agentartifacts.io, a digital marketplace selling AI prompts, skill modules, agents, utilities, and related digital goods. You can contact us at <a href="mailto:support@agentartifacts.io" style={{ color: "var(--green)", textDecoration: "underline" }}>support@agentartifacts.io</a>.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>2. Information we collect</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Information you provide</div>
                  <p>When you make a purchase, we collect your email address to deliver your order, issue receipts, and provide customer support. Payment details are processed directly by Stripe and are never stored on our servers.</p>
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Automatically collected information</div>
                  <p>We collect standard server logs including IP addresses, browser type, referring URLs, and pages visited. This data is used to operate and improve the site and is not sold or shared with third parties for marketing purposes.</p>
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Cookies</div>
                  <p>We use strictly necessary cookies to maintain session state and process orders. We do not use tracking cookies or third-party advertising cookies.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>3. How we use your information</h2>
              <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <li>Fulfilling your order and delivering purchased digital files</li>
                <li>Sending transactional emails (receipts, download links, order updates)</li>
                <li>Responding to support requests</li>
                <li>Preventing fraud and unauthorized access</li>
                <li>Complying with legal obligations</li>
              </ul>
              <p style={{ marginTop: "0.75rem" }}>We do not sell, rent, or share your personal information with third parties for their own marketing purposes.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>4. Third-party services</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Stripe</div>
                  <p>Payments are processed by Stripe, Inc. Stripe collects and processes your payment card details under their own <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--green)", textDecoration: "underline" }}>Privacy Policy</a>. We receive a transaction confirmation and your email address, but never your raw card data.</p>
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Hosting</div>
                  <p>The site is hosted on Vercel. Vercel may process request logs as part of infrastructure operation, subject to their privacy policy.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>5. Data retention</h2>
              <p>We retain your email address and purchase history for as long as necessary to fulfill your order, provide support, and comply with legal and financial record-keeping requirements (typically 7 years for transaction records). You may request deletion of your personal data at any time by emailing us, subject to legal retention obligations.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>6. Your rights</h2>
              <p style={{ marginBottom: "0.75rem" }}>Depending on your location, you may have the right to:</p>
              <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict certain processing</li>
                <li>Data portability (receive your data in a machine-readable format)</li>
              </ul>
              <p style={{ marginTop: "0.75rem" }}>To exercise any of these rights, contact us at <a href="mailto:support@agentartifacts.io" style={{ color: "var(--green)", textDecoration: "underline" }}>support@agentartifacts.io</a>.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>7. Security</h2>
              <p>We use HTTPS encryption for all data in transit. Download links are signed and time-limited. Payment processing is handled entirely by Stripe's PCI-DSS compliant infrastructure. We do not store credit card numbers or sensitive payment details.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>8. Children's privacy</h2>
              <p>Our services are not directed to children under 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, contact us and we will delete it promptly.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>9. Changes to this policy</h2>
              <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>10. Contact</h2>
              <p>For privacy-related questions or requests, contact us at <a href="mailto:support@agentartifacts.io" style={{ color: "var(--green)", textDecoration: "underline" }}>support@agentartifacts.io</a>.</p>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
