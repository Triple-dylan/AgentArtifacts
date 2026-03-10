import fs from "node:fs";
import path from "node:path";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  meta_title?: string;
  meta_description?: string;
  primary_keyword?: string;
  published_at: string;
};

const BLOG_PATH = path.join(process.cwd(), "data", "blog_posts.json");

function readPosts(): BlogPost[] {
  try {
    const raw = fs.readFileSync(BLOG_PATH, "utf8");
    return JSON.parse(raw) as BlogPost[];
  } catch {
    return [];
  }
}

export function listBlogPosts(limit = 50): BlogPost[] {
  const posts = readPosts();
  posts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  return posts.slice(0, limit);
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return readPosts().find((p) => p.slug === slug);
}
