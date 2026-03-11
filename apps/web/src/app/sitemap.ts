import type { MetadataRoute } from "next";
import { loadCatalog, loadBundles } from "@/lib/catalog";
import { listBlogPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://agentartifacts.io";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                                        lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/catalog`,                           lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/free-library`,                      lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/pricing`,                           lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/search`,                            lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/blog`,                              lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    // Docs
    { url: `${base}/docs-guides`,                       lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/docs-guides/agent-builder`,         lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/docs-guides/quick-integration`,     lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/docs-guides/skill-module`,          lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/docs-guides/compatibility-matrix`,  lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/docs-guides/trading-risk`,          lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/api-registry`,                      lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    // Legal / support
    { url: `${base}/contact`,                           lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`,                           lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,                             lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/refund-policy`,                     lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = loadCatalog().map((row) => ({
    url: `${base}/products/${row.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const bundleRoutes: MetadataRoute.Sitemap = loadBundles().map((bundle) => ({
    url: `${base}/bundles/${bundle.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const freeRoutes: MetadataRoute.Sitemap = loadCatalog()
    .filter((row) => row.lead_magnet === "Y")
    .map((row) => ({
      url: `${base}/sample/${row.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    }));

  const blogRoutes: MetadataRoute.Sitemap = listBlogPosts(200).map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.published_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...bundleRoutes, ...freeRoutes, ...blogRoutes];
}
