import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on AI agents, skill modules, prompt engineering, and building with Agent Artifacts.",
};

type Post = {
  slug: string;
  title: string;
  excerpt?: string;
  meta_description?: string;
  published_at?: string;
  primary_keyword?: string;
};

async function getBlogPosts(): Promise<Post[]> {
  try {
    const { listBlogPosts } = await import("@agent-artifacts/agent-runner");
    return await listBlogPosts(20);
  } catch {
    return [];
  }
}

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <div className="section-label">Blog</div>
          <h1 style={{ marginBottom: "0.5rem" }}>Articles</h1>
          <p style={{ color: "var(--ink-muted)", fontSize: "1rem" }}>
            Guides, walkthroughs, and insights on AI agents, skill modules, and prompt engineering.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "760px" }}>
          {posts.length === 0 ? (
            <div className="empty-state" style={{ padding: "3rem 0" }}>
              <div className="empty-state-icon">✍️</div>
              <h3>Posts coming soon</h3>
              <p style={{ marginBottom: "1.25rem" }}>Articles are being generated and will appear here shortly.</p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/docs-guides" className="btn btn-primary">Read the docs →</Link>
                <Link href="/catalog" className="btn btn-outline">Browse catalog</Link>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {posts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{
                    display: "block",
                    padding: "1.5rem 0",
                    borderBottom: i < posts.length - 1 ? "1px solid var(--border)" : "none",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  {post.primary_keyword && (
                    <span className="badge badge-plain" style={{ fontSize: "0.72rem", marginBottom: "0.5rem", display: "inline-block" }}>
                      {post.primary_keyword}
                    </span>
                  )}
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.4rem", lineHeight: 1.35 }}>
                    {post.title}
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)", lineHeight: 1.6, marginBottom: "0.5rem" }}>
                    {post.excerpt || post.meta_description}
                  </p>
                  {post.published_at && (
                    <span style={{ fontSize: "0.78rem", color: "var(--ink-subtle)" }}>
                      {new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
