# Analytics Event Spec

## Core Commerce Events

- `view_home`
- `view_catalog`
- `view_product`
- `view_bundle`
- `add_to_cart`
- `remove_from_cart`
- `start_checkout`
- `complete_checkout`
- `purchase_complete`

## Funnel Events

- `view_free_library`
- `submit_lead_capture`
- `download_free_asset`
- `view_no_free_preview`
- `upsell_shown`
- `upsell_clicked`
- `bundle_upgrade_applied`

## Trading and Risk Events

- `view_disclosure_panel`
- `accept_disclosure`
- `disclosure_blocked_download`
- `view_risk_profile`
- `view_connector_matrix`
- `execution_preflight_validated`
- `paper_simulation_started`

## Event Properties

- `session_id`
- `user_id`
- `funnel_variant` (`free_library` or `no_free`)
- `product_id`
- `bundle_id`
- `category`
- `execution_mode`
- `market_type`
- `risk_level`
- `price_usd`
- `discount_usd`
- `order_total_usd`

## KPI Derivations

- Conversion rate by funnel variant
- AOV overall and by product line
- Bundle attach rate
- Free-to-paid conversion
- Updates-feed attach and churn
- Refund rate
