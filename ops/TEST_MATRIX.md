# Test Matrix

## Catalog and Registry

- Validate required fields for all 50 SKUs.
- Validate trading fields on trading SKUs only.
- Validate bundle composition references existing product IDs.
- Validate schema compatibility for non-trading products under v1.1.0.
- Validate `/registry/index.json` pagination and filter integrity.

## Pricing and Licensing

- Verify tier range compliance by category.
- Verify bundle savings calculations against standalone sums.
- Verify seat logic and commercial rights defaults.
- Verify updates-feed add-on billing behavior.

## Disclosure and Risk Controls

- Block download for `disclosure_required = true` without ack.
- Persist disclosure acknowledgement by version and context.
- Trigger re-ack when disclosure version changes.
- Verify live-capable SKUs include preflight and kill-switch templates.

## Checkout and Entitlements

- Guest checkout success and entitlement issuance.
- Webhook idempotency for duplicate payment events.
- Signed URL issuance only for active entitlements.
- Re-download behavior across valid/expired token states.

## Funnel and Upsell

- Free variant lead capture before download.
- No-free variant preview-only behavior.
- Trigger and suppression logic order correctness.
- Cart threshold and flash discount precedence.
- Mixed cart bundle recommendation accuracy.

## Analytics

- Event emission coverage for all funnel stages.
- KPI dashboard dimension splits for trading vs non-trading.
- Bundle attach rate calculation accuracy.
