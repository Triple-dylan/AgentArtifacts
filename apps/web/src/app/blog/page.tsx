// @ts-nocheck
import Link from "next/link";

async function getBlogPosts() {
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
    <main className="container" style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>Blog</h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
        Articles on agents, skills, and AI builders.
      </p>
      {posts.length === 0 ? (
        <p>No posts yet. Check back soon.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {posts.map((post) => (
            <li key={post.slug} style={{ marginBottom: "1.5rem" }}>
              <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <h2 style={{ marginBottom: "0.25rem", fontSize: "1.25rem" }}>{post.title}</h2>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                  {post.excerpt || post.meta_description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
