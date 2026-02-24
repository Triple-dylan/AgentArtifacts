# Framer Setup Runbook

## Current Access Status

The shared Framer URL redirects to login in this automation session. Direct edits require an authenticated Framer session in this browser context.

## Quickest Integration Path

1. Import CMS data from `framer-import/products.collection.csv` and `framer-import/bundles.collection.csv`.
2. Build Product and Bundle CMS templates in Framer.
3. Connect CTA buttons to API-backed checkout flow.
4. Add disclosure panel and checkbox acknowledgment UI for products with `disclosure_required = Y`.

If you want direct Stripe Payment Links in Framer without custom code:

1. Set `STRIPE_SECRET_KEY`.
2. Run `npm run sync:stripe-links` to generate `data/stripe_links.csv`.
3. Run `npm run build:framer-import` to inject `checkout_url` into both collections.
4. Re-import `framer-import/products.collection.csv` and `framer-import/bundles.collection.csv`.
5. Bind CTA link target to `checkout_url`.

## Minimum Fields to Bind in Framer

- `name`
- `short_desc`
- `price_label`
- `compare_at_label`
- `risk_badge`
- `execution_mode`
- `market_type`
- `disclosure_required`
- `disclosure_text_short`
- `disclosure_version`
- `disclosure_ack_text`
- `product_id` / `bundle_id`
- `checkout_url`
- `success_page_url`
- `download_page_url`

## CTA Flow (Recommended)

- Product button click -> custom code call to `POST /checkout/session`
- If `disclosure_required = Y`, require checkbox prior to submit
- Store disclosure acceptance via `POST /disclosures/acknowledge`
- On successful payment and entitlement, downloads come from `POST /downloads/signed-url`

## CTA Flow (No-Code Framer variant)

- Product button link -> `checkout_url` (Stripe Payment Link)
- Disclosure-required products still show disclosure text + checkbox on page for consent UX
- Entitlement/download gating stays enforced server-side via `/downloads/signed-url`

## Endpoint Reference

See `framer-import/endpoint-map.csv`.

## If You Want Me to Wire In-Editor

1. Open the project and log in.
2. Keep the editor active.
3. Send a message when ready and I will provide click-by-click edits, block by block.
