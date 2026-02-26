import type { MetadataRoute } from "next";
import { loadCatalog, loadBundles } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://agentartifacts.io";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/catalog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/free-library`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs-guides`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/api-registry`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
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

  return [...staticRoutes, ...productRoutes, ...bundleRoutes];
}
