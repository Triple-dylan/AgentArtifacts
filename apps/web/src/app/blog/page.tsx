import type { Metadata } from "next";
import Link from "next/link";
import { listBlogPosts } from "@/lib/blog";
import BlogFilters from "./BlogFilters";

export const metadata: Metadata = {
  title: "Blog — AI Agents, Prompts & Skills Articles",
  description: "Guides, walkthroughs, and product updates on AI agents, prompt engineering, skill modules, and building with Agent Artifacts.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Agent Artifacts",
    description: "Guides, walkthroughs, and product updates on AI agents, prompt engineering, skill modules, and building with Agent Artifacts.",
    type: "website",
    url: "/blog",
  },
};

export default async function BlogIndexPage() {
  const posts = listBlogPosts(100);

  const keywords = Array.from(new Set(posts.map((p) => p.primary_keyword).filter(Boolean) as string[]));

  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <div className="section-label">Blog</div>
          <h1 style={{ marginBottom: "0.5rem" }}>Articles &amp; Updates</h1>
          <p style={{ color: "var(--ink-muted)", fontSize: "1rem" }}>
            Guides, walkthroughs, and insights on AI agents, skill modules, and prompt engineering.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "760px" }}>
          {posts.length === 0 ? (
            <div className="empty-state" style={{ padding: "3rem 0" }}>
              <div className="empty-state-icon">✍</div>
              <h3>Posts coming soon</h3>
              <p style={{ marginBottom: "1.25rem" }}>Articles are being generated and will appear here shortly.</p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/docs-guides" className="btn btn-primary">Read the docs</Link>
                <Link href="/catalog" className="btn btn-outline">Browse catalog</Link>
              </div>
            </div>
          ) : (
            <BlogFilters posts={posts} keywords={keywords} />
          )}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Agent Artifacts Blog",
          "description": "Guides, walkthroughs, and product updates on AI agents, prompt engineering, and skill modules.",
          "url": "https://agentartifacts.io/blog",
          "publisher": {
            "@type": "Organization",
            "name": "Agent Artifacts",
            "url": "https://agentartifacts.io",
          },
          "blogPost": posts.slice(0, 10).map((p) => ({
            "@type": "BlogPosting",
            "headline": p.title,
            "description": p.meta_description || p.excerpt,
            "author": { "@type": "Person", "name": p.author },
            "datePublished": p.published_at,
            "url": `https://agentartifacts.io/blog/${p.slug}`,
            "keywords": p.primary_keyword || undefined,
          })),
        }) }}
      />
    </>
  );
}
