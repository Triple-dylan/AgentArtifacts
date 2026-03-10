import { getBlogPost, listBlogPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return listBlogPosts(100).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.primary_keyword ? [post.primary_keyword] : undefined,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      type: "article",
      publishedTime: post.published_at,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  return (
    <>
      <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "1.25rem 0" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <nav style={{ fontSize: "0.82rem", color: "var(--ink-muted)" }}>
            <Link href="/blog">Blog</Link> / {post.title}
          </nav>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "760px" }}>
          {post.primary_keyword && (
            <span className="badge badge-plain" style={{ fontSize: "0.72rem", marginBottom: "1rem", display: "inline-block" }}>
              {post.primary_keyword}
            </span>
          )}
          <h1 style={{ marginBottom: "0.75rem", lineHeight: 1.25 }}>{post.title}</h1>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "2rem" }}>
            {post.author && (
              <span style={{ fontSize: "0.85rem", color: "var(--ink-muted)" }}>By {post.author}</span>
            )}
            {post.published_at && (
              <time style={{ fontSize: "0.85rem", color: "var(--ink-muted)" }}>
                {new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </time>
            )}
          </div>

          <article
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
          />

          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--border)", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/blog" className="btn btn-outline btn-sm">← All articles</Link>
            <Link href="/catalog" className="btn btn-primary btn-sm">Browse catalog →</Link>
          </div>
        </div>
      </div>

      <style>{`
        .blog-content { line-height: 1.75; color: var(--ink); }
        .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4 { margin: 2rem 0 0.75rem; line-height: 1.3; }
        .blog-content h1 { font-size: 1.65rem; }
        .blog-content h2 { font-size: 1.3rem; }
        .blog-content h3 { font-size: 1.1rem; }
        .blog-content p { margin: 0 0 1.2rem; }
        .blog-content ul, .blog-content ol { padding-left: 1.5rem; margin: 0 0 1.2rem; display: flex; flex-direction: column; gap: 0.35rem; }
        .blog-content ul { list-style: disc; }
        .blog-content ol { list-style: decimal; }
        .blog-content li { font-size: 0.95rem; }
        .blog-content pre { background: var(--bg-alt); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 1rem 1.25rem; overflow-x: auto; font-size: 0.82rem; line-height: 1.65; margin: 0 0 1.2rem; }
        .blog-content code { background: var(--bg-alt); padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.85em; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
        .blog-content pre code { background: none; padding: 0; font-size: inherit; }
        .blog-content blockquote { border-left: 3px solid var(--green); margin: 0 0 1.2rem; padding: 0.5rem 0 0.5rem 1.25rem; color: var(--ink-muted); font-style: italic; }
        .blog-content a { color: var(--green); text-decoration: underline; }
        .blog-content a:hover { color: var(--green-dark); }
        .blog-content hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
        .blog-content img { max-width: 100%; border-radius: var(--r); margin: 0.5rem 0 1.2rem; }
        .blog-content table { width: 100%; border-collapse: collapse; margin: 0 0 1.2rem; font-size: 0.9rem; }
        .blog-content th { background: var(--bg-alt); padding: 0.6rem 0.85rem; text-align: left; font-weight: 700; border-bottom: 2px solid var(--border); }
        .blog-content td { padding: 0.6rem 0.85rem; border-bottom: 1px solid var(--border); }
        .blog-content strong { font-weight: 700; }
        .blog-content em { font-style: italic; }
      `}</style>
    </>
  );
}

function markdownToHtml(md: string): string {
  if (!md) return "";

  let html = md;

  // Fenced code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<pre><code class="language-${lang}">${escaped}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headings
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

  // Horizontal rules
  html = html.replace(/^---+$/gm, "<hr>");

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links and images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Unordered lists
  html = html.replace(/((?:^[-*] .+\n?)+)/gm, (block) => {
    const items = block.trim().split("\n").map((l) => `<li>${l.replace(/^[-*] /, "")}</li>`).join("");
    return `<ul>${items}</ul>`;
  });

  // Ordered lists
  html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (block) => {
    const items = block.trim().split("\n").map((l) => `<li>${l.replace(/^\d+\. /, "")}</li>`).join("");
    return `<ol>${items}</ol>`;
  });

  // Tables
  html = html.replace(/((?:^\|.+\|\n?)+)/gm, (block) => {
    const rows = block.trim().split("\n").filter((r) => !r.match(/^\|[-| :]+\|$/));
    if (rows.length === 0) return block;
    const [head, ...body] = rows;
    const thCells = head.split("|").filter((_, i, a) => i > 0 && i < a.length - 1).map((c) => `<th>${c.trim()}</th>`).join("");
    const bodyRows = body.map((row) => {
      const cells = row.split("|").filter((_, i, a) => i > 0 && i < a.length - 1).map((c) => `<td>${c.trim()}</td>`).join("");
      return `<tr>${cells}</tr>`;
    }).join("");
    return `<table><thead><tr>${thCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
  });

  // Paragraphs
  html = html.split("\n\n").map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    if (/^<(h[1-6]|ul|ol|li|blockquote|pre|hr|table|thead|tbody|tr|th|td|img)/.test(trimmed)) return trimmed;
    return `<p>${trimmed.replace(/\n/g, " ")}</p>`;
  }).join("\n");

  return html;
}
