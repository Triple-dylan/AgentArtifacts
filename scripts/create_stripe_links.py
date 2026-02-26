#!/usr/bin/env python3
"""
Batch-create Stripe Products + Prices + Payment Links for all
products.collection.csv rows that have an empty checkout_url.

Usage:
    pip install stripe
    export STRIPE_SECRET_KEY=sk_live_...
    python3 scripts/create_stripe_links.py

Output: stripe_new_links.csv  (slug, checkout_url)
"""

import csv
import os
import sys
import time

try:
    import stripe
except ImportError:
    sys.exit("Run: pip install stripe")

api_key = os.environ.get("STRIPE_SECRET_KEY")
if not api_key:
    sys.exit("Set STRIPE_SECRET_KEY env var before running.")

stripe.api_key = api_key

CSV_PATH = "apps/web/data/products.collection.csv"
OUT_PATH = "stripe_new_links.csv"

# Load products with missing checkout_url
with open(CSV_PATH, newline="", encoding="utf-8") as f:
    all_rows = list(csv.DictReader(f))

missing = [r for r in all_rows if not r["checkout_url"].strip()]
print(f"Found {len(missing)} products without a checkout URL.")

if not missing:
    print("Nothing to do.")
    sys.exit(0)

results = {}
errors = {}

for i, p in enumerate(missing, 1):
    slug = p["slug"]
    name = p["name"]
    price_cents = int(float(p["price_usd"]) * 100)
    desc = p["short_desc"]
    product_id = p["product_id"]

    print(f"[{i}/{len(missing)}] {name} (${p['price_usd']}) ... ", end="", flush=True)

    try:
        # 1. Create Stripe Product
        sp = stripe.Product.create(
            name=name,
            description=desc,
            metadata={"slug": slug, "product_id": product_id},
        )

        # 2. Create Stripe Price
        pr = stripe.Price.create(
            product=sp.id,
            unit_amount=price_cents,
            currency="usd",
        )

        # 3. Create Payment Link
        pl = stripe.PaymentLink.create(
            line_items=[{"price": pr.id, "quantity": 1}],
            metadata={"slug": slug, "product_id": product_id},
        )

        results[slug] = pl.url
        print(f"✓ {pl.url}")

    except stripe.error.StripeError as e:
        errors[slug] = str(e)
        print(f"✗ ERROR: {e}")

    time.sleep(0.15)  # stay well within Stripe rate limits

# Write output CSV
with open(OUT_PATH, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["slug", "checkout_url"])
    for slug, url in results.items():
        writer.writerow([slug, url])

print(f"\nDone. {len(results)} links created, {len(errors)} errors.")
print(f"Output written to: {OUT_PATH}")

if errors:
    print("\nFailed slugs:")
    for slug, msg in errors.items():
        print(f"  {slug}: {msg}")
