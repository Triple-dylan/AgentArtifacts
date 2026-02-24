# Revised Build Plan: 50-SKU Agent Asset Store with Prediction Market + Trading Track

## Summary

Build a digital-download store for agent-native assets (prompts, skills, agents, utilities, docs) with:

- 50 launch SKUs (42 individual, 8 bundles)
- bundle-first monetization
- dual funnel at launch (Free Library + No-Free)
- prediction market and trading product track with `research`, `paper`, and `live` execution metadata

## Locked Decisions

- Stack: Next.js + Stripe + Postgres + S3/R2
- Accounts: guest checkout + optional account
- Billing: one-time and updates-feed subscription at launch
- Licensing baseline: standalone paid SKUs include commercial rights; bundles expand scale/support rights
- Compliance posture: research/education-first with strict disclosure controls
- Trading scope: prediction markets + crypto/perps

## Phase Plan

## Phase 0: Governance + Risk Baseline

Deliverables:

- taxonomy and controlled vocabulary freeze
- disclosure framework + acknowledgement versioning rules
- execution classification matrix (`research`/`paper`/`live`)

Exit criteria:

- every trading SKU has explicit execution mode and disclosure requirement

## Phase 1: Catalog Expansion (50 SKUs)

Deliverables:

- `data/catalog_master.csv` populated with full metadata
- `data/bundles_master.csv` populated with all bundle compositions

Exit criteria:

- all required fields filled for all 50 SKUs
- compatibility, licensing, and upsell links validated

## Phase 2: Registry Schema v1.1.0

Deliverables:

- canonical schema in `spec/registry/registry-schema-v1.1.0.json`
- examples for prompt/skill/agent/bundle and index layout

Exit criteria:

- schema supports trading fields without breaking non-trading products

## Phase 3: IA + Wireframes

Deliverables:

- sitemap and page-block requirements in `docs/IA_WIREFRAME.md`
- trading-specific facets and disclosure panel requirements

Exit criteria:

- every page has CTA, cross-sell, and bundle upgrade module where applicable

## Phase 4: Commerce + Entitlements + Disclosures

Deliverables:

- API contract in `spec/api/openapi.yaml`
- DB tables for disclosures, entitlements, and downloads in `db/schema.sql`

Exit criteria:

- disclosure-required SKUs cannot be downloaded without acknowledgement

## Phase 5: Funnel + Upsell Engine

Deliverables:

- dual funnel maps in `docs/FUNNELS.md`
- deterministic promotion logic in `docs/UPSELL_RULES.md`

Exit criteria:

- trigger, suppression, and cart-threshold rules are deterministic

## Phase 6: QA, Safety, Analytics, Launch

Deliverables:

- test matrix in `ops/TEST_MATRIX.md`
- event instrumentation in `ops/ANALYTICS_EVENTS.md`
- go-live checks in `ops/LAUNCH_CHECKLIST.md`

Exit criteria:

- launch gate complete with monitored KPIs

## KPI Targets (initial)

- conversion rate by funnel variant
- AOV and bundle attach rate
- free-to-paid conversion
- refund rate
- updates-feed churn
- trading vs non-trading product line performance
