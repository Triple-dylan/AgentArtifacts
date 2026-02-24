# Catalog and Spec Spreadsheet Schema

## Master Catalog Columns

- `product_id`
- `slug`
- `name`
- `short_desc`
- `long_desc`
- `category`
- `subcategory`
- `tags_keywords`
- `format`
- `file_count`
- `included_files`
- `size_estimate`
- `version`
- `changelog`
- `release_date`
- `compatibility`
- `dependencies`
- `license_type`
- `seats`
- `redistribution_policy`
- `price_usd`
- `compare_at_price`
- `cost_basis`
- `discount_eligibility`
- `bundle_id`
- `bundle_role`
- `upsell_targets`
- `cross_sell_targets`
- `status`
- `last_updated`
- `owner`
- `support_level`
- `support_docs_link`
- `demo_link`
- `sample_available`
- `sample_link`
- `primary_keyword`
- `secondary_keywords`
- `intent`
- `lead_magnet`
- `email_capture_required`
- `landing_page_type`
- `execution_mode`
- `market_type`
- `risk_level`
- `disclosure_required`

## Bundle Templates

- Starter Bundle: entry prompts + utility + docs.
- Agent Builder Kit: core skills + schemas + guardrails + orchestration.
- Vertical Pack: domain prompts + skills + agent + utility + playbook.
- Pro Suite: cross-category and cross-vertical bundle.
- Enterprise Kit: Pro Suite baseline plus expanded support and custom licensing.

## Pricing Template Guidance

- Prompts: $9-$39
- Skills: $49-$199
- Agents: $299-$999
- Utilities: $49-$149
- Docs: $29-$99
- Bundles: $249-$5000+

## Funnel Metadata Usage

- `lead_magnet` and `email_capture_required` drive free-library gating.
- `intent` supports TOFU/MOFU/BOFU routing.
- `landing_page_type` routes product vs library vs post templates.
