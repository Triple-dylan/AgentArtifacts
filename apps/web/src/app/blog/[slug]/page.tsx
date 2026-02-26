import { getBlogPost } from "@agent-artifacts/agent-runner";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.primary_keyword ? [post.primary_keyword] : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="container" style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem" }}>
      <Link href="/blog" style={{ display: "inline-block", marginBottom: "1rem", color: "var(--accent)" }}>
        ← Back to Blog
      </Link>
      <article>
        <h1>{post.title}</h1>
        <time style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""}
        </time>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
          style={{ marginTop: "1.5rem", lineHeight: 1.7 }}
        />
      </article>
    </main>
  );
}

function markdownToHtml(md: string): string {
  if (!md) return "";
  return md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/^\n/g, "<br>")
    .split("\n\n")
    .map((p) => (p.startsWith("<h") ? p : `<p>${p}</p>`))
    .join("\n");
}
