# Framer Import Pack

Use these files to populate Framer CMS collections and wire CTA actions to the backend API.

## Files

- `products.collection.csv`: all non-bundle products (42 rows)
- `bundles.collection.csv`: bundle products (8 rows)
- `endpoint-map.csv`: API endpoint reference

## Framer CMS Collections

Create two collections:

1. `Products`
- Import `products.collection.csv`
- Slug field: `slug`
- Primary title: `name`
- Add badges from `risk_badge`, `execution_mode`, `market_type`

2. `Bundles`
- Import `bundles.collection.csv`
- Slug field: `slug`
- Primary title: `name`

## Recommended Framer Page Templates

- Product template from `Products`
- Bundle template from `Bundles`

Required blocks:

- Hero (`name`, `short_desc`, `price_label`)
- Compatibility/tags badges
- Disclosure panel shown when `disclosure_required == Y`
- CTA primary button
- CTA secondary button (`sample_link` if present)

## CTA wiring

- Primary CTA should call your checkout flow (custom code component or external hosted checkout route).
- For disclosure-required products, include a checkbox acknowledgment before CTA submit.
- Save product id and disclosure version in the checkout payload.

For no-code Framer setup:

- Bind CTA button `Link` -> `checkout_url`
- Bind disclosure body -> `disclosure_text_short`
- Bind disclosure checkbox label -> `disclosure_ack_text`
- Bind post-purchase success button -> `success_page_url`
- Bind downloads/help button -> `download_page_url`

If you generate Stripe links (`npm run sync:stripe-links`), re-run `npm run build:framer-import` before re-importing CSVs.

## Enforcement reminder

Text-only disclosure is easy in Framer.
If you require blocking downloads until acknowledgement, keep backend enforcement on `/disclosures/acknowledge` + `/downloads/signed-url`.
