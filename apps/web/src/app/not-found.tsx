import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container" style={{ maxWidth: "600px" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>404</div>
          <h1 style={{ marginBottom: "0.5rem" }}>Page not found</h1>
          <p style={{ color: "var(--ink-muted)", fontSize: "1rem" }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
      </div>

      <div className="section-sm">
        <div className="container" style={{ maxWidth: "600px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
            <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Try one of these</div>
            {[
              { href: "/catalog", label: "Product Catalog", desc: "Browse all AI prompts, skills, agents, and utilities" },
              { href: "/catalog?type=bundle", label: "Bundles", desc: "Save up to 44% with curated product bundles" },
              { href: "/free-library", label: "Free Library", desc: "Free sample files — no email required" },
              { href: "/docs-guides", label: "Docs & Guides", desc: "Integration walkthroughs and compatibility guides" },
              { href: "/search", label: "Search", desc: "Search the full catalog" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.85rem 1rem",
                  background: "white",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r)",
                  textDecoration: "none",
                  gap: "1rem",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "0.15rem" }}>{item.label}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--ink-muted)" }}>{item.desc}</div>
                </div>
                <span style={{ color: "var(--ink-subtle)", flexShrink: 0 }}>→</span>
              </Link>
            ))}
          </div>

          <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)" }}>
            If you followed a link that should work, contact us at{" "}
            <a href="mailto:support@agentartifacts.io" style={{ color: "var(--green)", textDecoration: "underline" }}>
              support@agentartifacts.io
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
