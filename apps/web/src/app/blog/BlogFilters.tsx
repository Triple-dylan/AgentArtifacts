"use client";

import Link from "next/link";
import { useState } from "react";
import type { BlogPost } from "@/lib/blog";

export default function BlogFilters({ posts, keywords }: { posts: BlogPost[]; keywords: string[] }) {
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = posts.filter((p) => {
    if (activeKeyword && p.primary_keyword !== activeKeyword) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.excerpt || "").toLowerCase().includes(q) ||
        (p.primary_keyword || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "0.45rem 0.75rem",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            fontSize: "0.85rem",
            width: "200px",
            background: "var(--bg-alt)",
          }}
        />
        <button
          onClick={() => setActiveKeyword(null)}
          className={`badge ${!activeKeyword ? "badge-green" : "badge-plain"}`}
          style={{ cursor: "pointer", border: "none", fontSize: "0.75rem" }}
        >
          All
        </button>
        {keywords.map((kw) => (
          <button
            key={kw}
            onClick={() => setActiveKeyword(activeKeyword === kw ? null : kw)}
            className={`badge ${activeKeyword === kw ? "badge-green" : "badge-plain"}`}
            style={{ cursor: "pointer", border: "none", fontSize: "0.75rem" }}
          >
            {kw}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--ink-muted)", padding: "2rem 0" }}>No articles match your filter.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {filtered.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                display: "block",
                padding: "1.5rem 0",
                borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
                {post.primary_keyword && (
                  <span className="badge badge-plain" style={{ fontSize: "0.72rem" }}>
                    {post.primary_keyword}
                  </span>
                )}
                {post.author && (
                  <span style={{ fontSize: "0.75rem", color: "var(--ink-subtle)" }}>by {post.author}</span>
                )}
              </div>
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
    </>
  );
}
