#!/usr/bin/env python3
"""
Merge checkout URLs from stripe_new_links.csv back into
products.collection.csv (matches on slug).

Usage:
    python3 scripts/merge_stripe_links.py

Run AFTER create_stripe_links.py has completed successfully.
"""

import csv
import sys

CSV_PATH = "apps/web/data/products.collection.csv"
LINKS_PATH = "stripe_new_links.csv"
FRAMER_PATH = "framer-import/products.collection.csv"

# Load new links
try:
    with open(LINKS_PATH, newline="", encoding="utf-8") as f:
        links = {r["slug"]: r["checkout_url"] for r in csv.DictReader(f)}
except FileNotFoundError:
    sys.exit(f"Not found: {LINKS_PATH}  — run create_stripe_links.py first.")

print(f"Loaded {len(links)} new links from {LINKS_PATH}")

# Merge into main CSV
with open(CSV_PATH, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    fields = reader.fieldnames
    rows = list(reader)

updated = 0
for row in rows:
    if row["slug"] in links:
        row["checkout_url"] = links[row["slug"]]
        updated += 1

with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fields)
    writer.writeheader()
    writer.writerows(rows)

print(f"Updated {updated} rows in {CSV_PATH}")

# Also sync to framer-import/
try:
    import shutil
    shutil.copy(CSV_PATH, FRAMER_PATH)
    print(f"Synced to {FRAMER_PATH}")
except Exception as e:
    print(f"Warning: could not sync to framer-import: {e}")

# Verify
filled = sum(1 for r in rows if r["checkout_url"].strip())
total = len(rows)
print(f"\nVerification: {filled}/{total} products now have a checkout_url")
if filled == total:
    print("✓ All products have payment links!")
else:
    still_missing = [r["slug"] for r in rows if not r["checkout_url"].strip()]
    print(f"Still missing: {still_missing}")
