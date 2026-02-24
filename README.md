# Agent Artifacts Store

Implementation scaffold for a digital download store selling agent-native AI assets, including a 50-SKU launch catalog with prediction market and trading tracks.

## Repository Layout

- `apps/api/` runnable Node HTTP API implementing catalog, registry, disclosure, checkout, download, and upsell endpoints.
- `apps/web/` Next.js App Router scaffold implementing the planned IA route map.
- `data/` source-of-truth seed CSV files (catalog, bundles, disclosures, upsell rules).
- `docs/` product, funnel, pricing, IA, compliance, and rollout specifications.
- `spec/registry/` canonical registry schemas and example JSON payloads.
- `spec/api/` OpenAPI contract baseline.
- `db/` PostgreSQL schema for production data model.
- `ops/` QA matrix, analytics events, and launch checklist.
- `scripts/` data validation and registry generation scripts.
- `tests/` API + data contract tests.

## Quick Start

Run data validation:

```bash
npm run validate:data
```

Generate registry JSON from the catalog:

```bash
npm run build:registry
```

Run API server:

```bash
npm run dev:api
```

Run API server with Postgres persistence:

```bash
export DATABASE_URL=postgres://user:pass@localhost:5432/agent_assets
npm run db:migrate
npm run db:seed
npm run dev:api
```

Run tests:

```bash
npm test
```

Generate Stripe payment links for all SKUs (writes `data/stripe_links.csv`):

```bash
export STRIPE_SECRET_KEY=sk_live_or_test_xxx
export APP_BASE_URL=https://app.agentassets.io
npm run sync:stripe-links
npm run build:framer-import
```

## Launch Targets

- 50 total SKUs (42 individual + 8 bundles)
- Dual funnel launch: Free Library and No-Free
- Trading support with execution modes: `research`, `paper`, `live`
- Mandatory disclosure acknowledgement for required live/high-risk SKUs

## Persistence Modes

- Default: in-memory runtime store (no `DATABASE_URL`).
- Postgres: set `DATABASE_URL`, run migrations and seed scripts, then start API.
