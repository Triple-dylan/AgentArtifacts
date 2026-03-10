#!/usr/bin/env python3
"""
Generate blog posts for newly added products.

Reads the products CSV, compares against existing blog posts,
and creates:
  1. A roundup post summarising all new additions
  2. Per-category spotlight posts for each new vertical/category

Author defaults to 'Alvin'. Run after adding products to auto-generate content.

Usage:
  python scripts/generate_blog_posts.py                     # auto-detect new products
  python scripts/generate_blog_posts.py --from-id 185       # explicit start ID
"""

import csv
import json
import os
import re
import sys
from datetime import datetime, timezone

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(SCRIPT_DIR, "..")
PRODUCTS_CSV = os.path.join(ROOT, "apps/web/data/products.collection.csv")
BLOG_JSON = os.path.join(ROOT, "apps/web/data/blog_posts.json")

AUTHOR = "Alvin"
TODAY = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
TODAY_HUMAN = datetime.now(timezone.utc).strftime("%B %d, %Y")
DATE_SLUG = datetime.now(timezone.utc).strftime("%Y-%m-%d")

# ─── Category display names and keywords ──────────────────────────────────────

CATEGORY_META = {
    "prompt": {"label": "Prompts", "icon": "Prompt", "keyword": "AI prompts"},
    "skill": {"label": "Skills", "icon": "Skill", "keyword": "AI skill modules"},
    "agent": {"label": "Agents", "icon": "Agent", "keyword": "AI agents"},
    "utility": {"label": "Utilities", "icon": "Utility", "keyword": "AI utilities"},
    "doc": {"label": "Docs & Guides", "icon": "Doc", "keyword": "AI documentation"},
}

# Domain labels extracted from product IDs
DOMAIN_LABELS = {
    "EDU": "Education",
    "HR": "Human Resources",
    "PMG": "Product Management",
    "SEC": "Security & Compliance",
    "DAT": "Data & Analytics",
    "LEGAL": "Legal",
    "HEALTH": "Healthcare",
    "MKT": "Marketing",
    "SUP": "Support Ops",
    "GEN": "General",
    "TRD": "Trading",
    "FIN": "Finance",
    "ENG": "Engineering",
    "OPS": "DevOps",
    "DLK": "Deal Desk",
    "CSX": "Customer Success",
    "CRY": "Crypto & DeFi",
    "SAL": "Sales",
    "FIN2": "Treasury",
    "DAT2": "Data",
}


def load_products():
    """Load all products from the CSV."""
    products = []
    with open(PRODUCTS_CSV, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            products.append(row)
    return products


def load_existing_posts():
    """Load existing blog posts."""
    try:
        with open(BLOG_JSON, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def save_posts(posts):
    """Save blog posts to JSON."""
    with open(BLOG_JSON, "w") as f:
        json.dump(posts, f, indent=2)
        f.write("\n")


def extract_id_num(product_id):
    """Extract numeric suffix from product ID like AA-PRM-EDU-LESSPLAN-185 -> 185."""
    match = re.search(r"-(\d+)$", product_id)
    return int(match.group(1)) if match else 0


def extract_domain(product_id):
    """Extract domain code from product ID like AA-PRM-EDU-LESSPLAN-185 -> EDU."""
    parts = product_id.split("-")
    return parts[2] if len(parts) >= 3 else "GEN"


def is_free(product):
    """Check if a product is free (lead magnet)."""
    return product.get("lead_magnet", "").upper() == "Y"


def product_link(product):
    """Generate a markdown link to a product."""
    slug = product["slug"]
    name = product["name"]
    return f"[{name}](/products/{slug})"


def product_table_row(product):
    """Generate a markdown table row for a product."""
    cat = product.get("category", "").capitalize()
    price = product.get("price_usd", "0")
    price_label = "Free" if str(price) == "0" or is_free(product) else f"${price}"
    return f"| {product_link(product)} | {cat} | {price_label} |"


def generate_roundup_post(new_products):
    """Generate a roundup post for all new products."""
    total = len(new_products)
    free_count = sum(1 for p in new_products if is_free(p))
    paid_count = total - free_count

    # Group by category
    by_category = {}
    for p in new_products:
        cat = p.get("category", "other")
        by_category.setdefault(cat, []).append(p)

    # Group by domain
    domains = set()
    for p in new_products:
        domain = extract_domain(p["product_id"])
        label = DOMAIN_LABELS.get(domain, domain)
        domains.add(label)

    domains_list = sorted(domains)
    domains_text = ", ".join(domains_list)

    slug = f"new-assets-{DATE_SLUG}"
    title = f"New on Agent Artifacts: {total} Products Across {len(domains_list)} Verticals"
    excerpt = f"We just added {total} new assets — {free_count} free downloads and {paid_count} paid products spanning {domains_text}."

    # Build content
    lines = [
        f"We are excited to share **{total} new products** now available on Agent Artifacts.",
        "",
        f"This batch includes **{free_count} free assets** you can download immediately and **{paid_count} paid products** for teams ready to go deeper.",
        "",
        f"The new additions cover **{len(domains_list)} verticals**: {domains_text}.",
        "",
        "---",
        "",
        "## What's New",
        "",
    ]

    for cat in ["prompt", "skill", "agent", "utility", "doc"]:
        items = by_category.get(cat, [])
        if not items:
            continue
        meta = CATEGORY_META.get(cat, {"label": cat.capitalize()})
        lines.append(f"### {meta['label']} ({len(items)} new)")
        lines.append("")
        lines.append("| Product | Type | Price |")
        lines.append("|---------|------|-------|")
        for p in items:
            lines.append(product_table_row(p))
        lines.append("")

    # Free highlights
    free_products = [p for p in new_products if is_free(p)]
    if free_products:
        lines.append("---")
        lines.append("")
        lines.append("## Free Downloads")
        lines.append("")
        lines.append(f"All **{len(free_products)} free assets** are available for immediate download — no purchase required.")
        lines.append("")
        for p in free_products:
            lines.append(f"- {product_link(p)} — {p.get('short_desc', '')}")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Browse the Full Catalog")
    lines.append("")
    lines.append("Head to the [catalog](/catalog) to explore all products, or check out the [free library](/free-library) to download assets at no cost.")
    lines.append("")

    return {
        "slug": slug,
        "title": title,
        "excerpt": excerpt,
        "content": "\n".join(lines),
        "author": AUTHOR,
        "meta_title": title,
        "meta_description": excerpt,
        "primary_keyword": "new AI assets",
        "published_at": TODAY,
    }


def generate_category_post(category, products, domains):
    """Generate a spotlight post for a category."""
    meta = CATEGORY_META.get(category, {"label": category.capitalize(), "keyword": category})
    label = meta["label"]
    keyword = meta["keyword"]

    total = len(products)
    free_count = sum(1 for p in products if is_free(p))
    paid_count = total - free_count

    domains_text = ", ".join(sorted(domains))
    slug = f"new-{category}-assets-{DATE_SLUG}"
    title = f"New {label}: {total} {label} for {domains_text}"
    excerpt = f"{total} new {label.lower()} just dropped — {free_count} free, {paid_count} paid — covering {domains_text}."

    lines = [
        f"We have added **{total} new {label.lower()}** to Agent Artifacts, covering **{domains_text}**.",
        "",
    ]

    if free_count:
        lines.append(f"**{free_count}** of these are free downloads you can grab right now.")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append(f"## All New {label}")
    lines.append("")
    lines.append("| Product | Domain | Price |")
    lines.append("|---------|--------|-------|")

    for p in products:
        domain = extract_domain(p["product_id"])
        domain_label = DOMAIN_LABELS.get(domain, domain)
        price = p.get("price_usd", "0")
        price_label = "Free" if str(price) == "0" or is_free(p) else f"${price}"
        lines.append(f"| {product_link(p)} | {domain_label} | {price_label} |")

    lines.append("")

    # Deep dive on each
    lines.append("---")
    lines.append("")
    lines.append("## Highlights")
    lines.append("")

    for p in products:
        lines.append(f"### {p['name']}")
        lines.append("")
        lines.append(p.get("short_desc", ""))
        lines.append("")
        compat = p.get("compatibility", "")
        if compat:
            lines.append(f"**Compatible with:** {compat}")
            lines.append("")
        if is_free(p):
            lines.append(f"[Download free →](/products/{p['slug']})")
        else:
            lines.append(f"[View details →](/products/{p['slug']})")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append(f"Browse all {label.lower()} in the [catalog](/catalog) or explore [free downloads](/free-library).")
    lines.append("")

    return {
        "slug": slug,
        "title": title,
        "excerpt": excerpt,
        "content": "\n".join(lines),
        "author": AUTHOR,
        "meta_title": title,
        "meta_description": excerpt,
        "primary_keyword": keyword,
        "published_at": TODAY,
    }


def detect_new_products(all_products, existing_posts):
    """Detect products not yet covered by blog posts."""
    # Find the highest product ID number referenced in existing posts
    covered_ids = set()
    for post in existing_posts:
        content = post.get("content", "")
        # Extract product IDs from links like /products/slug
        slug_matches = re.findall(r"/products/([\w-]+)", content)
        covered_ids.update(slug_matches)

    new = [p for p in all_products if p["slug"] not in covered_ids]
    return new


def main():
    from_id = None
    if "--from-id" in sys.argv:
        idx = sys.argv.index("--from-id")
        if idx + 1 < len(sys.argv):
            from_id = int(sys.argv[idx + 1])

    all_products = load_products()
    existing_posts = load_existing_posts()

    if from_id is not None:
        new_products = [p for p in all_products if extract_id_num(p["product_id"]) >= from_id]
    else:
        new_products = detect_new_products(all_products, existing_posts)

    if not new_products:
        print("No new products detected. Nothing to generate.")
        return

    print(f"Found {len(new_products)} new products to blog about.")

    posts_to_add = []

    # 1. Roundup post (always generated)
    roundup = generate_roundup_post(new_products)
    posts_to_add.append(roundup)
    print(f"  Roundup: {roundup['title']}")

    # 2. One spotlight post for the largest category (cap at 2 posts total)
    by_category = {}
    cat_domains = {}
    for p in new_products:
        cat = p.get("category", "other")
        domain = extract_domain(p["product_id"])
        domain_label = DOMAIN_LABELS.get(domain, domain)
        by_category.setdefault(cat, []).append(p)
        cat_domains.setdefault(cat, set()).add(domain_label)

    if by_category:
        top_cat = max(by_category, key=lambda c: len(by_category[c]))
        top_prods = by_category[top_cat]
        if len(top_prods) >= 2:
            post = generate_category_post(top_cat, top_prods, cat_domains[top_cat])
            posts_to_add.append(post)
            print(f"  Spotlight: {post['title']}")

    # Deduplicate by slug
    existing_slugs = {p["slug"] for p in existing_posts}
    new_posts = [p for p in posts_to_add if p["slug"] not in existing_slugs]

    if not new_posts:
        print("All posts already exist. Nothing to add.")
        return

    all_posts = existing_posts + new_posts
    save_posts(all_posts)

    print(f"\nAdded {len(new_posts)} blog posts to {BLOG_JSON}")
    for p in new_posts:
        print(f"  - {p['slug']}: {p['title']}")


if __name__ == "__main__":
    main()
