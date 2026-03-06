import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadCatalog, categoryBadgeClass, categoryLabel } from "@/lib/catalog";
import fs from "fs";
import path from "path";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return loadCatalog()
    .filter((r) => r.lead_magnet === "Y")
    .map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const row = loadCatalog().find((r) => r.slug === slug);
  if (!row) return { title: "Not found" };
  return {
    title: `${row.name} — Free Download`,
    description: `Free download: ${row.short_desc}`,
  };
}

function getMarkdownContent(slug: string): string | null {
  try {
    const filePath = path.join(process.cwd(), "public", "downloads", `${slug}.md`);
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

export default async function SamplePage({ params }: Props) {
  const { slug } = await params;
  const all = loadCatalog();
  const row = all.find((r) => r.slug === slug);
  if (!row || row.lead_magnet !== "Y") notFound();

  const content = getMarkdownContent(slug);

  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "1.25rem 0" }}>
        <div className="container">
          <nav style={{ fontSize: "0.82rem", color: "var(--ink-muted)" }}>
            <Link href="/">Home</Link> / <Link href="/free-library">Free Library</Link> / {row.name}
          </nav>
        </div>
      </div>

      <div className="section-sm">
        <div className="container">
          <div className="detail-layout">
            <div className="detail-main">
              <div className="content-block">
                <div className="product-card-badges" style={{ marginBottom: "0.75rem" }}>
                  <span className={`badge ${categoryBadgeClass(row.category)}`}>{categoryLabel(row.category)}</span>
                  <span className="badge badge-plain" style={{ background: "#e8f4f0", color: "#1a6b50", border: "1px solid rgba(26,107,80,0.2)" }}>Free download</span>
                </div>
                <h1 style={{ marginBottom: "0.5rem", fontSize: "1.65rem" }}>{row.name}</h1>
                <p style={{ color: "var(--ink-muted)", marginBottom: "1.25rem", lineHeight: "1.65" }}>{row.short_desc}</p>

                <a
                  href={`/downloads/${slug}.md`}
                  download={`${slug}.md`}
                  className="btn btn-buy"
                  style={{ display: "inline-flex", width: "auto", marginBottom: "0.75rem" }}
                >
                  ↓ Download Free File (.md)
                </a>
                <p style={{ fontSize: "0.8rem", color: "var(--ink-muted)", marginTop: "0.25rem" }}>
                  No email required · Instant access · Markdown format
                </p>
              </div>

              {content && (
                <div className="content-block">
                  <h2 style={{ marginBottom: "1rem" }}>File contents</h2>
                  <pre style={{
                    background: "#f8f8f6",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "1.25rem",
                    overflowX: "auto",
                    fontSize: "0.82rem",
                    lineHeight: "1.65",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    maxHeight: "600px",
                    overflowY: "auto",
                  }}>
                    {content}
                  </pre>
                </div>
              )}

              <div className="content-block" style={{ background: "var(--green-light)", borderColor: "rgba(26,107,80,0.2)" }}>
                <h2 style={{ color: "var(--green)", marginBottom: "0.5rem" }}>Want the full version?</h2>
                <p style={{ fontSize: "0.9rem", color: "var(--green)", marginBottom: "1rem" }}>
                  The full product includes 20+ prompts, integration examples, and framework-specific schemas.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {row.checkout_url && (
                    <a href={row.checkout_url} className="btn btn-buy" style={{ display: "inline-flex", width: "auto" }} target="_blank" rel="noopener noreferrer">
                      {row.cta_label || "Buy Full Version"} — {row.price_label}
                    </a>
                  )}
                  <Link href={`/products/${slug}`} className="btn btn-outline" style={{ display: "inline-flex" }}>
                    View product details →
                  </Link>
                </div>
              </div>
            </div>

            <div className="detail-sidebar">
              <div className="sidebar-card">
                <div style={{ marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--green)" }}>Free</span>
                </div>
                <div className="sidebar-meta" style={{ marginBottom: "1rem" }}>
                  <div className="sidebar-meta-row">
                    <span className="sidebar-meta-key">Format</span>
                    <span className="sidebar-meta-val">Markdown (.md)</span>
                  </div>
                  <div className="sidebar-meta-row">
                    <span className="sidebar-meta-key">Category</span>
                    <span className="sidebar-meta-val" style={{ textTransform: "capitalize" }}>{row.category}</span>
                  </div>
                  <div className="sidebar-meta-row">
                    <span className="sidebar-meta-key">License</span>
                    <span className="sidebar-meta-val">Free commercial use</span>
                  </div>
                </div>
                <a
                  href={`/downloads/${slug}.md`}
                  download={`${slug}.md`}
                  className="btn btn-buy"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  ↓ Download Free File
                </a>
                <p className="sidebar-note">No account needed · No email required</p>
                <p className="sidebar-note">Redistribution not permitted</p>
              </div>

              <div style={{ marginTop: "1rem", background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.1rem" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.35rem" }}>More free downloads</div>
                <Link href="/free-library" className="btn btn-outline btn-sm" style={{ display: "inline-flex", marginBottom: "0.5rem" }}>Browse free library →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
