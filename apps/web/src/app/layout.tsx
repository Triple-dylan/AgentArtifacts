import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import PromoPopup from "@/components/PromoPopup";

export const metadata: Metadata = {
  title: { default: "Agent Artifacts — AI Prompts, Skills & Agents", template: "%s | Agent Artifacts" },
  description: "Production-ready AI prompts, skill modules, agents, and utilities with clear licensing and instant digital delivery.",
  metadataBase: new URL("https://agentartifacts.io"),
  openGraph: {
    type: "website",
    siteName: "Agent Artifacts",
    title: "Agent Artifacts — AI Prompts, Skills & Agents",
    description: "Production-ready AI prompts, skill modules, agents, and utilities with clear licensing and instant digital delivery.",
    url: "https://agentartifacts.io",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Agent Artifacts" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent Artifacts — AI Prompts, Skills & Agents",
    description: "Production-ready AI prompts, skill modules, agents, and utilities with clear licensing and instant digital delivery.",
    images: ["/og-image.png"],
  },
};

const navLinks = [
  { label: "Catalog", href: "/catalog" },
  { label: "Bundles", href: "/catalog?type=bundle" },
  { label: "Free Library", href: "/free-library" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs-guides" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">
              Agent<span>Artifacts</span>
            </Link>
            <div className="nav-links">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
              ))}
            </div>
            <div className="nav-actions">
              <Link href="/search" className="nav-link" style={{ border: "1px solid var(--border)", borderRadius: "6px" }}>
                🔍 Search
              </Link>
              <Link href="/account" className="nav-link" style={{ border: "1px solid var(--border)", borderRadius: "6px" }}>
                Account
              </Link>
            </div>
          </div>
        </nav>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Agent Artifacts",
            "url": "https://agentartifacts.io",
            "logo": "https://agentartifacts.io/og-image.png",
            "description": "Production-ready AI prompts, skill modules, agents, and utilities with clear licensing and instant digital delivery.",
            "contactPoint": { "@type": "ContactPoint", "contactType": "customer service", "email": "support@agentartifacts.io" },
          }) }}
        />

        <PromoPopup />
        <div className="page-wrap">
          {children}
        </div>

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-top">
              <div>
                <div className="footer-brand">Agent<span>Artifacts</span></div>
                <p className="footer-tagline">
                  Machine-readable AI prompts, skill modules, agents, and utilities. Clear licensing. Instant delivery.
                </p>
              </div>
              <div>
                <div className="footer-col-title">Store</div>
                <div className="footer-links">
                  <Link href="/catalog" className="footer-link">Catalog</Link>
                  <Link href="/catalog?type=bundle" className="footer-link">Bundles</Link>
                  <Link href="/free-library" className="footer-link">Free Library</Link>
                  <Link href="/pricing" className="footer-link">Pricing</Link>
                </div>
              </div>
              <div>
                <div className="footer-col-title">Resources</div>
                <div className="footer-links">
                  <Link href="/docs-guides" className="footer-link">Docs &amp; Guides</Link>
                  <Link href="/api-registry" className="footer-link">API Registry</Link>
                  <Link href="/search" className="footer-link">Search</Link>
                </div>
              </div>
              <div>
                <div className="footer-col-title">Legal</div>
                <div className="footer-links">
                  <Link href="/pricing#license" className="footer-link">License Terms</Link>
                  <Link href="/pricing#policy" className="footer-link">Refund Policy</Link>
                  <Link href="/pricing#disclosure" className="footer-link">Trading Disclosure</Link>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} Agent Artifacts. All rights reserved.</span>
              <span>Digital goods — instant delivery after purchase</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
